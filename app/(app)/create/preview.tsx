import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { markMessageSent, updateMessageContent } from '../../../src/services/messages.service';
import { buildSignatureText, getSignatureLabels } from '../../../src/utils/signature';
import { fetchMusicStatus } from '../../../src/services/music.service';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

// ── Lecteur audio preview ─────────────────────────────────────────────────────
function AudioPreviewPlayer({ messageId }: { messageId: string | null }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
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
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
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
  const C = useColors();
  const { autoGen } = useLocalSearchParams<{ autoGen?: string }>();
  const { generate, isPending } = useAIGenerate();
  const { i18n } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const {
    format,
    contactName,
    contactPhone,
    contactEmail,
    generatedContent,
    savedMessageId,
    setGeneratedContent,
  } = useCreateStore();

  const [sending, setSending] = useState(false);
  // Mode manuel (contenu vide / espace) → mémorisé pour toute la session
  const isManualMode = useRef(generatedContent.trim() === '');
  const [isEditing, setIsEditing] = useState(isManualMode.current);
  const [localContent, setLocalContent] = useState(isManualMode.current ? '' : generatedContent);
  const isFirstRender = useRef(true);

  // Auto-génération si lancé depuis l'accueil (quick-send)
  useEffect(() => {
    if (autoGen === '1') generate();
  }, []);

  // Sync quand le contenu change (après régénération) — skip le premier rendu
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setLocalContent(generatedContent);
    setIsEditing(false);
  }, [generatedContent]);

  const handleSaveEdit = async () => {
    Keyboard.dismiss();
    const trimmed = localContent.trim();
    if (!trimmed) return;
    setGeneratedContent(trimmed);
    if (savedMessageId) {
      try { await updateMessageContent(savedMessageId, trimmed); } catch { /* non-bloquant */ }
    }
    setIsEditing(false);
  };

  const showSig = profile?.show_signature !== false;
  const sigLabels = showSig ? getSignatureLabels(i18n.language) : null;

  const formatEmoji: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };
  // contactName stocké "NOM Prénom" → afficher "Prénom NOM"
  const nameParts = contactName.trim().split(' ');
  const displayName = nameParts.length > 1
    ? `${nameParts.slice(1).join(' ')} ${nameParts[0]}`
    : nameParts[0];
  const title = displayName ? `Pour ${displayName}` : 'Votre message';
  const emoji = formatEmoji[format] ?? '💬';

  const handleShare = async (channelId: string) => {
    const baseText = `${emoji} ${title}\n\n${generatedContent}`;
    const text = showSig ? baseText + buildSignatureText(i18n.language) : baseText;

    setSending(true);
    try {
      if (channelId === 'whatsapp') {
        const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const result = await Share.share({ message: text });
          // L'utilisateur a fermé sans partager → on annule
          if (result.action !== 'sharedAction') { setSending(false); return; }
        }
      } else if (channelId === 'sms') {
        try {
          const smsNumber = contactPhone ? contactPhone.replace(/\s+/g, '') : '';
          await Linking.openURL(`sms:${smsNumber}?body=${encodeURIComponent(text)}`);
        } catch {
          const result = await Share.share({ message: text });
          if (result.action !== 'sharedAction') { setSending(false); return; }
        }
      } else if (channelId === 'email') {
        const subject = encodeURIComponent(`🎉 ${title}`);
        const body = encodeURIComponent(text);
        try {
          const emailAddress = contactEmail ?? '';
          await Linking.openURL(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
        } catch {
          const result = await Share.share({ message: text });
          if (result.action !== 'sharedAction') { setSending(false); return; }
        }
      } else if (channelId === 'copy') {
        const result = await Share.share({ message: text });
        // L'utilisateur a fermé sans partager → on annule
        if (result.action !== 'sharedAction') { setSending(false); return; }
      }

      // Mark as sent in DB (best-effort — n'empêche pas la navigation si ça échoue)
      if (savedMessageId) {
        try { await markMessageSent(savedMessageId, channelId); } catch { /* non-bloquant */ }
      }

      router.push('/(app)/create/sent' as never);
    } catch {
      setSending(false);
      Alert.alert('Erreur', 'Impossible d\'ouvrir ce canal. Essayez "Copier" pour copier le message manuellement.');
    }
  };

  const handleRegenerate = () => {
    if (isManualMode.current) {
      // Mode manuel : vider le champ et rouvrir l'éditeur
      setLocalContent('');
      setIsEditing(true);
      return;
    }
    generate();
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{isEditing ? 'Modifier' : 'Aperçu'}</Text>
        <View style={styles.topbarActions}>
          {!isEditing && !isManualMode.current && (
            <TouchableOpacity
              style={[styles.topbarBtn, isPending && { opacity: 0.5 }]}
              onPress={handleRegenerate}
              disabled={isPending}
            >
              <Text style={styles.topbarBtnText}>{isPending ? '...' : '↺'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Album cover ───────────────────────────────── */}
        <LinearGradient
          colors={C.gradient}
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

        {/* ── Aperçu complet du message reçu ───────────── */}
        <View style={styles.previewEnvelope}>
          <Text style={styles.previewEnvelopeLabel}>📩 Ce que ton contact va recevoir</Text>

          {isEditing ? (
            <View style={styles.editCard}>
              <TextInput
                style={styles.editInput}
                value={localContent}
                onChangeText={setLocalContent}
                multiline
                autoFocus
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.editValidateBtn} onPress={handleSaveEdit}>
                <Text style={styles.editValidateBtnText}>✓ Appuie ici pour valider ton message</Text>
              </TouchableOpacity>
            </View>
          ) : format === 'song' || format === 'poem'
            ? <LyricsCard content={generatedContent} />
            : (
              <View style={styles.messageCard}>
                <Text style={styles.messageHeader}>{emoji} {title}</Text>
                <Text style={styles.messageText}>{generatedContent}</Text>
              </View>
            )}

          {/* Signature bannière */}
          {showSig && sigLabels && (
            <View style={styles.signatureBanner}>
              <Text style={styles.sigMain}>{sigLabels.main}</Text>
              <Text style={styles.sigCta}>
                {sigLabels.cta}{' '}
                <Text style={styles.sigUrl}>{sigLabels.url}</Text>
              </Text>
            </View>
          )}
        </View>

        {/* ── Prêt + Bouton modifier ────────────────────── */}
        {!isEditing && (
          <>
            <Text style={styles.readyTitle}>Ton message est prêt ! 🎉</Text>
            <TouchableOpacity style={styles.editPromptBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editPromptText}>✏️ Clique ici si tu veux le modifier</Text>
            </TouchableOpacity>
            <Text style={styles.readySub}>
              Si tu ne veux pas le modifier, choisis simplement un mode d'envoi ci-dessous pour l'expédier. 🚀
            </Text>
          </>
        )}

        {/* ── Envoi ────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Envoyer par</Text>
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
            {isPending ? '⏳ Génération...' : isManualMode.current ? '🗑 Effacer et réécrire' : '↺ Générer une nouvelle version'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: C.primary, lineHeight: 32 },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  topbarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  topbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbarBtnActive: {
    backgroundColor: C.primary,
  },
  topbarBtnText: {
    fontSize: 16,
    color: C.primary,
  },
  topbarBtnTextActive: {
    color: Colors.white,
  },

  content: { paddingBottom: 80 },

  albumCover: {
    margin: Spacing[4],
    borderRadius: Radii.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    gap: 6,
    ...Shadows.lg,
  },
  albumEmoji: { fontSize: 36 },
  albumTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.white,
    textAlign: 'center',
  },
  albumFormat: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
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
    backgroundColor: C.primary,
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

  // Edit card
  editCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    gap: 14,
    ...Shadows.sm,
  },
  editInput: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 26,
    minHeight: 160,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.lg,
    padding: Spacing[3],
  },
  editSaveBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editSaveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  editValidateBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadows.sm,
  },
  editValidateBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: C.onPrimary,
  },
  readyTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    marginTop: Spacing[5],
    marginHorizontal: Spacing[4],
  },
  readySub: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[3],
  },
  editPromptBtn: {
    alignSelf: 'center',
    marginTop: Spacing[4],
    paddingVertical: 12,
    paddingHorizontal: Spacing[6],
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    ...Shadows.md,
  },
  editPromptText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: C.onPrimary,
  },

  // Message card
  previewEnvelope: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    backgroundColor: '#f3eef8',
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    padding: Spacing[4],
    gap: 12,
  },
  previewEnvelopeLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  messageCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    ...Shadows.sm,
  },
  messageHeader: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: C.primary,
    marginBottom: Spacing[3],
  },
  messageText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 26,
  },

  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurface,
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
    marginTop: 0,
    backgroundColor: C.primary,
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
    borderColor: C.primary,
    alignItems: 'center',
  },
  regenFullBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },
  });
}
