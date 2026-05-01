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
  ActivityIndicator,
  Modal,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { useWritingAssistant } from '../../../src/hooks/useWritingAssistant';
import { markMessageSent, updateMessageContent, updateMessageStyle, updateMessagePhoto } from '../../../src/services/messages.service';
import { buildSignatureText, getSignatureLabels } from '../../../src/utils/signature';
import { useCreateGroupMessage, useGroupMessage, formatSigners, groupShareUrl } from '../../../src/hooks/useGroupMessages';
import { fetchMusicStatus } from '../../../src/services/music.service';
import { useMusicGeneration } from '../../../src/hooks/useMusicGeneration';
import { useTTSGeneration } from '../../../src/hooks/useTTSGeneration';
import type { TTSVoiceKey } from '../../../src/types/models';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { supabase } from '../../../src/services/supabase';
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
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [positionMs,  setPositionMs]  = useState(0);
  const [durationMs,  setDurationMs]  = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true, staysActiveInBackground: false });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const togglePlay = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: ttsUrl },
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
];

// ── Share channels ────────────────────────────────────────────────────────────
const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬', color: '#25D366' },
  { id: 'sms', label: 'SMS', emoji: '📱', color: Colors.primary },
  { id: 'email', label: 'Email', emoji: '📧', color: '#EA4335' },
  { id: 'copy', label: 'Copier', emoji: '📋', color: Colors.onSurfaceVariant },
];

// ── Type de style de police ───────────────────────────────────────────────────
type FontStyle = 'standard' | 'caveat_bold' | 'dancing' | 'satisfy' | 'patrick' | 'pacifico' | 'special_elite' | 'bangers';

const FONT_STYLES: { value: FontStyle; label: string; font: string; preview: string }[] = [
  { value: 'standard',     label: 'Standard',    font: 'BeVietnamPro_400Regular',  preview: 'Abc' },
  { value: 'caveat_bold',  label: 'Manuscrit gras',    font: 'Caveat_700Bold',           preview: 'Abc' },
  { value: 'dancing',      label: 'Manuscrit élégant', font: 'DancingScript_400Regular',  preview: 'Abc' },
  { value: 'satisfy',      label: 'Manuscrit romantique', font: 'Satisfy_400Regular',     preview: 'Abc' },
  { value: 'patrick',      label: 'Manuscrit enfantin',  font: 'PatrickHand_400Regular',  preview: 'Abc' },
  { value: 'pacifico',     label: 'Calligraphie',  font: 'Pacifico_400Regular',          preview: 'Abc' },
  { value: 'special_elite',label: 'Vintage',       font: 'SpecialElite_400Regular',      preview: 'Abc' },
  { value: 'bangers',      label: 'Comic',         font: 'Bangers_400Regular',           preview: 'Abc' },
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
  const { autoGen } = useLocalSearchParams<{ autoGen?: string }>();
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
    setGeneratedContent,
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
  const music = useMusicGeneration({
    messageId: savedMessageId ?? '',
    initialStatus: 'none',
    initialAudioUrl: null,
    lyrics: generatedContent,
    style: `${occasion} ${musicVoice === 'female' ? 'female vocal' : musicVoice === 'male' ? 'male vocal' : ''}`.trim(),
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
  const isManuscript = fontStyle !== 'standard';
  const [writingHelpVisible, setWritingHelpVisible] = useState(false);

  // ── Panneau "Idées" — occasions → modèles ───────────────────────────────────
  const [ideasStep, setIdeasStep] = useState<'closed' | 'occasion' | 'templates'>('closed');
  const [ideasOccasion, setIdeasOccasion] = useState<string>('birthday');
  const [ideasTon, setIdeasTon] = useState<'tu' | 'vous'>('tu');
  const [ideasLongueur, setIdeasLongueur] = useState<'court' | 'moyen' | 'long'>('court');
  const [ideasTemplates, setIdeasTemplates] = useState<{ id: string; title: string; content: string }[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

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
    setIdeasTemplates((data as { id: string; title: string; content: string }[]) ?? []);
    setIdeasLoading(false);
  };

  const changeIdeasFilter = (ton: 'tu' | 'vous', longueur: 'court' | 'moyen' | 'long') => {
    setIdeasTon(ton);
    setIdeasLongueur(longueur);
    if (ideasStep === 'templates') loadIdeasTemplates(ideasOccasion, ton, longueur);
  };

  const applyIdeasTemplate = (content: string) => {
    const firstName = contactName.trim().split(' ').slice(1).join(' ') || contactName.trim().split(' ')[0] || '';
    const currentYear = new Date().getFullYear().toString();
    const filled = content
      .replace(/\{prenom\}/gi, firstName || 'toi')
      .replace(/\{annee\}/gi, currentYear);
    setLocalContent(filled);
    assist.dismissImproved();
    setIdeasStep('closed');
  };

  // ── Contacts (pour multi-envoi) ─────────────────────────────────────────────
  const { data: allContacts = [] } = useContacts();

  // ── Accordéon — état ouvert/fermé des 5 sections ────────────────────────────
  const [sigOpen,     setSigOpen]     = useState(false);
  const [bgOpen,      setBgOpen]      = useState(false);
  const [photoOpen,   setPhotoOpen]   = useState(false);
  const [multiOpen,   setMultiOpen]   = useState(false);
  const [musicOpen,   setMusicOpen]   = useState(false);
  const [ttsOpen,     setTtsOpen]     = useState(false);

  // ── Multi-destinataires ──────────────────────────────────────────────────────
  const [extraContacts,       setExtraContacts]       = useState<Contact[]>([]);
  const [contactSearch,       setContactSearch]       = useState('');
  const [multiSendProgress,   setMultiSendProgress]   = useState<{ current: number; total: number } | null>(null);

  const filteredContacts = allContacts.filter((c) => {
    if (c.id === contactId) return false; // exclure le contact principal
    if (!contactSearch.trim()) return true;
    return c.name.toLowerCase().includes(contactSearch.toLowerCase());
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
  type SigType = 'prenom' | 'lien' | 'lien_prenom' | 'nom_complet' | 'surnom';
  const [sigType, setSigType] = useState<SigType>('prenom');
  const [sigCustom, setSigCustom] = useState('');
  const [sigHelpVisible, setSigHelpVisible] = useState(false);

  // ── Fond coloré et animé ─────────────────────────────────────────────────────
  const [bgTheme, setBgTheme] = useState<BgThemeId>('none');
  const [bgHelpVisible, setBgHelpVisible] = useState(false);
  const activeBgTheme = BG_THEMES.find((t) => t.id === bgTheme) ?? BG_THEMES[0];

  // ── Message musical ──────────────────────────────────────────────────────────
  type MusicAmbiance = 'auto' | 'joyeux' | 'emouvant' | 'doux' | 'majestueux' | 'drole';
  const [musicAmbiance, setMusicAmbiance] = useState<MusicAmbiance>('auto');
  const [musicHelpVisible, setMusicHelpVisible] = useState(false);
  const MUSIC_AMBIANCES: { id: MusicAmbiance; emoji: string; label: string }[] = [
    { id: 'auto',       emoji: '🤖', label: 'Auto IA'    },
    { id: 'joyeux',     emoji: '🎉', label: 'Joyeux'     },
    { id: 'emouvant',   emoji: '💛', label: 'Émouvant'   },
    { id: 'doux',       emoji: '🌸', label: 'Doux'       },
    { id: 'majestueux', emoji: '✨', label: 'Majestueux' },
    { id: 'drole',      emoji: '😄', label: 'Drôle'      },
  ];

  // ── Message vocal (TTS) ──────────────────────────────────────────────────────
  const TTS_VOICES: { key: TTSVoiceKey; emoji: string; label: string; sub: string }[] = [
    { key: 'homme_neutre',     emoji: '🎙️', label: 'Homme',     sub: 'Neutre'      },
    { key: 'homme_chaleureux', emoji: '🎙️', label: 'Homme',     sub: 'Chaleureux'  },
    { key: 'femme_douce',      emoji: '🎤', label: 'Femme',     sub: 'Douce'       },
    { key: 'femme_joyeuse',    emoji: '🎤', label: 'Femme',     sub: 'Joyeuse'     },
  ];
  const [ttsVoiceKey,   setTtsVoiceKey]   = useState<TTSVoiceKey>('femme_douce');
  const [ttsHelpVisible, setTtsHelpVisible] = useState(false);
  const tts = useTTSGeneration();

  // Préfixe possessif Ton/Ta selon le lien
  const LIEN_FEMININ = new Set(['mère', 'sœur', 'grand-mère', 'tante', 'fille', 'cousine', 'petite-fille', 'belle-sœur']);
  const possessiveLien = (lien: string) => {
    const prefix = LIEN_FEMININ.has(lien.toLowerCase()) ? 'Ta' : 'Ton';
    return `${prefix} ${lien.charAt(0).toUpperCase()}${lien.slice(1)}`;
  };

  const nameParts2 = (profile?.full_name ?? '').trim().split(' ');
  const senderFirst = nameParts2[0] ?? '';   // Prénom (stocké en premier dans le profil)
  const senderLast = nameParts2.slice(1).join(' ') || senderFirst;

  const computedSig = (() => {
    if (!sigType) return senderFirst || null;
    switch (sigType) {
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
  const contactFirstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];
  const contactLastName  = nameParts[0] ?? '';
  const contactFullName  = nameParts.length > 1 ? `${contactFirstName} ${contactLastName}` : contactFirstName;

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

  const senderFirstName = computedSig;

  const reactionLink = savedMessageId
    ? `\n\n💬 Réagis à ce message : https://confetticake.fr/reaction/${savedMessageId}`
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

  const handleShare = async (channelId: string) => {
    const closing = senderFirstName ? `\n\n${senderFirstName}` : '';
    const bodyText = `${generatedContent}${closing}${reactionLink}`;
    const fullText = `${emoji} ${title}\n\n${bodyText}`;
    const baseText = channelId === 'email' ? bodyText : fullText;
    const text = showSig ? baseText + buildSignatureText(i18n.language) : baseText;

    setSending(true);
    try {
      // ── Contact principal ────────────────────────────────────────────────────
      const sent = await sendToOne(channelId, text, contactPhone, contactEmail);
      if (!sent) { setSending(false); return; }

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
          const extraBodyText = `${generatedContent}${closing}`;
          const extraFullText = `${emoji} ${extraTitle}\n\n${extraBodyText}`;
          const extraBase = channelId === 'email' ? extraBodyText : extraFullText;
          const extraText = showSig ? extraBase + buildSignatureText(i18n.language) : extraBase;

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
          <Text style={styles.albumBrand}>by ConfettiCake</Text>
          <Text style={styles.albumFormat}>
            {format === 'song' ? 'Chanson' : format === 'poem' ? 'Poème' : format === 'joke' ? 'Humour' : 'Message'}
          </Text>
        </LinearGradient>

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

        {/* ── Aperçu complet du message reçu ───────────── */}
        <View style={styles.previewEnvelope}>
          <Text style={styles.previewEnvelopeLabel}>📩 Ce que ton contact va recevoir</Text>

          {/* ── Style d'écriture ────────────────────────── */}
          {!isEditing && (
            <View style={styles.writingSection}>
              <View style={styles.writingSectionHeader}>
                <Text style={styles.writingSectionTitle}>✍️ Style d'écriture</Text>
                <TouchableOpacity onPress={() => setWritingHelpVisible(true)} style={styles.writingHelpBtn}>
                  <Text style={styles.writingHelpBtnText}>ℹ️</Text>
                </TouchableOpacity>
              </View>
              {/* Grille 8 styles */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontStyleScroll} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
                {FONT_STYLES.map((s) => (
                  <TouchableOpacity
                    key={s.value}
                    style={[styles.fontStyleCard, fontStyle === s.value && styles.fontStyleCardActive]}
                    onPress={() => setFontStyle(s.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontFamily: s.font, fontSize: 20, color: fontStyle === s.value ? C.primary : Colors.onSurface, marginBottom: 4 }}>
                      Abc
                    </Text>
                    <Text style={[styles.fontStyleCardLabel, fontStyle === s.value && { color: C.primary }]} numberOfLines={2}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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

          {isEditing ? (
            <View style={styles.editCard}>
              {/* ── Zone de texte ───────────────────── */}
              <TextInput
                style={styles.editInput}
                value={localContent}
                onChangeText={(v) => {
                  setLocalContent(v);
                  assist.dismissImproved();
                }}
                multiline
                autoFocus
                textAlignVertical="top"
                placeholder="Écris ton message… ou inspire-toi 💡"
                placeholderTextColor={Colors.outlineVariant}
              />

              {/* ── Suggestion de complétion ─────────────────── */}
              {assist.completion && !assist.improved && (
                <View style={styles.completionCard}>
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


              {/* ── Barre d'actions IA ───────────────────────── */}
              <View style={styles.assistBar}>
                <TouchableOpacity
                  style={[styles.assistBtn, ideasStep !== 'closed' && styles.assistBtnActive]}
                  onPress={openIdeasOccasion}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.assistBtnText, ideasStep !== 'closed' && { color: C.primary }]}>
                    {ideasStep !== 'closed' ? '✕ Fermer' : '💡 Idées'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ── Panneau Idées : sélection occasion ──────── */}
              {ideasStep === 'occasion' && (
                <View style={styles.ideasPanel}>
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
                    ideasTemplates.map((tpl) => (
                      <TouchableOpacity
                        key={tpl.id}
                        style={styles.ideasTemplateRow}
                        onPress={() => applyIdeasTemplate(tpl.content)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.ideasTemplatePreview} numberOfLines={ideasLongueur === 'court' ? 2 : 6}>
                          {tpl.content
                            .replace(/\{prenom\}/gi, contactName.trim().split(' ').slice(1).join(' ') || contactName.trim().split(' ')[0] || 'Prénom')
                            .replace(/\{annee\}/gi, new Date().getFullYear().toString())}
                        </Text>
                        <Text style={styles.ideasTemplateCta}>→ Utiliser</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}

              {/* ── Teaser aperçu ────────────────────────────── */}
              <View style={styles.previewTeaserRow}>
                {['🎨 Fond animé', '🎵 Musique', '✍️ Signature'].map((item) => (
                  <View key={item} style={styles.previewTeaserChip}>
                    <Text style={styles.previewTeaserText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* ── Voir l'aperçu ────────────────────────────── */}
              <TouchableOpacity style={styles.editValidateBtn} onPress={handleSaveEdit}>
                <Text style={styles.editValidateBtnText}>👁️ Voir ton message avant envoi</Text>
              </TouchableOpacity>
            </View>
          ) : format === 'song' || format === 'poem'
            ? <LyricsCard content={generatedContent} fontStyle={fontStyle as FontStyle} fontSize={fontSize} isItalic={isItalic} />
            : (() => {
                const mFont = getFontFamily(fontStyle);
                const fSizeObj = FONT_SIZES.find((s) => s.key === fontSize) ?? FONT_SIZES[1];
                return (
                  <View style={[styles.messageCard, isManuscript && styles.messageCardManuscript]}>
                    <Text style={[styles.messageHeader, { fontFamily: mFont }]}>{emoji} {title}</Text>
                    <Text style={[styles.messageBrand, { fontFamily: mFont, fontSize: 14, letterSpacing: 0.5 }]}>by ConfettiCake</Text>
                    <Text style={[styles.messageText, { fontFamily: mFont, fontSize: fSizeObj.size, lineHeight: fSizeObj.lineHeight, fontStyle: isItalic ? 'italic' : 'normal' }]}>{generatedContent}</Text>
                    {senderFirstName && (
                      <Text style={[styles.messageSender, { fontFamily: mFont, fontSize: fSizeObj.size - 2, textAlign: 'right', fontStyle: isItalic ? 'italic' : 'normal' }]}>{senderFirstName}</Text>
                    )}
                  </View>
                );
              })()
            }

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

        {/* ── Destinataire ─────────────────────────────── */}
        {!isEditing && (
          <View style={styles.recipientSection}>
            <TouchableOpacity
              style={styles.recipientSectionHeader}
              onPress={() => setRecipientOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.recipientSectionTitle}>🎯 Adresser à</Text>
                {!recipientOpen && (
                  <Text style={styles.accordionBadge}>
                    {recipientType === 'aucun' ? 'Non affiché' : recipientLabel ?? '—'}
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
                    {"Choisis comment le prénom du destinataire apparaîtra en haut de ta carte — prénom seul, prénom + nom, ou une appellation affectueuse à toi 💛"}
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

        {/* ── Signature personnalisée ──────────────────── */}
        {!isEditing && (
          <View style={styles.sigSection}>
            <TouchableOpacity
              style={styles.sigSectionHeader}
              onPress={() => setSigOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.sigSectionTitle}>✍️ Ta signature</Text>
                {!sigOpen && computedSig && (
                  <Text style={styles.accordionBadge}>{computedSig}</Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <TouchableOpacity onPress={() => setSigHelpVisible(true)} style={styles.sigHelpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.sigHelpBtnText}>ℹ️</Text>
                </TouchableOpacity>
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
                  {(relation === 'family'
                    ? ([
                        { type: 'prenom' as SigType, label: `Prénom — ${senderFirst || '…'}` },
                        { type: 'lien' as SigType, label: familySubRelation ? possessiveLien(familySubRelation) : 'Lien seul' },
                        { type: 'lien_prenom' as SigType, label: familySubRelation && senderFirst ? `${possessiveLien(familySubRelation)} ${senderFirst}` : 'Lien + prénom' },
                        { type: 'surnom' as SigType, label: '✏️ Surnom libre' },
                      ] as const)
                    : ([
                        { type: 'prenom' as SigType, label: `Prénom — ${senderFirst || '…'}` },
                        { type: 'nom_complet' as SigType, label: `Complet — ${senderFirst} ${senderLast !== senderFirst ? senderLast : ''}`.trim() },
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

        {/* ── Fond coloré et animé ─────────────────────── */}
        {!isEditing && (
          <View style={styles.bgSection}>
            <TouchableOpacity
              style={styles.bgSectionHeader}
              onPress={() => setBgOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.bgSectionTitle}>🎨 Fond animé</Text>
                {!bgOpen && bgTheme !== 'none' && (
                  <Text style={styles.accordionBadge}>{activeBgTheme.emoji} {activeBgTheme.label}</Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <TouchableOpacity onPress={() => setBgHelpVisible(true)} style={styles.bgHelpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.bgHelpBtnText}>ℹ️</Text>
                </TouchableOpacity>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{bgOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {bgOpen && (
              <>
                <View style={[styles.bgIntroCard, { borderLeftColor: C.primary }]}>
                  <Text style={styles.bgIntroText}>
                    {"Et si cette année ton message arrivait habillé de couleurs et d'animations ? 🎨 Confettis, pétales, flocons... choisis le fond qui correspond à l'occasion 💛✨"}
                  </Text>
                </View>
                {/* Chips thèmes */}
                <View style={styles.bgChipsRow}>
                  {BG_THEMES.map((theme) => (
                    <TouchableOpacity
                      key={theme.id}
                      style={[styles.bgChip, bgTheme === theme.id && styles.bgChipActive]}
                      onPress={() => setBgTheme(theme.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.bgChipEmoji}>{theme.emoji}</Text>
                      <Text style={[styles.bgChipLabel, bgTheme === theme.id && styles.bgChipLabelActive]}>
                        {theme.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Preview du fond animé */}
                {bgTheme !== 'none' && activeBgTheme.particles.length > 0 && (
                  <View style={[styles.bgPreview, { backgroundColor: activeBgTheme.color }]}>
                    <Text style={styles.bgPreviewLabel}>Aperçu de l'animation ✨</Text>
                    {activeBgTheme.particles.map((emoji, i) => (
                      <FloatingParticle key={i} emoji={emoji} delay={i * 700} x={20 + i * 55} />
                    ))}
                  </View>
                )}
              </>
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
                <Text style={styles.multiSectionTitle}>👥 Envoyer à plusieurs</Text>
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
                <View style={styles.multiContactList}>
                  {filteredContacts.slice(0, 20).map((c) => {
                    const selected = extraContacts.some((e) => e.id === c.id);
                    const dispName = c.name.trim().split(' ').length > 1
                      ? `${c.name.trim().split(' ').slice(1).join(' ')} ${c.name.trim().split(' ')[0]}`
                      : c.name;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.multiContactRow, selected && { backgroundColor: C.primaryContainer }]}
                        onPress={() => toggleExtraContact(c)}
                        activeOpacity={0.75}
                      >
                        <View style={[styles.multiContactAvatar, { backgroundColor: selected ? C.primary : Colors.surfaceContainerHighest }]}>
                          <Text style={[styles.multiContactAvatarText, { color: selected ? Colors.white : Colors.onSurfaceVariant }]}>
                            {dispName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.multiContactName, selected && { color: C.primary }]} numberOfLines={1}>
                            {dispName}
                          </Text>
                          {(c.phone || c.email) && (
                            <Text style={styles.multiContactSub} numberOfLines={1}>
                              {c.phone ?? c.email}
                            </Text>
                          )}
                        </View>
                        <View style={[styles.multiContactCheck, selected && { backgroundColor: C.primary, borderColor: C.primary }]}>
                          {selected && <Text style={styles.multiContactCheckMark}>✓</Text>}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {filteredContacts.length === 0 && (
                    <Text style={styles.multiNoResult}>Aucun contact trouvé</Text>
                  )}
                </View>
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
                        <Image source={{ uri: photoUri }} style={styles.photoOverlayImg} resizeMode="cover" />
                        <View style={styles.photoOverlayTextBox}>
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

        {/* ── Message musical ──────────────────────────── */}
        {!isEditing && format !== 'song' && (
          <View style={styles.musicSection}>
            <TouchableOpacity
              style={styles.musicSectionHeader}
              onPress={() => setMusicOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.musicSectionTitle}>🎵 Ajouter une musique</Text>
                {!musicOpen && musicAmbiance !== 'auto' && (
                  <Text style={styles.accordionBadge}>
                    {MUSIC_AMBIANCES.find((a) => a.id === musicAmbiance)?.emoji}{' '}
                    {MUSIC_AMBIANCES.find((a) => a.id === musicAmbiance)?.label}
                  </Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <TouchableOpacity onPress={() => setMusicHelpVisible(true)} style={styles.musicHelpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.musicHelpBtnText}>ℹ️</Text>
                </TouchableOpacity>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{musicOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {musicOpen && (
              <>
                <View style={[styles.musicIntroCard, { borderLeftColor: C.primary }]}>
                  <Text style={styles.musicIntroText}>
                    {"La musique a ce pouvoir unique de décupler les émotions 🎵 Et si tes mots avaient leur propre bande son ? Choisis une ambiance et transforme ton message en une véritable expérience sensorielle — parce qu'un message accompagné d'une belle mélodie touche encore plus fort 💛✨"}
                  </Text>
                </View>
                {/* Chips ambiance */}
                <View style={styles.musicChipsRow}>
                  {MUSIC_AMBIANCES.map((am) => (
                    <TouchableOpacity
                      key={am.id}
                      style={[styles.musicChip, musicAmbiance === am.id && styles.musicChipActive]}
                      onPress={() => setMusicAmbiance(am.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.musicChipEmoji}>{am.emoji}</Text>
                      <Text style={[styles.musicChipLabel, musicAmbiance === am.id && styles.musicChipLabelActive]}>
                        {am.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Note bientôt */}
                <Text style={styles.musicComingSoon}>
                  🔔 Bientôt — ton proche entendra la mélodie dès l'ouverture du message !
                </Text>
              </>
            )}
          </View>
        )}

        {/* ── Message vocal (TTS ElevenLabs) ───────────── */}
        {!isEditing && (
          <View style={styles.ttsSection}>
            <TouchableOpacity
              style={styles.ttsSectionHeader}
              onPress={() => setTtsOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.accordionLeft}>
                <Text style={styles.ttsSectionTitle}>🎙️ Message vocal</Text>
                {!ttsOpen && (
                  <Text style={styles.accordionBadge}>
                    {tts.isReady
                      ? '🎙️ Vocal prêt'
                      : `${TTS_VOICES.find((v) => v.key === ttsVoiceKey)?.emoji ?? ''} ${TTS_VOICES.find((v) => v.key === ttsVoiceKey)?.label ?? ''}`}
                  </Text>
                )}
              </View>
              <View style={styles.accordionRight}>
                <TouchableOpacity onPress={() => setTtsHelpVisible(true)} style={styles.ttsHelpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.ttsHelpBtnText}>ℹ️</Text>
                </TouchableOpacity>
                <Text style={[styles.accordionArrow, { color: C.primary }]}>{ttsOpen ? '▾' : '▸'}</Text>
              </View>
            </TouchableOpacity>
            {ttsOpen && (
              <>
                <FeatureIntroCard
                  introText={"Les mots écrits touchent le cœur... mais les mots entendus touchent l'âme 🎙️ Et si cette année tu allais plus loin qu'un simple message texte ? Transforme tes mots en voix et offre à tes proches une attention vocale unique — parce que certains messages méritent d'être entendus et jamais oubliés 💛✨"}
                  modeEmploiLines={[
                    "🎙️ Génère ou saisis ton message texte comme d'habitude",
                    "✨ Choisis ta voix parmi les 4 disponibles",
                    "💫 Ton message est transformé en audio en quelques secondes",
                    "🎧 Écoute le résultat et réajuste si besoin avant d'envoyer",
                    "📲 Partage l'audio via WhatsApp, SMS, email ou toute autre appli 💛✨",
                  ]}
                />
                {/* Sélecteur de voix */}
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
                {/* Bouton générer */}
                {!tts.isReady && (
                  <TouchableOpacity
                    style={[styles.ttsGenerateBtn, { backgroundColor: C.primary }, tts.isLoading && { opacity: 0.6 }]}
                    onPress={() => {
                      if (!savedMessageId || !generatedContent.trim()) return;
                      tts.generate(savedMessageId, generatedContent.trim(), ttsVoiceKey);
                    }}
                    disabled={tts.isLoading || !savedMessageId}
                    activeOpacity={0.85}
                  >
                    {tts.isLoading
                      ? <ActivityIndicator size="small" color={Colors.white} />
                      : <Text style={styles.ttsGenerateBtnText}>🎙️ Transformer en vocal</Text>}
                  </TouchableOpacity>
                )}
                {/* Erreur */}
                {tts.isFailed && (
                  <View style={styles.ttsErrorCard}>
                    <Text style={styles.ttsErrorText}>⚠️ La génération a échoué. Vérifiez votre connexion et réessayez.</Text>
                    <TouchableOpacity onPress={() => tts.reset()}>
                      <Text style={[styles.ttsErrorRetry, { color: C.primary }]}>↺ Réessayer</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* Lecteur audio TTS */}
                {tts.isReady && tts.ttsUrl && (
                  <>
                    <TTSPlayer ttsUrl={tts.ttsUrl} />
                    <TouchableOpacity
                      style={styles.ttsRegenBtn}
                      onPress={() => tts.reset()}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.ttsRegenBtnText, { color: C.primary }]}>↺ Changer de voix</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
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

            {/* Éditer manuellement */}
            <TouchableOpacity style={styles.editPromptBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editPromptText}>✏️ Modifier moi-même le texte</Text>
            </TouchableOpacity>

            <Text style={styles.readySub}>
              Ou choisis simplement un mode d'envoi ci-dessous pour l'expédier tel quel. 🚀
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

        {/* ── Envoyer comme carte postale ───────────────── */}
        {generatedContent.trim().length >= 10 && (
          <TouchableOpacity
            style={styles.postcardBtn}
            onPress={() =>
              router.push({
                pathname: '/(app)/postcard/index',
                params: {
                  contactId: contactId ?? undefined,
                  message: generatedContent.trim(),
                },
              } as never)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.postcardBtnEmoji}>💌</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.postcardBtnTitle}>Envoyer comme carte postale</Text>
              <Text style={styles.postcardBtnSub}>Imprimée et expédiée en 5–7 jours — 3,49 €</Text>
            </View>
            <Text style={[styles.postcardBtnArrow, { color: '#9C27B0' }]}>›</Text>
          </TouchableOpacity>
        )}

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
              { title: 'Choisir un style', body: "Fais défiler les 8 styles disponibles et clique sur celui qui te plaît. L'aperçu du message se met à jour instantanément ✨" },
              { title: 'Régler la taille', body: "S = petit, M = normal, L = grand. La taille s'adapte aussi bien au message texte qu'aux chansons et poèmes." },
              { title: 'Activer l\'italique', body: "Le bouton I met ton message en italique — idéal pour les messages élégants ou poétiques 💛" },
              { title: 'Ce que reçoit ton proche', body: "Le style d'écriture choisi est appliqué automatiquement sur la page web que ton proche reçoit via le lien partagé." },
              { title: 'Bon à savoir 💡', body: "Certains styles (Comic, Vintage) sont très marqués — réserve-les pour les messages légers ou humoristiques. Pour l'émotion, préfère Manuscrit élégant ou Romantique 💛" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Fond animé */}
      <Modal visible={bgHelpVisible} transparent animationType="fade" onRequestClose={() => setBgHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setBgHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le fond animé ? 🎨</Text>
              <TouchableOpacity onPress={() => setBgHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Choisir un thème', body: "Sélectionne le thème qui correspond à ton occasion : 🎂 Anniversaire=confettis | 🌸 Pétales=romantique | ❄️ Flocons=hiver/Noël | 💝 Cœurs=amour | ⭐ Étoiles=célébration. Auto IA sélectionne automatiquement !" },
              { title: 'Aperçu en temps réel', body: "L'aperçu apparaît directement dans l'écran de composition — tu vois exactement l'ambiance créée avant d'envoyer ✨" },
              { title: 'Ce que reçoit ton proche', body: "Le fond animé s'affiche automatiquement lorsque ton proche ouvre le lien du message — confettis, pétales ou flocons selon l'occasion 💛" },
              { title: 'Bon à savoir 💡', body: "Si musique ajoutée, démarre en même temps que le fond. Bouton Couper le son 🔇 disponible pour ton proche." },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Message musical */}
      <Modal visible={musicHelpVisible} transparent animationType="fade" onRequestClose={() => setMusicHelpVisible(false)}>
        <TouchableOpacity
          style={styles.helpModalOverlay}
          activeOpacity={1}
          onPress={() => setMusicHelpVisible(false)}
        >
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le message musical ? 🎵</Text>
              <TouchableOpacity onPress={() => setMusicHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Ajouter une musique', body: "Appuie sur Ajouter une musique — c'est optionnel, tu peux très bien envoyer sans !" },
              { title: 'Choisir ton ambiance', body: "Explore les ambiances disponibles et sélectionne celle qui correspond à ton message et à l'occasion. Ou laisse Claude AI choisir automatiquement avec Auto IA 🤖" },
              { title: 'Ce que reçoit ton proche', body: "Lorsque ton proche ouvre le lien du message, la mélodie démarre automatiquement en fond sonore pour une véritable expérience émotionnelle. Un bouton Couper le son 🔇 est disponible 💛" },
              { title: 'Bon à savoir 💡', body: "Toutes les mélodies sont libres de droits. Un bouton discret permettra à ton proche de couper le son 🔇 si besoin !" },
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
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryContainer },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
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
    width: 36,
    height: 36,
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
    fontSize: Typography.sm,
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
    textAlign: 'center',
  },

  // ── Inline completion ──────────────────────────────────────────────────────
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
  ideasTemplateCta: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
    marginTop: 2,
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
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: Spacing[5],
    marginTop: Spacing[3],
  },
  regenBtn: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    paddingVertical: 15,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    alignItems: 'center',
  },
  regenBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
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

  groupSignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    padding: Spacing[3],
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
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
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
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
  },
  recipientSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipientSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
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
    gap: 10,
  },
  sigSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: Spacing[4],
    gap: 10,
  },
  bgSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: Spacing[4],
    gap: 10,
  },
  multiSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderRadius: Radii.lg,
    overflow: 'hidden',
    height: 200,
  },
  photoOverlayImg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    gap: 10,
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
  musicComingSoon: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  // ── Message vocal (TTS) ────────────────────────────────────────────────────
  ttsSection: {
    marginHorizontal: Spacing[4],
    marginBottom: 16,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 12,
    ...Shadows.sm,
  },
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
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  ttsVoicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ttsVoiceChip: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.white,
    minWidth: 76,
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

  ttsGenerateBtn: {
    borderRadius: Radii.full,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ttsGenerateBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

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
  });
}
