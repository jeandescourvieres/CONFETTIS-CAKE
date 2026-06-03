import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  ActivityIndicator,
  Modal,
  Animated,
  Image,
  Switch,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { useWritingAssistant } from '../../../src/hooks/useWritingAssistant';
import { markMessageSent, updateMessageContent, updateMessageStyle, updateMessagePhoto, deleteMessage } from '../../../src/services/messages.service';
import { buildSignatureText, getSignatureLabels } from '../../../src/utils/signature';
import { useCreateGroupMessage, useGroupMessage, formatSigners, groupShareUrl } from '../../../src/hooks/useGroupMessages';
import { fetchMusicStatus } from '../../../src/services/music.service';
import { useMusicGeneration } from '../../../src/hooks/useMusicGeneration';
import { useTTSGeneration } from '../../../src/hooks/useTTSGeneration';
import { saveTTSBgMusic } from '../../../src/services/tts.service';
import type { TTSVoiceKey } from '../../../src/types/models';
import { Config } from '../../../src/constants/config';
import * as SecureStore from 'expo-secure-store';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { supabase } from '../../../src/services/supabase';
import { MANUAL_STARTERS, pickRandom } from '../../../src/constants/manualStarters';
import { FESTIVE_IMAGES, FESTIVE_OVERLAY, getFestiveImageUrl, hasFestiveImages } from '../../../src/utils/festiveImageUrl';
import { resolveGenderTokens } from '../../../src/utils/genderTokens';
import { useContacts } from '../../../src/hooks/useContacts';
import { saveMessage } from '../../../src/services/messages.service';
import type { Contact } from '../../../src/types/models';

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

// ── Lecteur audio TTS ─────────────────────────────────────────────────────────
function TTSPlayer({ ttsUrl }: { ttsUrl: string }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const soundRef   = useRef<Audio.Sound | null>(null);
  const mountedRef = useRef(true);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [positionMs,  setPositionMs]  = useState(0);
  const [durationMs,  setDurationMs]  = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, staysActiveInBackground: false });
    return () => {
      mountedRef.current = false;
      const s = soundRef.current;
      if (s) {
        // Stopper avant de décharger pour éviter le deadlock expo-av
        s.stopAsync().catch(() => {}).finally(() => s.unloadAsync().catch(() => {}));
        soundRef.current = null;
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: ttsUrl },
        { shouldPlay: true },
        (status) => {
          if (!mountedRef.current || !status.isLoaded) return;
          setPositionMs(status.positionMillis ?? 0);
          setDurationMs(status.durationMillis ?? 0);
          if (status.didJustFinish) { setIsPlaying(false); setPositionMs(0); }
        },
      );
      if (!mountedRef.current) { sound.unloadAsync().catch(() => {}); return; }
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
        <Text style={styles.audioLabel}>🎙️ Écouter le message vocal</Text>
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

// ── Occasions pour le panneau "Idées" ────────────────────────────────────────
const IDEAS_OCCASIONS: { value: string; label: string; emoji: string; color: string }[] = [
  { value: 'birthday',   label: 'Anniversaire',   emoji: '🎁', color: '#9b6bb5' },
  { value: 'nameday',    label: 'Bonne Fête',     emoji: '🌸', color: '#e88fa3' },
  { value: 'wedding',    label: 'Mariage',        emoji: '💍', color: '#c9a8e0' },
  { value: 'engagement', label: 'Fiançailles',    emoji: '💎', color: '#E91E63' },
  { value: 'birth',      label: 'Naissance',      emoji: '👶', color: '#fdd34d' },
  { value: 'baptism',    label: 'Baptême',        emoji: '🕊️', color: '#90CAF9' },
  { value: 'communion',  label: 'Communion',      emoji: '✝️', color: '#A5D6A7' },
  { value: 'graduation', label: 'Diplôme',        emoji: '🎓', color: '#4CAF50' },
  { value: 'thanks',     label: 'Remerciements',  emoji: '🙏', color: '#FF9800' },
  { value: 'newyear',    label: 'Nouvel An',      emoji: '🎆', color: '#9C27B0' },
  { value: 'christmas',  label: 'Noël',           emoji: '🎄', color: '#C62828' },
  { value: 'easter',     label: 'Pâques',         emoji: '🐣', color: '#7CB342' },
  { value: 'valentines', label: 'Saint-Valentin', emoji: '💝', color: '#E91E63' },
  { value: 'mothersday', label: 'Fête des Mères', emoji: '👩', color: '#F06292' },
  { value: 'fathersday', label: 'Fête des Pères', emoji: '👨', color: '#1976D2' },
  { value: 'halloween',  label: 'Halloween',      emoji: '🎃', color: '#E65100' },
  { value: 'retirement', label: 'Retraite',       emoji: '🌴', color: '#00796B' },
  { value: 'support',    label: 'Soutien',        emoji: '🤍', color: '#5C8FA8' },
  { value: 'greetings', label: 'Coucou !',        emoji: '👋', color: '#43A047' },
];

// ── PS d'excuse de retard ─────────────────────────────────────────────────────
const LATE_PS_OPTIONS = [
  { emoji: '😅', label: 'Autodérision tendre', text: "PS : Je sais, je suis un peu en retard... mais tu comptes tellement pour moi que je ne pouvais vraiment pas laisser passer ça sans te le dire ! 😅🙈" },
  { emoji: '😄', label: 'Humour léger', text: "PS : Oui, oui, je sais... je suis en retard 😬 Mais l'essentiel c'est que je pense à toi, non ? 😄" },
  { emoji: '💛', label: 'Court & direct', text: "PS : Un peu de retard, beaucoup d'affection. 💛" },
  { emoji: '🌸', label: 'Poétique', text: "PS : Le calendrier m'a échappé, mais mes pensées pour toi, jamais. 🌸" },
  { emoji: '🫶', label: 'Chaleureux', text: "PS : Promis, la prochaine fois je serai à l'heure ! En attendant... je t'embrasse fort. 🫶" },
  { emoji: '✨', label: 'Sincère', text: "PS : Les vrais sentiments n'ont pas de date d'expiration. Je te le dis du fond du cœur. ✨" },
];

// ── Formules de clôture ───────────────────────────────────────────────────────
const CLOSING_FORMULAS: { value: string; label: string; group: string }[] = [
  { value: 'Bien à toi',                      label: 'Bien à toi',                      group: 'Amical' },
  { value: 'Grosses bises',                   label: 'Grosses bises',                   group: 'Amical' },
  { value: 'Bisous',                          label: 'Bisous',                          group: 'Amical' },
  { value: 'Gros bisous',                     label: 'Gros bisous',                     group: 'Amical' },
  { value: 'Plein de gros bisous',            label: 'Plein de gros bisous',            group: 'Amical' },
  { value: 'Avec toute mon affection',        label: 'Avec toute mon affection',        group: 'Amical' },
  { value: 'À très vite',                     label: 'À très vite',                     group: 'Amical' },
  { value: 'Amicalement',                     label: 'Amicalement',                     group: 'Semi-formel' },
  { value: 'Bien amicalement',               label: 'Bien amicalement',               group: 'Semi-formel' },
  { value: 'Avec mes pensées',               label: 'Avec mes pensées',               group: 'Semi-formel' },
  { value: 'Sincèrement',                     label: 'Sincèrement',                     group: 'Formel' },
  { value: 'Bien à vous',                     label: 'Bien à vous',                     group: 'Formel' },
  { value: 'Cordialement',                    label: 'Cordialement',                    group: 'Formel' },
  { value: 'Avec mes meilleures salutations',  label: 'Avec mes meilleures salutations',  group: 'Formel' },
  { value: 'Avec mes sincères salutations',    label: 'Avec mes sincères salutations',    group: 'Formel' },
];
const CLOSING_GROUPS = ['Amical', 'Semi-formel', 'Formel'];
const CLOSING_GROUP_COLOR: Record<string, string> = {
  'Amical':      '#E91E8C',
  'Semi-formel': '#5C8FA8',
  'Formel':      '#6D4C41',
};

// ── Inversion du lien famille (contact → expéditeur) ─────────────────────────
const LIEN_INVERSE: Record<string, { m: string; f: string }> = {
  'fils':         { m: 'père',      f: 'mère'       },
  'fille':        { m: 'père',      f: 'mère'       },
  'gendre':       { m: 'beau-père', f: 'belle-mère' },
  'belle-fille':  { m: 'beau-père', f: 'belle-mère' },
  'frère':        { m: 'frère',     f: 'sœur'       },
  'sœur':         { m: 'frère',     f: 'sœur'       },
  'père':         { m: 'fils',      f: 'fille'      },
  'mère':         { m: 'fils',      f: 'fille'      },
  'grand-père':   { m: 'grand-père',f: 'grand-mère' },
  'grand-mère':   { m: 'grand-père',f: 'grand-mère' },
  'petit-fils':   { m: 'grand-père',f: 'grand-mère' },
  'petite-fille': { m: 'grand-père',f: 'grand-mère' },
  'oncle':        { m: 'neveu',     f: 'nièce'      },
  'tante':        { m: 'neveu',     f: 'nièce'      },
  'cousin':       { m: 'cousin',    f: 'cousine'    },
  'cousine':      { m: 'cousin',    f: 'cousine'    },
  'beau-frère':   { m: 'beau-frère',f: 'belle-sœur' },
  'belle-sœur':   { m: 'beau-frère',f: 'belle-sœur' },
};

// ── Formules d'appel ──────────────────────────────────────────────────────────
const OPENING_FORMULAS: { value: string }[] = [
  { value: 'Bonjour {prénom},'   },
  { value: 'Salut {prénom},'     },
  { value: 'Coucou {prénom},'    },
  { value: 'Hello {prénom},'     },
  { value: 'Cher {prénom},'      },
  { value: 'Très cher {prénom},' },
  { value: 'Mon cher {prénom},'  },
];

// ── Share channels ────────────────────────────────────────────────────────────
const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬', color: '#25D366' },
  { id: 'sms', label: 'SMS', emoji: '📱', color: Colors.primary },
  { id: 'email', label: 'Email', emoji: '📧', color: '#EA4335' },
  { id: 'copy', label: 'Copier', emoji: '📋', color: Colors.onSurfaceVariant, sub: 'Messenger, Insta,\nTikTok…', info: true },
];

// ── Type de style de police ───────────────────────────────────────────────────
type FontStyle = 'standard' | 'caveat_bold' | 'dancing' | 'dancing_sc' | 'satisfy' | 'patrick' | 'pacifico' | 'special_elite' | 'bangers' | 'merriweather' | 'oswald' | 'roboto_slab' | 'space_mono' | 'playfair' | 'times_new_roman' | 'comic_sans' | 'verdana' | 'book_antiqua';

const FONT_STYLES: { value: FontStyle; label: string; font: string; group: string }[] = [
  // ── Classique ──
  { value: 'standard',      label: 'Standard',            font: 'BeVietnamPro_400Regular',   group: 'Classique' },
  { value: 'caveat_bold',   label: 'Gras',                font: 'BeVietnamPro_700Bold',       group: 'Classique' },
  { value: 'dancing',       label: 'Léger',               font: 'BeVietnamPro_300Light',      group: 'Classique' },
  { value: 'merriweather',  label: 'Merriweather',        font: 'Merriweather_400Regular',    group: 'Classique' },
  { value: 'playfair',      label: 'Playfair Display',    font: 'PlayfairDisplay_400Regular', group: 'Classique' },
  { value: 'oswald',        label: 'Oswald',              font: 'Oswald_400Regular',          group: 'Classique' },
  { value: 'roboto_slab',   label: 'Roboto Slab',         font: 'RobotoSlab_400Regular',      group: 'Classique' },
  { value: 'space_mono',    label: 'Space Mono',          font: 'SpaceMono_400Regular',       group: 'Classique' },
  // ── Manuscrit ──
  { value: 'satisfy',       label: 'Satisfy',             font: 'Satisfy_400Regular',         group: 'Manuscrit' },
  { value: 'patrick',       label: 'Patrick Hand',        font: 'PatrickHand_400Regular',     group: 'Manuscrit' },
  { value: 'pacifico',      label: 'Pacifico',            font: 'Pacifico_400Regular',        group: 'Manuscrit' },
  { value: 'dancing_sc',    label: 'Dancing Script',      font: 'DancingScript_400Regular',   group: 'Manuscrit' },
  // ── Déco ──
  { value: 'special_elite', label: 'Vintage',             font: 'SpecialElite_400Regular',    group: 'Déco' },
  { value: 'bangers',       label: 'Comic',               font: 'Bangers_400Regular',         group: 'Déco' },
  // ── Système ──
  { value: 'times_new_roman', label: 'Times New Roman',  font: 'TimesNewRoman',              group: 'Système' },
  { value: 'comic_sans',      label: 'Comic Sans MS',     font: 'ComicSansMS',                group: 'Système' },
  { value: 'verdana',         label: 'Verdana',           font: 'Verdana',                    group: 'Système' },
  { value: 'book_antiqua',    label: 'Book Antiqua',      font: 'BookAntiqua',                group: 'Système' },
];

function getFontFamily(fs: string): string {
  return FONT_STYLES.find((s) => s.value === fs)?.font ?? 'BeVietnamPro_400Regular';
}

const FONT_SIZES: { key: 'sm' | 'md' | 'lg'; label: string; size: number; lineHeight: number }[] = [
  { key: 'sm', label: 'S', size: 15, lineHeight: 24 },
  { key: 'md', label: 'M', size: 19, lineHeight: 30 },
  { key: 'lg', label: 'L', size: 24, lineHeight: 38 },
];

// ── Lyrics card (song format splits by newlines) ──────────────────────────────
function LyricsCard({ content, fontStyle = 'standard', fontSize = 'md', isItalic = false }: { content: string; fontStyle?: FontStyle; fontSize?: 'sm' | 'md' | 'lg'; isItalic?: boolean }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const isM = fontStyle !== 'standard';
  const mFont = isM ? getFontFamily(fontStyle) : null;
  const fSize = FONT_SIZES.find((s) => s.key === fontSize) ?? FONT_SIZES[1];
  const parts = content.split(/\n{2,}/);
  return (
    <View style={[styles.lyricsCard, isM && styles.lyricsCardManuscript]}>
      {parts.map((part, i) => (
        <View key={i} style={styles.lyricsPart}>
          <Text style={[styles.lyricsText, { fontFamily: mFont ?? 'BeVietnamPro_400Regular', fontSize: fSize.size, lineHeight: fSize.lineHeight, fontStyle: isItalic ? 'italic' : 'normal' }]}>{part.trim()}</Text>
          {i < parts.length - 1 && <View style={styles.lyricsDivider} />}
        </View>
      ))}
    </View>
  );
}

// ── Fond animé — thèmes ───────────────────────────────────────────────────────
const BG_THEMES = [
  { id: 'none',       emoji: '🚫', label: 'Aucun',      color: 'transparent', particles: [] },
  { id: 'auto',       emoji: '🤖', label: 'Auto',        color: '#F8E8FF',     particles: ['🎉','✨','🎊','⭐'] },
  { id: 'birthday',   emoji: '🎂', label: 'Anniversaire', color: '#FFF3E0',    particles: ['🎉','🎊','🥳','🎈'] },
  { id: 'petales',    emoji: '🌸', label: 'Pétales',     color: '#FCE4EC',     particles: ['🌸','🌺','🌼','💐'] },
  { id: 'flocons',    emoji: '❄️', label: 'Flocons',     color: '#E3F2FD',     particles: ['❄️','⛄','🌨','✨'] },
  { id: 'coeurs',     emoji: '💝', label: 'Cœurs',       color: '#FCE4EC',     particles: ['💝','💖','❤️','💕'] },
  { id: 'etoiles',    emoji: '⭐', label: 'Étoiles',     color: '#F3E5F5',     particles: ['⭐','🌟','✨','💫'] },
] as const;

type BgThemeId = typeof BG_THEMES[number]['id'];

/** Une particule animée (emoji flottant) */
function FloatingParticle({ emoji, delay, x }: { emoji: string; delay: number; x: number }) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, { toValue: -220, duration: 3200, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.85, duration: 400, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1200, delay: 1600, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(y, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.Text
      style={{ position: 'absolute', bottom: 0, left: x, fontSize: 18, opacity, transform: [{ translateY: y }] }}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function PreviewScreen() {
  const router = useRouter();
  const C = useColors();
  const { autoGen, prefillMessage, petImageUrl, noEdit, petDirection, petName, petType, petBreed, petGender, petOwnerName, petId, petOwnerId, petThirdId, petThirdName, petPersonalityTags, fromTemplate, manualMode } = useLocalSearchParams<{ autoGen?: string; prefillMessage?: string; petImageUrl?: string; noEdit?: string; petDirection?: string; petName?: string; petType?: string; petBreed?: string; petGender?: string; petOwnerName?: string; petId?: string; petOwnerId?: string; petThirdId?: string; petThirdName?: string; petPersonalityTags?: string; fromTemplate?: string; manualMode?: string }>();
  const isNoEdit = noEdit === '1';
  const isManualEntry = manualMode === '1';
  const isFromTemplate = fromTemplate === '1' || (!!prefillMessage && prefillMessage.trim().length > 0);
  const { generate, isPending } = useAIGenerate();
  const { i18n } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const {
    format,
    tone,
    occasion,
    musicVoice,
    contactId,
    contactName,
    contactPhone,
    contactEmail,
    generatedContent,
    savedMessageId,
    sessionKey,
    setGeneratedContent,
    setSavedMessageId,
    relation,
    familySubRelation,
    fontStyle,
    fontSize,
    isItalic,
    setFontStyle,
    setFontSize,
    setIsItalic,
  } = useCreateStore();

  const assist = useWritingAssistant();

  const isSong = format === 'song';

  const musicStyle = `${occasion} ${musicVoice === 'female' ? 'female vocal' : musicVoice === 'male' ? 'male vocal' : ''}`.trim();

  const music = useMusicGeneration({
    messageId: savedMessageId ?? '',
    initialStatus: 'none',
    initialAudioUrl: null,
    lyrics: generatedContent,
    style: musicStyle,
    tone,
    userId: profile?.id ?? '',
  });

  // Déclenche la génération musicale dès que le message chanson est sauvegardé
  useEffect(() => {
    if (isSong && savedMessageId && !music.isReady && !music.isLoading && music.musicStatus === 'none') {
      music.trigger();
    }
  }, [isSong, savedMessageId]);

  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isManuscript = fontStyle !== 'standard';

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  // ── Traduction du message ────────────────────────────────────────────────────
  const TRANSLATE_LANGS = [
    { code: 'en', flag: '🇬🇧', label: 'Anglais' },
    { code: 'de', flag: '🇩🇪', label: 'Allemand' },
    { code: 'es', flag: '🇪🇸', label: 'Espagnol' },
    { code: 'it', flag: '🇮🇹', label: 'Italien' },
    { code: 'pt', flag: '🇵🇹', label: 'Portugais' },
  ];
  const [showTranslatePicker, setShowTranslatePicker] = useState(false);
  const [isTranslating, setIsTranslating]             = useState(false);
  const [isRewritingPoem, setIsRewritingPoem]         = useState(false);
  const originalContentRef                            = useRef<string | null>(null);
  const originalOpeningRef                            = useRef<string | null>(null);
  const originalClosingRef                            = useRef<string | null>(null);
  const originalShowLatePSRef                         = useRef<boolean>(false);
  const originalSelectedPSIdxRef                      = useRef<number>(0);
  const scrollRef                                      = useRef<ScrollView>(null);
  const sigSectionY                                    = useRef<number>(0);
  const editInputRef                                   = useRef<import('react-native').TextInput>(null);
  const messageCardRef                                 = useRef<View>(null);
  const shareWrapperRef                                = useRef<View>(null);

  // Réinitialise tout l'état local à chaque nouveau message (sessionKey change via bumpSessionKey())
  const prevSessionKeyRef = useRef(sessionKey);
  useEffect(() => {
    if (prevSessionKeyRef.current !== sessionKey) {
      prevSessionKeyRef.current = sessionKey;
      // Visuels
      setShowFestiveImage(false);
      setFestiveSlug(null);
      setShowSenderPhoto(false);
      setPhotoUri(null);
      setPhotoShape('round');
      // Décorations message
      setOpeningFormula(null);
      setClosingFormula(null);
      setBgTheme('none');
      setShowLatePS(false);
      setSelectedPSIdx(0);
      // Accordéons
      setSigOpen(false);
      setOpeningOpen(false);
      setClosingOpen(false);
      setBgOpen(false);
      setPhotoOpen(false);
      setMultiOpen(false);
      setTtsOpen(false);
      setLatePSOpen(false);
      // Multi-contacts
      setExtraContacts([]);
      // Édition
      setIsEditing(false);
      setLocalContent('');
      // Panneau idées
      setIdeasStep('closed');
    }
  }, [sessionKey]);

  const [showMicHint, setShowMicHint]                  = useState(false);
  const [senderPhotoUri, setSenderPhotoUri]             = useState<string | null>(() => profile?.avatar_url ?? null);
  const [showSenderPhoto, setShowSenderPhoto]           = useState<boolean>(false);
  const [photoShape, setPhotoShape]                     = useState<'round' | 'square'>('round');
  const [showFestiveImage, setShowFestiveImage]         = useState(false);
  const [festiveSlug, setFestiveSlug]                   = useState<string | null>(null);

  const handlePickSenderPhoto = (onCancel?: () => void) => {
    Alert.alert('Ta photo', 'Choisir depuis…', [
      { text: 'Annuler', style: 'cancel', onPress: () => onCancel?.() },
      {
        text: '📷 Prendre un selfie',
        onPress: () => {
          Alert.alert(
            'Astuce recadrage',
            'Après la photo, centre ton visage dans le cadre puis appuie sur "Redimensionner" en haut pour valider.',
            [{
              text: "C'est parti ! 📸",
              onPress: async () => {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') { onCancel?.(); return; }
                const result = await ImagePicker.launchCameraAsync({
                  cameraType: ImagePicker.CameraType.front,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets[0]) {
                  setSenderPhotoUri(result.assets[0].uri);
                  setShowSenderPhoto(true);
                } else { onCancel?.(); }
              },
            },
            { text: 'Annuler', style: 'cancel', onPress: () => onCancel?.() }],
          );
        },
      },
      {
        text: '🖼️ Choisir dans la galerie',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { onCancel?.(); return; }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            setSenderPhotoUri(result.assets[0].uri);
            setShowSenderPhoto(true);
          } else { onCancel?.(); }
        },
      },
      {
        text: '👤 Utiliser ma photo de profil',
        onPress: () => {
          if (profile?.avatar_url) {
            setSenderPhotoUri(profile.avatar_url);
            setShowSenderPhoto(true);
          } else { onCancel?.(); }
        },
      },
    ]);
  };

  const handleTranslate = async (targetLang: string) => {
    const body = isEditing ? localContent.trim() : generatedContent.trim();
    if (!body) return;

    // Sauvegarde l'état complet avant la première traduction
    if (!originalContentRef.current) {
      originalContentRef.current = body;
      originalOpeningRef.current = openingFormula;
      originalClosingRef.current = closingFormula;
      originalShowLatePSRef.current = showLatePS;
      originalSelectedPSIdxRef.current = selectedPSIdx;
    }

    // Assemble le message complet pour une traduction cohérente
    const resolvedOpening = openingFormula
      ? resolveOpening(openingFormula).replace('{prénom}', contactFirstName)
      : null;
    const parts = [resolvedOpening, body, closingFormula].filter(Boolean) as string[];
    if (showLatePS) parts.push(activePSText);
    const textToTranslate = parts.join('\n\n');

    setShowTranslatePicker(false);
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-message', {
        body: { text_to_translate: textToTranslate, language: targetLang },
      });
      if (error || !data?.content) throw new Error('Traduction échouée');
      isContentReplaceRef.current = true;
      setGeneratedContent(data.content as string);
      if (isEditing) setLocalContent(data.content as string);
      // Tout est intégré dans le corps traduit — on vide les éléments séparés pour éviter les doublons
      setOpeningFormula(null);
      setClosingFormula(null);
      if (showLatePS) setShowLatePS(false);
      if (savedMessageId) {
        try { await import('../../../src/services/messages.service').then(m => m.updateMessageContent(savedMessageId, data.content as string)); } catch { /* non-bloquant */ }
      }
    } catch {
      Alert.alert('Traduction', 'La traduction a échoué. Réessaie dans un instant.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRewriteAsPoem = async () => {
    const textToRewrite = isEditing ? localContent.trim() : generatedContent.trim();
    if (!textToRewrite) return;
    if (!originalContentRef.current) originalContentRef.current = textToRewrite;
    setIsRewritingPoem(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-message', {
        body: { text_to_rewrite_as_poem: textToRewrite },
      });
      if (error || !data?.content) throw new Error('Réécriture échouée');
      isContentReplaceRef.current = true;
      setGeneratedContent(data.content as string);
      if (isEditing) setLocalContent(data.content as string);
      if (savedMessageId) {
        try { await import('../../../src/services/messages.service').then(m => m.updateMessageContent(savedMessageId, data.content as string)); } catch { /* non-bloquant */ }
      }
    } catch {
      Alert.alert('Poème', 'La réécriture a échoué. Réessaie dans un instant.');
    } finally {
      setIsRewritingPoem(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (!originalContentRef.current) return;
    isContentReplaceRef.current = true;
    setGeneratedContent(originalContentRef.current);
    if (isEditing) setLocalContent(originalContentRef.current);
    setOpeningFormula(originalOpeningRef.current);
    setClosingFormula(originalClosingRef.current);
    setShowLatePS(originalShowLatePSRef.current);
    setSelectedPSIdx(originalSelectedPSIdxRef.current);
    originalContentRef.current = null;
    originalOpeningRef.current = null;
    originalClosingRef.current = null;
    originalShowLatePSRef.current = false;
    originalSelectedPSIdxRef.current = 0;
    setShowTranslatePicker(false);
  };
  const [writingHelpVisible, setWritingHelpVisible] = useState(false);
  const [copyHelpVisible, setCopyHelpVisible] = useState(false);
  const [imageHelpVisible, setImageHelpVisible] = useState(false);
  const [fontPickerVisible, setFontPickerVisible] = useState(false);

  // Charger la police préférée au montage
  useEffect(() => {
    SecureStore.getItemAsync('preferred_font_style').then((saved) => {
      if (saved && FONT_STYLES.find(s => s.value === saved)) setFontStyle(saved as FontStyle);
    }).catch(() => {});
  }, []);

  // ── Panneau "Idées" — occasions → modèles ───────────────────────────────────
  const [ideasStep, setIdeasStep] = useState<'closed' | 'occasion' | 'templates'>('closed');
  const [ideasOccasion, setIdeasOccasion] = useState<string>('birthday');
  const [ideasTon, setIdeasTon] = useState<'tu' | 'vous'>('tu');
  const [ideasLongueur, setIdeasLongueur] = useState<'court' | 'moyen' | 'long'>('court');
  const [ideasTemplates, setIdeasTemplates] = useState<{ id: string; title: string; content: string }[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasFullPreview, setIdeasFullPreview] = useState<{ display: string; raw: string } | null>(null);

  const openIdeasOccasion = () => {
    setIdeasStep(ideasStep === 'closed' ? 'occasion' : 'closed');
  };

  const selectIdeasOccasion = async (occ: string) => {
    setIdeasOccasion(occ);
    setIdeasStep('templates');
    await loadIdeasTemplates(occ, ideasTon, ideasLongueur);
  };

  const loadIdeasTemplates = async (occ: string, ton: 'tu' | 'vous', longueur: 'court' | 'moyen' | 'long') => {
    setIdeasLoading(true);
    const { data } = await supabase
      .from('message_templates')
      .select('id, title, content')
      .eq('occasion', occ)
      .eq('ton', ton)
      .eq('longueur', longueur)
      .eq('is_system', true)
      .order('created_at', { ascending: true });

    const remoteTemplates = (data as { id: string; title: string; content: string }[]) ?? [];

    if (remoteTemplates.length > 0) {
      setIdeasTemplates(remoteTemplates);
    } else {
      // Fallback sur les modèles locaux MANUAL_STARTERS
      const starterSet = MANUAL_STARTERS[occ as keyof typeof MANUAL_STARTERS];
      const texts: string[] = starterSet?.[ton]?.[longueur] ?? [];
      const picked = pickRandom(texts, texts.length);
      setIdeasTemplates(picked.map((content, i) => ({ id: `local-${i}`, title: content.slice(0, 40), content })));
    }

    setIdeasLoading(false);
  };

  const changeIdeasFilter = (ton: 'tu' | 'vous', longueur: 'court' | 'moyen' | 'long') => {
    setIdeasTon(ton);
    setIdeasLongueur(longueur);
    if (ideasStep === 'templates') loadIdeasTemplates(ideasOccasion, ton, longueur);
  };

  const applyIdeasTemplate = (content: string) => {
    const parts = contactName.trim().split(/\s+/);
    const firstName = (() => { const f = parts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w))); return f.join(' ') || parts[0] || 'toi'; })();
    const currentYear = new Date().getFullYear().toString();
    const filled = resolveGenderTokens(content, senderGender, contactGender)
      .replace(/\{prenom\}/gi, firstName)
      .replace(/\[Prénom\]/gi, firstName)
      .replace(/\{annee\}/gi, currentYear)
      .replace(/\r\n/g, '\n')
      .replace(/\n+/g, '\n\n')
      .replace(/([.!?…])[^\S\n]+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ\p{Emoji_Presentation}])/gu, '$1\n\n$2')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    setLocalContent(filled);
    assist.dismissImproved();
    setIdeasStep('closed');
  };

  // ── Contacts (pour multi-envoi) ─────────────────────────────────────────────
  const { data: allContacts = [] } = useContacts();
  const contactObj = allContacts.find((c) => c.id === contactId) ?? null;
  const contactGender: 'f' | 'm' = contactObj?.civilite === 'Mme' ? 'f' : 'm';
  const resolveOpening = (formula: string): string => {
    if (contactGender !== 'f') return formula;
    return formula
      .replace('Mon cher', 'Ma chère')
      .replace('Très cher', 'Très chère')
      .replace('Cher ', 'Chère ');
  };

  const resolveGender = (text: string, gender: 'm' | 'f'): string => {
    if (gender === 'f') {
      return text
        .replace(/heureux\(se\)/gi, 'heureuse')
        .replace(/\(se\)/gi, 'se')
        .replace(/eux\(se\)/gi, 'euse')
        .replace(/\(e\)/gi, 'e')
        .replace(/\(ère\)/gi, 'ère')
        .replace(/\(ive\)/gi, 'ive')
        .replace(/\(rice\)/gi, 'rice')
        .replace(/\(trice\)/gi, 'trice');
    }
    return text
      .replace(/heureux\(se\)/gi, 'heureux')
      .replace(/\([^)]+\)/g, '');
  };

  // ── Accordéon — état ouvert/fermé des 5 sections ────────────────────────────
  const [sigOpen,         setSigOpen]         = useState(false);
  const [openingOpen,     setOpeningOpen]     = useState(false);
  const [openingFormula,  setOpeningFormula]  = useState<string | null>(null);
  const [closingOpen,     setClosingOpen]     = useState(false);
  const [closingFormula,  setClosingFormula]  = useState<string | null>(null);
  const [bgOpen,          setBgOpen]          = useState(false);
  const [photoOpen,   setPhotoOpen]   = useState(false);
  const [multiOpen,   setMultiOpen]   = useState(false);
  const [ttsOpen,     setTtsOpen]     = useState(false);
  const [morseMode,   setMorseMode]   = useState(false);
  const [bgMusicOpen, setBgMusicOpen] = useState(false);
  const [latePSOpen,    setLatePSOpen]    = useState(false);
  const [showLatePS,    setShowLatePS]    = useState(false);
  const [selectedPSIdx, setSelectedPSIdx] = useState(0);
  const activePSText = LATE_PS_OPTIONS[selectedPSIdx].text;

  useEffect(() => {
    if (sigOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: sigSectionY.current, animated: true });
      }, 100);
    }
  }, [sigOpen]);

  // ── Multi-destinataires ──────────────────────────────────────────────────────
  const [extraContacts,       setExtraContacts]       = useState<Contact[]>([]);
  const [contactSearch,       setContactSearch]       = useState('');
  const [multiSendProgress,   setMultiSendProgress]   = useState<{ current: number; total: number } | null>(null);

  const filteredContacts = allContacts
    .filter((c) => {
      if (c.id === contactId) return false;
      if (!contactSearch.trim()) return true;
      return c.name.toLowerCase().includes(contactSearch.toLowerCase());
    })
    .sort((a, b) => {
      // Tri par nom de famille (première partie du champ "NOM Prénom")
      const lastA = a.name.trim().split(' ')[0].toLowerCase();
      const lastB = b.name.trim().split(' ')[0].toLowerCase();
      return lastA.localeCompare(lastB, 'fr');
    });

  const toggleExtraContact = (contact: Contact) => {
    setExtraContacts((prev) =>
      prev.some((c) => c.id === contact.id)
        ? prev.filter((c) => c.id !== contact.id)
        : [...prev, contact],
    );
  };

  // ── Photo attachée à la carte ────────────────────────────────────────────────
  const [photoUri,       setPhotoUri]       = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoMode,      setPhotoMode]      = useState<'under' | 'overlay'>('under');

  const handlePickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est nécessaire pour joindre une photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => setPhotoUri(null);

  // Upload vers Supabase storage et sauvegarde l'URL
  const uploadPhoto = async (localUri: string): Promise<string | null> => {
    try {
      setPhotoUploading(true);
      const ext = localUri.split('.').pop() ?? 'jpg';
      const fileName = `${Date.now()}.${ext}`;
      const response = await fetch(localUri);
      const blob = await response.blob();
      const { error } = await supabase.storage
        .from('card-photos')
        .upload(fileName, blob, { contentType: `image/${ext}` });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('card-photos').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch {
      return null;
    } finally {
      setPhotoUploading(false);
    }
  };

  // ── Destinataire (comment adresser la carte) ────────────────────────────────
  type RecipientType = 'prenom' | 'prenom_nom' | 'surnom' | 'aucun';
  const [recipientOpen,   setRecipientOpen]   = useState(false);
  const [recipientType,   setRecipientType]   = useState<RecipientType>('prenom');
  const [recipientCustom, setRecipientCustom] = useState('');

  // ── Signature personnalisée ──────────────────────────────────────────────────
  type SigType = 'prenom' | 'lien' | 'lien_prenom' | 'nom_complet' | 'surnom' | 'none';
  const [sigType, setSigType] = useState<SigType>('prenom');
  const [sigCustom, setSigCustom] = useState('');
  const [sigHelpVisible, setSigHelpVisible] = useState(false);

  // ── Fond coloré et animé ─────────────────────────────────────────────────────
  const [bgTheme, setBgTheme] = useState<BgThemeId>('none');
  const [bgHelpVisible, setBgHelpVisible] = useState(false);
  const activeBgTheme = BG_THEMES.find((t) => t.id === bgTheme) ?? BG_THEMES[0];

  // ── Message vocal (TTS) ──────────────────────────────────────────────────────
  const TTS_VOICES: { key: TTSVoiceKey; emoji: string; label: string; sub: string }[] = [
    { key: 'homme_neutre',     emoji: '🎙️', label: 'Homme',     sub: 'Neutre'      },
    { key: 'homme_chaleureux', emoji: '🎙️', label: 'Homme',     sub: 'Chaleureux'  },
    { key: 'femme_douce',      emoji: '🎤', label: 'Femme',     sub: 'Douce'       },
    { key: 'femme_joyeuse',    emoji: '🎤', label: 'Femme',     sub: 'Joyeuse'     },
  ];
  const [ttsVoiceKey,    setTtsVoiceKey]    = useState<TTSVoiceKey>('femme_douce');
  const [ttsBgMusic,     setTtsBgMusic]     = useState<string>('piano');
  const [ttsHelpVisible, setTtsHelpVisible] = useState(false);
  const tts = useTTSGeneration();

  const TTS_BG_MUSIC_ALL: { key: string; emoji: string; label: string }[] = [
    { key: 'aucune',     emoji: '🔇', label: 'Aucune'      },
    { key: 'piano',      emoji: '🎹', label: 'Piano'       },
    { key: 'guitare',    emoji: '🎸', label: 'Guitare'     },
    { key: 'festif',     emoji: '🎉', label: 'Festive'     },
    { key: 'romantique', emoji: '🎻', label: 'Romantique'  },
    { key: 'berceuse',   emoji: '🌙', label: 'Berceuse'    },
    { key: 'classique',  emoji: '🎼', label: 'Classique'   },
    { key: 'triomphal',  emoji: '🎺', label: 'Triomphal'   },
    { key: 'jazz',       emoji: '🎷', label: 'Jazz'        },
    { key: 'noel',       emoji: '🎄', label: 'Noël'        },
    { key: 'halloween',  emoji: '🎃', label: 'Halloween'   },
    { key: 'tendre',     emoji: '💛', label: 'Tendre'      },
  ];

  const TTS_BG_MUSIC_BY_OCCASION: Record<string, string[]> = {
    birthday:   ['aucune', 'festif',     'jazz',      'piano'    ],
    nameday:    ['aucune', 'tendre',     'piano',     'guitare'  ],
    wedding:    ['aucune', 'romantique', 'classique', 'piano'    ],
    engagement: ['aucune', 'romantique', 'jazz',      'piano'    ],
    birth:      ['aucune', 'berceuse',   'piano',     'tendre'   ],
    baptism:    ['aucune', 'classique',  'tendre',    'piano'    ],
    communion:  ['aucune', 'classique',  'piano',     'tendre'   ],
    graduation: ['aucune', 'triomphal',  'festif',    'jazz'     ],
    promotion:  ['aucune', 'triomphal',  'jazz',      'festif'   ],
    thanks:     ['aucune', 'tendre',     'piano',     'guitare'  ],
    newyear:    ['aucune', 'festif',     'jazz',      'triomphal'],
    christmas:  ['aucune', 'noel',       'classique', 'piano'    ],
    easter:     ['aucune', 'guitare',    'piano',     'classique'],
    valentines: ['aucune', 'romantique', 'jazz',      'piano'    ],
    mothersday: ['aucune', 'tendre',     'piano',     'guitare'  ],
    fathersday: ['aucune', 'jazz',       'guitare',   'piano'    ],
    halloween:  ['aucune', 'halloween',  'festif',    'piano'    ],
    retirement: ['aucune', 'jazz',       'guitare',   'piano'    ],
    support:    ['aucune', 'piano',      'tendre',    'guitare'  ],
    greetings:  ['aucune', 'festif',     'guitare',   'jazz'     ],
  };

  const occasionMusicKeys = TTS_BG_MUSIC_BY_OCCASION[occasion] ?? ['aucune', 'piano', 'guitare', 'festif'];
  const TTS_BG_MUSIC = TTS_BG_MUSIC_ALL.filter((m) => occasionMusicKeys.includes(m.key))
    .sort((a, b) => occasionMusicKeys.indexOf(a.key) - occasionMusicKeys.indexOf(b.key));

  // Genre de l'expéditeur — pour inverser correctement le lien famille
  const senderGender: 'm' | 'f' = profile?.civilite === 'Mme' ? 'f' : 'm';

  // Préfixe possessif Ton/Ta selon le lien inversé
  const LIEN_FEMININ = new Set(['mère', 'sœur', 'grand-mère', 'tante', 'fille', 'cousine', 'petite-fille', 'belle-sœur', 'belle-fille', 'belle-mère', 'nièce']);
  const possessiveLien = (lien: string) => {
    const lower = lien.toLowerCase();
    const inverted = LIEN_INVERSE[lower]?.[senderGender] ?? lien;
    const prefix = LIEN_FEMININ.has(inverted.toLowerCase()) ? 'Ta' : 'Ton';
    return `${prefix} ${inverted.charAt(0).toUpperCase()}${inverted.slice(1)}`;
  };

  const nameParts2 = (profile?.full_name ?? '').trim().split(' ');
  const senderFirst = nameParts2[0] ?? '';   // Prénom (stocké en premier dans le profil)
  const senderLast = nameParts2.slice(1).join(' ') || senderFirst;

  const computedSig = (() => {
    if (!sigType) return senderFirst || null;
    switch (sigType) {
      case 'none': return null;
      case 'prenom': return senderFirst || null;
      case 'lien': return familySubRelation ? possessiveLien(familySubRelation) : null;
      case 'lien_prenom': return familySubRelation && senderFirst ? `${possessiveLien(familySubRelation)} ${senderFirst}` : senderFirst || null;
      case 'nom_complet': return senderFirst && senderLast && senderLast !== senderFirst ? `${senderFirst} ${senderLast}` : senderFirst || null;
      case 'surnom': return sigCustom.trim() || null;
    }
  })();

  // Co-signature de groupe
  const { data: existingGroup } = useGroupMessage(savedMessageId ?? null);
  const { mutateAsync: createGroup, isPending: isCreatingGroup } = useCreateGroupMessage();
  const handleGroupShare = async () => {
    if (!savedMessageId) return;
    try {
      let token: string;
      if (existingGroup) {
        token = existingGroup.share_token;
      } else {
        const g = await createGroup({
          messageId:   savedMessageId,
          label:       'De la part de nous tous',
          contactName: contactName.split(' ').reverse().join(' ').trim() || contactName,
        });
        token = g.share_token;
      }
      const url = groupShareUrl(token);
      await Share.share({ message: `✍️ Co-signe le message pour ${contactName} !\n${url}` });
    } catch { /* silent */ }
  };

  const normalizeTemplateContent = (text: string) =>
    text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  // Mode manuel (contenu vide / espace) → mémorisé pour toute la session
  const isManualMode = useRef(generatedContent.trim() === '');
  const [isEditing, setIsEditing] = useState(isManualMode.current);
  const [localContent, setLocalContent] = useState(
    isManualMode.current ? '' : normalizeTemplateContent(generatedContent)
  );
  const isFirstRender = useRef(true);
  // Empêche le useEffect de généredContent de réinitialiser isEditing lors d'une traduction/poème/restore
  const isContentReplaceRef = useRef(false);
  // Ref pour appliquer le prefill une seule fois (immunise contre les re-runs de useFocusEffect)
  const appliedPrefillRef = useRef<string | null>(null);

  // Gestion du focus : prefill bibliothèque (prioritaire) OU mode manuel
  // Le prefill est intégré ici pour éviter toute course avec la useFocusEffect
  useFocusEffect(
    useCallback(() => {
      if (isNoEdit) { setIsEditing(false); return; }

      // Mode "À ma façon" — force toujours le mode édition actif dès l'arrivée
      if (isManualEntry && !appliedPrefillRef.current) {
        appliedPrefillRef.current = 'manual';
        isManualMode.current = true;
        setLocalContent('');
        setIsEditing(true);
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => editInputRef.current?.focus(), 300);
        });
        return;
      }

      // Template DB — arrive directement en zone de saisie avec contenu formaté
      if (fromTemplate === '1' && generatedContent.trim() && !appliedPrefillRef.current) {
        appliedPrefillRef.current = 'template';
        const normalized = resolveGender(normalizeTemplateContent(generatedContent), senderGender);
        isContentReplaceRef.current = true;
        setGeneratedContent(normalized);
        setLocalContent(normalized);
        isManualMode.current = false;
        setIsEditing(true);
        return;
      }

      // Pré-remplissage depuis les librairies (Mode Jeune, BFF, etc.) — une seule fois par message
      if (prefillMessage && prefillMessage.trim() && appliedPrefillRef.current !== prefillMessage) {
        appliedPrefillRef.current = prefillMessage;
        const formatted = resolveGender(
          normalizeTemplateContent(prefillMessage),
          senderGender
        );
        setGeneratedContent(formatted);
        setLocalContent(formatted);
        isManualMode.current = false;
        setIsEditing(false);
        return;
      }

      // Mode manuel : si pas de prefill et pas de contenu IA
      if (!appliedPrefillRef.current) {
        const isManual = generatedContent.trim() === '';
        isManualMode.current = isManual;
        if (isManual) {
          setIsEditing(true);
          setLocalContent('');
        }
      }
    }, [generatedContent, isNoEdit, prefillMessage, fromTemplate, isManualEntry])
  );

  // Reset TTS quand le store est réinitialisé (nouveau message) — savedMessageId revient à null
  useEffect(() => {
    if (savedMessageId === null && (tts.isReady || tts.isFailed || tts.isLoading)) {
      tts.reset();
      setTtsBgMusic('piano');
    }
  }, [savedMessageId]);

  // Auto-génération si lancé depuis l'accueil (quick-send)
  useEffect(() => {
    if (autoGen === '1') generate();
  }, []);

  // Focus clavier après la transition de navigation (évite le conflit animation/clavier)
  useEffect(() => {
    if (!isEditing) return;
    const interaction = InteractionManager.runAfterInteractions(() => {
      const t = setTimeout(() => editInputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    });
    return () => interaction.cancel();
  }, [isEditing]);

  // Sync quand le contenu change (après régénération) — skip le premier rendu
  // isContentReplaceRef évite de sortir du mode édition lors d'une traduction/poème/restore
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (isContentReplaceRef.current) {
      isContentReplaceRef.current = false;
      const isManual = generatedContent.trim() === '';
      isManualMode.current = isManual;
      if (!isManual) setLocalContent(normalizeTemplateContent(generatedContent));
      return;
    }
    const isManual = generatedContent.trim() === '';
    isManualMode.current = isManual;
    setLocalContent(isManual ? '' : normalizeTemplateContent(generatedContent));
    if (!isManual) setIsEditing(false);
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
  // contactName stocké "NOM Prénom" → extraire le prénom (parties non tout-en-majuscules)
  const nameParts = contactName.trim().split(/\s+/);
  const contactFirstName = (() => { const f = nameParts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w))); return f.join(' ') || nameParts[0] || contactName; })();
  const contactLastName  = nameParts.find((w) => w === w.toUpperCase() && /[A-Z]/.test(w)) ?? '';
  const contactFullName  = contactLastName ? `${contactFirstName} ${contactLastName}` : contactFirstName;

  const recipientLabel = (() => {
    switch (recipientType) {
      case 'prenom':     return contactFirstName;
      case 'prenom_nom': return contactFullName;
      case 'surnom':     return recipientCustom.trim() || contactFirstName;
      case 'aucun':      return null;
    }
  })();

  const title = recipientLabel ? `Pour ${recipientLabel}` : 'Votre message';
  const emoji = formatEmoji[format] ?? '💬';

  const senderFirstName = (petDirection === 'from' || petDirection === 'from_to_third') && petName
    ? petName
    : computedSig;

  const reactionLink = savedMessageId
    ? `\n\n💬 Réagis à ce message : https://confetticake.fr/reaction.html?id=${savedMessageId}`
    : '';

  // ── Envoi vers un seul destinataire (texte + phone + email prédéfinis) ────────
  const sendToOne = async (
    channelId: string,
    text: string,
    phone: string | null,
    email: string | null,
  ): Promise<boolean> => {
    try {
      if (channelId === 'whatsapp') {
        const url = `whatsapp://send?${phone ? `phone=${phone.replace(/\s+/g, '')}&` : ''}text=${encodeURIComponent(text)}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          const result = await Share.share({ message: text });
          if (result.action !== 'sharedAction') return false;
        }
      } else if (channelId === 'sms') {
        const smsNumber = phone ? phone.replace(/\s+/g, '') : '';
        try {
          await Linking.openURL(`sms:${smsNumber}?body=${encodeURIComponent(text)}`);
        } catch {
          const result = await Share.share({ message: text });
          if (result.action !== 'sharedAction') return false;
        }
      } else if (channelId === 'email') {
        const subject = encodeURIComponent(`🎉 ${title}`);
        const body = encodeURIComponent(text);
        try {
          await Linking.openURL(`mailto:${email ?? ''}?subject=${subject}&body=${body}`);
        } catch {
          const result = await Share.share({ message: text });
          if (result.action !== 'sharedAction') return false;
        }
      } else if (channelId === 'copy') {
        const result = await Share.share({ message: text });
        if (result.action !== 'sharedAction') return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const captureAndShare = async (): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const uri = await captureRef(shareWrapperRef, { format: 'png', quality: 1 });
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) return false;
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Envoyer le message' });
      return true;
    } catch {
      return false;
    }
  };

  const handleShare = async (channelId: string) => {
    // Si en mode écriture : sauvegarder le texte en cours ET l'utiliser directement
    const contentToSend = isEditing ? localContent.trim() : generatedContent;
    if (!contentToSend) return;
    if (isEditing) {
      setGeneratedContent(contentToSend);
      setIsEditing(false);
      if (savedMessageId) {
        try { await updateMessageContent(savedMessageId, contentToSend); } catch { /* non-bloquant */ }
      }
    }

    // Sauvegarder en DB si pas encore fait (template / manuel) → nécessaire pour le lien de réaction
    let effectiveMsgId = savedMessageId;
    if (!effectiveMsgId && profile?.id && contentToSend.trim()) {
      try {
        const saved = await saveMessage(profile.id, {
          contact_id:   contactId   ?? null,
          contact_name: contactName,
          format, tone,
          content: contentToSend,
          relation: relation ?? 'friend',
        });
        effectiveMsgId = saved.id;
        setSavedMessageId(saved.id);
      } catch { /* non-bloquant */ }
    }
    const effectiveReactionLink = effectiveMsgId
      ? `\n\n💬 Réagis à ce message : https://confetticake.fr/reaction.html?id=${effectiveMsgId}`
      : '';
    const resolvedOpening = openingFormula
      ? resolveOpening(openingFormula).replace('{prénom}', contactFirstName)
      : null;
    const openingLine = resolvedOpening ? `${resolvedOpening}\n` : '';
    const formuleLine = closingFormula ? `\n${closingFormula}` : '';
    const closing = senderFirstName ? `\n${senderFirstName}` : '';
    const bodyText = `${openingLine}${contentToSend}${formuleLine}${closing}${effectiveReactionLink}`;
    const fullText = `${emoji} ${title}\n\n${bodyText}`;
    const baseText = channelId === 'email' ? bodyText : fullText;
    const vocalUrl = (tts.isReady && savedMessageId)
      ? `https://confetticake.fr/vocal.html?id=${savedMessageId}&bg=${ttsBgMusic}`
      : null;
    const bgMusicUrl = null;
    const ttsLine = vocalUrl ? `\n🎙️ ${vocalUrl}` : '';
    const morseUrl = morseMode && contentToSend
      ? `https://jeandescourvieres.github.io/CONFETTIS-CAKE/card.html?morse=1&msg=${encodeURIComponent(contentToSend)}&name=${encodeURIComponent(contactFirstName)}&anim=stars`
      : null;
    const morseLine = morseUrl ? `\n📡 Mode décalé Morse 😄 : ${morseUrl}` : '';
    const text = (showSig ? baseText + buildSignatureText(i18n.language) : baseText) + (showLatePS ? '\n\n' + activePSText : '') + ttsLine + morseLine;

    setSending(true);
    try {
      // WhatsApp → toujours partager en image (pleine largeur dans le chat)
      // Autres canaux → image seulement si attachment visuel, sinon texte

      const hasVisualAttachment = (showFestiveImage && !!festiveSlug) || (showSenderPhoto && !!senderPhotoUri);
      if (channelId === 'whatsapp' || hasVisualAttachment) {
        const ok = await captureAndShare();
        if (!ok) { setSending(false); return; }
        // Après l'image WhatsApp → envoyer le lien de réaction en texte séparé
        if (channelId === 'whatsapp' && effectiveMsgId) {
          const linkText = `💬 Réagis à ce message : https://confetticake.fr/reaction.html?id=${effectiveMsgId}`;
          await sendToOne('whatsapp', linkText, contactPhone, contactEmail);
        }
      } else {
        const sent = await sendToOne(channelId, text, contactPhone, contactEmail);
        if (!sent) { setSending(false); return; }
      }

      // Sauvegarder le style visuel + photo + marquer comme envoyé (best-effort)
      if (savedMessageId) {
        try {
          await updateMessageStyle(savedMessageId, {
            bg_theme: bgTheme,
            font_style: fontStyle,
            font_size: fontSize,
            is_italic: isItalic,
          });
        } catch { /* non-bloquant */ }
        if (photoUri) {
          try {
            const uploadedUrl = await uploadPhoto(photoUri);
            if (uploadedUrl) await updateMessagePhoto(savedMessageId, uploadedUrl);
          } catch { /* non-bloquant */ }
        }
        try { await markMessageSent(savedMessageId, channelId); } catch { /* non-bloquant */ }
      }

      // ── Contacts supplémentaires ─────────────────────────────────────────────
      if (extraContacts.length > 0) {
        const total = extraContacts.length;
        for (let i = 0; i < extraContacts.length; i++) {
          const extra = extraContacts[i];
          setMultiSendProgress({ current: i + 1, total });

          // Reconstruire le titre pour ce contact
          const extraNameParts = extra.name.trim().split(' ');
          const extraDisplayName = extraNameParts.length > 1
            ? `${extraNameParts.slice(1).join(' ')} ${extraNameParts[0]}`
            : extraNameParts[0];
          const extraTitle = `Pour ${extraDisplayName}`;
          const extraBodyText = `${generatedContent}${formuleLine}${closing}`;
          const extraFullText = `${emoji} ${extraTitle}\n\n${extraBodyText}`;
          const extraBase = channelId === 'email' ? extraBodyText : extraFullText;
          const extraText = (showSig ? extraBase + buildSignatureText(i18n.language) : extraBase) + (showLatePS ? '\n\n' + activePSText : '');

          await sendToOne(channelId, extraText, extra.phone, extra.email);

          // Sauvegarder un enregistrement pour chaque contact supplémentaire
          if (profile?.id && generatedContent.trim()) {
            try {
              await saveMessage(profile.id, {
                contact_id: extra.id,
                contact_name: extra.name,
                format,
                tone,
                content: generatedContent,
                relation: extra.relation,
              });
            } catch { /* non-bloquant */ }
          }
        }
        setMultiSendProgress(null);
      }

      router.push('/(app)/create/sent' as never);
    } catch {
      setSending(false);
      setMultiSendProgress(null);
      Alert.alert('Erreur', 'Impossible d\'ouvrir ce canal. Essayez "Copier" pour copier le message manuellement.');
    }
  };

  const handleOpenAccordion = async (section: 'bg' | 'sig') => {
    const trimmed = localContent.trim();
    if (trimmed) {
      setGeneratedContent(trimmed);
      if (savedMessageId) {
        try { await updateMessageContent(savedMessageId, trimmed); } catch { /* silent */ }
      }
    }
    Keyboard.dismiss();
    setIsEditing(false);
    if (section === 'bg') setBgOpen(true);
    else if (section === 'sig') setSigOpen(true);
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

  const SW = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Vue de capture invisible — plein écran, carré, pour partage WhatsApp (toujours montée) */}
      <View
        ref={shareWrapperRef}
        collapsable={false}
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, width: SW, backgroundColor: '#f5f0ff', padding: 18, zIndex: -999, opacity: 0.01 }}
      >
          <View style={{ backgroundColor: 'white', borderRadius: 18, padding: 14 }}>
            {showFestiveImage && !!festiveSlug && (() => {
              const imageUrl = getFestiveImageUrl(occasion, festiveSlug);
              const captureFirstName = (petDirection === 'to' && petName) ? petName : contactFirstName;
              return (
                <View style={{ marginBottom: 8 }}>
                  <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 110, borderRadius: 10 }} resizeMode="cover" />
                  <Text style={{ textAlign: 'center', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 15, color: '#FDD34D', marginTop: 4, textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                    ✨ {captureFirstName} ✨
                  </Text>
                </View>
              );
            })()}
            {showSenderPhoto && !!senderPhotoUri && !showFestiveImage && (
              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Image source={{ uri: senderPhotoUri }} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#f5f0ff' }} resizeMode="cover" />
              </View>
            )}
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 15, textAlign: 'center', color: '#1a1a2e', marginBottom: 5 }}>
              {emoji} {title}
            </Text>
            {openingFormula && (
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#333', marginBottom: 12, lineHeight: 17 }}>
                {resolveOpening(openingFormula).replace('{prénom}', contactFirstName)}
              </Text>
            )}
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#333', lineHeight: 17 }}>
              {generatedContent}
            </Text>
            {closingFormula && (
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#555', marginTop: 4 }}>{closingFormula}</Text>
            )}
            {senderFirstName && (
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#555', textAlign: 'right', marginTop: 2, paddingRight: 8 }}>{senderFirstName}</Text>
            )}
          </View>
          <View style={{ alignItems: 'center', marginTop: 10, gap: 2 }}>
            <Text style={{ fontSize: 10, color: '#9b6bb5', fontFamily: 'BeVietnamPro_700Bold', letterSpacing: 0.8 }}>
              🎂 CONFETTIS & CAKE
            </Text>
            <Text style={{ fontSize: 9, color: '#b08ec0', fontFamily: 'BeVietnamPro_400Regular', letterSpacing: 0.3 }}>
              Des messages qui font chavirer les cœurs 💌
            </Text>
            <Text style={{ fontSize: 8, color: '#c4a8d4', fontFamily: 'BeVietnamPro_600SemiBold', letterSpacing: 0.2 }}>
              confetticake.fr
            </Text>
          </View>
        </View>

      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity
          onPress={() => {
            if (petDirection && petId && petName) {
              router.replace({
                pathname: '/(app)/animal-message',
                params: {
                  petId,
                  petName,
                  petType: petType ?? 'autre',
                  breed: petBreed ?? '',
                  petGender: petGender ?? '',
                  ownerName: petOwnerName ?? '',
                  ownerId: petOwnerId ?? '',
                  direction: petDirection,
                  ...(petThirdId   ? { thirdId:   petThirdId   } : {}),
                  ...(petThirdName ? { thirdName: petThirdName } : {}),
                  personalityTags: petPersonalityTags ?? '[]',
                },
              } as never);
            } else {
              router.back();
            }
          }}
          style={styles.backLink}
        >
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
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

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Album cover ───────────────────────────────── */}
        <LinearGradient
          colors={C.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.albumCover}
        >
          <Text style={styles.albumEmoji}>{emoji}</Text>
          <Text style={styles.albumTitle}>{title}</Text>
          <Text style={styles.albumBrand}>by ConfettiCake</Text>
          <Text style={styles.albumFormat}>
            {format === 'song' ? 'Chanson' : format === 'poem' ? 'Poème' : format === 'joke' ? 'Humour' : 'Message'}
          </Text>
        </LinearGradient>

        {/* ── Accroche animal ──────────────────────────── */}
        {!!petDirection && !!petName && (() => {
          const article   = petGender === 'female' ? 'la' : 'le';
          const descriptor = petBreed || petType || 'animal';
          const ownerParts = (petOwnerName ?? '').trim().split(/\s+/);
          const ownerUpper = ownerParts.filter(p => p.length > 1 && p === p.toUpperCase());
          const ownerMixed = ownerParts.filter(p => p.length <= 1 || p !== p.toUpperCase());
          const ownerDisplay = ownerMixed.length && ownerUpper.length ? [...ownerMixed, ...ownerUpper].join(' ') : (petOwnerName ?? '');
          const identite  = `${petName}, ${article} ${descriptor} de ${ownerDisplay}`;
          let text = '';
          if (petDirection === 'to')
            text = `📬 Ce message est à l'attention de ${identite} 🐾`;
          else if (petDirection === 'from')
            text = `📬 Tu as reçu un message de la part de ${petName} 🐾`;
          else if (petDirection === 'from_to_third')
            text = `📬 Tu as reçu un message de la part de ${identite} 🐾`;
          return (
            <View style={{ backgroundColor: '#FFF7ED', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 13, color: '#92400E', textAlign: 'center', lineHeight: 20 }}>
                {text}
              </Text>
            </View>
          );
        })()}

        {/* ── Lecteur audio (chanson uniquement) ───────── */}
        {format === 'song' && (
          music.isReady && music.audioUrl
            ? <AudioPreviewPlayer messageId={savedMessageId} />
            : <View style={styles.musicStatus}>
                <Text style={styles.musicStatusText}>
                  {music.isLoading || music.isQueued
                    ? '🎵 Génération de ta chanson en cours...'
                    : music.isFailed
                    ? '⚠️ Génération échouée — '
                    : '🎵 Préparation de ta chanson...'}
                </Text>
                {music.isFailed && (
                  <TouchableOpacity onPress={music.trigger}>
                    <Text style={styles.musicRetryText}>Réessayer</Text>
                  </TouchableOpacity>
                )}
              </View>
        )}

        {/* ── Intro "À ma façon" ───────────────────────── */}
        {isManualEntry && (
          <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 18, gap: 12, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>✏️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, lineHeight: 24 }}>
                  Tu écris toi-même
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2 }}>
                  100 % à ta façon, 100 % toi
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '60' }} />

            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 21 }}>
              {'Parfois, les mots les plus touchants sont ceux qu\'on trouve soi-même. Ici, pas d\'IA, pas de modèle — juste toi, ton style, et ce que tu as envie de dire vraiment. 💛'}
            </Text>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '60' }} />

            <View style={{ gap: 8 }}>
              {[
                { emoji: '💬', text: 'Tape ton message dans la zone de texte ci-dessous' },
                { emoji: '✨', text: 'Le bouton « Améliorer » peut te donner un coup de pouce si besoin' },
                { emoji: '💡', text: 'Pas d\'inspiration ? Utilise le bouton « Voir les modèles » ci-dessous' },
              ].map((item) => (
                <View key={item.emoji} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <Text style={{ fontSize: 16, marginTop: 1 }}>{item.emoji}</Text>
                  <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 }}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Aperçu complet du message reçu ───────────── */}
        <View style={styles.previewEnvelope}>
          <Text style={styles.previewEnvelopeLabel}>📩 Ce que ton contact va recevoir</Text>
          <Text style={styles.previewEnvelopeSub}>{'Cet écran reflète en temps réel le message final — avec ta formule d\'ouverture, ton texte, ta signature et tous les ajouts que tu as activés ci-dessous. Ce que tu vois ici, c\'est exactement ce que ton proche recevra 👇'}</Text>

          {/* ── Style d'écriture ────────────────────────── */}
          {!isNoEdit && (
            <View style={styles.writingSection}>
              {/* Image festive */}
              {hasFestiveImages(occasion) && !isManualEntry && (
                <View style={{ marginTop: 10, borderRadius: Radii.xl, backgroundColor: '#FFF7ED', padding: 14, gap: 10, borderWidth: 1, borderColor: '#FED7AA' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: '#D97706' }}>🎊 Image festive dans le message</Text>
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 3, lineHeight: 18 }}>
                        Ajoute une image avec le prénom de {contactName.split(' ').find((p: string) => p !== p.toUpperCase()) ?? contactName.split(' ')[0]}
                      </Text>
                    </View>
                    <Switch
                      value={showFestiveImage}
                      onValueChange={(v) => {
                        setShowFestiveImage(v);
                        if (v && !festiveSlug) setFestiveSlug(FESTIVE_IMAGES[occasion]?.[0]?.slug ?? null);
                      }}
                      trackColor={{ false: Colors.outlineVariant, true: '#D97706' }}
                      thumbColor="#fff"
                    />
                  </View>
                  {showFestiveImage && FESTIVE_IMAGES[occasion] && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {FESTIVE_IMAGES[occasion].map((img) => (
                        <TouchableOpacity
                          key={img.slug}
                          onPress={() => setFestiveSlug(img.slug)}
                          activeOpacity={0.8}
                          style={{ borderRadius: Radii.lg, borderWidth: 2, borderColor: festiveSlug === img.slug ? '#D97706' : Colors.outlineVariant, overflow: 'hidden', width: 64, height: 64 }}
                        >
                          <Image source={{ uri: getFestiveImageUrl(occasion, img.slug) }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}

              {/* Photo expéditeur */}
              <View style={{ marginTop: 10, borderRadius: Radii.xl, backgroundColor: C.primaryContainer + '60', padding: 14, gap: 10, borderWidth: 1, borderColor: C.primary + '30' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: C.primary }}>📷 Ma photo dans le message</Text>
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurface, marginTop: 3, lineHeight: 18 }}>
                      Ajoute la photo de ton visage (ou une autre photo) en haut du message pour le personnaliser
                    </Text>
                  </View>
                  <Switch
                    value={showSenderPhoto && !!senderPhotoUri}
                    onValueChange={(v) => {
                      if (v && !senderPhotoUri) { handlePickSenderPhoto(() => setShowSenderPhoto(false)); }
                      else setShowSenderPhoto(v);
                    }}
                    trackColor={{ false: Colors.outlineVariant, true: C.primary }}
                    thumbColor="#fff"
                  />
                </View>
                {showSenderPhoto && !!senderPhotoUri && (
                  <View style={{ gap: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {(['round', 'square'] as const).map((s) => (
                        <TouchableOpacity
                          key={s}
                          onPress={() => setPhotoShape(s)}
                          activeOpacity={0.8}
                          style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: Radii.lg, borderWidth: 1.5, borderColor: photoShape === s ? C.primary : Colors.outlineVariant, backgroundColor: photoShape === s ? C.primaryContainer : Colors.white }}
                        >
                          <Text style={{ fontSize: 16 }}>{s === 'round' ? '⬤' : '■'}</Text>
                          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: photoShape === s ? C.primary : Colors.onSurfaceVariant, marginTop: 2 }}>
                            {s === 'round' ? 'Rond' : 'Carré'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Image source={{ uri: senderPhotoUri }} style={{ width: 52, height: 52, borderRadius: photoShape === 'round' ? 26 : 10, borderWidth: 3, borderColor: C.primary }} />
                      <TouchableOpacity
                        onPress={handlePickSenderPhoto}
                        activeOpacity={0.7}
                        style={{ backgroundColor: C.primary, borderRadius: Radii.full, paddingVertical: 7, paddingHorizontal: 14 }}
                      >
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#fff' }}>Changer la photo</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Style d'écriture */}
              <View style={styles.writingSectionHeader}>
                <Text style={styles.writingSectionTitle}>✍️ Style d'écriture</Text>
                <TouchableOpacity onPress={() => setWritingHelpVisible(true)} style={styles.writingHelpBtn}>
                  <Text style={styles.writingHelpBtnText}>ℹ️</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17, marginBottom: 8 }}>
                {'Choisis la police qui correspond à ton message — classique, manuscrite ou originale. Le changement s\'applique immédiatement.'}
              </Text>
              {/* Bouton ouvrir le picker de police */}
              <TouchableOpacity
                onPress={() => setFontPickerVisible(true)}
                activeOpacity={0.8}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.outlineVariant }}
              >
                <Text style={{ fontFamily: getFontFamily(fontStyle), fontSize: 14, color: Colors.onSurface }}>
                  {FONT_STYLES.find(s => s.value === fontStyle)?.label ?? 'Standard'}
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: C.primary }}>Changer ▸</Text>
              </TouchableOpacity>

              {/* Taille */}
              <View style={styles.fontSizeRow}>
                <Text style={styles.fontSizeLabel}>Taille :</Text>
                {FONT_SIZES.map((sz) => (
                  <TouchableOpacity
                    key={sz.key}
                    style={[styles.fontSizeBtn, fontSize === sz.key && styles.fontSizeBtnActive]}
                    onPress={() => setFontSize(sz.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.fontSizeBtnText, fontSize === sz.key && styles.fontSizeBtnTextActive]}>{sz.label}</Text>
                  </TouchableOpacity>
                ))}
                {/* Italique */}
                <TouchableOpacity
                  style={[styles.fontSizeBtn, isItalic && styles.fontSizeBtnActive, { marginLeft: 8 }]}
                  onPress={() => setIsItalic(!isItalic)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.fontSizeBtnText, { fontStyle: 'italic' }, isItalic && styles.fontSizeBtnTextActive]}>I</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}

          {isEditing && !isNoEdit ? (
            <View style={styles.editCard}>
              {/* ── Bouton micro ─────────────────────── */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, backgroundColor: Colors.surfaceContainerLow }}
                  onPress={() => {
                    editInputRef.current?.focus();
                    setShowMicHint(true);
                    setTimeout(() => setShowMicHint(false), 3000);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14 }}>🎤</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: 11, color: Colors.onSurfaceVariant }}>Dicter</Text>
                </TouchableOpacity>
              </View>
              {showMicHint && (
                <View style={{ backgroundColor: '#1A1A2E', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 6, alignSelf: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'BeVietnamPro_400Regular' }}>
                    Appuie sur le 🎤 de ton clavier pour dicter
                  </Text>
                </View>
              )}
              {/* ── Formule d'ouverture ─────────────────── */}
              {openingFormula && (
                <Text style={{ fontFamily: getFontFamily(fontStyle), fontSize: 14, color: Colors.onSurfaceVariant, fontStyle: 'italic', paddingHorizontal: 4, marginBottom: 2 }}>
                  {resolveOpening(openingFormula).replace('{prénom}', contactFirstName)}
                </Text>
              )}

              {/* ── Zone de texte ───────────────────── */}
              <TextInput
                ref={editInputRef}
                style={[styles.editInput, { fontFamily: getFontFamily(fontStyle) }]}
                value={localContent}
                onChangeText={(v) => {
                  setLocalContent(v);
                  assist.dismissImproved();
                }}
                multiline
                textAlignVertical="top"
                placeholder="Écris ton message… ou inspire-toi 💡"
                placeholderTextColor={Colors.outlineVariant}
              />

              {/* ── Formule de clôture + signature ──────── */}
              {(closingFormula || senderFirstName) && (
                <View style={{ paddingHorizontal: 4, marginTop: 2, gap: 2 }}>
                  {closingFormula && (
                    <Text style={{ fontFamily: getFontFamily(fontStyle), fontSize: 14, color: Colors.onSurfaceVariant, fontStyle: 'italic' }}>
                      {closingFormula}
                    </Text>
                  )}
                  {senderFirstName && (
                    <Text style={{ fontFamily: getFontFamily(fontStyle), fontSize: 14, color: Colors.onSurfaceVariant, fontStyle: 'italic', textAlign: 'right' }}>
                      {senderFirstName}
                    </Text>
                  )}
                </View>
              )}



              {/* ── Suggestion de complétion (hors mode modèle) ── */}
              {!isFromTemplate && !isManualEntry && assist.completion && !assist.improved && (
                <View style={styles.completionCard}>
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                    💡 Suggestion — → pour accepter, ✕ pour ignorer
                  </Text>
                  <Text style={styles.completionText}>
                    <Text style={styles.completionDots}>…</Text>
                    {assist.completion}
                  </Text>
                  <View style={styles.completionActions}>
                    <TouchableOpacity
                      style={styles.completionAcceptBtn}
                      onPress={() => {
                        const joined = localContent.trimEnd() + ' ' + assist.completion;
                        setLocalContent(joined);
                        assist.dismissCompletion();
                      }}
                    >
                      <Text style={styles.completionAcceptText}>→ Compléter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={assist.dismissCompletion} style={styles.completionDismissBtn}>
                      <Text style={styles.completionDismissText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ── Résultat "Améliorer" ─────────────────────── */}
              {assist.improved && (
                <View style={styles.improvedCard}>
                  <Text style={styles.improvedLabel}>✨ Version améliorée</Text>
                  <Text style={styles.improvedText}>{assist.improved}</Text>
                  <View style={styles.completionActions}>
                    <TouchableOpacity
                      style={styles.completionAcceptBtn}
                      onPress={() => {
                        setLocalContent(assist.improved!);
                        assist.dismissImproved();
                      }}
                    >
                      <Text style={styles.completionAcceptText}>→ Utiliser cette version</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={assist.dismissImproved} style={styles.completionDismissBtn}>
                      <Text style={styles.completionDismissText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ── Barre d'actions IA ───────────────────────── */}
              <View style={styles.assistBar}>
                <TouchableOpacity
                  style={[styles.assistBtn, assist.activeAction === 'improve' && styles.assistBtnActive]}
                  onPress={() => {
                    if (localContent.trim().length < 5) return;
                    assist.improve({ text: localContent, contact_name: contactName, relation, occasion });
                  }}
                  activeOpacity={0.8}
                  disabled={assist.isLoading || localContent.trim().length < 5}
                >
                  <Text style={[styles.assistBtnText, assist.activeAction === 'improve' && { color: C.primary }]}>
                    {assist.activeAction === 'improve' ? '⏳ …' : '✨ Améliorer'}
                  </Text>
                </TouchableOpacity>
                {isFromTemplate ? (
                  <TouchableOpacity
                    style={styles.assistBtn}
                    onPress={async () => {
                      const { savedMessageId: mid } = useCreateStore.getState();
                      if (mid) { try { await deleteMessage(mid); } catch { /* silent */ } }
                      useCreateStore.getState().setJumpToTemplates(true);
                      router.navigate('/(app)/create' as never);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.assistBtnText}>🔄 Autre modèle</Text>
                  </TouchableOpacity>
                ) : !isManualEntry ? (
                  <TouchableOpacity
                    style={[styles.assistBtn, ideasStep !== 'closed' && styles.assistBtnActive]}
                    onPress={openIdeasOccasion}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.assistBtnText, ideasStep !== 'closed' && { color: C.primary }]}>
                      {ideasStep !== 'closed' ? '✕ Fermer' : '💡 Idées'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* ── Suggestion modèles (mode manuel uniquement) ── */}
              {isManualEntry && (
                <View style={{ marginTop: 10, backgroundColor: C.primaryContainer, borderRadius: 12, padding: 14, alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 20, textAlign: 'center' }}>
                    {'📚 Pas d\'inspiration ? Tu peux repartir d\'un modèle.'}
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      const { savedMessageId: mid } = useCreateStore.getState();
                      if (mid) { try { await deleteMessage(mid); } catch { /* silent */ } }
                      useCreateStore.getState().setJumpToTemplates(true);
                      router.navigate('/(app)/create' as never);
                    }}
                    activeOpacity={0.8}
                    style={{ backgroundColor: C.primary, borderRadius: 99, paddingHorizontal: 20, paddingVertical: 8 }}
                  >
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' }}>Voir les modèles</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Panneau Idées : sélection occasion ──────── */}
              {ideasStep === 'occasion' && (
                <View style={styles.ideasPanel}>
                  {/* Intro + accès bibliothèque complète */}
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#6B7280', lineHeight: 17, marginBottom: 6 }}>
                    {'Besoin d\'inspiration ? Deux options :'}
                  </Text>
                  <View style={{ backgroundColor: '#F5F3FF', borderRadius: 12, padding: 10, gap: 6, marginBottom: 2 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, color: '#5B21B6' }}>
                      📚 La bibliothèque complète
                    </Text>
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#6D28D9', lineHeight: 16 }}>
                      {'Des milliers de messages écrits par de vraies personnes — classés par style : BFF, Mode Jeune, Langue de bois, Ado qui écrit à ses parents, Sans filtre… Tu copies celui qui te ressemble et tu l\'adaptes.'}
                    </Text>
                    <TouchableOpacity
                      style={styles.ideasLibraryBtn}
                      onPress={() => {
                        setIdeasStep('closed');
                        useCreateStore.getState().setJumpToTemplates(true);
                        router.navigate('/(app)/create' as never);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ideasLibraryBtnText}>📚 Toute la bibliothèque</Text>
                        <Text style={styles.ideasLibraryBtnSub}>BFF, Mode Jeune, Sans filtre, Ado→Parent…</Text>
                      </View>
                      <Text style={{ fontSize: 18, color: '#7C3AED' }}>›</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.ideasOccasionDivider}>
                    <View style={styles.ideasDividerLine} />
                    <Text style={styles.ideasDividerText}>ou</Text>
                    <View style={styles.ideasDividerLine} />
                  </View>

                  <View style={{ backgroundColor: '#F0F9FF', borderRadius: 12, padding: 10, gap: 4, marginBottom: 6 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, color: '#0369A1' }}>
                      ⚡ Un modèle rapide par occasion
                    </Text>
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#0284C7', lineHeight: 16 }}>
                      {'Choisis une occasion ci-dessous pour voir quelques messages clés-en-main à insérer directement.'}
                    </Text>
                  </View>

                  <Text style={styles.ideasPanelTitle}>Pour quelle occasion ?</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
                    {IDEAS_OCCASIONS.map((o) => (
                      <TouchableOpacity
                        key={o.value}
                        style={styles.ideasOccasionBtn}
                        onPress={() => selectIdeasOccasion(o.value)}
                        activeOpacity={0.75}
                      >
                        <Text style={{ fontSize: 15 }}>{o.emoji}</Text>
                        <Text style={styles.ideasOccasionLabel}>{o.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Info "Choisir un modèle" */}
                  <View style={{ marginTop: 12, backgroundColor: '#F0FDF4', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#86EFAC', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16 }}>💡</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#166534', lineHeight: 16 }}>
                        {'Tu veux repartir d\'un message tout fait ? Utilise '}
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>Choisir un modèle</Text>
                        {' depuis la page de création pour accéder aux modèles classiques par occasion.'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{ marginTop: 6, borderWidth: 1.5, borderColor: '#22C55E', borderRadius: 12, paddingVertical: 9, alignItems: 'center' }}
                    activeOpacity={0.8}
                    onPress={() => {
                      setIdeasStep('closed');
                      useCreateStore.getState().setJumpToTemplates(true);
                      router.navigate('/(app)/create' as never);
                    }}
                  >
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#16A34A' }}>
                      📋 Choisir un modèle →
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Panneau Idées : liste des modèles ───────── */}
              {ideasStep === 'templates' && (
                <View style={styles.ideasPanel}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => setIdeasStep('occasion')} activeOpacity={0.7}>
                      <Text style={{ fontSize: 22, color: C.primary, lineHeight: 28 }}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.ideasPanelTitle}>
                      {IDEAS_OCCASIONS.find((o) => o.value === ideasOccasion)?.emoji}{' '}
                      {IDEAS_OCCASIONS.find((o) => o.value === ideasOccasion)?.label}
                    </Text>
                  </View>
                  {/* Filtre Tu / Vous */}
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
                    {(['tu', 'vous'] as const).map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.ideasFilterBtn, ideasTon === t && styles.ideasFilterBtnActive]}
                        onPress={() => changeIdeasFilter(t, ideasLongueur)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.ideasFilterText, ideasTon === t && styles.ideasFilterTextActive]}>
                          {t === 'tu' ? 'Tutoiement' : 'Vouvoiement'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Filtre Court / Moyen / Long */}
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
                    {([
                      { key: 'court', label: 'Court' },
                      { key: 'moyen', label: 'Moyen' },
                      { key: 'long',  label: 'Long'  },
                    ] as const).map(({ key, label }) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.ideasFilterBtn, ideasLongueur === key && styles.ideasFilterBtnActive]}
                        onPress={() => changeIdeasFilter(ideasTon, key)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.ideasFilterText, ideasLongueur === key && styles.ideasFilterTextActive]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {ideasLoading ? (
                    <ActivityIndicator color={C.primary} style={{ marginVertical: 16 }} />
                  ) : ideasTemplates.length === 0 ? (
                    <Text style={styles.templateEmpty}>Aucun modèle disponible.</Text>
                  ) : (
                    ideasTemplates.map((tpl) => {
                      const _parts = contactName.trim().split(/\s+/);
                      const firstName = (() => { const f = _parts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w))); return f.join(' ') || _parts[0] || '[Prénom]'; })();
                      const filled = resolveGenderTokens(tpl.content, senderGender, contactGender)
                        .replace(/\{prenom\}/gi, firstName)
                        .replace(/\[Prénom\]/gi, firstName)
                        .replace(/\{annee\}/gi, new Date().getFullYear().toString());
                      return (
                        <View key={tpl.id} style={styles.ideasTemplateRow}>
                          <Text style={styles.ideasTemplatePreview} numberOfLines={ideasLongueur === 'court' ? 2 : 4}>
                            {filled}
                          </Text>
                          <View style={styles.ideasTemplateFooter}>
                            <TouchableOpacity
                              onPress={() => setIdeasFullPreview({ display: filled, raw: tpl.content })}
                              activeOpacity={0.75}
                            >
                              <Text style={styles.ideasTemplateSeeMore}>👁️ Voir en entier</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => applyIdeasTemplate(tpl.content)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.ideasTemplateCta}>✉️ Utiliser ce modèle</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              )}

              {/* ── Teaser aperçu ────────────────────────────── */}
              <View style={styles.previewTeaserRow}>
                <TouchableOpacity
                  style={styles.previewTeaserChip}
                  onPress={() => handleOpenAccordion('sig')}
                  activeOpacity={0.75}
                >
                  <Text style={styles.previewTeaserText}>✍️ Signature</Text>
                </TouchableOpacity>
              </View>

              {/* ── Traduire (fixe, toujours visible) ───────── */}
              <View style={styles.translateWrap}>
                {isTranslating ? (
                  <View style={styles.translateLoadingRow}>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={styles.translateLoadingText}>Traduction en cours…</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.translateBtnRow}>
                      <TouchableOpacity
                        style={styles.translateBtn}
                        onPress={() => setShowTranslatePicker((v) => !v)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.translateBtnText}>🌍 Traduire ce message</Text>
                      </TouchableOpacity>
                      {originalContentRef.current && (
                        <TouchableOpacity
                          style={styles.translateRestoreBtn}
                          onPress={handleRestoreOriginal}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.translateRestoreText}>↩ Texte original</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {showTranslatePicker && (
                      <View style={styles.translatePicker}>
                        <View style={styles.translateHint}>
                          <Text style={styles.translateHintEmoji}>🌍</Text>
                          <Text style={styles.translateHintText}>
                            {"Envoyer un message dans la langue de ton proche, c'est une petite attention qui fait souvent toute la différence 💛 L'IA le traduit directement dans la langue choisie."}
                          </Text>
                        </View>
                        <View style={styles.translateLangRow}>
                          {TRANSLATE_LANGS.map((l) => (
                            <TouchableOpacity
                              key={l.code}
                              style={styles.translateLangBtn}
                              onPress={() => handleTranslate(l.code)}
                              activeOpacity={0.75}
                            >
                              <Text style={styles.translateLangFlag}>{l.flag}</Text>
                              <Text style={styles.translateLangLabel}>{l.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>

              {/* ── Effacer et réécrire (mode manuel uniquement) ── */}
              {isManualMode.current && (
                <TouchableOpacity
                  style={[styles.regenFullBtn, isPending && { opacity: 0.5 }]}
                  onPress={handleRegenerate}
                  disabled={isPending}
                >
                  <Text style={styles.regenFullBtnText}>🗑 Effacer et réécrire</Text>
                </TouchableOpacity>
              )}

            </View>
          ) : format === 'song' || format === 'poem'
            ? <LyricsCard content={generatedContent} fontStyle={fontStyle as FontStyle} fontSize={fontSize} isItalic={isItalic} />
            : (() => {
                const mFont = getFontFamily(fontStyle);
                const fSizeObj = FONT_SIZES.find((s) => s.key === fontSize) ?? FONT_SIZES[1];
                return (
                  <View ref={messageCardRef} collapsable={false} style={[styles.messageCard, isManuscript && styles.messageCardManuscript]}>
                    {!!petImageUrl && (
                      <Image
                        source={{ uri: petImageUrl }}
                        style={{ width: '100%', aspectRatio: 1, borderRadius: Radii.lg, marginBottom: Spacing[3] }}
                        resizeMode="contain"
                      />
                    )}
                    {showFestiveImage && !!festiveSlug && (() => {
                      const imageUrl = getFestiveImageUrl(occasion, festiveSlug);
                      // Quand on écrit À l'animal (direction 'to'), le destinataire c'est l'animal
                      const firstName = (petDirection === 'to' && petName)
                        ? petName
                        : (contactName.split(' ').find((p: string) => p !== p.toUpperCase()) ?? contactName.split(' ')[0] ?? contactName);
                      return (
                        <View style={{ width: '100%', marginBottom: Spacing[3], alignItems: 'center', gap: 10 }}>
                          <Image
                            source={{ uri: imageUrl }}
                            style={{ width: '100%', aspectRatio: 4/3, borderRadius: Radii.lg }}
                            resizeMode="cover"
                          />
                          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 26, color: '#FDD34D', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                            ✨ {firstName} ✨
                          </Text>
                        </View>
                      );
                    })()}
                    {showSenderPhoto && !!senderPhotoUri && (
                      <View style={{ alignItems: 'center', marginBottom: 12 }}>
                        <Image
                          source={{ uri: senderPhotoUri }}
                          style={photoShape === 'square'
                            ? { width: '100%', aspectRatio: 1, borderRadius: 14, borderWidth: 3, borderColor: '#fff' }
                            : { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#fff' }
                          }
                          resizeMode="cover"
                        />
                      </View>
                    )}
                    <Text style={[styles.messageHeader, { fontFamily: mFont }]}>{emoji} {title}</Text>
                    <Text style={[styles.messageBrand, { fontFamily: mFont, fontSize: 14, letterSpacing: 0.5 }]}>by ConfettiCake</Text>
                    {openingFormula && (
                      <Text style={[styles.messageText, { fontFamily: mFont, fontSize: fSizeObj.size, lineHeight: fSizeObj.lineHeight, fontStyle: isItalic ? 'italic' : 'normal', marginBottom: 16 }]}>
                        {resolveOpening(openingFormula).replace('{prénom}', contactFirstName)}
                      </Text>
                    )}
                    {generatedContent.split(/\n{2,}/).map((para, i, arr) => (
                      <Text key={i} style={[styles.messageText, { fontFamily: mFont, fontSize: fSizeObj.size, lineHeight: fSizeObj.lineHeight, fontStyle: isItalic ? 'italic' : 'normal', marginBottom: i < arr.length - 1 ? 8 : 0 }]}>
                        {para}
                      </Text>
                    ))}
                    {closingFormula && (
                      <Text style={[styles.messageSender, { fontFamily: mFont, fontSize: fSizeObj.size, lineHeight: fSizeObj.lineHeight, textAlign: 'left', fontStyle: isItalic ? 'italic' : 'normal', marginTop: 8 }]}>{closingFormula}</Text>
                    )}
                    {senderFirstName && (
                      <Text style={[styles.messageSender, { fontFamily: mFont, fontSize: fSizeObj.size, lineHeight: fSizeObj.lineHeight, textAlign: 'right', fontStyle: isItalic ? 'italic' : 'normal' }]}>{senderFirstName}</Text>
                    )}
                    {showLatePS && (
                      <>
                        <View style={{ height: 1, backgroundColor: '#FCD34D', marginTop: 14, marginBottom: 10 }} />
                        <Text style={{ fontFamily: mFont, fontSize: fSizeObj.size - 3, color: '#78350F', fontStyle: isItalic ? 'italic' : 'normal', lineHeight: fSizeObj.lineHeight - 4 }}>
                          {activePSText}
                        </Text>
                      </>
                    )}
                  </View>
                );
              })()
            }


          {/* ── Modifier + Changer de modèle (mode aperçu) ──────────────── */}
          {!isEditing && !isNoEdit && (
            isFromTemplate ? (
              <View style={styles.templateActionRow}>
                <TouchableOpacity style={[styles.templateActionBtn, styles.templateActionBtnEdit]} onPress={() => setIsEditing(true)} activeOpacity={0.8}>
                  <Text style={styles.templateActionBtnEditText}>✏️ Modifier ce texte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.templateActionBtn, styles.templateActionBtnChange]}
                  onPress={async () => {
                    const { savedMessageId: mid } = useCreateStore.getState();
                    if (mid) { try { await deleteMessage(mid); } catch { /* silent */ } }
                    useCreateStore.getState().setJumpToTemplates(true);
                    router.back();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.templateActionBtnChangeText}>🔄 Autre modèle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editPromptBtn} onPress={() => setIsEditing(true)}>
                <Text style={styles.editPromptText}>✏️ Modifier moi-même le texte</Text>
              </TouchableOpacity>
            )
          )}

          {!isManualMode.current && !isEditing && (
            <TouchableOpacity
              style={[styles.regenFullBtn, { marginTop: Spacing[3] }, isPending && { opacity: 0.5 }]}
              onPress={handleRegenerate}
              disabled={isPending}
            >
              <Text style={styles.regenFullBtnText}>
                {isPending ? '⏳ Génération...' : '↺ Nouvelle version avec l\'IA'}
              </Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity
              style={[styles.regenFullBtn, { marginTop: Spacing[3], borderColor: '#F59E0B', paddingHorizontal: Spacing[5] }]}
              onPress={() => router.push({ pathname: '/(app)/cards', params: { contactId, contactName, occasion } } as never)}
              activeOpacity={0.85}
            >
              <Text style={[styles.regenFullBtnText, { color: '#F59E0B' }]}>🎴 Accompagner d'une carte animée</Text>
            </TouchableOpacity>
          )}

          {generatedContent.trim().length > 0 && !isEditing && (
            <View style={styles.translateWrap}>
              {isTranslating ? (
                <View style={styles.translateLoadingRow}>
                  <ActivityIndicator size="small" color="#7C3AED" />
                  <Text style={styles.translateLoadingText}>Traduction en cours…</Text>
                </View>
              ) : isRewritingPoem ? (
                <View style={styles.translateLoadingRow}>
                  <ActivityIndicator size="small" color="#7C3AED" />
                  <Text style={styles.translateLoadingText}>Réécriture en poème…</Text>
                </View>
              ) : (
                <>
                  <View style={styles.translateBtnRow}>
                    <TouchableOpacity
                      style={styles.translateBtn}
                      onPress={() => setShowTranslatePicker((v) => !v)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.translateBtnText}>🌍 Traduire ce message</Text>
                    </TouchableOpacity>
                    {originalContentRef.current && (
                      <TouchableOpacity
                        style={styles.translateRestoreBtn}
                        onPress={handleRestoreOriginal}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.translateRestoreText}>↩ Texte original</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {showTranslatePicker && (
                    <View style={styles.translatePicker}>
                      {TRANSLATE_LANGS.map((l) => (
                        <TouchableOpacity
                          key={l.code}
                          style={styles.translateLangBtn}
                          onPress={() => handleTranslate(l.code)}
                          activeOpacity={0.75}
                        >
                          <Text style={styles.translateLangFlag}>{l.flag}</Text>
                          <Text style={styles.translateLangLabel}>{l.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <View style={styles.poemIntroWrap}>
                    <Text style={styles.poemIntroText}>
                      ✨ Envie d'une touche poétique ? L'IA réécrit, tant que possible, ton message en poème rimé.
                    </Text>
                    <TouchableOpacity
                      style={styles.poemBtn}
                      onPress={handleRewriteAsPoem}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.poemBtnText}>🎭 Transformer en poème</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}

        </View>

        {/* ── Badge no-fautes ──────────────────────────── */}
        {!isEditing && generatedContent.trim().length > 0 && (
          <View style={styles.noFautesBadge}>
            <Text style={styles.noFautesBadgeText}>
              {'Fini les '}
              <Text style={styles.noFautesBadgeStrike}>fôtes</Text>
              {'  '}
              <Text style={styles.noFautesBadgeCorrect}>fautes ✓</Text>
              {'  — l\'IA soigne chaque mot 🪄'}
            </Text>
          </View>
        )}

        {/* ── Destinataire ─────────────────────────────── */}
        {!isEditing && (
          <View style={styles.recipientSection}>
            <TouchableOpacity
              style={styles.recipientSectionHeader}
              onPress={() => setRecipientOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={[styles.accordionLeft, { gap: 4 }]}>
                <Text style={styles.recipientSectionTitle}>🎯 Adresser à</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17 }}>
                  {'Le prénom qui s\'affichera en tête du message reçu par ton contact.'}
                </Text>
                {!recipientOpen && (
                  <Text style={styles.accordionBadge}>
                    {recipientType === 'aucun' ? '🚫 Non affiché' : `Adressé à : ${recipientLabel ?? '—'}`}
                  </Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{recipientOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>

            {recipientOpen && (
              <>
                <View style={[styles.recipientIntroCard, { borderLeftColor: C.primary }]}>
                  <Text style={styles.recipientIntroText}>
                    {"Choisis comment le nom du destinataire apparaîtra en haut de ta carte — prénom seul, prénom + nom, ou une appellation affectueuse à toi 💛"}
                  </Text>
                </View>

                <View style={styles.recipientChipsRow}>
                  {([
                    { type: 'prenom'     as RecipientType, label: `Prénom — ${contactFirstName}`      },
                    { type: 'prenom_nom' as RecipientType, label: `Complet — ${contactFullName}`      },
                    { type: 'surnom'     as RecipientType, label: '✏️ Appellation libre'              },
                    { type: 'aucun'      as RecipientType, label: '🚫 Ne pas afficher'               },
                  ]).map((opt) => (
                    <TouchableOpacity
                      key={opt.type}
                      style={[styles.recipientChip, recipientType === opt.type && styles.recipientChipActive]}
                      onPress={() => setRecipientType(opt.type)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.recipientChipLabel, recipientType === opt.type && styles.recipientChipLabelActive]} numberOfLines={1}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {recipientType === 'surnom' && (
                  <TextInput
                    style={styles.recipientInput}
                    value={recipientCustom}
                    onChangeText={setRecipientCustom}
                    placeholder="Ex: Ma chérie, Mon pote, Tonton Michel..."
                    placeholderTextColor={Colors.outlineVariant}
                    autoCapitalize="sentences"
                    returnKeyType="done"
                  />
                )}

                {recipientType !== 'aucun' && recipientLabel && (
                  <View style={styles.recipientPreview}>
                    <Text style={styles.recipientPreviewLabel}>Aperçu :</Text>
                    <Text style={[styles.recipientPreviewValue, { color: C.primary }]}>Pour {recipientLabel}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* ── Mots d'ouverture ──────────────────────────── */}
        {!isNoEdit && (
          <View style={[styles.sigSection, { borderColor: '#7C3AED' }]}>
            <TouchableOpacity
              style={[styles.sigSectionHeader, { alignItems: 'flex-start' }]}
              onPress={() => setOpeningOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={[styles.accordionLeft, { gap: 4 }]}>
                <Text style={[styles.sigSectionTitle, { color: '#7C3AED' }]}>👋 Le début du message</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17 }}>
                  {'Les premiers mots donnent le ton avant même que ton proche ait lu la suite. "Bonjour Sophie" c\'est chaleureux. "Chère Sophie" c\'est touchant. "Coucou Sophie" c\'est complice. Choisis les mots qui vous ressemblent.'}
                </Text>
                {!openingOpen && openingFormula && (
                  <Text style={[styles.accordionBadge, { backgroundColor: '#F3EFFF', color: '#7C3AED', marginTop: 2 }]}>
                    {resolveOpening(openingFormula).replace('{prénom}', contactFirstName)}
                  </Text>
                )}
                {!openingOpen && !openingFormula && (
                  <Text style={[styles.accordionBadge, { color: Colors.onSurface, marginTop: 2 }]}>▸ Choisir une formule</Text>
                )}
              </View>
              <Text style={[styles.accordionArrow, { color: '#7C3AED', marginTop: 2 }]}>{openingOpen ? '▾' : '▸'}</Text>
            </TouchableOpacity>
            {openingOpen && (
              <>
                {/* Aucun + 7 formules auto-genrées */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setOpeningFormula(null)}
                    activeOpacity={0.8}
                    style={[styles.sigChip, !openingFormula && styles.sigChipActive]}
                  >
                    <Text style={[styles.sigChipLabel, !openingFormula && styles.sigChipLabelActive]}>Aucun</Text>
                  </TouchableOpacity>
                  {OPENING_FORMULAS.map((f) => {
                    const displayed = resolveOpening(f.value).replace('{prénom}', contactFirstName);
                    return (
                      <TouchableOpacity
                        key={f.value}
                        onPress={() => setOpeningFormula(f.value)}
                        activeOpacity={0.8}
                        style={[styles.sigChip, openingFormula === f.value && styles.sigChipActive, openingFormula === f.value && { borderColor: '#7C3AED', backgroundColor: '#F3EFFF' }]}
                      >
                        <Text style={[styles.sigChipLabel, openingFormula === f.value && { color: '#7C3AED', fontFamily: 'BeVietnamPro_700Bold' }]}>{displayed}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {openingFormula && (
                  <View style={[styles.sigPreview, { borderColor: '#7C3AED' + '40', marginTop: 12 }]}>
                    <Text style={styles.sigPreviewLabel}>Aperçu :</Text>
                    <Text style={[styles.sigPreviewValue, { color: '#7C3AED' }]}>{resolveOpening(openingFormula).replace('{prénom}', contactFirstName)}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* ── Les mots de la fin ───────────────────────── */}
        {!isNoEdit && (
          <View style={[styles.sigSection, { borderColor: '#5C8FA8' }]}>
            <TouchableOpacity
              style={[styles.sigSectionHeader, { alignItems: 'flex-start' }]}
              onPress={() => setClosingOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={[styles.accordionLeft, { gap: 4 }]}>
                <Text style={[styles.sigSectionTitle, { color: '#5C8FA8' }]}>💌 La fin du message</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17 }}>
                  {'C\'est la petite phrase qui clôt un message avant la signature — "Bien à toi", "Cordialement", "Bisous"… Un détail qui change tout dans la façon dont ton message est reçu.'}
                </Text>
                {!closingOpen && closingFormula && (
                  <Text style={[styles.accordionBadge, { backgroundColor: '#EFF6FF', color: '#5C8FA8', marginTop: 2 }]}>{closingFormula}</Text>
                )}
                {!closingOpen && !closingFormula && (
                  <Text style={[styles.accordionBadge, { color: Colors.onSurface, marginTop: 2 }]}>▸ Choisir une formule</Text>
                )}
              </View>
              <Text style={[styles.accordionArrow, { color: '#5C8FA8', marginTop: 2 }]}>{closingOpen ? '▾' : '▸'}</Text>
            </TouchableOpacity>
            {closingOpen && (
              <>
                <View style={[styles.sigIntroCard, { borderLeftColor: '#5C8FA8' }]}>
                  <Text style={styles.sigIntroText}>
                    {'👫 Amical → pour les proches, les amis, la famille\n🤝 Semi-formel → pour les collègues ou relations mixtes\n📋 Formel → pour un supérieur, une relation professionnelle'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setClosingFormula(null)}
                  activeOpacity={0.8}
                  style={[styles.sigChip, !closingFormula && styles.sigChipActive, { marginBottom: 10 }]}
                >
                  <Text style={[styles.sigChipLabel, !closingFormula && styles.sigChipLabelActive]}>Aucune</Text>
                </TouchableOpacity>
                {CLOSING_GROUPS.map((group) => (
                  <View key={group} style={{ marginBottom: 10 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: CLOSING_GROUP_COLOR[group], marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{group}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {CLOSING_FORMULAS.filter((f) => f.group === group).map((f) => (
                        <TouchableOpacity
                          key={f.value}
                          onPress={() => setClosingFormula(f.value)}
                          activeOpacity={0.8}
                          style={[
                            styles.sigChip,
                            closingFormula === f.value && styles.sigChipActive,
                            closingFormula === f.value && { borderColor: CLOSING_GROUP_COLOR[group], backgroundColor: CLOSING_GROUP_COLOR[group] + '15' },
                          ]}
                        >
                          <Text style={[
                            styles.sigChipLabel,
                            closingFormula === f.value && styles.sigChipLabelActive,
                            closingFormula === f.value && { color: CLOSING_GROUP_COLOR[group] },
                          ]}>
                            {f.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
                {closingFormula && (
                  <View style={[styles.sigPreview, { borderColor: '#5C8FA8' + '40' }]}>
                    <Text style={styles.sigPreviewLabel}>Aperçu :</Text>
                    <Text style={[styles.sigPreviewValue, { color: '#5C8FA8' }]}>{closingFormula}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* ── Signature personnalisée ──────────────────── */}
        {!isNoEdit && (
          <View
            style={styles.sigSection}
            onLayout={(e) => { sigSectionY.current = e.nativeEvent.layout.y; }}
          >
            <TouchableOpacity
              style={styles.sigSectionHeader}
              onPress={() => setSigOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.sigSectionTitle}>✍️ Ta signature</Text>
                  <TouchableOpacity onPress={() => setSigHelpVisible(true)} style={styles.sigHelpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.sigHelpBtnText}>ℹ️</Text>
                  </TouchableOpacity>
                </View>
                {!sigOpen && (
                  <>
                    <Text style={styles.accordionBadge}>
                      {computedSig ? `Par défaut, c'est : ${computedSig}.` : 'Personnalise ta signature'}
                    </Text>
                    {!!computedSig && (
                      <Text style={styles.accordionBadge}>Mais tu as d'autres options.</Text>
                    )}
                  </>
                )}
              </View>
              <View style={styles.accordionRight}>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{sigOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {sigOpen && (
              <>
                <View style={styles.sigIntroCard}>
                  <Text style={styles.sigIntroText}>
                    {"Un message c'est bien... mais un message signé avec amour c'est encore mieux ! 💛 Personnalise ta signature selon le lien qui vous unit ✨"}
                  </Text>
                </View>
                {/* Sélecteur de type */}
                <View style={styles.sigChipsRow}>
                  <TouchableOpacity
                    style={[styles.sigChip, sigType === 'none' && styles.sigChipActive]}
                    onPress={() => setSigType('none')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sigChipLabel, sigType === 'none' && styles.sigChipLabelActive]}>Aucune signature</Text>
                  </TouchableOpacity>
                  {(relation === 'family'
                    ? ([
                        { type: 'prenom' as SigType, label: `Prénom — ${senderFirst || '…'}` },
                        { type: 'nom_complet' as SigType, label: `Prénom + Nom — ${senderFirst} ${senderLast !== senderFirst ? senderLast : ''}`.trim() },
                        { type: 'lien' as SigType, label: familySubRelation ? possessiveLien(familySubRelation) : 'Lien seul' },
                        { type: 'lien_prenom' as SigType, label: familySubRelation && senderFirst ? `${possessiveLien(familySubRelation)} ${senderFirst}` : 'Lien + prénom' },
                        { type: 'surnom' as SigType, label: '✏️ Surnom libre' },
                      ] as const)
                    : ([
                        { type: 'prenom' as SigType, label: `Prénom — ${senderFirst || '…'}` },
                        { type: 'nom_complet' as SigType, label: `Prénom + Nom — ${senderFirst} ${senderLast !== senderFirst ? senderLast : ''}`.trim() },
                        { type: 'surnom' as SigType, label: '✏️ Surnom libre' },
                      ] as const)
                  ).map((opt) => (
                    <TouchableOpacity
                      key={opt.type}
                      style={[styles.sigChip, sigType === opt.type && styles.sigChipActive]}
                      onPress={() => setSigType(opt.type)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.sigChipLabel, sigType === opt.type && styles.sigChipLabelActive]} numberOfLines={1}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Champ surnom libre */}
                {sigType === 'surnom' && (
                  <TextInput
                    style={styles.sigInput}
                    value={sigCustom}
                    onChangeText={setSigCustom}
                    placeholder="Ex: Tata Marie, Pépère, Ta grande sœur..."
                    placeholderTextColor={Colors.outlineVariant}
                    autoCapitalize="sentences"
                    returnKeyType="done"
                  />
                )}
                {/* Aperçu */}
                {computedSig && (
                  <View style={styles.sigPreview}>
                    <Text style={styles.sigPreviewLabel}>Aperçu :</Text>
                    <Text style={styles.sigPreviewValue}>{computedSig}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* ── PS d'excuse de retard ───────────────────── */}
        {!isNoEdit && (
          <View style={[styles.sigSection, { borderColor: '#FCD34D' }]}>
            <TouchableOpacity
              style={styles.sigSectionHeader}
              onPress={() => setLatePSOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={[styles.accordionLeft, { gap: 4 }]}>
                <Text style={[styles.sigSectionTitle, { color: '#92400E' }]}>😅 En retard ?</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17 }}>
                  {'Tu envoies ce message un peu en retard ? Choisis le ton de ton excuse et elle s\'ajoutera automatiquement sous ta signature. 💛'}
                </Text>
                {showLatePS && !latePSOpen && (
                  <Text style={[styles.accordionBadge, { backgroundColor: '#FEF3C7', color: '#92400E' }]}>PS activé</Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <Text style={[styles.accordionArrow, { color: '#D97706' }]}>{latePSOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {latePSOpen && (
              <View style={{ backgroundColor: '#FFFBEB', borderRadius: 14, padding: 14, gap: 12, borderWidth: 1, borderColor: '#FCD34D' }}>
                <View style={{ height: 1, backgroundColor: '#FCD34D80' }} />
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 13, color: '#78350F' }}>
                  Choisis ton excuse :
                </Text>
                {LATE_PS_OPTIONS.map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => { setSelectedPSIdx(idx); setShowLatePS(true); }}
                    activeOpacity={0.75}
                    style={{
                      borderRadius: 12,
                      borderWidth: selectedPSIdx === idx ? 2 : 1,
                      borderColor: selectedPSIdx === idx ? '#D97706' : '#FCD34D',
                      backgroundColor: selectedPSIdx === idx ? '#FEF3C7' : '#FFFBF0',
                      padding: 12,
                      gap: 4,
                    }}
                  >
                    <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: selectedPSIdx === idx ? '#92400E' : '#B45309' }}>
                      {opt.emoji} {opt.label}
                    </Text>
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#92400E', fontStyle: 'italic', lineHeight: 18 }}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={{ height: 1, backgroundColor: '#FCD34D80' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 14, color: '#78350F' }}>
                    Ajouter ce PS à mon message
                  </Text>
                  <Switch
                    value={showLatePS}
                    onValueChange={setShowLatePS}
                    trackColor={{ false: Colors.outlineVariant, true: '#D97706' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            )}
          </View>
        )}


        {/* ── Multi-destinataires ──────────────────────── */}
        {!isEditing && (
          <View style={styles.multiSection}>
            <TouchableOpacity
              style={styles.multiSectionHeader}
              onPress={() => setMultiOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.multiSectionTitle}>👥 Envoyer à plusieurs contacts</Text>
                <Text style={styles.accordionSub}>Envoie le même message à plusieurs personnes en un clic</Text>
                {!multiOpen && extraContacts.length > 0 && (
                  <Text style={styles.accordionBadge}>+{extraContacts.length} contact{extraContacts.length > 1 ? 's' : ''}</Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{multiOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {multiOpen && (
              <>
                <View style={[styles.multiIntroCard, { borderLeftColor: C.primary }]}>
                  <Text style={styles.multiIntroText}>
                    {"Envoie le même message à plusieurs contacts en une seule fois 👥 Chaque destinataire reçoit un message personnalisé avec son prénom. Parfait pour les vœux collectifs, les annonces ou les messages de groupe 💛✨"}
                  </Text>
                </View>

                {/* Contacts sélectionnés */}
                {extraContacts.length > 0 && (
                  <View style={styles.multiSelected}>
                    <Text style={styles.multiSelectedLabel}>
                      Destinataires sélectionnés ({extraContacts.length}) :
                    </Text>
                    <View style={styles.multiSelectedChips}>
                      {extraContacts.map((c) => (
                        <TouchableOpacity
                          key={c.id}
                          style={[styles.multiChip, { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                          onPress={() => toggleExtraContact(c)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.multiChipName, { color: C.primary }]} numberOfLines={1}>
                            {c.name.trim().split(' ').slice(1).join(' ') || c.name} ✕
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Recherche */}
                <View style={[styles.multiSearchRow, { borderColor: C.primary + '40' }]}>
                  <Text style={styles.multiSearchIcon}>🔍</Text>
                  <TextInput
                    style={styles.multiSearchInput}
                    value={contactSearch}
                    onChangeText={setContactSearch}
                    placeholder="Rechercher un contact..."
                    placeholderTextColor={Colors.outlineVariant}
                  />
                  {contactSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setContactSearch('')}>
                      <Text style={styles.multiSearchClear}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Liste contacts */}
                {(() => {
                  const PET_EMOJI: Record<string, string> = {
                    chien: '🐶', chat: '🐱', lapin: '🐰', perroquet: '🦜',
                    hamster: '🐹', poisson: '🐟', cheval: '🐴', oiseau: '🐦',
                    cochon_d_inde: '🐹', souris: '🐭', tortue: '🐢', autre: '🐾',
                  };
                  const humanList = filteredContacts.filter((c) => c.relation !== 'pet');
                  const petList   = filteredContacts.filter((c) => c.relation === 'pet');

                  const renderRow = (c: Contact) => {
                    const selected  = extraContacts.some((e) => e.id === c.id);
                    const parts     = c.name.trim().split(' ');
                    const dispName  = parts.length > 1
                      ? `${parts.slice(1).join(' ')} ${parts[0]}`
                      : c.name;
                    const isPet     = c.relation === 'pet';
                    const petEmoji  = isPet ? (PET_EMOJI[c.pet_type ?? ''] ?? '🐾') : null;
                    const petSub    = isPet
                      ? [c.pet_type ? c.pet_type.charAt(0).toUpperCase() + c.pet_type.slice(1).replace('_', ' ') : null, c.pet_owner_name ? `de ${c.pet_owner_name}` : null].filter(Boolean).join(' · ')
                      : null;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.multiContactRow, selected && { backgroundColor: C.primaryContainer }]}
                        onPress={() => toggleExtraContact(c)}
                        activeOpacity={0.75}
                      >
                        <View style={[styles.multiContactAvatar, { backgroundColor: selected ? C.primary : Colors.surfaceContainerHighest }]}>
                          {isPet ? (
                            <Text style={{ fontSize: 18 }}>{petEmoji}</Text>
                          ) : (
                            <Text style={[styles.multiContactAvatarText, { color: selected ? Colors.white : Colors.onSurfaceVariant }]}>
                              {dispName.charAt(0).toUpperCase()}
                            </Text>
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.multiContactName, selected && { color: C.primary }]} numberOfLines={1}>
                            {dispName}
                          </Text>
                          {isPet && petSub ? (
                            <Text style={styles.multiContactSub} numberOfLines={1}>{petSub}</Text>
                          ) : (c.phone || c.email) ? (
                            <Text style={styles.multiContactSub} numberOfLines={1}>{c.phone ?? c.email}</Text>
                          ) : null}
                        </View>
                        <View style={[styles.multiContactCheck, selected && { backgroundColor: C.primary, borderColor: C.primary }]}>
                          {selected && <Text style={styles.multiContactCheckMark}>✓</Text>}
                        </View>
                      </TouchableOpacity>
                    );
                  };

                  return (
                    <View style={styles.multiContactList}>
                      {humanList.length === 0 && petList.length === 0 && (
                        <Text style={styles.multiNoResult}>Aucun contact trouvé</Text>
                      )}
                      {humanList.map(renderRow)}
                      {petList.length > 0 && (
                        <>
                          <View style={styles.multiPetSeparator}>
                            <View style={styles.multiPetSeparatorLine} />
                            <Text style={styles.multiPetSeparatorText}>🐾 Animaux</Text>
                            <View style={styles.multiPetSeparatorLine} />
                          </View>
                          {petList.map(renderRow)}
                        </>
                      )}
                    </View>
                  );
                })()}
              </>
            )}

            {/* Indicateur d'envoi en cours */}
            {multiSendProgress && (
              <View style={[styles.multiProgressBar, { backgroundColor: C.primaryContainer }]}>
                <ActivityIndicator size="small" color={C.primary} />
                <Text style={[styles.multiProgressText, { color: C.primary }]}>
                  Envoi {multiSendProgress.current}/{multiSendProgress.total}...
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Photo attachée ───────────────────────────── */}
        {!isEditing && (
          <View style={styles.photoSection}>
            <TouchableOpacity
              style={styles.photoSectionHeader}
              onPress={() => setPhotoOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.photoSectionTitle}>📷 Ajouter une photo</Text>
                <Text style={styles.accordionSub}>Ta photo, ou une photo de ton choix, apparaît en signature — une touche personnelle qui fait la différence</Text>
                {!photoOpen && photoUri && (
                  <Text style={styles.accordionBadge}>📸 Photo ajoutée</Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{photoOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {photoOpen && (
              <>
                <View style={[styles.photoIntroCard, { borderLeftColor: C.primary }]}>
                  <Text style={styles.photoIntroText}>
                    {"Enrichis ta carte d'un souvenir photo 📷 Un portrait, un moment partagé, une image qui dit tout... Le texte s'affichera en dessous — ou par-dessus en mode superposé 💛✨"}
                  </Text>
                </View>

                {/* Mode de placement */}
                <View style={styles.photoModeRow}>
                  {([{ id: 'under', label: '📝 Texte en dessous' }, { id: 'overlay', label: '🖼 Texte sur la photo' }] as const).map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.photoModeChip, photoMode === m.id && styles.photoModeChipActive]}
                      onPress={() => setPhotoMode(m.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.photoModeLabel, photoMode === m.id && { color: C.primary }]}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Aperçu ou bouton ajouter */}
                {photoUri ? (
                  <View style={styles.photoPreviewWrapper}>
                    {photoMode === 'overlay' ? (
                      <View style={styles.photoOverlayContainer}>
                        <Image source={{ uri: photoUri }} style={{ width: '100%', height: 200, borderRadius: Radii.lg }} resizeMode="cover" />
                        <View style={[styles.photoOverlayTextBox, { borderBottomLeftRadius: Radii.lg, borderBottomRightRadius: Radii.lg }]}>
                          <Text style={styles.photoOverlayText} numberOfLines={4}>{generatedContent}</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.photoUnderContainer}>
                        <Image source={{ uri: photoUri }} style={styles.photoUnderImg} resizeMode="cover" />
                        <Text style={styles.photoUnderText} numberOfLines={3}>{generatedContent}</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.photoRemoveBtn} onPress={handleRemovePhoto}>
                      <Text style={styles.photoRemoveBtnText}>🗑 Supprimer la photo</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.photoPickBtn, { borderColor: C.primary }]} onPress={handlePickPhoto} activeOpacity={0.8}>
                    <Text style={styles.photoPickBtnEmoji}>📷</Text>
                    <Text style={[styles.photoPickBtnText, { color: C.primary }]}>Choisir une photo</Text>
                  </TouchableOpacity>
                )}
                {photoUploading && (
                  <View style={styles.photoUploadingRow}>
                    <ActivityIndicator size="small" color={C.primary} />
                    <Text style={[styles.photoUploadingText, { color: C.primary }]}>Envoi de la photo...</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* ── Valider les modifications ────────────────── */}
        {isEditing && (
          <View style={{ alignItems: 'center', marginTop: Spacing[5], marginBottom: Spacing[4] }}>
            <TouchableOpacity
              style={[styles.editValidateBtn, { paddingHorizontal: Spacing[6] }]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.editValidateBtnText}>✅ Je valide mon message</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 6, textAlign: 'center' }}>
              {'⚠️ Valide d\'abord ton message si tu veux générer le message vocal avec tes modifications'}
            </Text>
          </View>
        )}

        {/* ── Message vocal (TTS ElevenLabs) ───────────── */}
        {!isNoEdit && (
          <View style={styles.ttsSection}>

            {/* ── Intro TTS — toujours visible ─────────── */}
            {!tts.isReady && (
              <View style={styles.ttsPreIntro}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: '#9333EA', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 13, color: '#fff', letterSpacing: 0.8 }}>✨ NOUVEAU</Text>
                </View>
                <Text style={[styles.ttsPreIntroTitle, { marginBottom: 2 }]}>🎙️ Ton message… en version vocale</Text>
                <Text style={styles.ttsPreIntroText}>
                  {'L\'IA lit ton message à voix haute et génère un lien audio. Ton proche reçoit le lien et l\'écoute depuis son téléphone — comme si tu lui avais laissé un message vocal, en mieux 💛'}
                </Text>
              </View>
            )}

            {/* ── Bannière hero — toujours visible ──────── */}
            <TouchableOpacity
              onPress={() => setTtsOpen((o) => !o)}
              activeOpacity={0.88}
              style={styles.ttsBannerTouchable}
            >
              <LinearGradient
                colors={tts.isReady ? ['#059669', '#0D9488'] : ['#6D28D9', '#9333EA', '#C026D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ttsBannerGradient}
              >
                <View style={styles.ttsBannerIconWrap}>
                  <Text style={styles.ttsBannerIconBig}>{tts.isReady ? '✅' : '🎙️'}</Text>
                </View>
                <View style={styles.ttsBannerTextBlock}>
                  <Text style={styles.ttsBannerTitle}>
                    {tts.isReady
                      ? 'Vocal prêt à partager !'
                      : 'Transforme ton message en voix et partage le grâce à un lien'}
                  </Text>
                  <Text style={styles.ttsBannerSub}>
                    {tts.isReady
                      ? 'Tes proches peuvent l\'écouter depuis n\'importe où 🎧'
                      : 'Une attention unique — fais entendre ce que tu ressens 💛'}
                  </Text>
                  <View style={styles.ttsBannerPill}>
                    <Text style={styles.ttsBannerPillText}>
                      {ttsOpen
                        ? '▾ Réduire'
                        : tts.isReady
                          ? '▸ Voir le vocal'
                          : '▸ Créer le vocal'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setTtsHelpVisible(true)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.ttsBannerHelp}
                >
                  <Text style={styles.ttsBannerHelpText}>ℹ️</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>

            {/* Annuler le vocal — visible même si section fermée */}
            {tts.isReady && (
              <TouchableOpacity
                style={styles.ttsCancelBtn}
                onPress={() =>
                  Alert.alert(
                    'Annuler le message vocal ?',
                    'Le fichier audio sera supprimé. Tu pourras en créer un nouveau si tu le souhaites.',
                    [
                      { text: 'Non, garder', style: 'cancel' },
                      {
                        text: 'Oui, annuler',
                        style: 'destructive',
                        onPress: () => {
                          tts.reset();
                          setTtsOpen(false);
                        },
                      },
                    ],
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.ttsCancelBtnText}>✕ Annuler ce message vocal</Text>
              </TouchableOpacity>
            )}

            {/* ── Contenu expandable ────────────────────── */}
            {ttsOpen && (
              <View style={styles.ttsExpandedCard}>

                {/* Intro explicative */}
                {!tts.isReady && (
                  <View style={styles.ttsIntroBox}>
                    <Text style={styles.ttsIntroText}>
                      🎙️ Tu vas pouvoir <Text style={styles.ttsIntroBold}>écouter ton message</Text> qui va être lu par une IA.
                    </Text>
                    <Text style={styles.ttsIntroText}>
                      📲 Tu pourras ensuite le <Text style={styles.ttsIntroBold}>partager grâce à un lien</Text> — ton destinataire n'aura qu'à cliquer pour l'écouter, depuis n'importe où.
                    </Text>
                  </View>
                )}

                {/* Sélecteur de voix */}
                <View style={{ gap: 8 }}>
                  <Text style={styles.ttsPickerLabel}>🎤 Choisis ta voix :</Text>
                  <View style={styles.ttsVoicesRow}>
                    {TTS_VOICES.map((v) => (
                      <TouchableOpacity
                        key={v.key}
                        style={[styles.ttsVoiceChip, ttsVoiceKey === v.key && styles.ttsVoiceChipActive]}
                        onPress={() => { setTtsVoiceKey(v.key); tts.reset(); }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.ttsVoiceEmoji}>{v.emoji}</Text>
                        <Text style={[styles.ttsVoiceLabel, ttsVoiceKey === v.key && styles.ttsVoiceLabelActive]}>
                          {v.label}
                        </Text>
                        <Text style={[styles.ttsVoiceSub, ttsVoiceKey === v.key && styles.ttsVoiceSubActive]}>
                          {v.sub}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Sélecteur fond sonore */}
                <View style={{ gap: 8 }}>
                  <Text style={styles.ttsPickerLabel}>🎵 Choisis ton fond sonore :</Text>
                  <View style={styles.ttsVoicesRow}>
                    {TTS_BG_MUSIC.map((m) => (
                      <TouchableOpacity
                        key={m.key}
                        style={[styles.ttsVoiceChip, ttsBgMusic === m.key && styles.ttsVoiceChipActive]}
                        onPress={() => {
                          setTtsBgMusic(m.key);
                          if (savedMessageId) {
                            saveTTSBgMusic(savedMessageId, m.key).catch(() => {});
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.ttsVoiceEmoji}>{m.emoji}</Text>
                        <Text style={[styles.ttsVoiceLabel, ttsBgMusic === m.key && styles.ttsVoiceLabelActive]}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Bouton générer — hero gradient */}
                {!tts.isReady && (
                  <TouchableOpacity
                    style={[(tts.isLoading || !generatedContent.trim()) && { opacity: 0.5 }]}
                    onPress={async () => {
                      const content = isEditing ? localContent.trim() : generatedContent.trim();
                      if (!content || tts.isLoading) return;
                      // Assembler le texte complet : ouverture + corps + formule + signature + PS
                      const resolvedOpening = openingFormula
                        ? resolveOpening(openingFormula).replace('{prénom}', contactFirstName)
                        : null;
                      const openingLine = resolvedOpening ? `${resolvedOpening}.\n\n` : '';
                      const ttsFullName = senderFirst
                        ? (senderLast && senderLast !== senderFirst ? `${senderFirst} ${senderLast}` : senderFirst)
                        : null;
                      const ttsAttribution = ttsFullName || senderFirstName || null;
                      // Formule + nom fusionnés ("Bisous, Jean.") ou formule seule
                      const formuleLine = closingFormula && ttsAttribution
                        ? `\n\n${closingFormula}, ${ttsAttribution}.`
                        : closingFormula ? `\n\n${closingFormula}.` : '';
                      // Pas de closingLine séparé — intégré dans formuleLine ou attributionLine
                      const psLine = showLatePS ? `\n\n${activePSText}` : '';
                      // Attribution uniquement si pas de formule (sinon le nom est déjà dans formuleLine)
                      const isPetFrom = (petDirection === 'from' || petDirection === 'from_to_third') && !!petName;
                      const attributionLine = (!closingFormula && ttsAttribution)
                        ? isPetFrom
                          ? `\n\n…\n\nCe message t'est envoyé par ${petName}, mais ${ttsFullName || senderFirst} l'a un peu aidé !`
                          : `\n\n…\n\nCe message est envoyé de la part de ${ttsAttribution}.`
                        : '';
                      const rawTts = `${openingLine}${content}${formuleLine}${psLine}${attributionLine}`.trim();
                      const ttsText = resolveGender(rawTts, senderGender);
                      let msgId = savedMessageId;
                      if (!msgId && profile?.id) {
                        try {
                          const saved = await saveMessage(profile.id, {
                            contact_id: contactId ?? null,
                            contact_name: contactName,
                            format, tone, content,
                            relation: relation ?? 'friend',
                          });
                          msgId = saved.id;
                          setSavedMessageId(saved.id);
                        } catch { return; }
                      }
                      if (!msgId) return;
                      await saveTTSBgMusic(msgId, ttsBgMusic);
                      tts.generate(msgId, ttsText, ttsVoiceKey);
                    }}
                    disabled={tts.isLoading || !generatedContent.trim()}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#6D28D9', '#9333EA', '#C026D3']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ttsGenerateHeroGradient}
                    >
                      {tts.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Text style={{ fontSize: 22 }}>🎙️</Text>
                          <Text style={styles.ttsGenerateHeroText}>Transformer en vocal</Text>
                          <Text style={{ fontSize: 20 }}>🎧</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* Erreur */}
                {tts.isFailed && (
                  <View style={styles.ttsErrorCard}>
                    <Text style={styles.ttsErrorText}>⚠️ {tts.error ?? 'La génération a échoué.'}</Text>
                    <TouchableOpacity onPress={() => tts.reset()}>
                      <Text style={[styles.ttsErrorRetry, { color: C.primary }]}>↺ Réessayer</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Lecteur + partage */}
                {tts.isReady && tts.ttsUrl && (
                  <>
                    <TTSPlayer ttsUrl={tts.ttsUrl} />
                    {tts.ttsUrl && (
                      <TouchableOpacity
                        style={styles.ttsPreviewFullBtn}
                        onPress={() => {
                          const playerUrl = new URL('https://jeandescourvieres.github.io/CONFETTIS-CAKE/player.html');
                          playerUrl.searchParams.set('tts_url', tts.ttsUrl!);
                          if (ttsBgMusic && ttsBgMusic !== 'aucune') {
                            playerUrl.searchParams.set('bg_url', `${Config.supabaseUrl}/storage/v1/object/public/generated-audio/bg-music/${ttsBgMusic}.mp3`);
                          }
                          Linking.openURL(playerUrl.toString());
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.ttsPreviewFullBtnText}>🎵 Écouter avec le fond sonore →</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={async () => {
                        if (!savedMessageId) return;
                        const url = `https://confetticake.fr/vocal.html?id=${savedMessageId}&bg=${ttsBgMusic}`;
                        const shareRecipient = (petDirection === 'to' && petName) ? petName : contactFirstName;
                        const shareHeader = shareRecipient
                          ? `🎙️ Un message vocal pour toi, ${shareRecipient} !`
                          : `🎙️ Un message vocal pour toi !`;
                        await Share.share({ message: `${shareHeader}\n\nPour l'écouter, clique sur ce lien :\n${url}` });
                      }}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#059669', '#0D9488']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ttsShareHeroGradient}
                      >
                        <Text style={{ fontSize: 20 }}>📲</Text>
                        <Text style={styles.ttsShareHeroText}>Partager le message vocal</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.ttsRegenBtn}
                      onPress={() => tts.reset()}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.ttsRegenBtnText, { color: C.primary }]}>↺ Changer de voix</Text>
                    </TouchableOpacity>
                  </>
                )}

              </View>
            )}
          </View>
        )}

        {/* ── Mode Morse (décalé) ──────────────────────── */}
        {!isEditing && !!generatedContent && (
          <TouchableOpacity
            style={[
              { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing[4], borderRadius: Radii.xl, borderWidth: 1.5 },
              morseMode
                ? { backgroundColor: '#0d0d1a', borderColor: '#00ff88' }
                : { backgroundColor: Colors.surfaceContainerLow, borderColor: Colors.outlineVariant },
            ]}
            onPress={() => setMorseMode(!morseMode)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 22 }}>📡</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: morseMode ? '#00ff88' : Colors.onSurface }}>
                Mode Morse{morseMode ? ' — ACTIVÉ 😄' : ''}
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: morseMode ? '#00cc66' : Colors.onSurfaceVariant, lineHeight: 16, marginTop: 2 }}>
                {morseMode
                  ? '· − · · ·  Un lien animé est ajouté à ton message — le destinataire écoute les bips et peut révéler le texte caché 🤫'
                  : 'Mode décalé 😄 — ton message est converti en code Morse. Un lien animé est glissé dans le message avec bips audio et bouton "Révéler le message"'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Prêt + Boutons action ────────────────────── */}
        {!isEditing && (
          <>
            <Text style={styles.readyTitle}>Ton message est prêt ! 🎉</Text>

            {/* Régénérer avec l'IA */}
            {!isManualMode.current && (
              <TouchableOpacity
                style={[styles.regenBtn, isPending && { opacity: 0.5 }]}
                onPress={handleRegenerate}
                disabled={isPending}
                activeOpacity={0.85}
              >
                <Text style={styles.regenBtnText}>
                  {isPending ? '⏳ Génération en cours...' : '↺ Générer une nouvelle version avec l\'IA'}
                </Text>
              </TouchableOpacity>
            )}

          </>
        )}

        {/* ── Bandeau "comment envoyer" ─────────────────── */}
        {!isEditing && (
          <View style={{ marginHorizontal: Spacing[4], marginTop: Spacing[6] }}>
            <View style={{ borderRadius: 18, backgroundColor: '#E53935', paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', gap: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 22 }}>📲</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, color: '#fff' }}>
                  {petDirection === 'from' && petOwnerName
                    ? `Pour le transmettre à ${(() => { const p = (petOwnerName ?? '').trim().split(/\s+/); return p.find(w => w !== w.toUpperCase()) ?? p[0] ?? petOwnerName; })()} →`
                    : `Pour l'envoyer à ${(contactName.trim().split(/\s+/).find(w => w !== w.toUpperCase()) ?? contactName.trim().split(/\s+/)[0] ?? 'ton contact')} →`}
                </Text>
              </View>
              <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.88)', textAlign: 'center' }}>
                {'Choisis ton canal ci-dessous — WhatsApp, SMS, e-mail…'}
              </Text>
            </View>
          </View>
        )}

        {/* ── Envoi ────────────────────────────────────── */}
        <View style={[styles.shareGrid, { marginTop: Spacing[6] }]}>
          {SHARE_CHANNELS.map((ch) => (
            <TouchableOpacity
              key={ch.id}
              style={[styles.shareBtn, sending && { opacity: 0.5 }]}
              onPress={() => (ch as any).info && ch.id === 'copy' ? setCopyHelpVisible(true) : handleShare(ch.id)}
              disabled={sending}
              activeOpacity={0.8}
            >
              <View style={[styles.shareIcon, { backgroundColor: ch.color + '18', borderColor: ch.color + '60' }]}>
                <Text style={styles.shareEmoji}>{ch.emoji}</Text>
              </View>
              <Text style={[styles.shareLabel, { color: ch.color }]}>{ch.label}</Text>
              {(ch as any).sub && <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 9, color: Colors.onSurfaceVariant, textAlign: 'center' }}>{(ch as any).sub}</Text>}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.shareBtn, sending && { opacity: 0.5 }]}
            onPress={() => setImageHelpVisible(true)}
            disabled={sending}
            activeOpacity={0.8}
          >
            <View style={[styles.shareIcon, { backgroundColor: '#6366F118', borderColor: '#6366F160' }]}>
              <Text style={styles.shareEmoji}>🖼️</Text>
            </View>
            <Text style={[styles.shareLabel, { color: '#6366F1' }]}>Image</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 9, color: Colors.onSurfaceVariant, textAlign: 'center' }}>{'Insta, Snap,\ngalerie…'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Co-signature de groupe ───────────────────── */}
        {savedMessageId && (
          <TouchableOpacity
            style={styles.groupSignBtn}
            onPress={handleGroupShare}
            disabled={isCreatingGroup}
            activeOpacity={0.85}
          >
            <Text style={styles.groupSignEmoji}>👥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.groupSignTitle}>Inviter à co-signer</Text>
              <Text style={styles.groupSignSub}>
                {existingGroup && existingGroup.signatures && existingGroup.signatures.length > 0
                  ? `${existingGroup.signatures.length} signature${existingGroup.signatures.length > 1 ? 's' : ''} — ${formatSigners(existingGroup.signatures)}`
                  : 'Partager un lien pour co-signer "De la part de nous tous"'}
              </Text>
            </View>
            <Text style={[styles.groupSignArrow, { color: C.primary }]}>›</Text>
          </TouchableOpacity>
        )}

        {/* ── Envoyer comme carte postale — désactivé pour l'instant ── */}

        {/* ── Voir les réactions reçues ─────────────────── */}
        {savedMessageId && (
          <TouchableOpacity
            style={styles.reactionsBtn}
            onPress={() => router.push('/(app)/reactions' as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.reactionsBtnEmoji}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.reactionsBtnTitle}>Voir les réactions reçues</Text>
              <Text style={styles.reactionsBtnSub}>Tes proches peuvent réagir via le lien partagé</Text>
            </View>
            <Text style={[styles.reactionsBtnArrow, { color: C.primary }]}>›</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>


      {/* Modal — Voir en entier (suggestions "À ma façon") */}
      <Modal visible={!!ideasFullPreview} transparent animationType="slide" onRequestClose={() => setIdeasFullPreview(null)}>
        <TouchableOpacity style={styles.ideasFullOverlay} activeOpacity={1} onPress={() => setIdeasFullPreview(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.ideasFullCard}>
            <Text style={styles.ideasFullTitle}>📄 Aperçu du modèle</Text>
            <ScrollView style={styles.ideasFullScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.ideasFullText}>{ideasFullPreview?.display ?? ''}</Text>
            </ScrollView>
            <View style={styles.ideasFullActions}>
              <TouchableOpacity style={styles.ideasFullCancelBtn} onPress={() => setIdeasFullPreview(null)}>
                <Text style={styles.ideasFullCancelText}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ideasFullUseBtn, { backgroundColor: C.primary }]}
                onPress={() => {
                  if (!ideasFullPreview) return;
                  setIdeasFullPreview(null);
                  applyIdeasTemplate(ideasFullPreview.raw);
                }}
              >
                <Text style={styles.ideasFullUseBtnText}>✉️ Utiliser ce modèle</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal — Picker de police */}
      <Modal visible={fontPickerVisible} transparent animationType="slide" onRequestClose={() => setFontPickerVisible(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} activeOpacity={1} onPress={() => setFontPickerVisible(false)} />
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32, maxHeight: '80%', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant }}>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 17, color: Colors.onSurface }}>✍️ Choisir une police</Text>
            <TouchableOpacity onPress={() => setFontPickerVisible(false)}>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: Colors.onSurfaceVariant }}>Fermer ✕</Text>
            </TouchableOpacity>
          </View>
          {(() => {
            const previewText = (isEditing ? localContent : generatedContent).trim().split(/\n{2,}/)[0]?.slice(0, 80) || 'Voici un aperçu de ta police…';
            const groups = Array.from(new Set(FONT_STYLES.map(s => s.group)));
            return (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, gap: 20 }}>
                {groups.map(group => (
                  <View key={group}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 11, color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>{group}</Text>
                    {FONT_STYLES.filter(s => s.group === group).map(s => (
                      <TouchableOpacity
                        key={s.value}
                        onPress={() => { setFontStyle(s.value); setFontPickerVisible(false); SecureStore.setItemAsync('preferred_font_style', s.value).catch(() => {}); }}
                        activeOpacity={0.75}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, marginBottom: 6, borderWidth: fontStyle === s.value ? 2 : 1, borderColor: fontStyle === s.value ? C.primary : Colors.outlineVariant, backgroundColor: fontStyle === s.value ? C.primaryContainer + '50' : '#FAFAFA' }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: s.font, fontSize: 18, color: Colors.onSurface, marginBottom: 2 }}>{previewText}</Text>
                          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant }}>{s.label}</Text>
                        </View>
                        {fontStyle === s.value && <Text style={{ fontSize: 18 }}>✓</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
            );
          })()}
        </View>
      </Modal>

      {/* Modal — Copier */}
      <Modal visible={copyHelpVisible} transparent animationType="fade" onRequestClose={() => setCopyHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setCopyHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>📋 Copier le message</Text>
              <TouchableOpacity onPress={() => setCopyHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurface, lineHeight: 20, marginBottom: 20 }}>
              {'Le texte de ton message est copié dans le presse-papier de ton téléphone. Tu peux ensuite le coller dans n\'importe quelle appli :\n\n💬 Messenger · 📸 Instagram · 🎵 TikTok · 👻 Snapchat · 🐦 Twitter · 💼 LinkedIn · 📝 Notes…\n\nParfait pour toutes les applis qui n\'ont pas de bouton dédié ici !'}
            </Text>
            <TouchableOpacity
              style={[styles.editValidateBtn, { paddingHorizontal: Spacing[6] }]}
              onPress={() => { setCopyHelpVisible(false); handleShare('copy'); }}
            >
              <Text style={styles.editValidateBtnText}>📋 Copier maintenant</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal — Image */}
      <Modal visible={imageHelpVisible} transparent animationType="fade" onRequestClose={() => setImageHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setImageHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>🖼️ Envoyer en image</Text>
              <TouchableOpacity onPress={() => setImageHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurface, lineHeight: 20, marginBottom: 20 }}>
              {'Ton message est transformé en belle image (comme une carte) avec ta police et ton fond choisis. Tu peux ensuite l\'envoyer ou la partager :\n\n📸 Instagram Stories · 👻 Snapchat · 🖼️ Galerie photo · 📲 N\'importe quelle appli qui accepte des images\n\n💡 C\'est aussi le format utilisé automatiquement pour WhatsApp — il s\'affiche plein écran dans la conversation !'}
            </Text>
            <TouchableOpacity
              style={[styles.editValidateBtn, { paddingHorizontal: Spacing[6] }]}
              onPress={async () => { setImageHelpVisible(false); setSending(true); const ok = await captureAndShare(); setSending(false); if (!ok) Alert.alert('Erreur', 'Impossible de capturer l\'image.'); }}
            >
              <Text style={styles.editValidateBtnText}>🖼️ Créer et partager l'image</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Style d'écriture */}
      <Modal visible={writingHelpVisible} transparent animationType="fade" onRequestClose={() => setWritingHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setWritingHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le style d'écriture ? ✍️</Text>
              <TouchableOpacity onPress={() => setWritingHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Choisir une police', body: "Appuie sur le bouton de police pour ouvrir le sélecteur — 18 polices disponibles, regroupées en Classique, Manuscrit, Déco et Système. L'aperçu se met à jour instantanément ✨" },
              { title: 'Régler la taille', body: "S = petit, M = normal, L = grand. La taille s'adapte aussi bien au message texte qu'aux chansons et poèmes." },
              { title: 'Activer l\'italique', body: "Le bouton I met ton message en italique — idéal pour les messages élégants ou poétiques 💛" },
              { title: 'Ce que reçoit ton proche', body: "Le style d'écriture choisi est appliqué automatiquement sur la page web que ton proche reçoit via le lien partagé." },
              { title: 'Bon à savoir 💡', body: "Certains styles (Comic, Vintage, Comic Sans) sont très marqués — réserve-les pour les messages légers ou humoristiques. Pour l'émotion, préfère Satisfy ou Dancing Script 💛" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Message vocal */}
      <Modal visible={ttsHelpVisible} transparent animationType="fade" onRequestClose={() => setTtsHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setTtsHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le message vocal ? 🎙️</Text>
              <TouchableOpacity onPress={() => setTtsHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Transformer ton message en voix', body: "Appuie sur Transformer en vocal. Ton message est converti en audio en quelques secondes grâce à ElevenLabs — l'une des meilleures IA voix au monde !" },
              { title: 'Choisir ta voix', body: "4 voix disponibles : Homme neutre, Homme chaleureux, Femme douce, Femme joyeuse. Choisis celle qui correspond le mieux à ton message et à ton proche." },
              { title: 'Écouter avant d\'envoyer', body: "Écoute le résultat directement dans l'appli avant d'envoyer — et change de voix si le résultat ne te convient pas !" },
              { title: 'Partager', body: "Via WhatsApp, SMS, email ou toute autre appli en un tap. Ton proche reçoit un fichier audio qu'il peut écouter immédiatement." },
              { title: 'Bon à savoir 💡', body: "Plus ton message est bien rédigé, plus le résultat vocal sera naturel et émouvant ! La voix parle la langue du message — le français est parfaitement supporté." },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Signature personnalisée */}
      <Modal visible={sigHelpVisible} transparent animationType="fade" onRequestClose={() => setSigHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setSigHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la signature personnalisée ? ✍️</Text>
              <TouchableOpacity onPress={() => setSigHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Pour les contacts famille', body: "Quand tu envoies un message à un contact de type Famille, 4 options de signature sont proposées :\nTon prénom seul → ex : Jean\nLe lien seul → ex : Ton cousin\nLe lien + ton prénom → ex : Ton cousin Jean\nSurnom libre → saisis ce que tu veux — Tata Marie, Pépère, Ta grande sœur qui t'aime..." },
              { title: 'Pour les autres contacts', body: "Pour les contacts hors famille, 3 options sont proposées :\nTon prénom seul → ex : Jean\nTon prénom + nom → ex : Jean Dupont\nSurnom libre → saisis ce que tu veux" },
              { title: 'La mémorisation', body: "Ton choix de signature est mémorisé pour chaque contact et proposé automatiquement à chaque prochain message — plus besoin de le resélectionner à chaque fois !" },
              { title: 'Bon à savoir 💡', body: "La civilité (M. / Mme) renseignée dans ton profil est utilisée pour générer automatiquement le bon lien de parenté — Papa ou Maman, Oncle ou Tante... Pense à la renseigner dans Mon Profil si ce n'est pas encore fait !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  templateActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  templateActionBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radii.lg,
    alignItems: 'center',
  },
  templateActionBtnEdit: {
    backgroundColor: C.primaryContainer,
  },
  templateActionBtnEditText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  templateActionBtnChange: {
    backgroundColor: Colors.surfaceContainer,
  },
  templateActionBtnChangeText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
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
  albumBrand: {
    fontFamily: 'BeVietnamPro_300Light_Italic' ,
    fontSize: Typography.lg,
    color: 'rgba(255,255,255,0.90)',
    fontStyle: 'italic',
    letterSpacing: 1.5,
  },
  albumFormat: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Audio player
  musicStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.lg,
  },
  musicStatusText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: C.primary,
    flex: 1,
  },
  musicRetryText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: C.primary,
    textDecorationLine: 'underline',
  },
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

  // ── Teaser aperçu (mode manuel) ───────────────────────────────────────────
  previewTeaserRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewTeaserChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    backgroundColor: C.primaryContainer,
    borderWidth: 1,
    borderColor: C.primary,
  },
  previewTeaserText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: C.primary,
  },

  // ── Style d'écriture ──────────────────────────────────────────────────────
  writingSection: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    gap: 10,
  },
  writingSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  writingSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  writingHelpBtn: { padding: 4 },
  writingHelpBtnText: { fontSize: 16 },
  fontStyleScroll: { marginLeft: -4 },
  fontStyleCard: {
    width: 88,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
    alignItems: 'center',
    gap: 2,
  },
  fontStyleCardActive: { backgroundColor: C.primaryContainer, borderColor: C.primary },
  fontStyleCardLabel: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  fontSizeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fontSizeLabel: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginRight: 2,
  },
  fontSizeBtn: {
    width: 28,
    height: 28,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  fontSizeBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  fontSizeBtnTextActive: { color: Colors.white },
  messageCardManuscript: { backgroundColor: '#FFFDF8', borderWidth: 1, borderColor: '#e8d5b0' },
  lyricsCardManuscript: { backgroundColor: '#FFFDF8', borderWidth: 1, borderColor: '#e8d5b0' },

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
    borderWidth: 2.5,
    borderColor: '#EF4444',
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
  editMiniPreview: {
    backgroundColor: '#F5F0FF',
    borderRadius: Radii.md,
    padding: Spacing[3],
    gap: 4,
    marginTop: Spacing[2],
  },
  editMiniPreviewLine: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  editValidateBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignSelf: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  editValidateBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: C.onPrimary,
    textAlign: 'center',
  },

  // ── Inline completion ──────────────────────────────────────────────────────
  improvedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: Radii.lg,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  improvedLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  improvedText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  completionCard: {
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.lg,
    padding: 12,
    gap: 8,
  },
  completionText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  completionDots: {
    color: Colors.outlineVariant,
  },
  completionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completionAcceptBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  completionAcceptText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  completionDismissBtn: {
    width: 26, height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionDismissText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // ── Vue côte à côte Améliorer ──────────────────────────────────────────────
  improveCard: {
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    gap: 0,
  },
  improveRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 0,
  },
  improveCol: {
    flex: 1,
    gap: 6,
  },
  improveColDivider: {
    width: 1,
    backgroundColor: C.primaryContainer,
    marginHorizontal: 10,
  },
  improveColLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: Colors.onSurfaceVariant,
  },
  improveColText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  improveButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.primaryContainer,
  },
  improveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  improveBtnOutline: {
    borderLeftWidth: 1,
    borderLeftColor: C.primaryContainer,
  },
  improveBtnTextWhite: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  improveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
  },

  // ── Idées ──────────────────────────────────────────────────────────────────
  ideasCard: {
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  ideasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.primaryContainer,
  },
  ideasTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
    flex: 1,
  },
  ideasClose: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    paddingLeft: 8,
  },
  ideaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: C.primaryContainer,
    gap: 8,
    backgroundColor: Colors.white,
  },
  ideaText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  ideaArrow: {
    fontSize: 18,
    color: C.primary,
    lineHeight: 22,
  },

  // ── Barre d'actions IA ─────────────────────────────────────────────────────
  assistBar: {
    flexDirection: 'row',
    gap: 8,
  },
  assistBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  assistBtnActive: {
    backgroundColor: C.primaryContainer,
  },
  assistBtnPrimary: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  assistBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  assistError: {
    backgroundColor: '#fff3f3',
    borderRadius: Radii.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    padding: Spacing[3],
    marginTop: Spacing[2],
  },
  assistErrorText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.error,
  },

  // ── Panneau Idées ─────────────────────────────────────────────────────────
  ideasPanel: {
    marginTop: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    padding: Spacing[4],
    gap: 8,
  },
  ideasPanelTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  ideasOccasionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.surfaceContainerLow,
  },
  ideasOccasionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  ideasLibraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radii.lg,
    backgroundColor: C.primaryContainer,
    borderWidth: 1.5,
    borderColor: C.primary + '50',
    gap: 8,
  },
  ideasLibraryBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  ideasLibraryBtnSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: C.primary,
    opacity: 0.75,
    marginTop: 1,
  },
  ideasOccasionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  ideasDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  ideasDividerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  ideasTemplateRow: {
    borderTopWidth: 0.5,
    borderTopColor: C.primaryContainer,
    paddingTop: 10,
    marginTop: 4,
    gap: 4,
  },
  ideasTemplateTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  ideasTemplatePreview: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  ideasTemplateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ideasTemplateSeeMore: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  ideasTemplateCta: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  ideasFullOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  ideasFullCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    gap: 14,
  },
  ideasFullTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  ideasFullScroll: { maxHeight: 320 },
  ideasFullText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  ideasFullActions: {
    flexDirection: 'row',
    gap: 10,
  },
  ideasFullCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
  },
  ideasFullCancelText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  ideasFullUseBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  ideasFullUseBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  ideasFilterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
  },
  ideasFilterBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  ideasFilterText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  ideasFilterTextActive: {
    color: C.primary,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  templateEmpty: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
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
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[3],
  },
  regenBtn: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    paddingVertical: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: 'center',
  },
  regenBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
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
  previewEnvelopeSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginTop: -4,
  },
  messageCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
  },
  messageHeader: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: C.primary,
    marginBottom: 2,
  },
  messageBrand: {
    fontFamily: 'BeVietnamPro_300Light',
    fontStyle: 'italic',
    fontSize: Typography.sm,
    color: C.primary,
    opacity: 0.7,
    letterSpacing: 1.2,
    marginBottom: Spacing[3],
  },
  messageText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 26,
  },
  messageSender: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginTop: 12,
    textAlign: 'right',
    paddingRight: 8,
  },

  sectionLabel: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 10,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceContainerLow,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginTop: Spacing[6],
    marginBottom: Spacing[3],
    marginHorizontal: Spacing[4],
  },

  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing[4],
  },
  shareBtn: { alignItems: 'center', gap: 8 },
  shareIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  shareEmoji: { fontSize: 32 },
  shareLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 13,
    color: Colors.onSurface,
  },

  translateWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  translateBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  translateBtn: {
    alignSelf: 'center',
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  translateBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 13,
    color: '#7C3AED',
  },
  poemIntroWrap: {
    marginTop: 10,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDBA74',
    padding: 14,
    gap: 10,
    alignItems: 'center',
  },
  poemIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 19,
  },
  poemBtn: {
    alignSelf: 'center',
    backgroundColor: '#FED7AA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  poemBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 13,
    color: '#C2410C',
  },
  translatePicker: {
    gap: 10,
  },
  translateHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  translateHintEmoji: { fontSize: 18, marginTop: 1 },
  translateHintText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: '#1E3A5F',
    lineHeight: 18,
  },
  translateLangRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  translateLangBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  translateLangFlag: { fontSize: 16 },
  translateLangLabel: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12,
    color: '#5B21B6',
  },
  translateLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  translateLoadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#7C3AED',
  },
  translateRestoreBtn: {
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  translateRestoreText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 13,
    color: '#475569',
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

  groupSignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    padding: Spacing[3],
    backgroundColor: '#ECFDF5',
    borderRadius: Radii.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  groupSignEmoji: { fontSize: 26 },
  groupSignTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  groupSignSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  groupSignArrow: { fontSize: 22, lineHeight: 26 },

  postcardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    padding: Spacing[3],
    backgroundColor: '#9C27B015',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#9C27B040',
  },
  postcardBtnEmoji: { fontSize: 26 },
  postcardBtnTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  postcardBtnSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  postcardBtnArrow: { fontSize: 22, lineHeight: 26 },

  reactionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    padding: Spacing[3],
    backgroundColor: '#FFF7ED',
    borderRadius: Radii.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  reactionsBtnEmoji: { fontSize: 26 },
  reactionsBtnTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  reactionsBtnSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  reactionsBtnArrow: { fontSize: 22, lineHeight: 26 },

  regenFullBtn: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[6],
    paddingVertical: 14,
    paddingHorizontal: Spacing[5],
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

  // ── Destinataire ──────────────────────────────────────────────────────────
  recipientSection: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 2,
    borderColor: C.primary + '40',
    padding: Spacing[4],
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  recipientSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipientSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: C.primary,
  },
  recipientIntroCard: {
    borderLeftWidth: 3,
    borderRadius: Radii.md,
    backgroundColor: C.primaryContainer,
    padding: 12,
  },
  recipientIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  recipientChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recipientChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
  },
  recipientChipActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  recipientChipLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  recipientChipLabelActive: { color: C.primary },
  recipientInput: {
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: Radii.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    backgroundColor: Colors.white,
  },
  recipientPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.md,
  },
  recipientPreviewLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  recipientPreviewValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
  },

  // ── Signature personnalisée ────────────────────────────────────────────────
  sigSection: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 10,
    ...Shadows.sm,
  },
  sigSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  sigSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  sigHelpBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  sigHelpBtnText: { fontSize: 15, lineHeight: 18 },
  sigIntroCard: {
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    borderRadius: Radii.md,
    padding: 12,
  },
  sigIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  sigChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sigChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
    maxWidth: '100%',
  },
  sigChipActive: {
    backgroundColor: C.primaryContainer,
    borderColor: C.primary,
  },
  sigChipLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  sigChipLabelActive: { color: C.primary },
  sigInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  sigPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sigPreviewLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sigPreviewValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },

  // ── Help modal (shared) ────────────────────────────────────────────────────
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  helpModalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    overflow: 'hidden',
    maxHeight: '85%',
  },
  helpModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primary,
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
  },
  helpModalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
    flex: 1,
    marginRight: 8,
  },
  helpModalClose: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  helpModalSection: {
    paddingHorizontal: Spacing[4],
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  helpModalSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  helpModalSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  // ── Fond coloré et animé ───────────────────────────────────────────────────
  bgSection: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
    gap: 10,
  },
  bgSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.lg,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  bgSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  bgHelpBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  bgHelpBtnText: { fontSize: 15, lineHeight: 18 },
  bgIntroCard: {
    borderLeftWidth: 3,
    borderRadius: Radii.md,
    backgroundColor: C.primaryContainer,
    padding: 12,
  },
  bgIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  bgChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bgChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
  },
  bgChipActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  bgChipEmoji: { fontSize: 14 },
  bgChipLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  bgChipLabelActive: { color: C.primary },
  bgPreview: {
    height: 80,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.outlineVariant,
  },
  bgPreviewLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  // ── Multi-destinataires ────────────────────────────────────────────────────
  multiSection: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
    gap: 10,
  },
  multiSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: Radii.lg,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  multiSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  multiIntroCard: {
    borderLeftWidth: 3,
    borderRadius: Radii.md,
    backgroundColor: C.primaryContainer,
    padding: 12,
  },
  multiIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  multiSelected: { gap: 6 },
  multiSelectedLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  multiSelectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  multiChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
  },
  multiChipName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  multiSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceContainerLow,
    gap: 8,
  },
  multiSearchIcon: { fontSize: 15 },
  multiSearchInput: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    padding: 0,
  },
  multiSearchClear: {
    fontSize: 14,
    color: Colors.outlineVariant,
  },
  multiContactList: { gap: 2 },
  multiContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radii.md,
  },
  multiContactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiContactAvatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
  },
  multiContactName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  multiContactSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  multiContactCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiContactCheckMark: {
    fontSize: 12,
    color: Colors.white,
    lineHeight: 14,
  },
  multiNoResult: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
  },
  multiPetSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  multiPetSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  multiPetSeparatorText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  multiProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radii.md,
    justifyContent: 'center',
  },
  multiProgressText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  // ── Photo attachée ─────────────────────────────────────────────────────────
  photoSection: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    gap: 10,
  },
  photoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderRadius: Radii.lg,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  photoSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  photoIntroCard: {
    borderLeftWidth: 3,
    borderRadius: Radii.md,
    backgroundColor: C.primaryContainer,
    padding: 12,
  },
  photoIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  photoModeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoModeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
  },
  photoModeChipActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  photoModeLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  photoPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: Colors.surfaceContainerLow,
  },
  photoPickBtnEmoji: { fontSize: 22 },
  photoPickBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
  },
  photoPreviewWrapper: {
    gap: 8,
  },
  photoUnderContainer: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 0.5,
    borderColor: Colors.outlineVariant,
  },
  photoUnderImg: {
    width: '100%',
    height: 180,
  },
  photoUnderText: {
    padding: 12,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  photoOverlayContainer: {
    width: '100%',
    height: 200,
  },
  photoOverlayImg: {
    width: '100%',
    height: 200,
  },
  photoOverlayTextBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.52)',
    padding: 12,
  },
  photoOverlayText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
    lineHeight: 20,
  },
  photoRemoveBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  photoRemoveBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.error,
  },
  photoUploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  photoUploadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
  },

  // ── Message musical ────────────────────────────────────────────────────────
  musicSection: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 10,
    ...Shadows.sm,
  },
  musicSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  musicSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  musicHelpBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  musicHelpBtnText: { fontSize: 15, lineHeight: 18 },
  musicIntroCard: {
    borderLeftWidth: 3,
    borderRadius: Radii.md,
    backgroundColor: C.primaryContainer,
    padding: 12,
  },
  musicIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  musicChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  musicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
  },
  musicChipActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  musicChipEmoji: { fontSize: 14 },
  musicChipLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  musicChipLabelActive: {
    color: C.primary,
  },
  musicGenerateBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  musicGenerateBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.white,
  },

  bgMusicBanner: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: '#F5F3FF',
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: '#7C3AED30',
    padding: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  bgMusicBannerEmoji: { fontSize: 24 },
  bgMusicBannerTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#5B21B6', marginBottom: 2 },
  bgMusicBannerSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#6D28D9', lineHeight: 17 },
  bgMusicBannerArrow: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: '#7C3AED' },
  bgMusicPicker: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    backgroundColor: '#F5F3FF',
    borderRadius: Radii.lg,
    padding: Spacing[4],
  },

  // ── Message vocal (TTS) ────────────────────────────────────────────────────
  ttsSection: {
    marginHorizontal: Spacing[4],
    marginBottom: 16,
    gap: 10,
  },
  ttsPreIntro: {
    backgroundColor: '#F3E8FF',
    borderRadius: Radii.xl,
    padding: Spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
    gap: 6,
  },
  ttsPreIntroTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: '#6D28D9',
  },
  ttsPreIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  ttsBannerTouchable: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  ttsBannerGradient: {
    padding: 20,
    paddingRight: 44,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderRadius: Radii.xl,
  },
  ttsBannerIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ttsBannerIconBig: { fontSize: 28 },
  ttsBannerTextBlock: { flex: 1, gap: 5 },
  ttsBannerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  ttsBannerSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18,
  },
  ttsBannerPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  ttsBannerPillText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: '#fff',
  },
  ttsBannerHelp: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  ttsBannerHelpText: { fontSize: 16, opacity: 0.75 },
  ttsExpandedCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 14,
    ...Shadows.sm,
  },
  ttsTagline: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
  },
  ttsIntroBox: {
    backgroundColor: '#F5F0FF',
    borderRadius: Radii.lg,
    padding: 12,
    gap: 8,
  },
  ttsIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  ttsIntroBold: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: '#7C3AED',
  },
  ttsPickerLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 13,
    color: Colors.onSurface,
  },
  ttsGenerateHeroGradient: {
    borderRadius: Radii.xl,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ttsGenerateHeroText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.2,
  },
  ttsShareHeroGradient: {
    borderRadius: Radii.xl,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ttsShareHeroText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#fff',
  },
  // ── Rétrocompat (accordion shared styles) ─────────────────────────────────
  ttsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ttsSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  ttsHelpBtn: { padding: 4 },
  ttsHelpBtnText: { fontSize: 18 },

  // ── Accordion shared styles ────────────────────────────────────────────────
  accordionLeft: { flex: 1, gap: 4 },
  accordionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accordionArrow: { fontSize: 18, fontWeight: 'bold' },
  accordionBadge: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  accordionSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
    marginTop: 2,
  },

  ttsVoicesRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
  },
  ttsVoiceChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.white,
    gap: 2,
  },
  ttsVoiceChipActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  ttsVoiceEmoji: { fontSize: 18 },
  ttsVoiceLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSurface,
  },
  ttsVoiceLabelActive: { color: C.primary },
  ttsVoiceSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  ttsVoiceSubActive: { color: C.primary },


  ttsErrorCard: {
    backgroundColor: '#FFF3F0',
    borderRadius: Radii.md,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  ttsErrorText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.error,
    lineHeight: 20,
  },
  ttsErrorRetry: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
  },


  ttsPreviewFullBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: '#9b6bb5',
    backgroundColor: '#f5f0ff',
  },
  ttsPreviewFullBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: '#7c3aed',
  },

  ttsRegenBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: 'transparent',
  },
  ttsRegenBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  ttsCancelBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  ttsCancelBtnText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },

  // ── Style manuscrit ────────────────────────────────────────────────────────
  manuscriptToggle: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: 'transparent',
  },
  manuscriptToggleActive: {
    backgroundColor: '#FFF8E7',
    borderColor: '#C8A84B',
  },
  manuscriptToggleText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  messageHeaderManuscript: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 26,
    letterSpacing: 0.3,
  },
  messageTextManuscript: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 22,
    lineHeight: 34,
    color: '#2C1A0E',
    letterSpacing: 0.2,
  },
  messageSenderManuscript: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 22,
    color: '#2C1A0E',
  },
  lyricsTextManuscript: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 22,
    lineHeight: 34,
    color: '#2C1A0E',
    letterSpacing: 0.2,
  },

  noFautesBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginTop: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  noFautesBadgeText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: '#333',
  },
  noFautesBadgeStrike: {
    textDecorationLine: 'line-through',
    color: '#e53935',
    fontFamily: 'BeVietnamPro_700Bold',
  },
  noFautesBadgeCorrect: {
    color: '#2E7D32',
    fontFamily: 'BeVietnamPro_700Bold',
  },
  });
}
