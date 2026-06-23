import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
  Alert,
  Keyboard,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import i18n from '../../../src/i18n';
import { useContacts, useContact, useMyPets } from '../../../src/hooks/useContacts';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { saveMessage } from '../../../src/services/messages.service';
import { supabase } from '../../../src/services/supabase';
import { useAuthStore } from '../../../src/stores/authStore';
import { getAge } from '../../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { useTablet } from '../../../src/hooks/useTablet';
import { HelpModal } from '../../../src/components/ui/HelpModal';
import { PremiumGateModal } from '../../../src/components/ui/PremiumGateModal';
import type { Relation } from '../../../src/types/models';
import type { MessageFormat, MessageTone } from '../../../src/types/models';
import type { PersonalityTag, PetPersonalityTag, DogPersonalityTag, CatPersonalityTag, Occasion } from '../../../src/stores/createStore';
import { BIRTHDAY_GROUPS, BIRTHDAY_CATEGORY_META, type BirthdayCategory } from '../../../src/constants/birthdayMessages';
import { YOUTH_GRADUATION_LIBRARY, YOUTH_FIRSTJOB_LIBRARY } from '../../../src/constants/youthMessages';
import { FROM_CHILD_BIRTHDAY, FROM_CHILD_NAMEDAY } from '../../../src/constants/fromChildMessages';
import { useCardTemplates } from '../../../src/hooks/useCards';
import { CardThumbnail } from '../../../src/components/cards/CardThumbnail';
import { FETE_GROUPS, type FeteSubGroup } from '../../../src/constants/feteMessages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Occasion definitions ──────────────────────────────────────────────────────

const OCCASIONS: { value: Occasion; label: string; emoji: string; color: string }[] = [
  { value: 'birthday',   label: 'Anniversaire',   emoji: '🎁', color: '#9b6bb5' },
  { value: 'nameday',    label: 'Bonne Fête',     emoji: '🌸', color: '#e88fa3' },
  { value: 'wedding',    label: 'Mariage',        emoji: '💍', color: '#c9a8e0' },
  { value: 'engagement', label: 'Fiançailles',    emoji: '💎', color: '#E91E63' },
  { value: 'birth',      label: 'Naissance',      emoji: '👶', color: '#fdd34d' },
  { value: 'baptism',    label: 'Baptême',        emoji: '🕊️', color: '#90CAF9' },
  { value: 'communion',  label: 'Communion',      emoji: '✝️', color: '#A5D6A7' },
  { value: 'graduation', label: 'Diplôme',        emoji: '🎓', color: '#4CAF50' },
  { value: 'promotion',  label: 'Promotion',      emoji: '📈', color: '#2196F3' },
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

const SUPPORT_SUBTYPES: { value: NonNullable<import('../../../src/stores/createStore').OccasionExtras['supportType']>; label: string; emoji: string }[] = [
  { value: 'bereavement', label: 'Deuil & condoléances', emoji: '🕊️' },
  { value: 'illness',     label: 'Maladie',        emoji: '🌿' },
  { value: 'breakup',     label: 'Séparation',     emoji: '💔' },
  { value: 'hardtime',    label: 'Période difficile', emoji: '🧠' },
  { value: 'encouragement', label: 'Encouragement', emoji: '💪' },
];

/** Returns true if the occasion uses an "age" field */
function hasAge(occasion: Occasion): boolean {
  return occasion === 'birthday' || occasion === 'graduation';
}

/** Returns true if the "mode J'ai oublié" makes sense */
function hasLateMode(occasion: Occasion): boolean {
  return occasion === 'birthday' || occasion === 'nameday';
}

/** Returns true if personality tags make sense */
function hasPersonality(occasion: Occasion): boolean {
  return occasion === 'birthday' || occasion === 'nameday' || occasion === 'wedding' || occasion === 'custom';
}

/** Returns true if this is a support/difficult moment occasion */
function isSupportOccasion(occasion: Occasion): boolean {
  return occasion === 'support';
}

/** Occasions religieuses/solennelles : pas d'humour ni de blague */
function isSolemnOccasion(occasion: Occasion): boolean {
  return occasion === 'baptism' || occasion === 'communion';
}


const RELATION_LABELS: Record<string, string> = {
  best_friend: 'Meilleur·e ami·e',
  friend: 'Ami·e',
  family: 'Famille',
  partner: 'Amour',
  colleague: 'Collègue',
  other: 'Connaissance',
  pet: 'Animal',
  child_of: 'Enfant',
};

function getRelationLabel(c: { relation: string; child_gender?: string | null; child_parent_contact_id?: string | null; child_parent_name?: string | null; pet_owner_name?: string | null }, allContacts: { id: string; name: string; civilite?: string | null; partner_contact_id?: string | null }[]): string {
  if (c.relation === 'pet') return c.pet_owner_name ? `Animal de ${c.pet_owner_name}` : 'Animal';
  if (c.relation !== 'child_of') return RELATION_LABELS[c.relation] ?? c.relation;
  const gender = c.child_gender;
  const role = gender === 'female' ? 'Fille de' : gender === 'male' ? 'Fils de' : 'Enfant de';
  const parent = allContacts.find((p) => p.id === c.child_parent_contact_id);
  if (!parent) return c.child_parent_name ? `${role} ${c.child_parent_name}` : 'Enfant';
  const partner = allContacts.find((p) => p.id === (parent as any).partner_contact_id);
  if (!partner) return `${role} ${parent.name}`;
  const isMale = parent.civilite === 'M.';
  const [p1, p2] = isMale ? [parent, partner] : [partner, parent];
  return p1.name === p2.name
    ? `${role} ${p1.name[0]}. et ${p2.name[0]}. ${p1.name}`
    : `${role} ${p1.name} et ${p2.name}`;
}

const RELATIONS: { value: Relation; label: string; emoji: string }[] = [
  { value: 'colleague', label: 'Collègue', emoji: '💼' },
  { value: 'partner', label: 'Amour', emoji: '💑' },
  { value: 'best_friend', label: 'Meilleur·e ami·e', emoji: '💜' },
  { value: 'friend', label: 'Ami·e', emoji: '😊' },
  { value: 'family', label: 'Famille', emoji: '👨‍👩‍👧' },
  { value: 'other', label: 'Connaissance', emoji: '👤' },
];

const PERSONALITY_TAGS: { value: PersonalityTag; label: string }[] = [
  { value: 'drôle', label: 'Drôle' }, { value: 'calme', label: 'Calme' },
  { value: 'passionné', label: 'Passionné·e' }, { value: 'créatif', label: 'Créatif·ve' },
  { value: 'sportif', label: 'Sportif·ve' }, { value: 'gourmand', label: 'Gourmand·e' },
  { value: 'voyageur', label: 'Voyageur·se' }, { value: 'geek', label: 'Geek' },
];

const DOG_TAGS: { value: DogPersonalityTag; label: string; emoji: string }[] = [
  { value: 'câlin',        label: 'Câlin',           emoji: '🤗' },
  { value: 'joueur',       label: 'Joueur',          emoji: '🎾' },
  { value: 'gourmand',     label: 'Gourmand',        emoji: '🍖' },
  { value: 'peureux',      label: 'Peureux',         emoji: '😨' },
  { value: 'protecteur',   label: 'Protecteur',      emoji: '🛡️' },
  { value: 'bavard',       label: 'Bavard',          emoji: '🗣️' },
  { value: 'énergique',    label: 'Énergique',       emoji: '⚡' },
  { value: 'canapé-addict',label: 'Canapé-addict',  emoji: '🛋️' },
  { value: 'chasseur',     label: 'Chasseur',        emoji: '🐿️' },
  { value: 'fidèle',       label: 'Fidèle',          emoji: '❤️' },
];

const CAT_TAGS: { value: CatPersonalityTag; label: string; emoji: string }[] = [
  { value: 'royal',             label: 'Royal',              emoji: '👑' },
  { value: 'indifférent',       label: 'Indifférent',        emoji: '😑' },
  { value: 'destructeur',       label: 'Destructeur',        emoji: '💥' },
  { value: 'chasseur nocturne', label: 'Chasseur nocturne',  emoji: '🌙' },
  { value: 'gourmet difficile', label: 'Gourmet difficile',  emoji: '🍽️' },
  { value: 'câlin capricieux',  label: 'Câlin capricieux',   emoji: '😽' },
  { value: 'contemplatif',      label: 'Contemplatif',       emoji: '🔮' },
  { value: 'jaloux',            label: 'Jaloux',             emoji: '😾' },
  { value: 'acrobate',          label: 'Acrobate',           emoji: '🤸' },
  { value: 'mystérieux',        label: 'Mystérieux',         emoji: '✨' },
];

const TONES: { value: MessageTone; label: string; emoji: string }[] = [
  { value: 'humorous', label: 'Humoristique', emoji: '😂' },
  { value: 'touching', label: 'Touchant', emoji: '🥹' },
  { value: 'playful', label: 'Chaleureux', emoji: '🤗' },
  { value: 'poetic', label: 'Poétique', emoji: '🌙' },
  { value: 'childlike', label: 'Enfantin ✨', emoji: '🧸' },
];

const FORMATS: { value: MessageFormat; label: string; emoji: string }[] = [
  { value: 'song', label: 'Chanson', emoji: '🎵' },
  { value: 'poem', label: 'Poème', emoji: '✍️' },
  { value: 'message', label: 'Message', emoji: '💬' },
];

// ── Langues disponibles pour le message ──────────────────────────────────────
const MESSAGE_LANGUAGES = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'Anglais' },
  { code: 'de', flag: '🇩🇪', label: 'Allemand' },
  { code: 'es', flag: '🇪🇸', label: 'Espagnol' },
  { code: 'it', flag: '🇮🇹', label: 'Italien' },
  { code: 'pt', flag: '🇵🇹', label: 'Portugais' },
];

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text, large }: { text: string; large?: boolean }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return <Text style={[styles.sectionLabel, large && styles.sectionLabelLarge]}>{text}</Text>;
}

// ── Extra fields per occasion ─────────────────────────────────────────────────
function ExtraFields({ color }: { color: string }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { occasion, extras, setExtras, contactName } = useCreateStore();
  const bg = color + '18'; // fond très léger de la couleur de l'occasion

  const wrap = (children: React.ReactNode) => (
    <View style={{ backgroundColor: bg, borderRadius: 12, padding: 12, marginTop: 8, marginBottom: 8, borderWidth: 1.5, borderColor: color }}>
      {children}
    </View>
  );

  switch (occasion) {
    case 'wedding':
      return wrap(
        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }]}
            value={extras.partner1Name ?? ''}
            onChangeText={(v) => setExtras({ partner1Name: v })}
            placeholder="Prénom marié·e 1"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
          <Text style={styles.andSep}>💍</Text>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }]}
            value={extras.partner2Name ?? ''}
            onChangeText={(v) => setExtras({ partner2Name: v })}
            placeholder="Prénom marié·e 2"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
        </View>
      );

    case 'birth':
      return wrap(
        <>
          <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)', marginBottom: 8 }]}
            value={extras.babyName ?? ''}
            onChangeText={(v) => setExtras({ babyName: v })}
            placeholder="👶 Prénom du bébé (optionnel)"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)', marginBottom: 8 }]}
            value={extras.parent1Name ?? ''}
            onChangeText={(v) => {
              const p2 = extras.parent2Name?.trim() ?? '';
              setExtras({ parent1Name: v, parentNames: [v.trim(), p2].filter(Boolean).join(' et ') });
            }}
            placeholder="👩 Prénom du parent 1 (optionnel)"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
            value={extras.parent2Name ?? ''}
            onChangeText={(v) => {
              const p1 = extras.parent1Name?.trim() ?? '';
              setExtras({ parent2Name: v, parentNames: [p1, v.trim()].filter(Boolean).join(' et ') });
            }}
            placeholder="👨 Prénom du parent 2 (optionnel)"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
        </>
      );

    case 'graduation':
      return wrap(
        <TextInput
          style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
          value={extras.diplomaLabel ?? ''}
          onChangeText={(v) => setExtras({ diplomaLabel: v })}
          placeholder="🎓 Diplôme / réussite (ex: Master 2, bac...)"
          placeholderTextColor={Colors.outlineVariant}
        />
      );

    case 'promotion':
      return wrap(
        <TextInput
          style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
          value={extras.newJobTitle ?? ''}
          onChangeText={(v) => setExtras({ newJobTitle: v })}
          placeholder="📈 Nouveau poste / entreprise (optionnel)"
          placeholderTextColor={Colors.outlineVariant}
        />
      );

    case 'thanks':
      return wrap(
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
          value={extras.thankReason ?? ''}
          onChangeText={(v) => setExtras({ thankReason: v })}
          placeholder="🙏 Motif du remerciement (optionnel)"
          placeholderTextColor={Colors.outlineVariant}
          multiline
          numberOfLines={3}
        />
      );

    case 'support':
      return wrap(
        <>
          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 13, color: '#5C8FA8', marginBottom: 8 }}>
            De quoi s'agit-il ?
          </Text>
          <View style={styles.chipRow}>
            {SUPPORT_SUBTYPES.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.chip, extras.supportType === s.value && { backgroundColor: '#5C8FA820', borderColor: '#5C8FA8' }]}
                onPress={() => setExtras({ supportType: extras.supportType === s.value ? undefined : s.value })}
              >
                <Text style={styles.chipEmoji}>{s.emoji}</Text>
                <Text style={[styles.chipLabel, extras.supportType === s.value && { color: '#5C8FA8', fontFamily: 'BeVietnamPro_700Bold' }]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      );

    case 'custom':
      return wrap(
        <TextInput
          style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
          value={extras.customOccasionLabel ?? ''}
          onChangeText={(v) => setExtras({ customOccasionLabel: v })}
          placeholder="🎯 Décris l'occasion..."
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="sentences"
        />
      );

    default:
      return null;
  }
}

// ── Contact chooser (étape initiale) ─────────────────────────────────────────
function ContactChooser({ onExisting, onNew }: { onExisting: () => void; onNew: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { isTablet } = useTablet();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Créer un message ✨</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={[styles.chooserContent, isTablet && styles.chooserContentTablet]}>
        {/* Hero */}
        <LinearGradient colors={['#9b6bb5', '#7C3AED', '#4A148C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.chooserHero}>
          <Text style={styles.chooserHeroEmoji}>✨</Text>
          <Text style={styles.chooserHeroTagline}>Dis-lui ce que tu ressens — on s'occupe du reste 💛</Text>
        </LinearGradient>

        <Text style={styles.chooserTitle}>Pour qui est ce message ?</Text>
        <Text style={styles.chooserSub}>Choisis un contact existant ou crée-en un nouveau</Text>

        <TouchableOpacity style={styles.chooserBtn} onPress={onExisting} activeOpacity={0.85}>
          <Text style={styles.chooserBtnEmoji}>👥</Text>
          <View style={styles.chooserBtnText}>
            <Text style={styles.chooserBtnTitle}>Un contact existant</Text>
            <Text style={styles.chooserBtnSub}>Choisir parmi mes contacts</Text>
          </View>
          <Text style={styles.chooserArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.chooserBtn, styles.chooserBtnSecondary]} onPress={onNew} activeOpacity={0.85}>
          <Text style={styles.chooserBtnEmoji}>✚</Text>
          <View style={styles.chooserBtnText}>
            <Text style={[styles.chooserBtnTitle, { color: Colors.primary }]}>Un nouveau contact</Text>
            <Text style={[styles.chooserBtnSub, { color: Colors.onSurfaceVariant }]}>Créer le contact puis le message</Text>
          </View>
          <Text style={styles.chooserArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Contact list picker ───────────────────────────────────────────────────────
function ContactListPicker({ onSelect, onBack }: { onSelect: (id: string, name: string, rel: Relation) => void; onBack: () => void }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { isTablet } = useTablet();
  const { data: contacts = [] } = useContacts();
  const [search, setSearch] = useState('');
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Choisir un contact</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={[{ padding: Spacing[4] }, isTablet && styles.chooserContentTablet]}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher..."
          placeholderTextColor={Colors.outlineVariant}
          autoFocus
        />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={isTablet ? styles.chooserContentTablet : undefined}>
        {filtered.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.contactRow}
            onPress={() => onSelect(c.id, c.name, c.relation)}
          >
            <View style={styles.contactAvatar}>
              <Text style={{ fontSize: 16, color: Colors.white }}>{c.name[0]?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactRowName}>{c.name}</Text>
              <Text style={styles.contactRowRelation}>{getRelationLabel(c as any, contacts as any[])}</Text>
            </View>
            <Text style={styles.chooserArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Card picker pour le flow "De la part de l'enfant" ────────────────────────
function CardPickerForChild({ occasion, contactId, contactName, senderName }: {
  occasion: string; contactId: string | null; contactName: string; senderName: string;
}) {
  const router = useRouter();
  const { data: cards = [], isLoading } = useCardTemplates(occasion);
  const profile = useAuthStore((s) => s.profile);
  const isPremium = profile?.plan !== 'free';
  const [lockedCardGateVisible, setLockedCardGateVisible] = useState(false);
  if (isLoading || cards.length === 0) return null;
  return (
    <View style={{ marginTop: 20, gap: 10 }}>
      <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: Colors.onSurface }}>
        🎴 Accompagne avec une carte
      </Text>
      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18 }}>
        {`"De la part de ${senderName}" sera automatiquement inscrit sur la carte.`}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
        {cards.slice(0, 8).map((card) => (
          <View key={card.id} style={{ width: 110 }}>
            <CardThumbnail
              template={card}
              isPremium={isPremium}
              onPress={() => router.push({
                pathname: '/(app)/cards/[id]',
                params: { id: card.id, contactName, ...(contactId ? { contactId } : {}), senderName },
              } as never)}
              onPressLocked={() => setLockedCardGateVisible(true)}
            />
          </View>
        ))}
      </ScrollView>
      <PremiumGateModal
        visible={lockedCardGateVisible}
        onClose={() => setLockedCardGateVisible(false)}
        emoji="⭐"
        title="Cette carte est exclusive Premium ⭐"
        description="Débloque cette carte animée et toutes les autres créations exclusives en passant en Premium — pour des messages encore plus mémorables."
      />
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CreateScreen() {
  const router = useRouter();
  const { isTablet } = useTablet();
  const C = useColors();
  const user = useAuthStore((s) => s.user);
  const myProfile = useAuthStore((s) => s.profile);
  const { data: contacts = [] } = useContacts();
  const myPets = useMyPets();
  const { generate, isPending } = useAIGenerate(() => { bumpSessionKey(); router.push('/(app)/create/preview' as never); });

  const {
    contactId, contactName, relation, familySubRelation, petSubRelation, occasion, age,
    personalityTags, petPersonalityTags, memories, lateMode, format, tone, extras, musicVoice, setMusicVoice,
    messageLanguage, setMessageLanguage,
    setContact, setFavouriteColor, setFamilySubRelation, setPetSubRelation, setOccasion, setAge,
    togglePersonalityTag, togglePetPersonalityTag,
    setMemories, setLateMode, setFormat, setTone, setExtras,
    setGeneratedContent, setSavedMessageId,
    setFontStyle, setFontSize, setIsItalic,
    generationError, generatedContent, reset, bumpSessionKey,
  } = useCreateStore();

  const { contactId: contactIdParam, prefillMessage, occasion: occasionParam, fromGuide, childName: childNameParam, childAge: childAgeParam, childFromName: childFromNameParam, childFromAge: childFromAgeParam, toTemplates } = useLocalSearchParams<{ contactId?: string; prefillMessage?: string; occasion?: string; fromGuide?: string; childName?: string; childAge?: string; childFromName?: string; childFromAge?: string; toTemplates?: string }>();

  const effectiveContactId = contactId ?? contactIdParam ?? null;
  const contactPets = useMemo(() => {
    if (!effectiveContactId) return [];
    const owner = contacts.find((c) => c.id === effectiveContactId);
    return contacts.filter((c) =>
      c.relation === 'pet' && (
        (c as any).pet_owner_contact_id === effectiveContactId ||
        (owner != null && (c as any).pet_owner_name === owner.name)
      )
    );
  }, [contacts, effectiveContactId]);
  const childName     = childNameParam ?? null;
  const childAge      = childAgeParam ? parseInt(childAgeParam) : null;
  const childFromName = childFromNameParam ?? null;
  const childFromAge  = childFromAgeParam ? parseInt(childFromAgeParam) : null;

  // Récupère le contact depuis le cache React Query (déjà chargé depuis la fiche contact)
  const { data: contactFromParam } = useContact(contactIdParam ?? '');

  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [manualCivilite, setManualCivilite] = useState<'M.' | 'Mme' | null>(null);
  const [ageInput, setAgeInput] = useState('');
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [petPickerDirection, setPetPickerDirection] = useState<'to' | 'from' | 'from_to_third' | null>(null);
  const [petPickerFreeThird, setPetPickerFreeThird] = useState(false);
  const [ttsMode, setTtsMode] = useState(false);
  // Si on arrive depuis une fiche contact, on va directement au formulaire
  const [step, setStep] = useState<'choose' | 'pick' | 'form' | 'ai-guide' | 'template-occasion' | 'template-birthday-category' | 'template-birthday-subgroup' | 'template-birthday-messages' | 'template-fete-subgroup' | 'template-fete-messages' | 'template-support-subtype' | 'template-list' | 'template-from-child'>(
    () => toTemplates ? 'template-occasion' : contactIdParam ? 'form' : 'choose'
  );
  const [birthdayCategory, setBirthdayCategory] = useState<BirthdayCategory | null>(null);
  const [birthdaySubGroupId, setBirthdaySubGroupId] = useState<string | null>(null);
  const [feteSubGroupId, setFeteSubGroupId] = useState<string | null>(null);
  const [templateFeteLongueur, setTemplateFeteLongueur] = useState<'moyen' | 'long'>('moyen');
  const [templateBirthdayStyle, setTemplateBirthdayStyle] = useState<string>('chaleureux');
  const [writeMode, setWriteMode] = useState<'ai' | 'manual' | 'template' | null>(null);
  const [templateOccasion, setTemplateOccasion] = useState<Occasion>('birthday');
  const [templateTon, setTemplateTon] = useState<'tu' | 'vous'>('tu');
  const [templateLongueur, setTemplateLongueur] = useState<'court' | 'moyen' | 'long'>('court');
  const [templateSupportType, setTemplateSupportType] = useState<string | null>(null);
  const [hasPet, setHasPet] = useState(false);
  const [templates, setTemplates] = useState<{ id: string; title: string; content: string }[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [creatingTemplateContent, setCreatingTemplateContent] = useState<string | null>(null);
  const myAge = myProfile?.birthday ? getAge(myProfile.birthday, false) : null;
  const iAmAdo = myAge !== null && myAge >= 13 && myAge <= 25;
  const [templatePreview, setTemplatePreview] = useState<{ display: string; raw: string } | null>(null);

  // Réinitialiser store ET états locaux à chaque fois que l'écran est affiché
  useFocusEffect(useCallback(() => {
    // Retour depuis preview avec demande d'accès bibliothèque complète
    const { jumpToTemplates, setJumpToTemplates } = useCreateStore.getState();
    if (jumpToTemplates) {
      setJumpToTemplates(false);
      setBirthdayCategory(null);
      setBirthdaySubGroupId(null);
      setStep('template-occasion');
      return;
    }
    // Toujours remettre les styles à zéro (fontStyle, fontSize, isItalic)
    setFontStyle('standard');
    setFontSize('md');
    setIsItalic(false);
    // Arrivée depuis une fiche contact : laisser useEffect gérer l'initialisation
    if (contactIdParam) return;
    reset();
    setMessageLanguage(i18n.language as import('../../../src/types/models').AppLanguage ?? 'fr');
    setFirstNameInput('');
    setLastNameInput('');
    setAgeInput('');
    setShowContactPicker(false);
    setWriteMode(null);
    setHasPet(false);
    setTemplates([]);
    setTemplateSupportType(null);
    setStep('choose');
  }, [reset, setFontStyle, setFontSize, setIsItalic, contactIdParam]));

  // Pré-remplir le formulaire dès que le contact est disponible (cache ou réseau)
  useEffect(() => {
    if (!contactIdParam || !contactFromParam) return;
    const contact = contactFromParam;
    // Animal → rediriger vers la fiche contact
    if (contact.relation === 'pet') {
      router.replace({ pathname: '/(app)/contact/[id]', params: { id: contact.id } } as never);
      return;
    }
    const parts = contact.name.trim().split(/\s+/);
    const firstParts = parts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w)));
    const lastParts  = parts.filter((w) =>   w === w.toUpperCase() && /[A-Z]/.test(w));
    const first = firstParts.join(' ') || parts[parts.length - 1] || '';
    const last  = lastParts.join(' ') || '';
    setFirstNameInput(first);
    setLastNameInput(last);
    setContact(contact.id, contact.name, contact.relation, contact.phone ?? null, contact.email ?? null, contact.civilite ?? null);
    if (contact.preferred_language) setMessageLanguage(contact.preferred_language);
    if (contact.relation === 'family' && contact.notes) {
      const linkMatch = contact.notes.match(/^Lien\s*:\s*(.+?)(\n|$)/);
      if (linkMatch) setFamilySubRelation(linkMatch[1].trim());
    }
    if (contact.birthday) {
      const computed = getAge(contact.birthday, false);
      if (computed !== null && computed >= 0) { setAgeInput(String(computed)); setAge(computed); }
    }
    if (contact.personality_tags?.length) {
      const { personalityTags: current } = useCreateStore.getState();
      contact.personality_tags.forEach((tag) => {
        if (!current.includes(tag as PersonalityTag)) togglePersonalityTag(tag as PersonalityTag);
      });
    }
    setFavouriteColor(contact.favourite_color ?? null);

    if (prefillMessage) {
      setOccasion('birthday');
      setGeneratedContent(prefillMessage);
      bumpSessionKey();
      router.replace('/(app)/create/preview' as never);
      return;
    }

    if (occasionParam) setOccasion(occasionParam as Occasion);

    if (childNameParam) {
      setExtras({ childName: childNameParam, childAge: childAgeParam ? parseInt(childAgeParam) : undefined });
    }
    if (childFromNameParam) {
      setExtras({ childFromName: childFromNameParam, childFromAge: childFromAgeParam ? parseInt(childFromAgeParam) : undefined });
    }

    setStep(toTemplates ? 'template-occasion' : 'form');
  }, [contactIdParam, contactFromParam, prefillMessage, occasionParam, childNameParam, childAgeParam, childFromNameParam, childFromAgeParam, toTemplates]);

  // Charger les modèles filtrés par occasion + ton + longueur (+ style pour anniversaire)
  useEffect(() => {
    if (step !== 'template-list') return;
    // Pour "soutien", attendre que le sous-type soit sélectionné
    if (templateOccasion === 'support' && !templateSupportType) {
      setTemplates([]);
      return;
    }
    setTemplatesLoading(true);
    let query = supabase
      .from('message_templates')
      .select('id, title, content')
      .eq('occasion', templateOccasion)
      .eq('ton', templateTon)
      .eq('longueur', templateLongueur)
      .eq('is_system', true)
      .eq('is_manual_only', false);
    if (templateOccasion === 'support' && templateSupportType) {
      query = query.eq('support_type', templateSupportType);
    }
    if (templateOccasion === 'birthday') {
      query = query.eq('style', templateBirthdayStyle);
    }
    let cancelled = false;
    query
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (cancelled) return;
        setTemplates((data as { id: string; title: string; content: string }[]) ?? []);
        setTemplatesLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setTemplates([]);
        setTemplatesLoading(false);
      });
    return () => { cancelled = true; };
  }, [step, templateOccasion, templateTon, templateLongueur, templateSupportType, templateBirthdayStyle]);

  const handleTemplateSelect = async (content: string) => {
    if (!user) return;
    if (!contactId) {
      Alert.alert('Contact requis', 'Sélectionnez d\'abord un contact via l\'icône 👥.');
      return;
    }
    const firstName = firstNameInput.trim() || 'toi';
    const currentYear = new Date().getFullYear().toString();
    const filled = content
      .replace(/\{prenom\}/gi, firstName)
      .replace(/\{annee\}/gi, currentYear)
      .replace(/\r\n/g, '\n')
      .replace(/\n+/g, '\n\n')
      .replace(/([.!?…])[^\S\n]+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ\p{Emoji_Presentation}])/gu, '$1\n\n$2')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    try {
      setCreatingTemplateContent(content);
      const saved = await saveMessage(user.id, {
        contact_id: contactId,
        contact_name: combinedName(firstNameInput, lastNameInput),
        format: 'message',
        tone: 'playful',
        content: filled,
        relation,
      });
      setGeneratedContent(filled);
      setSavedMessageId(saved.id);
      bumpSessionKey();
      router.push({ pathname: '/(app)/create/preview', params: { fromTemplate: '1' } } as never);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible d\'utiliser ce modèle.');
    } finally {
      setCreatingTemplateContent(null);
    }
  };

  const selectedOccasion = OCCASIONS.find((o) => o.value === occasion)!;

  const firstNamePlaceholder: Record<Occasion, string> = {
    birthday: 'Ex: Marie', nameday: 'Ex: Jean', wedding: 'Ex: Sophie',
    engagement: 'Ex: Léa', birth: 'Ex: Sophie', baptism: 'Ex: Lucas',
    communion: 'Ex: Emma', graduation: 'Ex: Lucas', promotion: 'Ex: Camille',
    thanks: 'Ex: Marc', newyear: 'Ex: Famille', christmas: 'Ex: Famille',
    easter: 'Ex: Famille', valentines: 'Ex: Chéri(e)', mothersday: 'Ex: Maman',
    fathersday: 'Ex: Papa', halloween: 'Ex: Les enfants', retirement: 'Ex: Michel',
    support: 'Ex: Paul', greetings: 'Ex: Lucie', custom: 'Ex: Lucie',
  };

  // Formats et tonalités disponibles selon l'occasion
  const availableFormats = isSupportOccasion(occasion) || isSolemnOccasion(occasion)
    ? FORMATS.filter((f) => f.value === 'message' || f.value === 'poem')
    : FORMATS;

  const availableTones = isSupportOccasion(occasion) || isSolemnOccasion(occasion)
    ? TONES.filter((t) => t.value === 'touching' || t.value === 'poetic' || t.value === 'professional')
    : TONES;

  // Recaler format/tone si invalide pour l'occasion en cours
  useEffect(() => {
    if (isSupportOccasion(occasion) || isSolemnOccasion(occasion)) {
      if (format === 'song' || format === 'joke') setFormat('message');
      if (tone === 'humorous' || tone === 'playful') setTone('touching');
    }
  }, [occasion]);

  const combinedName = (fn: string, ln: string) =>
    [fn.trim(), ln.trim()].filter(Boolean).join(' ');

  const handleFirstNameChange = (text: string) => {
    setFirstNameInput(text);
    setContact(null, combinedName(text, lastNameInput), relation, null, null, manualCivilite);
  };

  const handleLastNameChange = (text: string) => {
    const upper = text.toUpperCase();
    setLastNameInput(upper);
    setContact(null, combinedName(firstNameInput, upper), relation, null, null, manualCivilite);
  };

  const handleAgeChange = (text: string) => {
    setAgeInput(text);
    const parsed = parseInt(text, 10);
    setAge(isNaN(parsed) ? null : parsed);
  };

  const handleContactSelect = (id: string, name: string, rel: Relation) => {
    // Animal → renvoyer vers la fiche contact qui affiche les 3 options animal
    if (rel === 'pet') {
      setShowContactPicker(false);
      router.push({ pathname: '/(app)/contact/[id]', params: { id } } as never);
      return;
    }
    const contact = contacts.find((c) => c.id === id);
    // Split name into first / last — gère les noms composés type "DESCOURVIERES FONTAINE Carine"
    const parts = name.trim().split(/\s+/);
    const firstParts = parts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w)));
    const lastParts  = parts.filter((w) =>   w === w.toUpperCase() && /[A-Z]/.test(w));
    const first = firstParts.join(' ') || parts[parts.length - 1] || '';
    const last  = lastParts.join(' ') || '';
    setFirstNameInput(first);
    setLastNameInput(last);
    setContact(id, name, rel, contact?.phone ?? null, contact?.email ?? null, contact?.civilite ?? null);
    // Auto-fill langue du message depuis la fiche contact
    if (contact?.preferred_language) {
      setMessageLanguage(contact.preferred_language);
    }
    // Auto-fill age from birthday
    if (contact?.birthday) {
      const computed = getAge(contact.birthday, false);
      if (computed !== null && computed >= 0) {
        setAgeInput(String(computed));
        setAge(computed);
      }
    }
    // Auto-fill personality tags from contact profile
    if (contact?.personality_tags?.length) {
      const { personalityTags: current } = useCreateStore.getState();
      contact.personality_tags.forEach((tag) => {
        if (!current.includes(tag as PersonalityTag)) togglePersonalityTag(tag as PersonalityTag);
      });
    }
    // Pré-remplir le lien de parenté famille depuis les notes
    if (contact?.relation === 'family' && contact.notes) {
      const linkMatch = contact.notes.match(/^Lien\s*:\s*(.+?)(\n|$)/);
      if (linkMatch) setFamilySubRelation(linkMatch[1].trim());
    }
    // Couleur préférée
    setFavouriteColor(contact?.favourite_color ?? null);
    setShowContactPicker(false);
    setStep('form');
  };

  const handleGenerate = () => { generate(); };

  const [isCreatingManual, setIsCreatingManual] = useState(false);

  const styles = useMemo(() => makeStyles(C), [C]);

  const handleWriteManually = async () => {
    if (!firstNameInput.trim() || !user) return;
    if (!contactId) {
      Alert.alert(
        'Contact requis',
        'Pour écrire un message, sélectionnez un contact existant via l\'icône 👥.',
      );
      return;
    }
    try {
      setIsCreatingManual(true);
      const manualFormat = format === 'song' ? 'message' : format;
      const saved = await saveMessage(user.id, {
        contact_id: contactId,
        contact_name: combinedName(firstNameInput, lastNameInput),
        format: manualFormat,
        tone,
        content: ' ',
        relation,
        memories: memories || null,
      });
      setGeneratedContent(' ');
      setSavedMessageId(saved.id);
      bumpSessionKey();
      router.push({ pathname: '/(app)/create/preview', params: { manualMode: '1' } } as never);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de créer le message.');
    } finally {
      setIsCreatingManual(false);
    }
  };

  if (step === 'choose') {
    return (
      <ContactChooser
        onExisting={() => setStep('pick')}
        onNew={() => router.push({ pathname: '/(app)/contacts/new', params: { resetKey: Date.now().toString() } } as never)}
      />
    );
  }

  if (step === 'pick') {
    return (
      <ContactListPicker
        onSelect={handleContactSelect}
        onBack={() => setStep('choose')}
      />
    );
  }

  // ── Page dédiée IA (mode apprentissage) ─────────────────────────────────────
  if (step === 'ai-guide') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('form')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>{ttsMode ? '🎙️ Message vocal' : '✨ Avec l\'IA'}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 120, gap: 16 }} keyboardShouldPersistTaps="handled">

          {/* ── Bandeau mode vocal ── */}
          {ttsMode && (
            <View style={{ backgroundColor: '#FFF1F7', borderRadius: 14, borderWidth: 1.5, borderColor: '#FBCFE8', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 28 }}>🎙️</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.base, color: '#BE185D' }}>Mode vocal activé</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#9D174D', lineHeight: 18, marginTop: 2 }}>
                  L'IA va rédiger ton message. Dans l'aperçu, tu pourras l'écouter lu par une voix IA 🎧
                </Text>
              </View>
            </View>
          )}

          {/* ── Intro IA ── */}
          <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 18, gap: 12, borderWidth: 1, borderColor: Colors.outlineVariant }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3EFFF', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>✨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, lineHeight: 24 }}>
                  L'IA écrit pour toi
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2 }}>
                  Un message unique, rien que pour ce moment
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '60' }} />

            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 21 }}>
              {'Trouver les bons mots, ce n\'est pas toujours facile. L\'IA analyse l\'occasion, la relation et le ton que tu choisis — et rédige un message personnalisé, sincère et prêt à envoyer. Toi, tu valides, tu retouches si tu veux, et tu envoies. 🚀'}
            </Text>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '60' }} />

            <View style={{ gap: 8 }}>
              {[
                { emoji: '🎯', text: 'Choisis l\'occasion et le ton ci-dessous' },
                { emoji: '💭', text: 'Ajoute un souvenir ou une anecdote pour un résultat encore plus personnel' },
                { emoji: '↺',  text: 'Régénère autant de fois que tu veux — c\'est gratuit !' },
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

          {/* Destinataire */}
          {firstNameInput ? (
            <View style={{ backgroundColor: '#F3EFFF', borderRadius: Radii.xl, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 24 }}>🎯</Text>
              <View>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>Message pour</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, color: '#7C3AED' }}>{firstNameInput}</Text>
              </View>
            </View>
          ) : null}

          {/* Occasion */}
          <View>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface, marginBottom: 10 }}>Pour quelle occasion ?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {OCCASIONS.slice(0, 8).map((o) => (
                <TouchableOpacity
                  key={o.value}
                  style={[styles.occasionBtn, occasion === o.value && { backgroundColor: o.color + '20', borderColor: o.color }]}
                  onPress={() => setOccasion(o.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                  <Text style={[styles.occasionLabel, occasion === o.value && { color: o.color, fontFamily: 'BeVietnamPro_700Bold' }]} numberOfLines={1}>
                    {o.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ton */}
          <View>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface, marginBottom: 10 }}>Quel ton ?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {TONES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.toneBtn, tone === t.value && styles.toneBtnActive]}
                  onPress={() => setTone(t.value)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontFamily: tone === t.value ? 'BeVietnamPro_700Bold' : 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: tone === t.value ? C.primary : Colors.onSurface }}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Souvenirs / contexte */}
          <View>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface, marginBottom: 6 }}>
              Un souvenir ou une anecdote ? <Text style={{ fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurfaceVariant }}>(facultatif)</Text>
            </Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              value={memories}
              onChangeText={setMemories}
              placeholder="Ex: On a voyagé ensemble au Japon l'an dernier…"
              placeholderTextColor={Colors.outlineVariant}
              multiline
            />
          </View>

          {/* Mode "J'ai oublié" */}
          {hasLateMode(occasion) && (
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF7ED', borderRadius: Radii.xl, padding: 14, borderWidth: 1, borderColor: '#FED7AA', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#92400E' }}>😅 Tu as oublié ou laissé passer la date ?</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: '#B45309', marginTop: 2 }}>🙈 Active ça et l'IA glissera une excuse légère dans ton message !</Text>
                </View>
                <Switch
                  value={lateMode}
                  onValueChange={setLateMode}
                  trackColor={{ false: Colors.surfaceContainerHighest, true: '#D97706' }}
                  thumbColor={lateMode ? '#fff' : Colors.outlineVariant}
                />
              </View>
              {lateMode && (
                <View style={{ backgroundColor: '#FFFBEB', borderRadius: Radii.lg, padding: 14, borderWidth: 1, borderColor: '#FDE68A', gap: 6 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#92400E' }}>
                    💬 Exemple de ce que l'IA pourrait glisser :
                  </Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#78350F', lineHeight: 20, fontStyle: 'italic' }}>
                    {[
                      '"J\'attendais que tout le monde te le souhaite avant de faire une entrée remarquée."',
                      '"Je vis dans un fuseau horaire émotionnel différent."',
                      '"Mon calendrier fonctionne à l\'énergie solaire et il y avait des nuages."',
                      '"Je t\'écris depuis le futur où les anniversaires durent toute la semaine."',
                      '"J\'ai d\'abord voulu vérifier que tu méritais vraiment un message — tu l\'as prouvé."',
                    ][Math.floor(Date.now() / 86400000) % 5]}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Bouton générer */}
          <TouchableOpacity
            style={[{ borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center' as const, backgroundColor: '#7C3AED' }, (!firstNameInput.trim() || isPending) && { opacity: 0.5 }]}
            onPress={handleGenerate}
            disabled={!firstNameInput.trim() || isPending}
            activeOpacity={0.85}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: '#fff' }}>✨ Générer le message</Text>}
          </TouchableOpacity>

          {/* Résultat */}
          {generationError ? (
            <View style={{ backgroundColor: Colors.errorContainer, borderRadius: Radii.lg, padding: 12 }}>
              <Text style={{ color: Colors.error, fontFamily: 'BeVietnamPro_400Regular' }}>{generationError}</Text>
            </View>
          ) : null}
          {generatedContent ? (
            <View style={{ backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: 16, gap: 12 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface, lineHeight: 24 }}>
                {generatedContent}
              </Text>
              <View style={{ backgroundColor: '#F5F3FF', borderRadius: Radii.lg, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>🎙️</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.xs, color: '#7C3AED', flex: 1, lineHeight: 18 }}>
                  {'Dans l\'aperçu, tu pourras le faire lire par un Robot, un Pirate, le Père Noël… !'}
                </Text>
              </View>
              <TouchableOpacity
                style={{ borderRadius: Radii.full, paddingVertical: 13, alignItems: 'center' as const, backgroundColor: '#7C3AED' }}
                onPress={() => { bumpSessionKey(); router.push('/(app)/create/preview' as never); }}
                activeOpacity={0.85}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: '#fff' }}>Utiliser ce message →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGenerate} activeOpacity={0.75} style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: '#7C3AED' }}>↺ Régénérer</Text>
              </TouchableOpacity>
            </View>
          ) : null}

        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'template-from-child') {
    const msgs = occasion === 'nameday' ? FROM_CHILD_NAMEDAY : FROM_CHILD_BIRTHDAY;
    const parentFirstName = firstNameInput.trim() || 'ce parent';
    const cardOccasion = occasion === 'nameday' ? 'nameday' : 'birthday';
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('form')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle} numberOfLines={1}>
            💌 De la part de {childFromName}
          </Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 120, gap: 12 }}>
          <View style={{ backgroundColor: '#FDF4FF', borderRadius: 14, borderWidth: 1.5, borderColor: '#9333EA30', padding: 14, gap: 6, marginBottom: 4 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: '#7C3AED' }}>
              💌 {childFromName} prend la plume
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: '#6D28D9', lineHeight: 20 }}>
              {`Ces messages sont écrits à la 1ère personne, comme si c'était ${childFromName} qui les avait rédigés — avec la tendresse, la maladresse et l'humour d'un enfant qui parle à ${occasion === 'nameday' ? 'son' : 'son'} parent 💛\n\nChoisis un modèle, personnalise-le si tu veux, et ajoute une carte animée pour une attention inoubliable 🎴`}
            </Text>
          </View>
          {msgs.map((msg) => {
            const contactCivilite = contacts.find((c) => c.id === contactId)?.civilite;
            const parentRole  = contactCivilite === 'M.' ? 'Papa' : contactCivilite === 'Mme' ? 'Maman' : parentFirstName;
            const isMale      = contactCivilite === 'M.';
            const isFemale2   = contactCivilite === 'Mme';
            const filled = msg.text
              .replace(/\{role\}/gi, parentRole)
              .replace(/\{le_la\}/gi, isFemale2 ? 'la' : 'le')
              .replace(/\{meilleur_e\}/gi, isFemale2 ? 'meilleure' : 'meilleur')
              .replace(/\{e_cuisin\}/gi, isFemale2 ? 'ère' : '')
              .replace(/\{prenom\}/gi, parentFirstName);
            return (
              <View key={msg.id} style={styles.templateCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Text style={{ fontSize: 20 }}>{msg.emoji}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: Colors.onSurface }}>{msg.label}</Text>
                </View>
                <Text style={styles.templateCardPreview} numberOfLines={6}>{filled}</Text>
                <View style={styles.templateCardFooter}>
                  <TouchableOpacity
                    onPress={() => setTemplatePreview({ display: filled, raw: msg.text })}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.templateCardSeeMore, { color: '#7C3AED' }]}>👁️ Voir en entier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const contactCiv2  = contacts.find((c) => c.id === contactId)?.civilite;
                      const role2        = contactCiv2 === 'M.' ? 'Papa' : contactCiv2 === 'Mme' ? 'Maman' : parentFirstName;
                      const isFemale3    = contactCiv2 === 'Mme';
                      handleTemplateSelect(
                        msg.text
                          .replace(/\{role\}/gi, role2)
                          .replace(/\{le_la\}/gi, isFemale3 ? 'la' : 'le')
                          .replace(/\{meilleur_e\}/gi, isFemale3 ? 'meilleure' : 'meilleur')
                          .replace(/\{e_cuisin\}/gi, isFemale3 ? 'ère' : '')
                          .replace(/\{prenom\}/gi, parentFirstName)
                      );
                    }}
                    disabled={creatingTemplateContent !== null}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.templateCardCta}>
                      {creatingTemplateContent === msg.text ? 'Chargement...': '✉️ Utiliser ce message'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          <CardPickerForChild
            occasion={cardOccasion}
            contactId={contactId}
            contactName={parentFirstName}
            senderName={childFromName ?? ''}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'template-occasion') {
    const selectedContact = contacts.find((c) => c.id === contactId);
    const contactCivilite = selectedContact?.civilite;
    const templateOccasions = OCCASIONS.filter((o) => {
      if (o.value === 'custom') return false;
      if (o.value === 'mothersday' && contactCivilite === 'M.') return false;
      if (o.value === 'fathersday' && contactCivilite === 'Mme') return false;
      return true;
    });
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('form')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Pour quelle occasion ?</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 120, gap: 16 }}>

          {/* ── Intro ── */}
          <View style={{ backgroundColor: Colors.white, borderRadius: 16, padding: 18, gap: 12, borderWidth: 1, borderColor: Colors.outlineVariant }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>📚</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface, lineHeight: 24 }}>
                  Des milliers de modèles prêts à envoyer
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2 }}>
                  Écrits avec soin, pour chaque occasion
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '60' }} />

            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 21 }}>
              {'Un mariage, une naissance, une promotion, une bonne fête… chaque moment compte. On a constitué une bibliothèque pour chacun, parce qu\'un message juste au bon moment, ça fait toute la différence. 💛'}
            </Text>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '60' }} />

            <View style={{ gap: 8 }}>
              {[
                { emoji: '🎯', text: 'Choisis une occasion ci-dessous' },
                { emoji: '💜', text: 'Explore les styles : classique, BFF, mode jeune, sans filtre, humour…' },
                { emoji: '✏️', text: 'Personnalise le message à ta façon avant d\'envoyer' },
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

          <View style={{ borderLeftWidth: 4, borderLeftColor: C.primary, paddingLeft: 10 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface }}>
              Pour quelle occasion ? 👇
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {templateOccasions.map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.occasionBtn,
                  templateOccasion === o.value && { backgroundColor: o.color + '20', borderColor: o.color },
                ]}
                onPress={() => {
                  setTemplateOccasion(o.value);
                  setTemplateSupportType(null);
                  if (o.value === 'birthday') {
                    setBirthdayCategory(null);
                    setBirthdaySubGroupId(null);
                    setStep('template-birthday-category');
                  } else if (o.value === 'nameday') {
                    setFeteSubGroupId(null);
                    setStep('template-fete-subgroup');
                  } else if (o.value === 'support') {
                    setTemplateSupportType(null);
                    setStep('template-support-subtype');
                  } else {
                    setStep('template-list');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                <Text
                  style={[styles.occasionLabel, templateOccasion === o.value && { color: o.color }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                >
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ borderLeftWidth: 4, borderLeftColor: '#7C3AED', paddingLeft: 10 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface }}>
              Et en nouveauté 👇
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/(app)/mode-jeune' as never)} activeOpacity={0.85}>
            <LinearGradient
              colors={['#4C1D95', '#7C3AED', '#A855F7']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 }}
            >
              <Text style={{ fontSize: 24 }}>😎</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18, color: '#fff', textAlign: 'center' }}>
                Mode Jeune
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#EDE9FE', textAlign: 'center', lineHeight: 19 }}>
                Ado · BFF · Sans filtre · Humour · 18 ans… des centaines de messages dans le vrai style jeune →
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Étape : choix de la catégorie anniversaire ───────────────────────────────
  if (step === 'template-birthday-category') {
    const BIRTHDAY_CATS: { cat: BirthdayCategory | 'classique'; label: string; emoji: string; sub: string; color: string }[] = [
      { cat: 'classique',   label: 'Classique',         emoji: '🎁', sub: 'Messages tendres & sincères',     color: '#9b6bb5' },
      { cat: 'bff',         label: 'BFF',              emoji: '💜', sub: 'Best Friend Forever — meilleur·e ami·e pour la vie',   color: '#7C3AED' },
      { cat: 'sans_filtre', label: 'Sans filtre',      emoji: '🔥', sub: 'Messages décalés & cash',         color: '#EA580C' },
      { cat: 'ex',          label: 'À mon/ma "ex"',    emoji: '💔', sub: 'Pour un·e ex',                   color: '#E11D48' },
      { cat: 'enfant',      label: 'Pour les enfants', emoji: '🧸', sub: 'Messages magiques & tendres',     color: C.primary },
      { cat: 'ado_parent',  label: 'Ado → Parent',     emoji: '🫂', sub: 'Un ado écrit à son parent',       color: '#D97706' },
    ];
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('template-occasion')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>🎁 Anniversaire</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[3], paddingBottom: 120, gap: 10 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
            {"L'anniversaire — le seul jour de l'année où tout le monde a une bonne raison de penser à toi"}
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19, marginBottom: 4 }}>
            {'Un anniversaire, c\'est bien plus qu\'un chiffre qui change. C\'est le moment idéal pour dire à quelqu\'un ce qu\'on ne lui dit pas assez — qu\'il compte, qu\'on pense à lui, qu\'on est heureux qu\'il soit là. ConfettiCake t\'aide à trouver les bons mots, dans le bon ton, pour la bonne personne.'}
          </Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface, textAlign: 'center', marginBottom: 4 }}>
            Quel type de message ?
          </Text>

          {/* Suggestion automatique enfant < 12 ans */}
          {age !== null && age < 12 && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: C.primaryContainer, borderWidth: 2, borderColor: C.primary, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={() => { setBirthdayCategory('enfant'); setBirthdaySubGroupId(null); setStep('template-birthday-subgroup'); }}
            >
              <Text style={{ fontSize: 22 }}>🧸</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: C.primary }}>
                  ✨ {firstNameInput.trim() ? `${firstNameInput.trim()} a ${age} ans` : `${age} ans détectés`} — messages enfants recommandés
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: C.primary }}>›</Text>
            </TouchableOpacity>
          )}

          {/* Mode Jeune EN PREMIER si l'utilisateur lui-même est ado/jeune adulte */}
          {iAmAdo && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: '#7C3AED', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'birthday', ...(age !== null ? { contactAge: String(age) } : {}) } } as never)}
            >
              <Text style={{ fontSize: 28 }}>😎</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#fff' }}>Mode Jeune</Text>
                  <View style={{ backgroundColor: '#ffffff30', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 10, color: '#fff' }}>Pour toi 😎</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#ffffff99' }}>Messages dans ton style</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#fff' }}>›</Text>
            </TouchableOpacity>
          )}

          {/* Suggestion automatique Mode Jeune si destinataire 13-25 ans (et moi pas ado) */}
          {!iAmAdo && age !== null && age >= 13 && age <= 25 && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: '#F3EFFF', borderWidth: 2, borderColor: '#7C3AED', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'birthday', contactAge: String(age) } } as never)}
            >
              <Text style={{ fontSize: 22 }}>😎</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#7C3AED' }}>
                  ✨ {firstNameInput.trim() ? `${firstNameInput.trim()} a ${age} ans` : `${age} ans détectés`} — Mode Jeune recommandé
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#6D28D9', marginTop: 1 }}>Messages ados & jeunes adultes</Text>
              </View>
              <Text style={{ fontSize: 16, color: '#7C3AED' }}>›</Text>
            </TouchableOpacity>
          )}

          {BIRTHDAY_CATS.map(({ cat, label, emoji, sub, color }) => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.82}
              style={{
                backgroundColor: color + '12',
                borderColor: color,
                borderWidth: 2,
                borderRadius: 14,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
              onPress={() => {
                if (cat === 'classique') {
                  if (templateLongueur === 'court') setTemplateLongueur('moyen');
                  setStep('template-list');
                } else {
                  setBirthdayCategory(cat as BirthdayCategory);
                  setBirthdaySubGroupId(null);
                  setStep('template-birthday-subgroup');
                }
              }}
            >
              <Text style={{ fontSize: 28 }}>{emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color }}>{label}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 }}>{sub}</Text>
              </View>
              <Text style={{ fontSize: 18, color }}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Mode Jeune (toujours disponible) */}
          {(age === null || age < 13 || age > 25) && (
            <TouchableOpacity
              activeOpacity={0.82}
              style={{ backgroundColor: '#7C3AED12', borderColor: '#7C3AED', borderWidth: 2, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'birthday', ...(age !== null ? { contactAge: String(age) } : {}) } } as never)}
            >
              <Text style={{ fontSize: 28 }}>😎</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#7C3AED' }}>Mode Jeune</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 }}>Messages ados & jeunes adultes</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#7C3AED' }}>›</Text>
            </TouchableOpacity>
          )}

          {/* Je déteste les messages */}
          <TouchableOpacity
            activeOpacity={0.82}
            style={{ backgroundColor: '#37415112', borderColor: '#374151', borderWidth: 2, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => {
              const contact = contacts.find((c) => c.id === contactId);
              router.push({ pathname: '/(app)/deteste-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'birthday', contactCivilite: contact?.civilite ?? '' } } as never);
            }}
          >
            <Text style={{ fontSize: 28 }}>🙄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#374151' }}>Je déteste les messages</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 }}>Pour ceux qui écrivent rarement</Text>
            </View>
            <Text style={{ fontSize: 18, color: '#374151' }}>›</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Étape : choix du sous-groupe ─────────────────────────────────────────────
  if (step === 'template-birthday-subgroup' && birthdayCategory) {
    const groups = BIRTHDAY_GROUPS[birthdayCategory];
    const meta = BIRTHDAY_CATEGORY_META[birthdayCategory];
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('template-birthday-category')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>{meta.emoji} {meta.label}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 120, gap: 10 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface, textAlign: 'center', marginBottom: 6 }}>
            Choisis un thème
          </Text>
          {birthdayCategory === 'bff' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#7C3AED', textAlign: 'center', marginBottom: 10, lineHeight: 20 }}>
              {"BFF : Best Friends Forever — ton/ta meilleur·e ami·e pour la vie. Parce que 'Joyeux anniversaire' tout seul, c'est bon pour les inconnus. Ton BFF mérite mieux — et toi aussi tu mérites d'être le/la meilleur·e ami·e de l'année. 👑💜"}
            </Text>
          )}
          {birthdayCategory === 'sans_filtre' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#EA580C', textAlign: 'center', marginBottom: 10, lineHeight: 20 }}>
              {"Ici, pas de 'plein de bonheur et de santé'. On dit ce qu'on pense, on assume, et on envoie. Ta réputation de franchise est entre de bonnes mains. 🔥"}
            </Text>
          )}
          {birthdayCategory === 'ex' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#E11D48', textAlign: 'center', marginBottom: 10, lineHeight: 20 }}>
              {"On ne juge pas. On ne pose pas de questions. On t'aide juste à trouver le bon ton — entre le message qui dit tout et celui qui ne dit rien. Tu verras bien. 💔"}
            </Text>
          )}
          {birthdayCategory === 'enfant' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: C.primary, textAlign: 'center', marginBottom: 10, lineHeight: 20 }}>
              {"Des messages qui font briller les yeux, même si le destinataire préfère encore le gâteau au message. C'est normal. Continue quand même. 🧸✨"}
            </Text>
          )}
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              activeOpacity={0.82}
              style={{
                backgroundColor: meta.color + '10',
                borderColor: meta.color + '50',
                borderWidth: 1.5,
                borderRadius: 14,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
              onPress={() => {
                setBirthdaySubGroupId(group.id);
                setStep('template-birthday-messages');
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: meta.color }}>{group.title}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 }}>
                  {group.messages.length} messages
                </Text>
              </View>
              <Text style={{ fontSize: 18, color: meta.color }}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Je déteste les messages — Ado→Parent */}
          {birthdayCategory === 'ado_parent' && (
            <TouchableOpacity
              activeOpacity={0.82}
              style={{ backgroundColor: '#37415110', borderColor: '#374151', borderWidth: 1.5, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              onPress={() => {
                const contact = contacts.find((c) => c.id === contactId);
                router.push({ pathname: '/(app)/deteste-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'ado_parent', contactCivilite: contact?.civilite ?? '' } } as never);
              }}
            >
              <Text style={{ fontSize: 26 }}>🙄</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#374151' }}>Je déteste les messages</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 }}>Pour ceux qui écrivent rarement</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#374151' }}>›</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Étape : liste des messages locaux ────────────────────────────────────────
  if (step === 'template-birthday-messages' && birthdayCategory && birthdaySubGroupId) {
    const groups = BIRTHDAY_GROUPS[birthdayCategory];
    const meta = BIRTHDAY_CATEGORY_META[birthdayCategory];
    const group = groups.find((g) => g.id === birthdaySubGroupId);
    if (!group) return null;
    const firstName = firstNameInput.trim() || 'Prénom';
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('template-birthday-subgroup')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle} numberOfLines={1}>{group.title}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 60, gap: 12 }}>
          {birthdaySubGroupId === 'children_g1' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#7C3AED', textAlign: 'center', marginBottom: 4, lineHeight: 20 }}>
              {"Licornes, fées, étoiles filantes... On n'a pas lésé sur la poudre magique. Ton enfant va y croire dur comme fer — et honnêtement, toi aussi un peu. ✨🦄"}
            </Text>
          )}
          {birthdaySubGroupId === 'children_g2' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: C.primary, textAlign: 'center', marginBottom: 4, lineHeight: 20 }}>
              {"Cape, super-pouvoirs et missions impossibles inclus. Attention : après ce message, l'enfant risque de vouloir sauter du canapé. On décline toute responsabilité. 🦸‍♂️💥"}
            </Text>
          )}
          {birthdaySubGroupId === 'children_g3' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#EC4899', textAlign: 'center', marginBottom: 4, lineHeight: 20 }}>
              {"Des messages tellement tendres qu'ils pourraient faire fondre un bonhomme de neige en plein hiver. Prévoir des mouchoirs — pour toi, pas pour l'enfant. 🤗💛"}
            </Text>
          )}
          {birthdaySubGroupId === 'children_g4' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#F59E0B', textAlign: 'center', marginBottom: 4, lineHeight: 20 }}>
              {"De l'humour calibré pour les petits — ni trop piquant, ni trop fade. Juste ce qu'il faut pour décrocher un grand sourire et peut-être un fou rire. 😄🎈"}
            </Text>
          )}
          {birthdaySubGroupId === 'children_g5' && (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13.5, color: '#10B981', textAlign: 'center', marginBottom: 4, lineHeight: 20 }}>
              {"Pour les tout-petits qui ne savent pas encore lire — mais leurs parents, si. Des mots simples, doux, et remplis d'amour pour les toutes premières bougies. 🍼🌸"}
            </Text>
          )}
          {group.messages.map((msg) => {
            const childContact = contacts.find((c) => c.id === contactId);
            const isFemale = childContact?.civilite === 'Mme' || (childContact as any)?.child_gender === 'female';
            const parentRole = birthdayCategory === 'ado_parent'
              ? (childContact?.civilite === 'M.' ? 'Papa' : childContact?.civilite === 'Mme' ? 'Maman' : firstName)
              : firstName;
            const applyGender = (t: string) => t
              .replace(/\{e\}/g, isFemale ? 'e' : '')
              .replace(/\{se\}/g, isFemale ? 'se' : '')
              .replace(/\{ne\}/g, isFemale ? 'ne' : '')
              .replace(/\{prenom\}/gi, parentRole);
            const filled = applyGender(msg.text);
            return (
              <View key={msg.id} style={styles.templateCard}>
                <Text style={styles.templateCardPreview} numberOfLines={6}>{filled}</Text>
                <View style={styles.templateCardFooter}>
                  <TouchableOpacity
                    onPress={() => setTemplatePreview({ display: filled, raw: msg.text })}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.templateCardSeeMore, { color: meta.color }]}>👁️ Voir en entier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleTemplateSelect(applyGender(msg.text))}
                    disabled={creatingTemplateContent !== null}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.templateCardCta}>
                      {creatingTemplateContent === msg.text ? 'Chargement...': '✉️ Utiliser ce message'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        {/* Modale aperçu texte complet (réutilisée) */}
        <Modal
          visible={!!templatePreview}
          transparent
          animationType="slide"
          onRequestClose={() => setTemplatePreview(null)}
        >
          <TouchableOpacity style={styles.templateModalOverlay} activeOpacity={1} onPress={() => setTemplatePreview(null)}>
            <TouchableOpacity activeOpacity={1} style={styles.templateModalCard}>
              <Text style={styles.templateModalTitle}>📄 Aperçu du message</Text>
              <ScrollView style={styles.templateModalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.templateModalText}>{templatePreview?.display ?? ''}</Text>
              </ScrollView>
              <View style={styles.templateModalActions}>
                <TouchableOpacity style={styles.templateModalCancelBtn} onPress={() => setTemplatePreview(null)}>
                  <Text style={styles.templateModalCancelText}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.templateModalUseBtn, { backgroundColor: meta.color }]}
                  onPress={() => { if (!templatePreview) return; setTemplatePreview(null); handleTemplateSelect(templatePreview.raw); }}
                  disabled={creatingTemplateContent !== null}
                >
                  <Text style={styles.templateModalUseBtnText}>
                    {creatingTemplateContent === templatePreview?.raw ? 'Chargement...': '✉️ Utiliser ce message'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }

  // ── Fête : choix du sous-groupe ─────────────────────────────────────────────
  if (step === 'template-fete-subgroup') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('template-occasion')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>🌸 Bonne Fête</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 120, gap: 12 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
            {"La fête — parce qu'un prénom mérite d'être célébré"}
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
            {'La fête du prénom, c\'est souvent l\'occasion la plus oubliée — et pourtant l\'une des plus touchantes quand on y pense. Recevoir un message ce jour-là, c\'est la surprise que personne n\'attend et que tout le monde adore. Un petit mot qui dit : "J\'ai pensé à toi aujourd\'hui." Ça suffit à illuminer une journée.'}
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
            {'Le ton — "Tu" pour tes proches, "Vous" pour les relations plus formelles ou les collègues.'}
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19, marginBottom: 4 }}>
            {'La taille — Court pour un petit mot qui fait plaisir, Moyen pour une pensée bien tournée, Long pour lui dire combien il ou elle compte dans ta vie.'}
          </Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 16, color: Colors.onSurface, textAlign: 'center' }}>
            Quel ton veux-tu pour ton message ?
          </Text>

          {/* Mode Jeune EN PREMIER si l'utilisateur lui-même est ado/jeune adulte */}
          {iAmAdo && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: '#7C3AED', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'nameday', ...(age !== null ? { contactAge: String(age) } : {}) } } as never)}
            >
              <Text style={{ fontSize: 28 }}>😎</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#fff' }}>Mode Jeune</Text>
                  <View style={{ backgroundColor: '#ffffff30', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 10, color: '#fff' }}>Pour toi 😎</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#ffffff99' }}>Messages dans ton style</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#fff' }}>›</Text>
            </TouchableOpacity>
          )}

          {/* Suggestion Mode Jeune si destinataire 13-25 ans (et moi pas ado) */}
          {!iAmAdo && age !== null && age >= 13 && age <= 25 && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: '#F3EFFF', borderWidth: 2, borderColor: '#7C3AED', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'nameday', contactAge: String(age) } } as never)}
            >
              <Text style={{ fontSize: 22 }}>😎</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#7C3AED' }}>
                  ✨ Mode Jeune — recommandé pour {firstNameInput.trim() || contactName} ({age} ans)
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#6D28D9', marginTop: 1 }}>Messages ados & jeunes adultes</Text>
              </View>
              <Text style={{ fontSize: 16, color: '#7C3AED' }}>›</Text>
            </TouchableOpacity>
          )}

          {FETE_GROUPS.map((group) => {
            const FETE_GROUP_INTROS: Record<string, string> = {
              fete_g1: 'Des mots chaleureux et sincères — pour quelqu\'un qui compte vraiment dans ta vie.',
              fete_g2: 'Sobre et raffiné, qui touche sans en faire trop — pour les personnes qui apprécient les belles choses.',
              fete_g3: 'Léger, pétillant, sans prétention — pour célébrer avec le sourire.',
              fete_g4: 'Des images, de la douceur, un texte qui reste — pour les âmes un peu sensibles.',
              fete_g5: 'L\'amour familial dit clairement et du fond du cœur — pour ceux qu\'on aime depuis toujours.',
              fete_g6: 'Sincère sans être intime — parfait pour un collègue, une connaissance ou une relation formelle.',
            };
            return (
              <TouchableOpacity
                key={group.id}
                style={{ backgroundColor: '#e88fa312', borderColor: '#e88fa3', borderWidth: 2, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
                onPress={() => { setFeteSubGroupId(group.id); setStep('template-fete-messages'); }}
                activeOpacity={0.82}
              >
                <Text style={{ fontSize: 28 }}>{group.title.split(' ').pop()}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: '#e88fa3' }}>
                    {group.title.replace(/\s+\S*$/, '').trim()}
                  </Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 3, lineHeight: 17 }}>
                    {FETE_GROUP_INTROS[group.id]}
                  </Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.6, marginTop: 4 }}>
                    {group.messages.length} messages
                  </Text>
                </View>
                <Text style={{ color: '#e88fa3', fontSize: 18 }}>›</Text>
              </TouchableOpacity>
            );
          })}

          {/* Mode Jeune toujours accessible */}
          {(age === null || age < 13 || age > 25) && (
            <TouchableOpacity
              activeOpacity={0.82}
              style={{ backgroundColor: '#7C3AED12', borderColor: '#7C3AED', borderWidth: 2, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'nameday', ...(age !== null ? { contactAge: String(age) } : {}) } } as never)}
            >
              <Text style={{ fontSize: 28 }}>😎</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#7C3AED' }}>Mode Jeune</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 }}>Messages ados & jeunes adultes</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#7C3AED' }}>›</Text>
            </TouchableOpacity>
          )}

          {/* Je déteste les messages */}
          <TouchableOpacity
            activeOpacity={0.82}
            style={{ backgroundColor: '#37415112', borderColor: '#374151', borderWidth: 2, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => router.push({ pathname: '/(app)/deteste-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'nameday' } } as never)}
          >
            <Text style={{ fontSize: 28 }}>🙄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: '#374151' }}>Je déteste les messages</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 }}>Pour ceux qui écrivent rarement</Text>
            </View>
            <Text style={{ fontSize: 18, color: '#374151' }}>›</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Fête : liste des messages ────────────────────────────────────────────────
  if (step === 'template-fete-messages' && feteSubGroupId) {
    const group = FETE_GROUPS.find((g) => g.id === feteSubGroupId);
    if (!group) return null;
    const firstName = firstNameInput.trim() || 'Prénom';
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('template-fete-subgroup')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle} numberOfLines={1}>{group.title.replace(/\s+\S*$/, '').trim()}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 100, gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
            {(['tu', 'vous'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTemplateTon(t)}
                activeOpacity={0.75}
                style={[styles.filterBtn, templateTon === t && styles.filterBtnActive, { flex: 1 }]}
              >
                <Text style={[styles.filterBtnText, templateTon === t && styles.filterBtnTextActive]}>
                  {t === 'tu' ? '✦ Tu' : '✦ Vous'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
            {(['moyen', 'long'] as const).map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => setTemplateFeteLongueur(l)}
                activeOpacity={0.75}
                style={[styles.filterBtn, templateFeteLongueur === l && styles.filterBtnActive, { flex: 1 }]}
              >
                <Text style={[styles.filterBtnText, templateFeteLongueur === l && styles.filterBtnTextActive]}>
                  {l === 'moyen' ? '✦ Moyen' : '✦ Long'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {group.messages.filter((m) => m.longueur === templateFeteLongueur && (m.ton ?? 'tu') === templateTon).map((msg) => {
            const filled = msg.text.replace(/\{prenom\}/gi, firstName);
            return (
              <View key={msg.id} style={styles.templateCard}>
                <Text style={styles.templateCardPreview} numberOfLines={6}>{filled}</Text>
                <View style={styles.templateCardFooter}>
                  <TouchableOpacity onPress={() => setTemplatePreview({ display: filled, raw: msg.text })} activeOpacity={0.75}>
                    <Text style={[styles.templateCardSeeMore, { color: '#e88fa3' }]}>👁️ Voir en entier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleTemplateSelect(msg.text)} disabled={creatingTemplateContent !== null} activeOpacity={0.8}>
                    <Text style={styles.templateCardCta}>{creatingTemplateContent === msg.text ? 'Chargement...': '✉️ Utiliser ce message'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <Modal visible={!!templatePreview} transparent animationType="slide" onRequestClose={() => setTemplatePreview(null)}>
          <TouchableOpacity style={styles.templateModalOverlay} activeOpacity={1} onPress={() => setTemplatePreview(null)}>
            <TouchableOpacity activeOpacity={1} style={styles.templateModalCard}>
              <Text style={styles.templateModalTitle}>📄 Aperçu du message</Text>
              <ScrollView style={styles.templateModalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.templateModalText}>{templatePreview?.display ?? ''}</Text>
              </ScrollView>
              <View style={styles.templateModalActions}>
                <TouchableOpacity style={styles.templateModalCancelBtn} onPress={() => setTemplatePreview(null)}>
                  <Text style={styles.templateModalCancelText}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.templateModalUseBtn, { backgroundColor: '#e88fa3' }]}
                  onPress={() => { if (!templatePreview) return; setTemplatePreview(null); handleTemplateSelect(templatePreview.raw); }}
                  disabled={creatingTemplateContent !== null}
                >
                  <Text style={styles.templateModalUseBtnText}>{creatingTemplateContent === templatePreview?.raw ? 'Chargement...': '✉️ Utiliser ce message'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }

  if (step === 'template-support-subtype') {
    const SUPPORT_PAGES: { value: string; emoji: string; label: string; desc: string }[] = [
      {
        value: 'bereavement',
        emoji: '🕊️',
        label: 'Deuil & condoléances',
        desc: 'Le deuil laisse souvent sans voix. Ces messages disent "je suis là" avec délicatesse, sans prétendre combler ce vide.',
      },
      {
        value: 'illness',
        emoji: '🌿',
        label: 'Maladie',
        desc: 'Chaleureux et sincères, sans alourdir. Ces messages trouvent l\'équilibre juste pour accompagner quelqu\'un qui traverse une maladie.',
      },
      {
        value: 'hardtime',
        emoji: '🧠',
        label: 'Période difficile',
        desc: 'Perte d\'emploi, épuisement, moment difficile à traverser… Parfois savoir que quelqu\'un pense à soi change quelque chose.',
      },
      {
        value: 'encouragement',
        emoji: '💪',
        label: 'Encouragement',
        desc: 'Un projet qui démarre, un défi qui effraie, une période qui met à l\'épreuve — ces messages encouragent avec une chaleur sincère.',
      },
    ];
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep('template-occasion')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>🤍 Soutien</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 120, gap: 10 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface, marginBottom: 4 }}>
            {'Parce que les mots comptent double dans les moments difficiles'}
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19, marginBottom: 8 }}>
            {'Trouver les bons mots quand quelqu\'un traverse une épreuve est souvent plus dur que d\'habitude. Choisis la situation.'}
          </Text>
          {SUPPORT_PAGES.map((sp) => (
            <TouchableOpacity
              key={sp.value}
              style={{ backgroundColor: '#5C8FA812', borderColor: '#5C8FA8', borderWidth: 2, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
              onPress={() => { setTemplateSupportType(sp.value); setStep('template-list'); }}
              activeOpacity={0.82}
            >
              <Text style={{ fontSize: 28 }}>{sp.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 16, color: '#5C8FA8' }}>{sp.label}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 3, lineHeight: 17 }}>{sp.desc}</Text>
              </View>
              <Text style={{ color: '#5C8FA8', fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'template-list') {
    const selectedOccasionData = OCCASIONS.find((o) => o.value === templateOccasion);
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setStep(templateOccasion === 'support' ? 'template-support-subtype' : 'template-occasion')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>
            {selectedOccasionData?.emoji} {selectedOccasionData?.label}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>

        {/* ── Intro spécifique par sous-type soutien ── */}
        {templateOccasion === 'support' && !!templateSupportType && (() => {
          const SUPPORT_INTROS: Record<string, { title: string; body: string; tone: string; size: string }> = {
            bereavement: {
              title: 'Trouver les mots quand il n\'y en a pas',
              body: 'Le deuil laisse souvent sans voix. On ne sait pas quoi dire, on a peur de blesser, d\'en faire trop ou pas assez. Ces messages sont écrits avec délicatesse — pour dire "je suis là" sans prétendre que les mots peuvent combler ce vide.',
              tone: '"Tu" pour quelqu\'un de proche, "Vous" pour une relation plus formelle ou une situation très solennelle.',
              size: 'Court pour un mot simple et sincère qui dit "je pense à toi", Long pour un message plus enveloppant qui prend le temps d\'être là.',
            },
            illness: {
              title: 'Un message qui dit "je pense à toi"',
              body: 'Quand quelqu\'un est malade, on veut lui montrer qu\'on est là sans alourdir. Ces messages trouvent l\'équilibre — chaleureux, sincères, sans excès de dramatisme ni de légèreté déplacée.',
              tone: '"Tu" pour quelqu\'un de proche, "Vous" pour un message plus formel ou vers une personne âgée.',
              size: 'Court pour un signe de vie discret, Long pour accompagner vraiment et prendre le temps d\'être là.',
            },
            hardtime: {
              title: 'Pour ceux qui traversent un moment difficile',
              body: 'Perte d\'emploi, épuisement, une période où tout semble lourd — parfois, juste savoir que quelqu\'un pense à soi change quelque chose. Ces messages sont là pour ça : présents, sincères, sans minimiser.',
              tone: '"Tu" pour quelqu\'un de proche, "Vous" pour une relation professionnelle ou moins intime.',
              size: 'Court pour un signe chaleureux et discret, Long pour un message qui accompagne vraiment.',
            },
            encouragement: {
              title: 'Parce que les bons mots donnent de l\'élan',
              body: 'Un projet qui démarre, un défi qui effraie, une épreuve qui met à l\'épreuve — un mot bien placé peut faire une vraie différence. Ces messages encouragent sans être creux, avec une chaleur sincère.',
              tone: '"Tu" pour quelqu\'un de proche, "Vous" pour un contexte professionnel ou une relation formelle.',
              size: 'Court pour un boost rapide et direct, Long pour exprimer toute ta confiance en cette personne.',
            },
          };
          const intro = SUPPORT_INTROS[templateSupportType];
          if (!intro) return null;
          return (
            <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>{intro.title}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>{intro.body}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>{'Le ton — '}{intro.tone}</Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>{'La taille — '}{intro.size}</Text>
            </View>
          );
        })()}

        {/* ── Intro personnalisation ── */}
        {templateOccasion === 'thanks' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Parce qu\'un merci bien dit, ça change tout'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Un remerciement sincère, c\'est l\'un des gestes les plus forts qu\'on puisse faire. Ça dit à l\'autre que ce qu\'il a fait comptait vraiment — et que toi, tu l\'as vu.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour quelqu\'un de proche, "Vous" pour une relation plus formelle ou professionnelle.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un merci direct et chaleureux, Moyen pour quelque chose de plus expressif, Long pour un remerciement qui dit vraiment tout ce que tu ressens.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'promotion' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'La reconnaissance d\'un talent qui méritait de monter'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Une promotion, c\'est la preuve que le travail paie et que les efforts sont vus. Ton message vient souligner ce moment de fierté légitime.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour un collègue ou ami proche, "Vous" pour une relation professionnelle plus formelle.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour des félicitations directes et enthousiastes, Moyen pour quelque chose de plus personnel, Long pour exprimer toute l\'estime que tu as pour cette personne.'}
            </Text>
            {/* Mode Jeune pour premier job 18-25 */}
            {(age === null || (age >= 18 && age <= 25)) && (
              <TouchableOpacity
                activeOpacity={0.85}
                style={{ backgroundColor: '#F3EFFF', borderWidth: 2, borderColor: '#7C3AED', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}
                onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'first_job', ...(age !== null ? { contactAge: String(age) } : {}) } } as never)}
              >
                <Text style={{ fontSize: 22 }}>💼</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#7C3AED' }}>😎 Mode Jeune — Premier job/stage (18-25 ans)</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#6D28D9', marginTop: 1 }}>100 messages dans le style jeune adulte</Text>
                </View>
                <Text style={{ fontSize: 16, color: '#7C3AED' }}>›</Text>
              </TouchableOpacity>
            )}
            {/* Je déteste les messages — premier job */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: '#37415110', borderWidth: 1.5, borderColor: '#374151', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
              onPress={() => router.push({ pathname: '/(app)/deteste-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'first_job' } } as never)}
            >
              <Text style={{ fontSize: 22 }}>🙄</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#374151' }}>Et en bonus — spécialement pensé pour toi si tu détestes écrire des messages :</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16 }}>
                  {'20 modèles adaptés, si tu ne sais pas trop quoi mettre, si tu bloques devant ton écran, ou si tu le fais parce qu\'il le faut.'}
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16 }}>
                  {'Cette collection est faite pour toi — des formules courtes et vraies, qui vont droit au but.'}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: '#374151' }}>›</Text>
            </TouchableOpacity>
          </View>
        )}
        {templateOccasion === 'graduation' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Parce que les efforts méritent d\'être célébrés'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Des années de travail, de doutes et de persévérance qui aboutissent à ce moment. Un diplôme, c\'est bien plus qu\'un bout de papier — c\'est une victoire personnelle qui mérite d\'être reconnue.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour quelqu\'un de proche, "Vous" pour un message plus formel ou respectueux.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour des félicitations spontanées, Moyen pour quelque chose de plus sincère, Long pour exprimer toute ta fierté et ton admiration.'}
            </Text>
            {/* Mode Jeune pour diplôme ados */}
            {(age === null || (age >= 13 && age <= 17)) && (
              <TouchableOpacity
                activeOpacity={0.85}
                style={{ backgroundColor: '#F3EFFF', borderWidth: 2, borderColor: '#7C3AED', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}
                onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'graduation', ...(age !== null ? { contactAge: String(age) } : {}) } } as never)}
              >
                <Text style={{ fontSize: 22 }}>😎</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#7C3AED' }}>😎 Mode Jeune — Diplôme ados (13-17 ans)</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#6D28D9', marginTop: 1 }}>100 messages dans le style ado</Text>
                </View>
                <Text style={{ fontSize: 16, color: '#7C3AED' }}>›</Text>
              </TouchableOpacity>
            )}
            {/* Je déteste les messages — diplôme */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ backgroundColor: '#37415110', borderWidth: 1.5, borderColor: '#374151', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
              onPress={() => router.push({ pathname: '/(app)/deteste-message-library', params: { contactId: contactId ?? '', contactName: firstNameInput.trim() || contactName, occasion: 'graduation' } } as never)}
            >
              <Text style={{ fontSize: 22 }}>🙄</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#374151' }}>Et en bonus — spécialement pensé pour toi si tu détestes écrire des messages :</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16 }}>
                  {'20 modèles adaptés, si tu ne sais pas trop quoi mettre, si tu bloques devant ton écran, ou si tu le fais parce qu\'il le faut.'}
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16 }}>
                  {'Cette collection est faite pour toi — des formules courtes et vraies, qui vont droit au but.'}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: '#374151' }}>›</Text>
            </TouchableOpacity>
          </View>
        )}
        {templateOccasion === 'communion' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Un grand jour dans un jeune cœur'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La communion, c\'est un moment de foi et de partage qui restera gravé longtemps dans la mémoire de l\'enfant et de sa famille. Ton message fait partie de ce souvenir.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour l\'enfant ou la famille proche, "Vous" pour un message adressé aux parents ou plus formel.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un message joyeux et léger, Moyen pour quelque chose de plus chaleureux, Long pour un texte qui accompagnera durablement ce jour.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'baptism' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Un prénom, une lumière, un jour béni'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le baptême, c\'est l\'un des premiers grands moments de la vie d\'un enfant. Ton message accompagne cette célébration avec toute la tendresse qu\'elle mérite.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour la famille proche ou les parents que tu connais bien, "Vous" pour un message plus solennel ou respectueux.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un vœu simple et sincère, Moyen pour quelque chose de plus personnel, Long pour un message qui marquera ce jour mémorable.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'birth' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Bienvenue au monde, petit·e nouveau·elle !'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Un bébé qui arrive, c\'est une émotion à part entière. Ton message va accueillir cette nouvelle vie et entourer les parents dans ce moment inoubliable.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour des parents proches de toi, "Vous" pour un message plus formel ou si vous ne vous connaissez pas très bien.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un message doux et spontané, Moyen pour quelque chose de plus chaleureux, Long pour exprimer toute la joie que tu ressens.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'engagement' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Le début de la plus belle des aventures'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Les fiançailles, c\'est le moment où tout commence officiellement. Ton message peut être le premier à célébrer ce "oui" qui précède tous les autres.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" si tu les connais intimement, "Vous" pour un message plus élégant ou si vous n\'êtes pas si proches.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un message pétillant et spontané, Moyen pour quelque chose de plus touchant, Long pour leur dire vraiment ce que tu ressens.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'wedding' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Pour les mots qui durent toute une vie'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Un mariage, c\'est bien plus qu\'une fête — c\'est deux personnes qui choisissent de construire quelque chose ensemble. Ton message mérite d\'être à la hauteur de ce moment.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" si tu les connais bien, "Vous" pour un message plus solennel ou si tu ne les connais que d\'un côté.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour une attention sincère, Moyen pour quelque chose de plus personnel, Long pour un message qui restera dans les mémoires.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'greetings' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Parce que donner des nouvelles, ça compte'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Pas besoin d\'attendre un anniversaire ou une grande occasion pour penser à quelqu\'un. Un simple "coucou" peut faire toute la différence dans la journée de l\'autre.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour quelqu\'un de proche, "Vous" pour une relation plus formelle.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un petit signe de vie, Moyen pour un message plus chaleureux, Long pour une vraie prise de nouvelles.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'nameday' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Personnalise ton message de fête'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Deux réglages pour que le message soit vraiment le tien :'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — tu tutoies cette personne ? Choisis "Tu". Tu la vouvoies ? Choisis "Vous".'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un message rapide, Moyen pour quelque chose de chaleureux, Long pour une attention particulièrement soignée.'}
            </Text>
          </View>
        )}

        {templateOccasion === 'birthday' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'6 ambiances pour un anniversaire parfait'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Choisis l\'ambiance qui correspond le mieux à ta relation et à la personne. Chaque style existe en version Moyen ou Long.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour quelqu\'un de proche, "Vous" pour une relation plus formelle ou distante.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'retirement' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {"Des années de boulot — et maintenant c'est enfin son heure !"}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour un collègue devenu ami, "Vous" pour marquer le respect et la reconnaissance.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un message qui va droit au but, Moyen pour une pensée chaleureuse, Long pour lui rendre hommage comme il le mérite.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'halloween' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {"La nuit la plus effrayante de l'année — autant l'assumer jusqu'au bout"}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour les proches avec qui tu vas frissonner, "Vous" pour une ambiance plus mystérieuse et théâtrale.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {"La taille — Court pour un message qui fait son effet, Moyen pour mettre dans l'ambiance, Long pour une histoire qui fait vraiment peur."}
            </Text>
          </View>
        )}
        {templateOccasion === 'fathersday' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Pour celui qui est là depuis le début — trouve les mots à la hauteur'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour ton papa, "Vous" pour un beau-père ou une relation plus respectueuse.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {"La taille — Court pour un message percutant qui dit l'essentiel, Moyen pour lui montrer à quel point il compte, Long pour lui écrire ce qu'on ne dit jamais à voix haute."}
            </Text>
          </View>
        )}
        {templateOccasion === 'mothersday' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Pour la femme qui a tout donné — trouve les mots à la hauteur'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour ta maman, "Vous" pour une belle-mère ou une relation plus respectueuse.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {"La taille — Court pour un mot du cœur simple et sincère, Moyen pour lui dire tout ce qu'elle représente, Long pour une déclaration qui restera."}
            </Text>
          </View>
        )}
        {templateOccasion === 'valentines' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {"Parce que l'amour mérite les bons mots"}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour la personne qui partage ta vie, "Vous" pour une déclaration plus romanesque et intemporelle.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {"La taille — Court pour un mot tendre et percutant, Moyen pour exprimer ce que tu ressens vraiment, Long pour une lettre d'amour qui marque."}
            </Text>
          </View>
        )}
        {templateOccasion === 'easter' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {"Pâques — des œufs, du chocolat, et l'occasion rêvée de penser à quelqu'un"}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Pâques, c\'est la fête qui sent bon le printemps, les retrouvailles en famille et les kilos de chocolat qu\'on assume complètement. C\'est aussi une occasion souvent sous-estimée pour envoyer un message chaleureux — parce que tout le monde aime recevoir une pensée inattendue au milieu des lapins en folie.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour tes proches, "Vous" pour les relations plus formelles.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un petit mot festif et spontané, Moyen pour une pensée douce, Long pour un message qui va droit au cœur.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'christmas' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {"Noël — parce que certains mots méritent d'être dits, et pas seulement en décembre"}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Noël, c\'est la fête qui réchauffe même les cœurs les plus froids. C\'est le moment de l\'année où l\'on se dit les choses qu\'on reporte depuis trop longtemps. Un message sincère peut faire plus qu\'un cadeau emballé — il reste, lui.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour tes proches, "Vous" pour les collègues ou les relations plus formelles.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un vœu chaleureux et spontané, Moyen pour une pensée sincère et bien tournée, Long pour un message qui vient vraiment du cœur et restera.'}
            </Text>
          </View>
        )}
        {templateOccasion === 'newyear' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, gap: 6 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 19, color: Colors.onSurface }}>
              {'Une nouvelle année commence — à toi de choisir comment la commencer'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'Le ton — "Tu" pour tes proches, "Vous" pour les collègues ou les relations plus formelles.'}
            </Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19 }}>
              {'La taille — Court pour un vœu rapide, Moyen pour une pensée équilibrée, Long pour un message vraiment personnel.'}
            </Text>
          </View>
        )}

        {/* ── Sélecteur style anniversaire ── */}
        {templateOccasion === 'birthday' && (
          <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, paddingBottom: 4, gap: 8 }}>
            <Text style={styles.filterLabel}>Ambiance</Text>
            <View style={{ gap: 8 }}>
              {[
                [
                  { key: 'chaleureux' as const, label: '🌸', sub: 'Chaleureux' },
                  { key: 'elegant'    as const, label: '✨', sub: 'Élégant' },
                  { key: 'drole'      as const, label: '😄', sub: 'Drôle' },
                ],
                [
                  { key: 'poetique'   as const, label: '🌿', sub: 'Poétique' },
                  { key: 'famille'    as const, label: '👨‍👩‍👧', sub: 'Famille' },
                  { key: 'collegue'   as const, label: '🤝', sub: 'Collègue' },
                ],
              ].map((row, ri) => (
                <View key={ri} style={{ flexDirection: 'row', gap: 8 }}>
                  {row.map(({ key, label, sub }) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.filterBtn, styles.styleAmbBtn, templateBirthdayStyle === key && styles.filterBtnActive]}
                      onPress={() => setTemplateBirthdayStyle(key)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.styleAmbEmoji}>{label}</Text>
                      <Text style={[styles.styleAmbText, templateBirthdayStyle === key && styles.filterBtnTextActive]} numberOfLines={1}>
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
            <View style={{ backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, borderLeftWidth: 3, borderLeftColor: C.primary }}>
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 13, color: Colors.onSurface, lineHeight: 20 }}>
                {({
                  chaleureux: 'Des mots sincères et pleins d\'élan — pour quelqu\'un qui compte vraiment.',
                  elegant:    'Sobre, raffiné, et qui touche sans en faire trop — pour les personnes qui apprécient les belles choses.',
                  drole:      'Un peu de légèreté, une bonne dose d\'humour — pour célébrer sans se prendre au sérieux.',
                  poetique:   'Des images, de la douceur, un texte qui reste — pour les âmes un peu sensibles.',
                  famille:    'L\'amour qu\'on ne dit pas assez — enfin dit, clairement et du fond du cœur.',
                  collegue:   'Sincère sans être trop intime — parfait pour un collègue ou une connaissance.',
                } as Record<string, string>)[templateBirthdayStyle]}
              </Text>
            </View>
          </View>
        )}

        {/* ── Filtres ton + longueur ── */}
        {(templateOccasion !== 'support' || !!templateSupportType) && (
        <View style={{ paddingHorizontal: Spacing[4], paddingTop: 12, paddingBottom: 4, gap: 8 }}>
          {/* Tu / Vous */}
          <Text style={styles.filterLabel}>Ton du message</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['tu', 'vous'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.filterBtn, templateTon === t && styles.filterBtnActive]}
                onPress={() => setTemplateTon(t)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterBtnText, templateTon === t && styles.filterBtnTextActive]}>
                  {t === 'tu' ? 'Tutoiement' : 'Vouvoiement'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Moyen / Long (Court supprimé pour anniversaire) */}
          <Text style={styles.filterLabel}>Taille du message</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {([
              { key: 'court', label: 'Court' },
              { key: 'moyen', label: 'Moyen' },
              { key: 'long',  label: 'Long'  },
            ] as const).filter(({ key }) => templateOccasion !== 'birthday' || key !== 'court').map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterBtn, templateLongueur === key && styles.filterBtnActive]}
                onPress={() => setTemplateLongueur(key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterBtnText, templateLongueur === key && styles.filterBtnTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        )}

        {(templateOccasion !== 'support' || !!templateSupportType) && (
        <View style={{ padding: Spacing[4], gap: 12 }}>
          {templatesLoading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
          ) : templates.length === 0 ? (
            <Text style={styles.templateEmpty}>
              Aucun modèle disponible.{'\n'}D'autres arrivent bientôt !
            </Text>
          ) : (
            templates.map((tpl) => {
              const filled = tpl.content
                .replace(/\{prenom\}/gi, firstNameInput.trim() || 'Prénom')
                .replace(/\{annee\}/gi, new Date().getFullYear().toString());
              return (
                <View key={tpl.id} style={styles.templateCard}>
                  <Text style={styles.templateCardPreview} numberOfLines={6}>{filled}</Text>
                  <View style={styles.templateCardFooter}>
                    <TouchableOpacity
                      onPress={() => setTemplatePreview({ display: filled, raw: tpl.content })}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.templateCardSeeMore, { color: C.primary }]}>👁️ Voir en entier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleTemplateSelect(tpl.content)}
                      disabled={creatingTemplateContent !== null}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.templateCardCta}>
                        {creatingTemplateContent === tpl.content ? 'Chargement...': '✉️ Utiliser ce modèle'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
        )}

        </ScrollView>

        {/* ── Modale aperçu texte complet ── */}
        <Modal
          visible={!!templatePreview}
          transparent
          animationType="slide"
          onRequestClose={() => setTemplatePreview(null)}
        >
          <TouchableOpacity
            style={styles.templateModalOverlay}
            activeOpacity={1}
            onPress={() => setTemplatePreview(null)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.templateModalCard}>
              <Text style={styles.templateModalTitle}>📄 Aperçu du modèle</Text>
              <ScrollView style={styles.templateModalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.templateModalText}>{templatePreview?.display ?? ''}</Text>
              </ScrollView>
              <View style={styles.templateModalActions}>
                <TouchableOpacity
                  style={styles.templateModalCancelBtn}
                  onPress={() => setTemplatePreview(null)}
                >
                  <Text style={styles.templateModalCancelText}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.templateModalUseBtn, { backgroundColor: C.primary }]}
                  onPress={() => {
                    if (!templatePreview) return;
                    setTemplatePreview(null);
                    handleTemplateSelect(templatePreview.raw);
                  }}
                  disabled={creatingTemplateContent !== null}
                >
                  <Text style={styles.templateModalUseBtnText}>
                    {creatingTemplateContent === templatePreview?.raw ? 'Chargement...': '✉️ Utiliser ce modèle'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Générateur Magique ✨</Text>
        <HelpModal
          title="Créer un message"
          content={"Suis les étapes : choisis le contact, l'occasion, le format et la tonalité.\n\n↺ Régénérer est toujours GRATUIT.\n✏️ Tu peux aussi modifier le texte manuellement.\n🌍 Si ton contact est étranger, sélectionne sa langue avant de générer."}
        />
      </View>

      <ScrollView contentContainerStyle={[styles.content, isTablet && styles.contentTablet]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Intro générique (pas de contact) ──────────── */}
        {!contactId && (
          <View style={{ backgroundColor: Colors.white, borderRadius: 20, padding: 20, gap: 14, borderWidth: 1.5, borderColor: C.primary + '30', marginBottom: 4 }}>
            {/* Titre */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 26 }}>✨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface, lineHeight: 26 }}>
                  Le Générateur Magique
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2 }}>
                  Des mots justes pour chaque moment
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '50' }} />

            {/* Pitch */}
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 21 }}>
              {'Trouver les bons mots pour un anniversaire, une fête, un mariage… c\'est parfois plus difficile qu\'il n\'y paraît. Le Générateur est là pour ça — rapide, personnalisé, et toujours touchant. 💛'}
            </Text>

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '50' }} />

            {/* 3 modes */}
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface, marginBottom: 2 }}>
              3 façons de créer ton message :
            </Text>
            {[
              { emoji: '✨', label: 'Avec l\'IA', sub: 'Un message unique et personnalisé en quelques secondes' },
              { emoji: '📚', label: 'Depuis un modèle', sub: 'Des centaines de textes prêts à retoucher selon l\'occasion' },
              { emoji: '✏️', label: 'À ta façon', sub: 'Tu écris librement, l\'assistant t\'aide si tu en as besoin' },
            ].map((item) => (
              <View key={item.emoji} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1, paddingTop: 2 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface }}>{item.label}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, lineHeight: 18, marginTop: 1 }}>{item.sub}</Text>
                </View>
              </View>
            ))}

            <View style={{ height: 1, backgroundColor: Colors.outlineVariant + '50' }} />

            {/* Conseil */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.primaryContainer, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 18, marginTop: 1 }}>💡</Text>
              <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 20 }}>
                {'Plus tu renseignes de détails sur ton contact (âge, relation, couleur préférée, anecdote…), plus le message sera personnalisé et touchant.'}
              </Text>
            </View>
          </View>
        )}

        {/* ── Carte contact enrichie ─────────────────────── */}
        {contactId && firstNameInput && (() => {
          const bday = contactFromParam?.birthday ?? null;
          const nday = contactFromParam?.name_day ?? null;
          const displayAge = bday && !bday.startsWith('0000-') ? getAge(bday) : (age ?? null);
          const MONTHS = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.'];

          const fmtMmDd = (mmdd: string) => {
            const [mm, dd] = mmdd.split('-');
            return `${parseInt(dd)} ${MONTHS[parseInt(mm) - 1]}`;
          };

          const daysUntilMmDd = (mmdd: string): number => {
            const today = new Date();
            const [mm, dd] = mmdd.split('-').map(Number);
            let next = new Date(today.getFullYear(), mm - 1, dd);
            if (next < today) next = new Date(today.getFullYear() + 1, mm - 1, dd);
            return Math.round((next.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000);
          };

          const bdayMmDd = bday && !bday.startsWith('0000-') ? bday.slice(5) : bday?.startsWith('0000-') ? bday.slice(6) : null;
          const ndayMmDd = nday ?? null;
          const bdayDays = bdayMmDd ? daysUntilMmDd(bdayMmDd) : null;
          const ndayDays = ndayMmDd ? daysUntilMmDd(ndayMmDd) : null;
          const isUrgentEvent = (bdayDays !== null && bdayDays <= 7) || (ndayDays !== null && ndayDays <= 7);

          const initials = [firstNameInput, lastNameInput]
            .filter(Boolean)
            .map((w) => w[0]?.toUpperCase() ?? '')
            .join('');

          const relLabel = RELATION_LABELS[relation] ?? relation;

          return (
            <View style={{ backgroundColor: C.primaryContainer, borderRadius: 16, borderWidth: 1.5, borderColor: C.primary + '30', padding: 14, gap: 10 }}>
              {/* Ligne principale */}
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                {/* Avatar initiales */}
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 18, color: '#fff' }}>{initials}</Text>
                </View>
                {/* Infos */}
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface }}>
                    {[firstNameInput, lastNameInput].filter(Boolean).join(' ')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {relLabel ? (
                      <View style={{ backgroundColor: C.primary + '20', borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary }}>{relLabel}</Text>
                      </View>
                    ) : null}
                    {displayAge !== null && displayAge >= 0 ? (
                      <View style={{ backgroundColor: '#FEF3C7', borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: '#92400E' }}>{displayAge} ans</Text>
                      </View>
                    ) : null}
                  </View>
                  {bdayMmDd ? (
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant }}>
                      🎂 {bday && !bday.startsWith('0000-')
                        ? `Né·e le ${fmtMmDd(bday.slice(5))}${bday.length >= 4 ? ` ${bday.slice(0, 4)}` : ''}`
                        : `Né·e le ${fmtMmDd(bdayMmDd)}`}
                    </Text>
                  ) : null}
                  {ndayMmDd ? (
                    <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant }}>
                      🌸 Fête le {fmtMmDd(ndayMmDd)}
                      {ndayDays !== null ? (ndayDays === 0 ? ' · aujourd\'hui !' : ndayDays === 1 ? ' · demain !' : ndayDays <= 7 ? ` · dans ${ndayDays}j 🔥` : '') : ''}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Alerte événement urgent */}
              {isUrgentEvent && (
                <View style={{ backgroundColor: C.primary, borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 18 }}>{bdayDays !== null && bdayDays <= 7 ? '🎂' : '🌸'}</Text>
                  <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' }}>
                    {bdayDays !== null && bdayDays <= 7
                      ? bdayDays === 0 ? `Anniversaire de ${firstNameInput} aujourd'hui ! 🎉`
                        : bdayDays === 1 ? `Anniversaire de ${firstNameInput} demain ! 🔥`
                        : `Anniversaire de ${firstNameInput} dans ${bdayDays} jours 🔥`
                      : ndayDays === 0 ? `Fête de ${firstNameInput} aujourd'hui ! 🌸`
                        : ndayDays === 1 ? `Fête de ${firstNameInput} demain ! 🌸`
                        : `Fête de ${firstNameInput} dans ${ndayDays} jours 🌸`}
                  </Text>
                </View>
              )}

              {/* Animaux de compagnie */}
              {contactPets.length > 0 && (
                <View style={{ gap: 4 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.onSurfaceVariant }}>
                    {contactPets.length === 1 ? 'Son animal :' : 'Ses animaux :'}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {contactPets.map((pet) => {
                      const PET_EMOJIS: Record<string, string> = { chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢', autre: '🐾' };
                      const pEmoji = PET_EMOJIS[(pet as any).pet_type ?? ''] ?? '🐾';
                      return (
                        <TouchableOpacity
                          key={pet.id}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary + '15', borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4 }}
                          onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)}
                          activeOpacity={0.75}
                        >
                          <Text style={{ fontSize: 14 }}>{pEmoji}</Text>
                          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary }}>{pet.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Lien fiche */}
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: contactId } } as never)}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.xs, color: C.primary }}>👤 Voir la fiche complète</Text>
                <Text style={{ fontSize: 14, color: C.primary }}>›</Text>
              </TouchableOpacity>
            </View>
          );
        })()}


        {/* ── Destinataire — masqué si contact déjà sélectionné ── */}
        {!contactId && <SectionLabel text="À qui souhaites-tu envoyer ce message ?" large />}
        {!contactId && relation !== 'pet' && (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: Colors.onSurfaceVariant, alignSelf: 'center', marginRight: 4 }}>Civilité :</Text>
            {(['M.', 'Mme'] as const).map((civ) => (
              <TouchableOpacity
                key={civ}
                onPress={() => setManualCivilite(civ === manualCivilite ? null : civ)}
                activeOpacity={0.8}
                style={{ paddingVertical: 6, paddingHorizontal: 16, borderRadius: Radii.full, borderWidth: 1.5, borderColor: manualCivilite === civ ? C.primary : Colors.outlineVariant, backgroundColor: manualCivilite === civ ? C.primaryContainer : Colors.white }}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: manualCivilite === civ ? C.primary : Colors.onSurfaceVariant }}>{civ}</Text>
              </TouchableOpacity>
            ))}
            {!manualCivilite && (
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: '#F59E0B', alignSelf: 'center' }}>⚠️ Sans civilité, les accords seront neutres</Text>
            )}
          </View>
        )}
        <View style={contactId ? { display: 'none' } : styles.nameRow}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.nameFieldLabel}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={firstNameInput}
              onChangeText={handleFirstNameChange}
              placeholder={firstNamePlaceholder[occasion]}
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="words"
            />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.nameFieldLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              value={lastNameInput}
              onChangeText={(v) => handleLastNameChange(v.toUpperCase())}
              placeholder="DUPONT"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="characters"
            />
          </View>
          <View style={{ paddingTop: 22 }}>
            <TouchableOpacity style={styles.contactPickerBtn} onPress={() => setShowContactPicker(!showContactPicker)}>
              <Text style={styles.contactPickerIcon}>👥</Text>
            </TouchableOpacity>
          </View>
        </View>
        {showContactPicker && contacts.length > 0 && (
          <View style={styles.contactDropdown}>
            <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
              {contacts.map((c) => (
                <TouchableOpacity key={c.id} style={styles.contactRow} onPress={() => handleContactSelect(c.id, c.name, c.relation)}>
                  <Text style={styles.contactRowName}>{c.name}</Text>
                  <Text style={styles.contactRowRelation}>{getRelationLabel(c as any, contacts as any[])}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}


        {/* ── Hint animaux ─────────────────────────────── */}
        {relation === 'pet' && (
          <View style={styles.petHintBanner}>
            <Text style={styles.petHintTitle}>🐾 Mode animal activé !</Text>
            <Text style={styles.petHintText}>
              {'L\'IA va créer un message célébrant ton animal.\n💌 Tu veux que ce soit lui qui "écrive" à son humain ? Précise-le dans le champ mémoires ci-dessous.'}
            </Text>
          </View>
        )}
        {!relation && !contactId && (
          <View style={styles.petHintBanner}>
            <Text style={styles.petHintTitle}>🐾 Pour ton animal ?</Text>
            <Text style={styles.petHintText}>
              {'Sélectionne-le via 👥 ou va dans l\'onglet Animaux — l\'IA s\'adapte à sa personnalité et peut même écrire de sa part !'}
            </Text>
          </View>
        )}

        {/* ── Sélection du mode ──────────────────────────────────────────── */}
        <SectionLabel text={firstNameInput ? `Comment veux-tu écrire à ${firstNameInput} ?` : 'Comment veux-tu envoyer ton message ?'} large />

        {/* Mode Jeune — visible si contact 13-25 ans et occasion anniversaire ou fête */}
        {Number(ageInput) >= 13 && Number(ageInput) <= 25 && (occasion === 'birthday' || occasion === 'nameday') && (
          <>
            <TouchableOpacity
              style={[styles.guideModeCard, { borderColor: '#7C3AED40', backgroundColor: '#1a0a2e', borderWidth: 2 }]}
              onPress={() => router.push({ pathname: '/(app)/youth-message-library', params: { contactId: effectiveContactId ?? '', contactName: firstNameInput, occasion: occasion ?? 'birthday', contactAge: ageInput } } as never)}
              activeOpacity={0.85}
            >
              <View style={styles.guideModeHeader}>
                <Text style={styles.guideModeEmoji}>😎</Text>
                <Text style={[styles.guideModeLabel, { color: '#a78bfa' }]}>Tu peux écrire en mode jeune :</Text>
              </View>
              <Text style={[styles.guideModeSub, { color: 'rgba(255,255,255,0.75)' }]}>
                {firstNameInput ? `${firstNameInput} a ${ageInput} ans` : `Contact de ${ageInput} ans`} — envoie un message dans un style cash, direct et fun, sans les formules classiques.
              </Text>
              <View style={[styles.guideModeBtn, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.guideModeBtnText}>Mode Jeune →</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.orSeparator}>ou</Text>
          </>
        )}

        {/* Manuel */}
        <TouchableOpacity
          style={[styles.guideModeCard, { borderColor: '#D9770640', backgroundColor: '#FFF7ED' }, (!firstNameInput.trim() || isCreatingManual) && { opacity: 0.5 }]}
          onPress={handleWriteManually}
          disabled={!firstNameInput.trim() || isCreatingManual}
          activeOpacity={0.85}
        >
          <View style={styles.guideModeHeader}>
            <Text style={styles.guideModeEmoji}>✏️</Text>
            <Text style={[styles.guideModeLabel, { color: '#D97706' }]}>Tu peux écrire à ta façon :</Text>
          </View>
          <Text style={styles.guideModeSub}>Écris ton message librement. L'IA peut t'aider à peaufiner le texte si tu veux un coup de pouce.</Text>
          <View style={[styles.guideModeBtn, { backgroundColor: '#D97706' }]}>
            <Text style={styles.guideModeBtnText}>{isCreatingManual ? 'Ouverture...' : 'Écrire moi-même →'}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.orSeparator}>ou</Text>

        {/* Modèle */}
        <TouchableOpacity
          style={[styles.guideModeCard, { borderColor: C.primary + '40', backgroundColor: C.primaryContainer }]}
          onPress={() => { setBirthdayCategory(null); setBirthdaySubGroupId(null); setStep(childFromName ? 'template-from-child' : 'template-occasion'); }}
          activeOpacity={0.85}
        >
          <View style={styles.guideModeHeader}>
            <Text style={styles.guideModeEmoji}>📋</Text>
            <Text style={[styles.guideModeLabel, { color: C.primary }]}>Tu peux choisir un modèle :</Text>
          </View>
          <Text style={styles.guideModeSub}>Parcours des milliers de messages prêts à l'emploi, écrits par l'IA. Choisis-en un et personnalise-le.</Text>
          <View style={[styles.guideModeBtn, { backgroundColor: C.primary }]}>
            <Text style={styles.guideModeBtnText}>Parcourir les modèles →</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.orSeparator}>ou</Text>

        {/* IA */}
        <TouchableOpacity
          style={[styles.guideModeCard, { borderColor: '#7C3AED40', backgroundColor: '#F3EFFF' }]}
          onPress={() => { setTtsMode(false); setWriteMode('ai'); setStep('ai-guide'); }}
          activeOpacity={0.85}
        >
          <View style={styles.guideModeHeader}>
            <Text style={styles.guideModeEmoji}>✨</Text>
            <Text style={[styles.guideModeLabel, { color: '#7C3AED' }]}>Tu peux écrire avec l'IA :</Text>
          </View>
          <Text style={styles.guideModeSub}>L'IA génère un message unique et personnalisé en quelques secondes, selon l'occasion et le contact.</Text>
          <View style={[styles.guideModeBtn, { backgroundColor: '#7C3AED' }]}>
            <Text style={styles.guideModeBtnText}>Lancer la magie →</Text>
          </View>
        </TouchableOpacity>

        {/* ── Message vocal ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 4 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHighest }} />
          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.onSurfaceVariant, letterSpacing: 1 }}>ET AUSSI</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHighest }} />
        </View>

        <View style={{ borderRadius: Radii.xl, backgroundColor: '#FB8C00', padding: 16, gap: 10 }}>
          <View style={styles.guideModeHeader}>
            <Text style={styles.guideModeEmoji}>🎙️</Text>
            <Text style={[styles.guideModeLabel, { color: '#FFFFFF' }]}>Tu peux envoyer un message vocal :</Text>
          </View>
          <Text style={[styles.guideModeSub, { color: 'rgba(255,255,255,0.92)' }]}>Écris ton message via l'un des modes ci-dessus, puis dans l'aperçu tu pourras le transformer en message audio lu par une voix IA — avec une musique de fond et un lien à partager. Une attention qui sort vraiment du lot 🎧</Text>
        </View>

        <View style={styles.softDivider} />

        {/* ── Message festif animé ── */}
        <TouchableOpacity
          style={{ padding: 0, backgroundColor: 'transparent', borderColor: '#7C3AED', borderWidth: 1.5, borderRadius: Radii.xl, overflow: 'hidden' }}
          onPress={() => router.push({ pathname: '/(app)/cards', params: { ...(contactId ? { contactId, contactName } : {}) } } as never)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7C3AED', '#9b6bb5', '#c084fc']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: Radii.xl, padding: 16, gap: 10 }}
          >
            <View style={styles.guideModeHeader}>
              <Text style={styles.guideModeEmoji}>🎊</Text>
              <Text style={[styles.guideModeLabel, { color: '#fff' }]}>{'Tu peux envoyer un message\nfestif animé :'}</Text>
            </View>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.88)', lineHeight: 19 }}>
              {'Envoie une animation festive avec le prénom de ton proche, un message et une musique. Il ouvre un lien — et c\'est la fête sur son écran !\n\nBien plus sympa qu\'un SMS ou un mail. 💛'}
            </Text>
            <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radii.full, paddingVertical: 8, paddingHorizontal: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' }}>Créer une animation →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.softDivider} />

        {/* ── Mode Morse ── */}
        <View style={{ borderRadius: Radii.xl, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#0d0d1a', '#3b1d5e', '#6D28D9']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: Radii.xl, padding: 16, gap: 10 }}
          >
            <View style={styles.guideModeHeader}>
              <Text style={styles.guideModeEmoji}>📡</Text>
              <Text style={[styles.guideModeLabel, { color: '#fff' }]}>Tu peux aussi activer le Mode Morse :</Text>
            </View>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.88)', lineHeight: 19 }}>
              {'Écris ton message via l\'un des modes ci-dessus, puis dans l\'aperçu tu pourras le convertir en code Morse 😄 — un lien animé avec bips audio et bouton "Révéler le message". Indépendant du message vocal !'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const params = new URLSearchParams({ morse: '1', msg: 'Salut ! Voici un message secret juste pour toi 🤫', anim: 'stars' });
                if (firstNameInput.trim()) params.set('name', firstNameInput.trim());
                WebBrowser.openBrowserAsync(`https://cartes.confetticake.fr/card.html?${params.toString()}`);
              }}
              activeOpacity={0.85}
              style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radii.full, paddingVertical: 8, paddingHorizontal: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}
            >
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#fff' }}>🔊 Écouter un exemple</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ── Option animaux — après les modes, séparée clairement ── */}
        {myPets.length > 0 && contactId && relation !== 'pet' && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHighest }} />
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant }}>OU</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHighest }} />
            </View>
            <View style={{ borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing[3], backgroundColor: '#064E3B' }}>
              {/* Hero */}
              <View style={{ padding: 20, alignItems: 'center' as const, gap: 8 }}>
                <Text style={{ fontSize: 52 }}>
                  {myPets.length === 1 ? (({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢', autre: '🐾' } as Record<string,string>)[myPets[0].pet_type ?? ''] ?? '🐾') : '🐾'}
                </Text>
                <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: '#fff', textAlign: 'center' as const, lineHeight: 28 }}>
                  {myPets.length === 1
                    ? `Et si ${myPets[0].name} prenait le clavier ?`
                    : `Et si l'un de tes animaux prenait le clavier ?`}
                </Text>
                <View style={{ width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.80)', textAlign: 'center' as const, lineHeight: 20 }}>
                  {'Jalousie, tendresse, réclamation de croquettes… L\'IA rédige un message comme si c\'était vraiment lui. Hilarant et attendrissant ! 💛'}
                </Text>
              </View>

              {/* Boutons */}
              <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
                <TouchableOpacity
                  style={{ borderRadius: Radii.full, backgroundColor: '#34D399', paddingVertical: 12, alignItems: 'center' as const }}
                  activeOpacity={0.85}
                  onPress={() => {
                    const pet = myPets[0];
                    if (myPets.length === 1) {
                      router.push({ pathname: '/(app)/animal-message', params: { petId: pet.id, petName: pet.name, petType: pet.pet_type ?? 'autre', breed: (pet as any).breed ?? '', petGender: pet.pet_gender ?? '', direction: 'from_to_third', ownerName: useAuthStore.getState().profile?.full_name ?? '', ownerId: '', thirdName: contactName, thirdId: contactId, personalityTags: JSON.stringify(pet.personality_tags ?? []) } } as never);
                    } else {
                      setPetPickerFreeThird(false);
                      setPetPickerDirection('from_to_third' as any);
                    }
                  }}
                >
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#064E3B' }}>
                    {`Il écrit à ${firstNameInput || 'ce contact'} →`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ borderRadius: Radii.full, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12, alignItems: 'center' as const, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                  activeOpacity={0.85}
                  onPress={() => {
                    const pet = myPets[0];
                    if (myPets.length === 1) {
                      router.push({ pathname: '/(app)/animal-message', params: { petId: pet.id, petName: pet.name, petType: pet.pet_type ?? 'autre', breed: (pet as any).breed ?? '', petGender: pet.pet_gender ?? '', direction: 'from_to_third', ownerName: useAuthStore.getState().profile?.full_name ?? '', ownerId: '', thirdName: '', thirdId: '', personalityTags: JSON.stringify(pet.personality_tags ?? []) } } as never);
                    } else {
                      setPetPickerFreeThird(true);
                      setPetPickerDirection('from_to_third' as any);
                    }
                  }}
                >
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#fff' }}>
                    Il écrit à quelqu'un d'autre →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* ── Carte animal de Sophie ── */}
        {effectiveContactId && relation !== 'pet' && contactPets.length > 0 && (
          <View style={{ borderRadius: Radii.xl, overflow: 'hidden', marginTop: Spacing[3], marginBottom: Spacing[3], backgroundColor: '#3B0764' }}>
            {/* Hero */}
            <View style={{ padding: 20, alignItems: 'center' as const, gap: 8 }}>
              <Text style={{ fontSize: 52 }}>
                {contactPets.length === 1 ? (({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢', autre: '🐾' } as Record<string,string>)[(contactPets[0] as any).pet_type ?? ''] ?? '🐾') : '🐾'}
              </Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: '#fff', textAlign: 'center' as const, lineHeight: 28 }}>
                {contactPets.length === 1
                  ? `Et si ${contactPets[0].name}, ${({ chien: 'le chien', chat: 'le chat', lapin: 'le lapin', oiseau: "l'oiseau", cheval: 'le cheval', hamster: 'le hamster', perroquet: 'le perroquet', cochon_d_inde: 'le cochon d\'Inde', souris: 'la souris', poisson: 'le poisson', tortue: 'la tortue', autre: "l'animal" } as Record<string,string>)[(contactPets[0] as any).pet_type ?? ''] ?? "l'animal"} de ${firstNameInput || 'ce contact'}, prenait le clavier ?`
                  : `Et si un des animaux de ${firstNameInput || 'ce contact'} prenait le clavier ?`}
              </Text>
              <View style={{ width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: 'rgba(255,255,255,0.80)', textAlign: 'center' as const, lineHeight: 20 }}>
                {contactPets.length === 1
                  ? `${contactPets[0].name} peut écrire à ${firstNameInput || 'son humain'} — ou à quelqu'un d'autre de ton choix. L'IA s'exprime à sa place ! 🐾`
                  : `Les animaux de ${firstNameInput || 'ce contact'} prennent la plume ! L'IA s'exprime à leur place — hilarant et attendrissant 🐾`}
              </Text>
            </View>

            {/* Boutons */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
              <TouchableOpacity
                style={{ borderRadius: Radii.full, backgroundColor: '#C084FC', paddingVertical: 12, alignItems: 'center' as const }}
                activeOpacity={0.85}
                onPress={() => {
                  if (contactPets.length === 1) {
                    const p = contactPets[0];
                    router.push({ pathname: '/(app)/animal-message', params: { petId: p.id, petName: p.name, petType: (p as any).pet_type ?? 'autre', breed: (p as any).breed ?? '', petGender: (p as any).pet_gender ?? '', direction: 'from', ownerName: firstNameInput.trim() || contactName, ownerId: contactId ?? '' } } as never);
                  } else {
                    setPetPickerDirection('from');
                  }
                }}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#3B0764' }}>
                  {`Il écrit à ${firstNameInput || 'ce contact'} →`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ borderRadius: Radii.full, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12, alignItems: 'center' as const, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                activeOpacity={0.85}
                onPress={() => {
                  if (contactPets.length === 1) {
                    const p = contactPets[0];
                    router.push({ pathname: '/(app)/animal-message', params: { petId: p.id, petName: p.name, petType: (p as any).pet_type ?? 'autre', breed: (p as any).breed ?? '', petGender: (p as any).pet_gender ?? '', direction: 'from', ownerName: firstNameInput.trim() || contactName, ownerId: contactId ?? '', thirdName: '', thirdId: '' } } as never);
                  } else {
                    setPetPickerDirection('from');
                  }
                }}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#fff' }}>
                  Il écrit à quelqu'un d'autre →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Champs IA uniquement ──────────────────────── */}
        {writeMode === 'ai' && <>

        {/* ── Bannière enfant → parent ─────────────────── */}
        {childFromName && (
          <View style={{ backgroundColor: '#FDF4FF', borderRadius: 12, borderWidth: 1.5, borderColor: '#9333EA40', padding: 12, gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>💌</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 14, color: '#7C3AED' }}>
                  De la part de {childFromName}{childFromAge !== null ? ` (${childFromAge} an${childFromAge > 1 ? 's' : ''})` : ''}
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#6D28D9', marginTop: 2 }}>
                  {childFromName} écrit à {firstNameInput || 'ce contact'} — pour quelle occasion ?
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {([
                { value: 'birthday', emoji: '🎂', label: 'Anniversaire' },
                { value: 'nameday',  emoji: '🎉', label: 'Fête' },
              ] as const).map((o) => (
                <TouchableOpacity
                  key={o.value}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: occasion === o.value ? '#7C3AED' : '#9333EA30', backgroundColor: occasion === o.value ? '#7C3AED' : '#F5F3FF' }}
                  onPress={() => setOccasion(o.value)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 16 }}>{o.emoji}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: occasion === o.value ? '#fff' : '#7C3AED' }}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Bannière contexte enfant ─────────────────── */}
        {childName && (
          <View style={{ backgroundColor: C.primaryContainer, borderRadius: 12, borderWidth: 1.5, borderColor: C.primary + '40', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 22 }}>{occasionParam === 'nameday' ? '🎉' : '🎂'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 14, color: C.primary }}>
                {occasionParam === 'nameday' ? `Fête de ${childName}` : `Anniversaire de ${childName}`}
                {childAge !== null ? ` (${childAge} an${childAge > 1 ? 's' : ''})` : ''}
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#0369A1', marginTop: 2 }}>
                Le message sera envoyé à {firstNameInput || 'ce contact'} pour l'occasion 💛
              </Text>
            </View>
          </View>
        )}

        {/* ── Occasion ─────────────────────────────────── */}
        {!childName && !childFromName && <SectionLabel text="Pour quelle occasion ?" large />}
        {/* Grille 2 colonnes — ExtraFields s'insère inline après la rangée sélectionnée */}
        {!childName && !childFromName && (() => {
          const OCCASIONS_WITH_EXTRAS = new Set(['wedding','birth','graduation','promotion','thanks','support','custom']);
          const rows: typeof OCCASIONS[] = [];
          for (let i = 0; i < OCCASIONS.length; i += 2) rows.push(OCCASIONS.slice(i, i + 2));
          return rows.map((row, rowIdx) => {
            const rowSelected = row.some((o) => o.value === occasion);
            return (
              <React.Fragment key={rowIdx}>
                <View style={styles.occasionRow}>
                  {row.map((o) => (
                    <TouchableOpacity
                      key={o.value}
                      style={[styles.occasionBtn, occasion === o.value && { backgroundColor: o.color + '20', borderColor: o.color }]}
                      onPress={() => setOccasion(o.value)}
                    >
                      <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                      <Text style={[styles.occasionLabel, occasion === o.value && { color: o.color, fontFamily: 'BeVietnamPro_700Bold' }]} numberOfLines={1}>
                        {o.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {row.length === 1 && <View style={styles.occasionBtn} />}
                </View>
                {rowSelected && isSupportOccasion(occasion) && (
                  <View style={styles.supportBanner}>
                    <Text style={styles.supportBannerText}>
                      🤍 Ces messages sont écrits avec douceur et sincérité, loin des formules toutes faites.
                    </Text>
                  </View>
                )}
                {rowSelected && OCCASIONS_WITH_EXTRAS.has(occasion) && (
                  <ExtraFields color={selectedOccasion?.color ?? '#607D8B'} />
                )}
              </React.Fragment>
            );
          });
        })()}

        {/* ── Relation ─────────────────────────────────── */}
        <SectionLabel text="Quelle est la nature de ta relation avec ton contact ?" large />
        <View style={styles.chipRow}>
          {RELATIONS.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.chip, relation === r.value && styles.chipActive]}
              onPress={() => setContact(contactId, combinedName(firstNameInput, lastNameInput), r.value)}
            >
              <Text style={styles.chipEmoji}>{r.emoji}</Text>
              <Text style={[styles.chipLabel, relation === r.value && styles.chipLabelActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sous-relation famille ─────────────────────── */}
        {relation === 'family' && (
          <View style={styles.familySubBox}>
            <Text style={styles.familySubTitle}>Précisez le lien 👨‍👩‍👧</Text>
            <View style={styles.chipRow}>
              {['Frère', 'Sœur', 'Père', 'Mère', 'Grand-père', 'Grand-mère', 'Oncle', 'Tante', 'Cousin', 'Cousine', 'Fils', 'Fille', 'Belle-fille', 'Gendre'].map((sub) => (
                <TouchableOpacity
                  key={sub}
                  style={[styles.chip, familySubRelation === sub.toLowerCase() && styles.chipActive]}
                  onPress={() => setFamilySubRelation(familySubRelation === sub.toLowerCase() ? '' : sub.toLowerCase())}
                >
                  <Text style={[styles.chipLabel, familySubRelation === sub.toLowerCase() && styles.chipLabelActive]}>{sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={familySubRelation}
              onChangeText={setFamilySubRelation}
              placeholder="Ou saisissez le lien (ex: beau-frère, marraine...)"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="none"
            />
          </View>
        )}

        {/* ── Animal domestique ────────────────────────── */}
        <View style={styles.familySubBox}>
          <Text style={styles.familySubTitle}>🐾 A-t-il·elle un animal domestique ?</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, hasPet && styles.chipActive]}
              onPress={() => { setHasPet(!hasPet); if (hasPet) setPetSubRelation(''); }}
            >
              <Text style={[styles.chipLabel, hasPet && styles.chipLabelActive]}>Oui 🐾</Text>
            </TouchableOpacity>
          </View>
          {hasPet && (
            <View style={[styles.chipRow, { marginTop: 8 }]}>
              {[{ label: '🐶 Chien', value: 'chien' }, { label: '🐱 Chat', value: 'chat' }, { label: '🐾 Autre', value: 'autre' }].map((sub) => (
                <TouchableOpacity
                  key={sub.value}
                  style={[styles.chip, petSubRelation === sub.value && styles.chipActive]}
                  onPress={() => setPetSubRelation(petSubRelation === sub.value ? '' : sub.value)}
                >
                  <Text style={[styles.chipLabel, petSubRelation === sub.value && styles.chipLabelActive]}>{sub.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Âge (si pertinent) ───────────────────────── */}
        {hasAge(occasion) && (
          <>
            <SectionLabel text="Âge" />
            <TextInput
              style={styles.input}
              value={ageInput}
              onChangeText={handleAgeChange}
              placeholder="Ex: 30"
              placeholderTextColor={Colors.outlineVariant}
              keyboardType="number-pad"
            />
          </>
        )}

        {/* ── Personnalité (si pertinent) ───────────────── */}
        {hasPersonality(occasion) && relation !== 'pet' && (
          <>
            <SectionLabel text="Quels sont les traits de personnalité de ton contact ?" large />
            <View style={styles.chipRow}>
              {PERSONALITY_TAGS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.chip, personalityTags.includes(t.value) && styles.chipActive]}
                  onPress={() => togglePersonalityTag(t.value)}
                >
                  <Text style={[styles.chipLabel, personalityTags.includes(t.value) && styles.chipLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── Personnalité animal ───────────────────────── */}
        {hasPersonality(occasion) && relation === 'pet' && petSubRelation === 'chien' && (
          <>
            <SectionLabel text="C'est quel genre de chien ? 🐶" large />
            <View style={styles.chipRow}>
              {DOG_TAGS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.chip, petPersonalityTags.includes(t.value) && styles.chipActive]}
                  onPress={() => togglePetPersonalityTag(t.value)}
                >
                  <Text style={styles.chipEmoji}>{t.emoji}</Text>
                  <Text style={[styles.chipLabel, petPersonalityTags.includes(t.value) && styles.chipLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {hasPersonality(occasion) && relation === 'pet' && petSubRelation === 'chat' && (
          <>
            <SectionLabel text="C'est quel genre de chat ? 🐱" large />
            <View style={styles.chipRow}>
              {CAT_TAGS.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.chip, petPersonalityTags.includes(t.value) && styles.chipActive]}
                  onPress={() => togglePetPersonalityTag(t.value)}
                >
                  <Text style={styles.chipEmoji}>{t.emoji}</Text>
                  <Text style={[styles.chipLabel, petPersonalityTags.includes(t.value) && styles.chipLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── Souvenirs / contexte ──────────────────────── */}
        <SectionLabel text="Intègre un souvenir, une anecdote... (optionnel)" large />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={memories}
          onChangeText={setMemories}
          placeholder="Un souvenir partagé, un détail personnel..."
          placeholderTextColor={Colors.outlineVariant}
          multiline
          numberOfLines={3}
        />

        {/* ── Tonalité ─────────────────────────────────── */}
        <SectionLabel text="Quelle tonalité veux-tu donner à ton message ?" large />
        <View style={styles.toneGrid}>
          {availableTones.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.toneBtn, tone === t.value && styles.toneBtnActive]}
              onPress={() => setTone(t.value)}
            >
              <Text style={styles.toneEmoji}>{t.emoji}</Text>
              <Text style={[styles.toneLabel, tone === t.value && styles.toneLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Format ───────────────────────────────────── */}
        <SectionLabel text="Quel type de message veux-tu envoyer ?" large />
        <View style={styles.toneGrid}>
          {availableFormats.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.toneBtn, format === f.value && styles.toneBtnActive]}
              onPress={() => setFormat(f.value)}
            >
              <Text style={styles.toneEmoji}>{f.emoji}</Text>
              <Text style={[styles.toneLabel, format === f.value && styles.toneLabelActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Voix (chanson uniquement) ────────────────── */}
        {format === 'song' && (
          <>
            <SectionLabel text="Quelle voix pour ta chanson ?" large />
            <View style={styles.toneGrid}>
              {([
                { value: 'female', label: 'Voix féminine', emoji: '👩' },
                { value: 'male',   label: 'Voix masculine', emoji: '👨' },
                { value: 'mixed',  label: 'Mixte', emoji: '🎤' },
              ] as const).map((v) => (
                <TouchableOpacity
                  key={v.value}
                  style={[styles.toneBtn, musicVoice === v.value && styles.toneBtnActive]}
                  onPress={() => setMusicVoice(v.value)}
                >
                  <Text style={styles.toneEmoji}>{v.emoji}</Text>
                  <Text style={[styles.toneLabel, musicVoice === v.value && styles.toneLabelActive]}>{v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── Mode "J'ai oublié" (si pertinent) ───────── */}
        {hasLateMode(occasion) && (
          <View style={{ gap: 10 }}>
            <View style={styles.lateRow}>
              <View>
                <Text style={styles.lateTitle}>😅 Tu as oublié ou laissé passer la date ?</Text>
                <Text style={styles.lateSub}>🙈 Active ça et l'IA glissera une excuse légère dans ton message !</Text>
              </View>
              <Switch
                value={lateMode}
                onValueChange={setLateMode}
                trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
                thumbColor={lateMode ? Colors.primary : Colors.outlineVariant}
              />
            </View>
            {lateMode && (
              <View style={{ backgroundColor: '#FFFBEB', borderRadius: Radii.lg, padding: 14, borderWidth: 1, borderColor: '#FDE68A', gap: 6 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: '#92400E' }}>
                  💬 Exemple de ce que l'IA pourrait glisser :
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#78350F', lineHeight: 20, fontStyle: 'italic' }}>
                  {occasion === 'birthday'
                    ? '"Je sais, je sais... je suis un peu en retard — mais tu comptes tellement pour moi que je ne pouvais vraiment pas laisser passer ça sans te le dire ! 😅"'
                    : '"Un tout petit peu en retard, mais le cœur y est — et ça, ça ne change pas ! 🙈"'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Langue du message ────────────────────────── */}
        <SectionLabel text="Langue du message" />

        {/* Bulle explicative */}
        <View style={styles.langBubble}>
          <Text style={styles.langBubbleEmoji}>🌍</Text>
          <Text style={styles.langBubbleText}>
            {'Envoyer un message dans la langue de ton proche, c\'est une petite attention qui fait souvent toute la différence 💛 L\'IA le rédige directement dans la langue choisie.'}
          </Text>
        </View>

        {/* Suggestion dynamique si le contact a une langue préférée non sélectionnée */}
        {contactFromParam?.preferred_language && contactFromParam.preferred_language !== messageLanguage && (() => {
          const lang = MESSAGE_LANGUAGES.find((l) => l.code === contactFromParam.preferred_language);
          if (!lang) return null;
          return (
            <TouchableOpacity
              style={styles.langSuggestBubble}
              onPress={() => setMessageLanguage(contactFromParam.preferred_language as import('../../../src/types/models').AppLanguage)}
              activeOpacity={0.85}
            >
              <Text style={styles.langSuggestText}>
                {'💡 '}
                <Text style={styles.langSuggestName}>{firstNameInput || 'Ton contact'}</Text>
                {` parle ${lang.label.toLowerCase()} — lui écrire dans sa langue lui ferait sûrement plaisir !`}
              </Text>
              <View style={styles.langSuggestBtn}>
                <Text style={styles.langSuggestBtnText}>{lang.flag} Passer en {lang.label} →</Text>
              </View>
            </TouchableOpacity>
          );
        })()}

        <View style={styles.langRow}>
          {MESSAGE_LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langBtn, messageLanguage === l.code && styles.langBtnActive]}
              onPress={() => setMessageLanguage(l.code as import('../../../src/types/models').AppLanguage)}
              activeOpacity={0.8}
            >
              <Text style={styles.langBtnFlag}>{l.flag}</Text>
              <Text style={[styles.langBtnLabel, messageLanguage === l.code && styles.langBtnLabelActive]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Erreur ───────────────────────────────────── */}
        {generationError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{generationError}</Text>
          </View>
        )}

        {/* ── Tag sans faute ───────────────────────────── */}
        <View style={styles.noFautesTag}>
          <Text style={styles.noFautesPrefix}>Messages envoyés sans </Text>
          <Text style={styles.noFautesWrong}>fôte</Text>
          <Text style={styles.noFautesSpace}>  </Text>
          <Text style={styles.noFautesRight}>faute ✓</Text>
        </View>

        {/* ── CTA IA ───────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.ctaBtn, (isPending || !firstNameInput.trim()) && { opacity: 0.5 }]}
          onPress={handleGenerate}
          disabled={isPending || !firstNameInput.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {isPending ? `⏳ Génération...` : `${selectedOccasion.emoji} Lancer la Magie de l'IA`}
          </Text>
        </TouchableOpacity>

        </> /* fin bloc IA */}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal sélection animal ─────────────────────────────────────── */}
      <Modal
        visible={petPickerDirection !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPetPickerDirection(null)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setPetPickerDirection(null)}
        >
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: C.onSurface }}>
                {petPickerDirection === 'to' ? '🐾 Quel animal fêter ?' : petPickerDirection === 'from_to_third' ? '🐾 Quel animal prend la plume ?' : '🐾 De la part de quel animal ?'}
              </Text>
              <TouchableOpacity onPress={() => setPetPickerDirection(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ fontSize: 22, color: C.onSurfaceVariant }}>✕</Text>
              </TouchableOpacity>
            </View>
            {(petPickerDirection === 'from_to_third' ? myPets : contactPets).map((p) => {
              const PET_EMOJIS: Record<string, string> = { chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢', autre: '🐾' };
              const pEmoji = PET_EMOJIS[(p as any).pet_type ?? ''] ?? '🐾';
              return (
                <TouchableOpacity
                  key={p.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.primaryContainer, borderRadius: 16, padding: 16 }}
                  activeOpacity={0.8}
                  onPress={() => {
                    const dir = petPickerDirection;
                    setPetPickerDirection(null);
                    if (dir === 'from_to_third') {
                      const extraParams = petPickerFreeThird ? { thirdName: '', thirdId: '' } : { thirdName: contactName, thirdId: contactId };
                      router.push({ pathname: '/(app)/animal-message', params: { petId: p.id, petName: p.name, petType: (p as any).pet_type ?? 'autre', breed: (p as any).breed ?? '', petGender: (p as any).pet_gender ?? '', direction: 'from_to_third', ownerName: useAuthStore.getState().profile?.full_name ?? '', ownerId: '', ...extraParams, personalityTags: JSON.stringify((p as any).personality_tags ?? []) } } as never);
                    } else {
                      router.push({ pathname: '/(app)/animal-message', params: { petId: p.id, petName: p.name, petType: (p as any).pet_type ?? 'autre', breed: (p as any).breed ?? '', petGender: (p as any).pet_gender ?? '', direction: dir ?? 'to', ownerName: firstNameInput.trim() || contactName, ownerId: contactId ?? '' } } as never);
                    }
                  }}
                >
                  {(p as any).avatar_url
                    ? <Image source={{ uri: (p as any).avatar_url }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                    : <Text style={{ fontSize: 28 }}>{pEmoji}</Text>
                  }
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: C.onSurface, flex: 1 }}>{p.name}</Text>
                  <Text style={{ fontSize: 18, color: C.primary }}>›</Text>
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
  topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },

  content: { padding: Spacing[4], paddingBottom: 80 },
  contentTablet: { maxWidth: 720, width: '100%', alignSelf: 'center' },
  introBanner: {
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    borderWidth: 2,
    borderColor: C.primary,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },
  introText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: C.primary,
    textAlign: 'center',
    lineHeight: 26,
  },
  introTextSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: C.primary,
    textAlign: 'center',
    opacity: 0.75,
    marginBottom: 2,
  },
  introTextName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: C.primary,
    textAlign: 'center',
    lineHeight: 42,
  },
  sectionLabel: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: 10,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceContainerLow,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  sectionLabelLarge: {
    fontSize: Typography.xl,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: 0.2,
    textTransform: 'none',
    color: Colors.onSurface,
    marginTop: Spacing[5],
    marginBottom: Spacing[3],
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: Spacing[3],
  },

  // Occasions (2-column grid)
  occasionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  occasionRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  occasionBtn: {
    width: (SCREEN_WIDTH - Spacing[4] * 2 - 8) / 2,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  occasionEmoji: { fontSize: 18 },
  occasionLabel: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: Colors.onSurfaceVariant,
    flex: 1,
  },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipEmoji: { fontSize: 14 },
  chipLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  chipLabelActive: { color: Colors.white },

  // Family sub-relation
  familySubBox: {
    backgroundColor: C.primaryContainer,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderRadius: Radii.lg,
    padding: Spacing[3],
    marginTop: Spacing[3],
    gap: 8,
  },
  familySubTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
    marginBottom: 4,
  },

  // Name row
  nameRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  nameFieldLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
  },
  andSep: { fontSize: 18 },
  contactPickerBtn: {
    width: 48, height: 48, borderRadius: Radii.md, backgroundColor: Colors.white,
    borderWidth: 0.5, borderColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  contactPickerIcon: { fontSize: 22 },
  contactDropdown: {
    backgroundColor: Colors.white, borderRadius: Radii.md,
    borderWidth: 0.5, borderColor: C.primaryContainer, marginTop: 4, ...Shadows.sm,
  },
  contactRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    gap: 12,
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainer,
  },
  contactRowName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
  contactRowRelation: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  input: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: C.primaryContainer,
    borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: Spacing[3],
    fontSize: Typography.md, fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurface,
  },
  textArea: { height: 88, textAlignVertical: 'top', paddingTop: 10 },

  // Tone / Format 2x2 grid
  toneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toneBtn: {
    width: (SCREEN_WIDTH - Spacing[4] * 2 - 10) / 2,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: 14, borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  toneBtnActive: { backgroundColor: C.primaryContainer, borderColor: C.primary },
  toneEmoji: { fontSize: 22 },
  toneLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurface },
  toneLabelActive: { color: Colors.onPrimaryContainer },

  // Late mode
  lateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing[5], padding: Spacing[4],
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    borderWidth: 0.5, borderColor: C.primaryContainer, ...Shadows.sm,
  },
  lateTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
  lateSub: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface, marginTop: 2 },

  customOccasionBox: {
    marginTop: Spacing[3],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: C.primary,
    padding: Spacing[4],
    gap: 8,
  },
  customOccasionLabel: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.md,
    color: C.primary,
  },
  customOccasionValidate: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  customOccasionValidateText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  customOccasionInput: {
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    paddingVertical: 12,
    paddingHorizontal: Spacing[3],
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorBox: { marginTop: Spacing[4], padding: Spacing[3], backgroundColor: Colors.errorContainer, borderRadius: Radii.md },
  errorText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onError },

  ctaBtn: {
    marginTop: Spacing[6], paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: C.primary, alignItems: 'center', ...Shadows.lg,
  },
  ctaBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },

  // Sélecteur langue message
  langHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
    marginBottom: Spacing[3],
  },
  langBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  langBubbleEmoji: { fontSize: 20, marginTop: 1 },
  langBubbleText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#1E3A5F',
    lineHeight: 20,
  },
  langSuggestBubble: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    gap: 10,
  },
  langSuggestText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#7C2D12',
    lineHeight: 20,
  },
  langSuggestName: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: '#7C2D12',
  },
  langSuggestBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EA580C',
    borderRadius: Radii.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  langSuggestBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: '#fff',
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing[3],
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  langBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  langBtnFlag: { fontSize: 16 },
  langBtnLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  langBtnLabelActive: { color: C.primary },

  manualBtn: {
    marginTop: Spacing[3], paddingVertical: 17, borderRadius: Radii.full,
    borderWidth: 2, borderColor: C.primary,
    backgroundColor: Colors.white, alignItems: 'center',
  },
  manualBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: C.primary,
  },
  petHintBanner: {
    backgroundColor: '#FFFBF0',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: Radii.xl,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    gap: 4,
  },
  petHintTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#92400E',
  },
  petHintText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#78350F',
    lineHeight: 18,
  },
  modeRow: {
    flexDirection: 'row', gap: 12,
    marginTop: Spacing[5], marginBottom: Spacing[2],
  },
  modeCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: Radii.xl,
    borderWidth: 2, borderColor: Colors.outline,
    backgroundColor: Colors.surfaceContainer,
  },
  modeCardActive: {
    borderColor: Colors.onSurface,
    borderWidth: 3,
    backgroundColor: C.primary,
    ...Shadows.md,
  },
  modeCardEmoji: { fontSize: 28 },
  modeCardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  modeCardTitleActive: { color: C.onPrimary },
  modeCardSub: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  modeCardSubActive: { color: C.onPrimary },
  modeChevron: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
    alignSelf: 'center',
  },
  modeChevronActive: { color: C.onPrimary },

  // Beaux modes (style landing page message-guide)
  guideModeCard: { borderRadius: Radii.xl, padding: Spacing[4], borderWidth: 1.5, gap: 10 },
  orSeparator: {
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginVertical: Spacing[2],
  },
  softDivider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerHighest,
    marginVertical: Spacing[3],
    marginHorizontal: Spacing[8],
  },
  guideModeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  guideModeEmoji: { fontSize: 28 },
  guideModeLabel: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl },
  guideModeSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, lineHeight: 22 },
  guideModeBtn: { borderRadius: Radii.full, paddingVertical: 11, paddingHorizontal: 24, alignItems: 'center' as const, alignSelf: 'flex-start' as const },
  guideModeBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  // Template mode (full-width card below the row)
  modeCardFull: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: Radii.xl,
    borderWidth: 2, borderColor: Colors.outline,
    backgroundColor: Colors.surfaceContainer,
    marginTop: 10,
  },
  modeCardFullActive: {
    borderColor: Colors.onSurface,
    borderWidth: 3,
    backgroundColor: C.primary,
    ...Shadows.md,
  },

  // Template list
  templateSection: {
    marginTop: Spacing[4],
    gap: 10,
  },
  templateHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 4,
  },
  templateCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    padding: Spacing[4],
    gap: 8,
    ...Shadows.sm,
  },
  templateCardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },
  templateCardPreview: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  templateCardSeeMore: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  templateCardFooter: {
    borderTopWidth: 0.5,
    borderTopColor: C.primaryContainer,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  templateCardCta: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  // Modale aperçu texte complet
  templateModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  templateModalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing[5],
    maxHeight: '80%',
    gap: Spacing[4],
  },
  templateModalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  templateModalScroll: {
    maxHeight: 380,
  },
  templateModalText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  templateModalActions: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  templateModalCancelBtn: {
    flex: 1, paddingVertical: 13,
    borderRadius: Radii.full,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
  },
  templateModalCancelText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  templateModalUseBtn: {
    flex: 2, paddingVertical: 13,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  templateModalUseBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.white,
  },

  // Template — occasion picker
  templateOccasionLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    marginTop: 4,
    marginBottom: 8,
  },
  templateOccasionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  templateOccasionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  templateOccasionEmoji: { fontSize: 13 },
  templateOccasionText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  templateEmpty: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  filterLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 6,
    marginBottom: 2,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  filterBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  filterBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  filterBtnTextActive: {
    color: C.primary,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  styleAmbBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 2,
  },
  styleAmbEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  styleAmbText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Contact chooser
  chooserContent: { flex: 1, padding: Spacing[5], justifyContent: 'flex-start', gap: 16, paddingTop: Spacing[4] },
  chooserContentTablet: { maxWidth: 600, width: '100%', alignSelf: 'center' },
  chooserHero: {
    borderRadius: Radii.xl,
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing[2],
  },
  chooserHeroEmoji: { fontSize: 48 },
  chooserHeroTagline: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  chooserTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center' },
  chooserSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: 8 },
  chooserBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.primary, borderRadius: Radii.xl,
    padding: Spacing[4], ...Shadows.md,
  },
  chooserBtnSecondary: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: C.primaryContainer },
  chooserBtnEmoji: { fontSize: 28 },
  chooserBtnText: { flex: 1 },
  chooserBtnTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.white },
  chooserBtnSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.primaryContainer, marginTop: 2 },
  chooserArrow: { fontSize: 24, color: C.primary },

  // Contact avatar
  contactAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
  },

  viewContactBtn: {
    alignSelf: 'center',
    marginTop: Spacing[2],
    marginBottom: Spacing[2],
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: Colors.white,
  },
  viewContactBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  // Tag sans faute
  noFautesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: Spacing[5],
    marginBottom: Spacing[2],
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: '#A5D6A7',
    borderRadius: Radii.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  noFautesPrefix: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: '#2E7D32',
  },
  noFautesWrong: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: '#e53935',
    textDecorationLine: 'line-through',
  },
  noFautesSpace: { fontSize: Typography.base },
  noFautesRight: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: Typography.base,
    color: '#2E7D32',
  },

  // Support banner
  supportBanner: {
    backgroundColor: '#5C8FA815',
    borderLeftWidth: 3,
    borderLeftColor: '#5C8FA8',
    borderRadius: Radii.md,
    padding: Spacing[3],
    marginBottom: Spacing[2],
  },
  supportBannerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#5C8FA8',
    lineHeight: 20,
  },

  });

}
