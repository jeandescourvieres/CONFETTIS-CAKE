import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { markMessageSent } from '../../../src/services/messages.service';
import { buildSignatureText, getSignatureLabels } from '../../../src/utils/signature';
import { fetchMusicStatus } from '../../../src/services/music.service';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';

// ── Lecteur audio preview ─────────────────────────────────────────────────────
function AudioPreviewPlayer({ messageId }: { messageId: string | null }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!messageId) return;
    Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, staysActiveInBackground: false });
    // Récupère l'URL audio depuis la DB (déjà générée dans le Studio)
    fetchMusicStatus(messageId).then((result) => {
      if (result?.audio_url && result.music_status === 'ready') {
        setAudioUrl(result.audio_url);
      }
      setLoading(false);
    });
    return () => { soundRef.current?.unloadAsync(); };
  }, [messageId]);

  if (loading) return null;
  if (!audioUrl) return null;

  const togglePlay = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;
          setPositionMs(status.positionMillis ?? 0);
          setDurationMs(status.durationMillis ?? 0);
          if (status.didJustFinish) { setIsPlaying(false); setPositionMs(0); }
        },
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } else {
      if (isPlaying) { await soundRef.current.pauseAsync(); setIsPlaying(false); }
      else { await soundRef.current.playAsync(); setIsPlaying(true); }
    }
  };

  const progress = durationMs > 0 ? positionMs / durationMs : 0;
  const fmt = (ms: number) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  return (
    <View style={styles.audioPlayer}>
      <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.8}>
        <Text style={styles.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.audioLabel}>🎵 Écouter la chanson</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { flex: progress || 0.001 }]} />
          <View style={[styles.progressBg, { flex: Math.max(1 - progress, 0.001) }]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.timeText}>{fmt(positionMs)}</Text>
          <Text style={styles.timeText}>{fmt(durationMs)}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Share channels ────────────────────────────────────────────────────────────
const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬', color: '#25D366' },
  { id: 'sms', label: 'SMS', emoji: '📱', color: Colors.primary },
  { id: 'email', label: 'Email', emoji: '📧', color: '#EA4335' },
  { id: 'copy', label: 'Copier', emoji: '📋', color: Colors.onSurfaceVariant },
];

// ── Lyrics card (song format splits by newlines) ──────────────────────────────
function LyricsCard({ content }: { content: string }) {
  const parts = content.split(/\n{2,}/);
  return (
    <View style={styles.lyricsCard}>
      {parts.map((part, i) => (
        <View key={i} style={styles.lyricsPart}>
          <Text style={styles.lyricsText}>{part.trim()}</Text>
          {i < parts.length - 1 && <View style={styles.lyricsDivider} />}
        </View>
      ))}
    </View>
  );
}

export default function PreviewScreen() {
  const router = useRouter();
  const { generate, isPending } = useAIGenerate();
  const { i18n } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const {
    format,
    contactName,
    generatedContent,
    savedMessageId,
  } = useCreateStore();

  const [sending, setSending] = useState(false);

  const showSig = profile?.show_signature !== false;
  const sigLabels = showSig ? getSignatureLabels(i18n.language) : null;

  const formatEmoji: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };
  const title = contactName ? `Pour ${contactName}` : 'Votre message';
  const emoji = formatEmoji[format] ?? '💬';

  const handleShare = async (channelId: string) => {
    const baseText = `${emoji} ${title}\n\n${generatedContent}`;
    const text = showSig ? baseText + buildSignatureText(i18n.language) : baseText;

    try {
      setSending(true);

      if (channelId === 'whatsapp') {
        const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          await Share.share({ message: text });
        }
      } else if (channelId === 'sms') {
        await Linking.openURL(`sms:?body=${encodeURIComponent(text)}`);
      } else if (channelId === 'email') {
        const subject = encodeURIComponent(`🎉 ${title}`);
        const body = encodeURIComponent(text);
        await Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
      } else if (channelId === 'copy') {
        await Share.share({ message: text });
      }

      // Mark as sent in DB
      if (savedMessageId) {
        await markMessageSent(savedMessageId, channelId);
      }

      router.push('/(app)/create/sent' as never);
    } catch {
      // User cancelled share — don't show error
    } finally {
      setSending(false);
    }
  };

  const handleRegenerate = async () => {
    await generate();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Aperçu</Text>
        <TouchableOpacity
          style={[styles.regenBtn, isPending && { opacity: 0.5 }]}
          onPress={handleRegenerate}
          disabled={isPending}
        >
          <Text style={styles.regenBtnText}>{isPending ? '...' : '↺'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Album cover ───────────────────────────────── */}
        <LinearGradient
          colors={['#9b6bb5', '#5e2d80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.albumCover}
        >
          <Text style={styles.albumEmoji}>{emoji}</Text>
          <Text style={styles.albumTitle}>{title}</Text>
          <Text style={styles.albumFormat}>
            {format === 'song' ? 'Chanson' : format === 'poem' ? 'Poème' : format === 'joke' ? 'Humour' : 'Message'}
          </Text>
        </LinearGradient>

        {/* ── Lecteur audio (chanson uniquement) ───────── */}
        {format === 'song' && (
          <AudioPreviewPlayer messageId={savedMessageId} />
        )}

        {/* ── Contenu ───────────────────────────────────── */}
        {format === 'song' || format === 'poem'
          ? <LyricsCard content={generatedContent} />
          : (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{generatedContent}</Text>
            </View>
          )}

        {/* ── Signature bannière ───────────────────────── */}
        {showSig && sigLabels && (
          <View style={styles.signatureBanner}>
            <Text style={styles.sigMain}>{sigLabels.main}</Text>
            <Text style={styles.sigCta}>
              {sigLabels.cta}{' '}
              <Text style={styles.sigUrl}>{sigLabels.url}</Text>
            </Text>
          </View>
        )}

        {/* ── Envoi ────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Envoyer via</Text>
        <View style={styles.shareGrid}>
          {SHARE_CHANNELS.map((ch) => (
            <TouchableOpacity
              key={ch.id}
              style={[styles.shareBtn, sending && { opacity: 0.5 }]}
              onPress={() => handleShare(ch.id)}
              disabled={sending}
              activeOpacity={0.8}
            >
              <View style={[styles.shareIcon, { backgroundColor: ch.color + '20' }]}>
                <Text style={styles.shareEmoji}>{ch.emoji}</Text>
              </View>
              <Text style={styles.shareLabel}>{ch.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Regénérer ─────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.regenFullBtn, isPending && { opacity: 0.5 }]}
          onPress={handleRegenerate}
          disabled={isPending}
        >
          <Text style={styles.regenFullBtnText}>
            {isPending ? '⏳ Génération...' : '↺ Générer une nouvelle version'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  regenBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenBtnText: {
    fontSize: 18,
    color: Colors.primary,
  },

  content: { paddingBottom: 80 },

  albumCover: {
    margin: Spacing[4],
    borderRadius: Radii['2xl'],
    padding: Spacing[7],
    alignItems: 'center',
    gap: 10,
    ...Shadows.lg,
  },
  albumEmoji: { fontSize: 60 },
  albumTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['4xl'],
    color: Colors.white,
    textAlign: 'center',
  },
  albumFormat: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Audio player
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    ...Shadows.md,
  },
  playBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: { fontSize: 18 },
  audioLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  progressTrack: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { backgroundColor: Colors.white },
  progressBg: { backgroundColor: 'rgba(255,255,255,0.3)' },
  timeText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },

  // Lyrics (song/poem)
  lyricsCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    ...Shadows.sm,
  },
  lyricsPart: { gap: 8 },
  lyricsText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 26,
  },
  lyricsDivider: {
    height: 1,
    backgroundColor: Colors.surfaceContainer,
    marginVertical: 10,
  },

  // Message card
  messageCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    ...Shadows.sm,
  },
  messageText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 26,
  },

  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing[6],
    marginBottom: Spacing[3],
    paddingHorizontal: Spacing[4],
  },

  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing[4],
  },
  shareBtn: { alignItems: 'center', gap: 8 },
  shareIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareEmoji: { fontSize: 28 },
  shareLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  signatureBanner: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    backgroundColor: '#9b6bb5',
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 6,
    ...Shadows.sm,
  },
  sigMain: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.white,
    lineHeight: 20,
  },
  sigCta: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  sigUrl: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fdd34d',
  },

  regenFullBtn: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[6],
    paddingVertical: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  regenFullBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.primary,
  },
});
