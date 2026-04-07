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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { useMessage } from '../../../src/hooks/useAIGenerate';
import { deleteMessage, markMessageSent } from '../../../src/services/messages.service';
import { useAuthStore } from '../../../src/stores/authStore';
import { useCreateStore } from '../../../src/stores/createStore';
import { buildSignatureText, getSignatureLabels } from '../../../src/utils/signature';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import type { MessageFormat, MessageTone, MusicStatus } from '../../../src/types/models';

const FORMAT_EMOJI: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };
const FORMAT_LABEL: Record<MessageFormat, string> = { song: 'Chanson', poem: 'Poème', message: 'Message', joke: 'Humour' };
const TONE_LABEL: Record<MessageTone, string> = {
  humorous: 'Humoristique', touching: 'Touchant', poetic: 'Poétique',
  playful: 'Chaleureux', professional: 'Professionnel',
};

// ── Mini lecteur audio ────────────────────────────────────────────────────────
function MiniAudioPlayer({ audioUrl, musicStatus }: { audioUrl: string | null; musicStatus: MusicStatus }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, staysActiveInBackground: false });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  if (musicStatus === 'generating' || musicStatus === 'queued') {
    return (
      <View style={styles.audioBar}>
        <ActivityIndicator size="small" color={Colors.white} />
        <Text style={styles.audioBarText}>
          {musicStatus === 'queued' ? '⏳ En file d\'attente...' : '🎵 Génération en cours...'}
        </Text>
      </View>
    );
  }
  if (musicStatus === 'failed') {
    return (
      <View style={[styles.audioBar, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
        <Text style={styles.audioBarText}>⚠️ Génération audio échouée</Text>
      </View>
    );
  }
  if (!audioUrl || musicStatus !== 'ready') return null;

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
    <View style={styles.audioBar}>
      <TouchableOpacity style={styles.miniPlayBtn} onPress={togglePlay}>
        <Text style={{ fontSize: 16 }}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.miniProgress}>
          <View style={[styles.miniProgressFill, { flex: progress || 0.001 }]} />
          <View style={[styles.miniProgressBg, { flex: Math.max(1 - progress, 0.001) }]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.miniTimeText}>{fmt(positionMs)}</Text>
          <Text style={styles.miniTimeText}>{fmt(durationMs)}</Text>
        </View>
      </View>
    </View>
  );
}

const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬', color: '#25D366' },
  { id: 'sms', label: 'SMS', emoji: '📱', color: Colors.primary },
  { id: 'email', label: 'Email', emoji: '📧', color: '#EA4335' },
  { id: 'qr', label: 'QR Code', emoji: '⬛', color: Colors.onSurface },
  { id: 'copy', label: 'Copier', emoji: '📋', color: Colors.onSurfaceVariant },
];

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const [sending, setSending] = useState(false);

  const { data: message, isLoading } = useMessage(id ?? null);

  const showSig = profile?.show_signature !== false;
  const sigLabels = showSig ? getSignatureLabels(i18n.language) : null;

  const deleteMutation = useMutation({
    mutationFn: () => deleteMessage(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      router.back();
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Supprimer ce message ?',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate() },
      ],
    );
  };

  const handleShare = async (channelId: string) => {
    if (!message) return;

    if (channelId === 'qr') {
      const store = useCreateStore.getState();
      store.setGeneratedContent(message.content);
      store.setSavedMessageId(message.id);
      router.push(`/(app)/qr/${message.id}` as never);
      return;
    }

    const emoji = FORMAT_EMOJI[message.format] ?? '💬';
    const baseText = `${emoji} Pour ${message.contact_name}\n\n${message.content}`;
    const text = showSig ? baseText + buildSignatureText(i18n.language) : baseText;

    try {
      setSending(true);
      if (channelId === 'whatsapp') {
        const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
        const ok = await Linking.canOpenURL(url);
        if (ok) await Linking.openURL(url);
        else await Share.share({ message: text });
      } else if (channelId === 'sms') {
        await Linking.openURL(`sms:?body=${encodeURIComponent(text)}`);
      } else if (channelId === 'email') {
        const subject = encodeURIComponent(`🎉 Pour ${message.contact_name}`);
        await Linking.openURL(`mailto:?subject=${subject}&body=${encodeURIComponent(text)}`);
      } else if (channelId === 'copy') {
        await Share.share({ message: text });
      }
      await markMessageSent(message.id, channelId);
      queryClient.invalidateQueries({ queryKey: ['messages', message.id] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    } catch {
      // user cancelled
    } finally {
      setSending(false);
    }
  };

  if (isLoading || !message) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingCenter}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isSong = message.format === 'song';
  const isPoem = message.format === 'poem';
  const contentParts = (isSong || isPoem)
    ? message.content.split(/\n{2,}/)
    : [message.content];

  const date = new Date(message.created_at);
  const dateLabel = date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle} numberOfLines={1}>
          Pour {message.contact_name}
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ───────────────────────────────────── */}
        <LinearGradient
          colors={message.status === 'sent'
            ? ['#9b6bb5', '#5e2d80']
            : ['#b0abb3', '#79757c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>{FORMAT_EMOJI[message.format] ?? '💬'}</Text>
          <Text style={styles.heroName}>Pour {message.contact_name}</Text>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{FORMAT_LABEL[message.format]}</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{TONE_LABEL[message.tone]}</Text>
            </View>
            <View style={[styles.heroBadge, message.status === 'sent' && styles.heroBadgeSent]}>
              <Text style={styles.heroBadgeText}>
                {message.status === 'sent' ? '✓ Envoyé' : 'Brouillon'}
              </Text>
            </View>
          </View>
          <Text style={styles.heroDate}>{dateLabel}</Text>
        </LinearGradient>

        {/* ── Lecteur audio (chansons) ─────────────────── */}
        {isSong && (
          <MiniAudioPlayer audioUrl={message.audio_url} musicStatus={message.music_status} />
        )}

        {/* ── Contenu ─────────────────────────────────── */}
        <View style={styles.contentCard}>
          {contentParts.map((part, i) => (
            <View key={i}>
              <Text style={styles.contentText}>{part.trim()}</Text>
              {i < contentParts.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

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

        {/* ── Partage ──────────────────────────────────── */}
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
              <View style={[styles.shareIcon, { backgroundColor: ch.color + '18' }]}>
                <Text style={styles.shareEmoji}>{ch.emoji}</Text>
              </View>
              <Text style={styles.shareLabel}>{ch.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },

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
    flex: 1,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  deleteBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { fontSize: 20 },

  content: { paddingBottom: 80 },

  hero: {
    margin: Spacing[4],
    borderRadius: Radii['2xl'],
    padding: Spacing[6],
    alignItems: 'center',
    gap: 10,
    ...Shadows.lg,
  },
  heroEmoji: { fontSize: 52 },
  heroName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.white,
    textAlign: 'center',
  },
  heroBadgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  heroBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroBadgeSent: { backgroundColor: 'rgba(255,255,255,0.35)' },
  heroBadgeText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.white,
  },
  heroDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'capitalize',
  },

  contentCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    gap: 0,
    ...Shadows.sm,
  },
  contentText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainer,
    marginVertical: 14,
  },

  // Audio player
  audioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    padding: Spacing[4],
  },
  audioBarText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  miniPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniProgress: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden' },
  miniProgressFill: { backgroundColor: Colors.white },
  miniProgressBg: { backgroundColor: 'rgba(255,255,255,0.3)' },
  miniTimeText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
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
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareEmoji: { fontSize: 26 },
  shareLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
});
