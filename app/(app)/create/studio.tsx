import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { useMusicGeneration } from '../../../src/hooks/useMusicGeneration';
import { updateMessageContent } from '../../../src/services/messages.service';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import type { MessageFormat } from '../../../src/types/models';

// ── AI voice options ──────────────────────────────────────────────────────────
const AI_VOICES = [
  { id: 'warm', label: 'Chaleureuse', emoji: '🤗' },
  { id: 'poetic', label: 'Poétique', emoji: '🌙' },
  { id: 'playful', label: 'Espiègle', emoji: '😄' },
  { id: 'classic', label: 'Classique', emoji: '📜' },
];

const GENRES_BY_FORMAT: Record<MessageFormat, string[]> = {
  song: ['Pop', 'R&B', 'Folk', 'Jazz', 'Électro', 'Classique'],
  poem: ['Romantique', 'Libre', 'Haïku', 'Épique', 'Comique'],
  message: ['Court', 'Moyen', 'Long', 'Formel', 'Intime'],
  joke: ['Jeu de mots', 'Absurde', 'Sarcastique', 'Doux', 'Référence'],
};

// ── Waveform animée ───────────────────────────────────────────────────────────
const BAR_HEIGHTS = [6, 14, 10, 20, 16, 24, 18, 12, 22, 8, 16, 20, 14, 10, 18, 22, 12, 16, 8, 14];

function AnimatedWaveform({ isPlaying }: { isPlaying: boolean }) {
  const anims = useRef(BAR_HEIGHTS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = anims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: 300 + (i % 5) * 80,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 300 + (i % 5) * 80,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ),
      );
      animations.forEach((a) => a.start());
      return () => animations.forEach((a) => a.stop());
    } else {
      anims.forEach((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(),
      );
    }
  }, [isPlaying]);

  return (
    <View style={styles.waveform}>
      {BAR_HEIGHTS.map((h, i) => (
        <Animated.View
          key={i}
          style={[
            styles.waveBar,
            {
              height: h,
              backgroundColor: isPlaying ? Colors.white : 'rgba(255,255,255,0.5)',
              transform: [{ scaleY: anims[i] }],
            },
          ]}
        />
      ))}
    </View>
  );
}

// ── Lecteur audio ─────────────────────────────────────────────────────────────
function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const togglePlay = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;
          setPositionMs(status.positionMillis ?? 0);
          setDurationMs(status.durationMillis ?? 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPositionMs(0);
          }
        },
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={styles.audioPlayer}>
      <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.8}>
        <Text style={styles.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <View style={styles.audioInfo}>
        <AnimatedWaveform isPlaying={isPlaying} />
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { flex: progress }]} />
          <View style={[styles.progressBg, { flex: 1 - progress }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
          <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Section label helper ──────────────────────────────────────────────────────
function formatSectionTitle(format: MessageFormat): string {
  if (format === 'song') return 'Paroles';
  if (format === 'poem') return 'Poème';
  return 'Contenu';
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function StudioScreen() {
  const router = useRouter();
  const { generate, isPending } = useAIGenerate();

  const { user } = useAuthStore();

  const {
    format,
    contactName,
    tone,
    occasion,
    generatedContent,
    savedMessageId,
    setGeneratedContent,
  } = useCreateStore();

  // Construit le style musical à partir de l'occasion et du genre sélectionné
  const buildMusicStyle = (genre: string | null) => {
    const base = occasion === 'birthday' ? 'pop joyful upbeat'
      : occasion === 'wedding' ? 'romantic orchestral'
      : occasion === 'birth' ? 'gentle lullaby soft'
      : occasion === 'graduation' ? 'triumphant energetic'
      : occasion === 'newyear' ? 'festive uplifting'
      : 'pop uplifting';
    return genre ? `${base} ${genre.toLowerCase()}` : base;
  };

  const [editableContent, setEditableContent] = useState(generatedContent);
  const [selectedVoice, setSelectedVoice] = useState('warm');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isSong = format === 'song';

  const music = useMusicGeneration({
    messageId: savedMessageId ?? '',
    initialStatus: 'none',
    initialAudioUrl: null,
    lyrics: editableContent,
    style: buildMusicStyle(selectedGenre),
    tone: tone ?? 'touching',
    userId: user?.id ?? '',
  });

  const genres = GENRES_BY_FORMAT[format] ?? [];
  const title = contactName ? `Pour ${contactName} ✨` : 'Votre message ✨';

  // Déclencher la génération musicale dès l'arrivée sur le Studio si format = song
  useEffect(() => {
    if (isSong && savedMessageId && music.musicStatus === 'none' && !music.isReady) {
      music.trigger();
    }
  }, [isSong, savedMessageId]);

  const handleSaveEdit = async () => {
    if (!savedMessageId || editableContent === generatedContent) return;
    try {
      setIsSaving(true);
      await updateMessageContent(savedMessageId, editableContent);
      setGeneratedContent(editableContent);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    await generate();
    const fresh = useCreateStore.getState().generatedContent;
    if (fresh) setEditableContent(fresh);
  };

  const handleNext = async () => {
    await handleSaveEdit();
    router.push('/(app)/create/preview' as never);
  };

  // Pour une chanson, on bloque l'aperçu jusqu'à ce que l'audio soit prêt
  const canProceed = !isSong || music.isReady;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Studio ✦</Text>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextBtn, !canProceed && { opacity: 0.4 }]}
          disabled={!editableContent.trim() || !canProceed}
        >
          <Text style={styles.nextBtnText}>Aperçu ›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Album cover hero ─────────────────────────── */}
        <LinearGradient
          colors={['#9b6bb5', '#5e2d80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.albumCover}
        >
          <Text style={styles.albumEmoji}>
            {format === 'song' ? '🎵' : format === 'poem' ? '✍️' : format === 'joke' ? '✨' : '💬'}
          </Text>
          <Text style={styles.albumTitle}>{title}</Text>
          <AnimatedWaveform isPlaying={false} />
        </LinearGradient>

        {/* ── Lecteur audio (chanson uniquement) ───────── */}
        {isSong && (
          <View style={styles.audioSection}>
            {music.isReady && music.audioUrl ? (
              <AudioPlayer audioUrl={music.audioUrl} />
            ) : music.isFailed ? (
              <View style={styles.audioStatus}>
                <Text style={styles.audioStatusEmoji}>⚠️</Text>
                <Text style={styles.audioStatusText}>La génération a échoué</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={music.trigger}>
                  <Text style={styles.retryBtnText}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.audioStatus}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.audioStatusText}>
                  {music.isQueued
                    ? '⏳ En file d\'attente — on vous notifie dès que c\'est prêt !'
                    : '🎵 Génération de votre chanson en cours...'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Genre chips ──────────────────────────────── */}
        <Text style={styles.sectionLabel}>
          {format === 'song' ? 'Genre musical' : 'Style'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreRow}>
          {genres.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genreChip, selectedGenre === g && styles.genreChipActive]}
              onPress={() => setSelectedGenre(selectedGenre === g ? null : g)}
            >
              <Text style={[styles.genreLabel, selectedGenre === g && styles.genreLabelActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Voix IA ───────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Voix IA</Text>
        <View style={styles.voiceRow}>
          {AI_VOICES.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.voiceBtn, selectedVoice === v.id && styles.voiceBtnActive]}
              onPress={() => setSelectedVoice(v.id)}
            >
              <Text style={styles.voiceEmoji}>{v.emoji}</Text>
              <Text style={[styles.voiceLabel, selectedVoice === v.id && styles.voiceLabelActive]}>
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Contenu éditable ─────────────────────────── */}
        <Text style={styles.sectionLabel}>{formatSectionTitle(format)}</Text>
        <View style={styles.contentCard}>
          <TextInput
            style={styles.contentInput}
            value={editableContent}
            onChangeText={setEditableContent}
            multiline
            textAlignVertical="top"
            placeholder="Votre message apparaîtra ici..."
            placeholderTextColor={Colors.outlineVariant}
          />
        </View>

        {/* ── Actions ──────────────────────────────────── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.regenBtn, isPending && { opacity: 0.5 }]}
            onPress={handleRegenerate}
            disabled={isPending}
          >
            <Text style={styles.regenBtnText}>{isPending ? '⏳ ...' : '↺ Regénérer'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, (isSaving || editableContent === generatedContent) && { opacity: 0.4 }]}
            onPress={handleSaveEdit}
            disabled={isSaving || editableContent === generatedContent}
          >
            <Text style={styles.saveBtnText}>{isSaving ? 'Sauvegarde...' : '✓ Sauvegarder'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Bouton aperçu ────────────────────────────── */}
        {isSong && !music.isReady && (
          <View style={styles.audioBlockedBanner}>
            <Text style={styles.audioBlockedText}>
              🎵 L'aperçu sera disponible dès que votre chanson est prête
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.previewBtn, (!editableContent.trim() || !canProceed) && { opacity: 0.4 }]}
          onPress={handleNext}
          disabled={!editableContent.trim() || !canProceed}
          activeOpacity={0.85}
        >
          <Text style={styles.previewBtnText}>Voir l'aperçu final →</Text>
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
  nextBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  nextBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.white,
  },

  content: { paddingBottom: 80 },

  // Album cover
  albumCover: {
    margin: Spacing[4],
    borderRadius: Radii['2xl'],
    padding: Spacing[6],
    alignItems: 'center',
    gap: 12,
    ...Shadows.lg,
  },
  albumEmoji: { fontSize: 52 },
  albumTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.white,
    textAlign: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
    height: 32,
  },
  waveBar: { width: 3, borderRadius: 2 },

  // Audio player section
  audioSection: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[2],
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    ...Shadows.md,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: { fontSize: 20 },
  audioInfo: { flex: 1, gap: 6 },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { backgroundColor: Colors.white },
  progressBg: { backgroundColor: 'rgba(255,255,255,0.3)' },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  audioStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.xl,
    padding: Spacing[4],
  },
  audioStatusEmoji: { fontSize: 20 },
  audioStatusText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onPrimaryContainer,
  },
  retryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  retryBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[4],
  },

  genreRow: { paddingHorizontal: Spacing[4], gap: 8 },
  genreChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  genreChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genreLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  genreLabelActive: { color: Colors.white },

  voiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing[4],
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  voiceBtnActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primary },
  voiceEmoji: { fontSize: 18 },
  voiceLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  voiceLabelActive: { color: Colors.onPrimaryContainer },

  contentCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    padding: Spacing[4],
    ...Shadows.sm,
  },
  contentInput: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 24,
    minHeight: 200,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[4],
  },
  regenBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  regenBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.primary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },

  audioBlockedBanner: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    padding: Spacing[3],
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.lg,
    alignItems: 'center',
  },
  audioBlockedText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onPrimaryContainer,
    textAlign: 'center',
  },

  previewBtn: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    paddingVertical: 17,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    ...Shadows.lg,
  },
  previewBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.white,
  },
});
