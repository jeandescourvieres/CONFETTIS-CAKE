import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContacts } from '../../../src/hooks/useContacts';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { saveMessage } from '../../../src/services/messages.service';
import { useAuthStore } from '../../../src/stores/authStore';
import { getAge } from '../../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import type { Relation } from '../../../src/types/models';
import type { MessageFormat, MessageTone } from '../../../src/types/models';
import type { PersonalityTag, Occasion } from '../../../src/stores/createStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Occasion definitions ──────────────────────────────────────────────────────

const OCCASIONS: { value: Occasion; label: string; emoji: string; color: string }[] = [
  { value: 'birthday', label: 'Anniversaire', emoji: '🎂', color: '#9b6bb5' },
  { value: 'nameday', label: 'Bonne Fête', emoji: '🌸', color: '#e88fa3' },
  { value: 'wedding', label: 'Mariage', emoji: '💍', color: '#c9a8e0' },
  { value: 'birth', label: 'Naissance', emoji: '👶', color: '#fdd34d' },
  { value: 'graduation', label: 'Diplôme', emoji: '🎓', color: '#4CAF50' },
  { value: 'promotion', label: 'Promotion', emoji: '📈', color: '#2196F3' },
  { value: 'thanks', label: 'Remerciements', emoji: '🙏', color: '#FF9800' },
  { value: 'newyear',    label: 'Nouvel An',       emoji: '🎆', color: '#9C27B0' },
  { value: 'christmas',  label: 'Noël',            emoji: '🎄', color: '#C62828' },
  { value: 'easter',     label: 'Pâques',          emoji: '🐣', color: '#7CB342' },
  { value: 'valentines', label: 'Saint-Valentin',  emoji: '💝', color: '#E91E63' },
  { value: 'mothersday', label: 'Fête des Mères',  emoji: '👩', color: '#F06292' },
  { value: 'fathersday', label: 'Fête des Pères',  emoji: '👨', color: '#1976D2' },
  { value: 'halloween',  label: 'Halloween',       emoji: '🎃', color: '#E65100' },
  { value: 'retirement', label: 'Retraite',        emoji: '🌴', color: '#00796B' },
  { value: 'support',    label: 'Soutien',         emoji: '🤍', color: '#5C8FA8' },
  { value: 'custom',     label: 'Autre occasion',  emoji: '🎯', color: '#607D8B' },
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


const RELATION_LABELS: Record<string, string> = {
  best_friend: 'Meilleur·e ami·e',
  friend: 'Ami·e',
  family: 'Famille',
  partner: 'Amour',
  colleague: 'Collègue',
  other: 'Autre',
};

const RELATIONS: { value: Relation; label: string; emoji: string }[] = [
  { value: 'colleague', label: 'Collègue', emoji: '💼' },
  { value: 'partner', label: 'Amour', emoji: '💑' },
  { value: 'best_friend', label: 'Meilleur·e ami·e', emoji: '💜' },
  { value: 'friend', label: 'Ami·e', emoji: '😊' },
  { value: 'family', label: 'Famille', emoji: '👨‍👩‍👧' },
  { value: 'other', label: 'Autre', emoji: '👤' },
];

const PERSONALITY_TAGS: { value: PersonalityTag; label: string }[] = [
  { value: 'drôle', label: 'Drôle' }, { value: 'calme', label: 'Calme' },
  { value: 'passionné', label: 'Passionné·e' }, { value: 'créatif', label: 'Créatif·ve' },
  { value: 'sportif', label: 'Sportif·ve' }, { value: 'gourmand', label: 'Gourmand·e' },
  { value: 'voyageur', label: 'Voyageur·se' }, { value: 'geek', label: 'Geek' },
];

const TONES: { value: MessageTone; label: string; emoji: string }[] = [
  { value: 'humorous', label: 'Humoristique', emoji: '😂' },
  { value: 'touching', label: 'Touchant', emoji: '🥹' },
  { value: 'playful', label: 'Chaleureux', emoji: '🤗' },
  { value: 'poetic', label: 'Poétique', emoji: '🌙' },
];

const FORMATS: { value: MessageFormat; label: string; emoji: string }[] = [
  { value: 'song', label: 'Chanson', emoji: '🎵' },
  { value: 'poem', label: 'Poème', emoji: '✍️' },
  { value: 'message', label: 'Message', emoji: '💬' },
  { value: 'joke', label: 'Blague', emoji: '😂' },
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
            style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
            value={extras.parentNames ?? ''}
            onChangeText={(v) => setExtras({ parentNames: v })}
            placeholder="👨‍👩‍👧 Prénom(s) des parents (optionnel)"
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
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.topbarTitle}>Créer un message ✨</Text>
      </View>
      <View style={styles.chooserContent}>
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
  const { data: contacts = [] } = useContacts();
  const [search, setSearch] = useState('');
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <Text style={{ fontSize: 28, color: Colors.primary, lineHeight: 32 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Choisir un contact</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={{ padding: Spacing[4] }}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher..."
          placeholderTextColor={Colors.outlineVariant}
          autoFocus
        />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
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
              <Text style={styles.contactRowRelation}>{RELATION_LABELS[c.relation] ?? c.relation}</Text>
            </View>
            <Text style={styles.chooserArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CreateScreen() {
  const router = useRouter();
  const C = useColors();
  const user = useAuthStore((s) => s.user);
  const { data: contacts = [] } = useContacts();
  const { generate, isPending } = useAIGenerate(() => router.push('/(app)/create/preview' as never));

  const {
    contactId, contactName, relation, familySubRelation, occasion, age,
    personalityTags, memories, lateMode, format, tone, extras,
    setContact, setFamilySubRelation, setOccasion, setAge, togglePersonalityTag,
    setMemories, setLateMode, setFormat, setTone, setExtras,
    setGeneratedContent, setSavedMessageId,
    generationError, reset,
  } = useCreateStore();

  // Réinitialiser le store à chaque ouverture du Create screen
  useEffect(() => { reset(); }, []);

  // Toujours vierge à l'ouverture (reset() efface le store mais après le 1er render)
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('');

  const [showContactPicker, setShowContactPicker] = useState(false);
  const [step, setStep] = useState<'choose' | 'pick' | 'form'>('choose');
  const [writeMode, setWriteMode] = useState<'ai' | 'manual'>('ai');

  const selectedOccasion = OCCASIONS.find((o) => o.value === occasion)!;

  const firstNamePlaceholder: Record<Occasion, string> = {
    birthday: 'Ex: Marie', nameday: 'Ex: Jean', wedding: 'Ex: Sophie',
    birth: 'Ex: Sophie', graduation: 'Ex: Lucas', promotion: 'Ex: Camille',
    thanks: 'Ex: Marc', newyear: 'Ex: Famille', christmas: 'Ex: Famille',
    easter: 'Ex: Famille', valentines: 'Ex: Chéri(e)', mothersday: 'Ex: Maman',
    fathersday: 'Ex: Papa', halloween: 'Ex: Les enfants',
    support: 'Ex: Paul', custom: 'Ex: Lucie',
  };

  // Formats et tonalités disponibles selon l'occasion
  const availableFormats = isSupportOccasion(occasion)
    ? FORMATS.filter((f) => f.value === 'message' || f.value === 'poem')
    : FORMATS;

  const availableTones = isSupportOccasion(occasion)
    ? TONES.filter((t) => t.value === 'touching' || t.value === 'poetic' || t.value === 'playful')
    : TONES;

  // Recaler format/tone si invalide pour l'occasion en cours
  useEffect(() => {
    if (isSupportOccasion(occasion)) {
      if (format === 'song' || format === 'joke') setFormat('message');
      if (tone === 'humorous') setTone('touching');
    }
  }, [occasion]);

  const combinedName = (fn: string, ln: string) =>
    [fn.trim(), ln.trim()].filter(Boolean).join(' ');

  const handleFirstNameChange = (text: string) => {
    setFirstNameInput(text);
    setContact(null, combinedName(text, lastNameInput), relation);
  };

  const handleLastNameChange = (text: string) => {
    const upper = text.toUpperCase();
    setLastNameInput(upper);
    setContact(null, combinedName(firstNameInput, upper), relation);
  };

  const handleAgeChange = (text: string) => {
    setAgeInput(text);
    const parsed = parseInt(text, 10);
    setAge(isNaN(parsed) ? null : parsed);
  };

  const handleContactSelect = (id: string, name: string, rel: Relation) => {
    const contact = contacts.find((c) => c.id === id);
    // Split name into first / last
    const parts = name.split(' ');
    // nom stocké en "NOM Prénom"
    const last = parts[0] ?? '';
    const first = parts.slice(1).join(' ');
    setFirstNameInput(first || last); // si pas de prénom, utilise le nom seul
    setLastNameInput(first ? last : '');
    setContact(id, name, rel, contact?.phone ?? null, contact?.email ?? null);
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
      router.push('/(app)/create/preview' as never);
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
        onNew={() => router.push('/(app)/contacts/new' as never)}
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.topbarTitle}>Générateur Magique ✨</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Intro ─────────────────────────────────────── */}
        <View style={styles.introBanner}>
          <Text style={styles.introText}>🎉 C'est parti !{'\n'}Créons ensemble un message{'\n'}qui va faire son effet !</Text>
        </View>

        {/* ── Destinataire ──────────────────────────────── */}
        <SectionLabel text="À qui souhaites-tu envoyer ce message ?" large />
        <View style={styles.nameRow}>
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
                  <Text style={styles.contactRowRelation}>{RELATION_LABELS[c.relation] ?? c.relation}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Toggle Mode ──────────────────────────────── */}
        <SectionLabel text="Comment veux-tu envoyer ton message ?" large />
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeCard, writeMode === 'ai' && styles.modeCardActive]}
            onPress={() => setWriteMode('ai')}
            activeOpacity={0.8}
          >
            <Text style={styles.modeCardEmoji}>✨</Text>
            <Text style={[styles.modeCardTitle, writeMode === 'ai' && styles.modeCardTitleActive]}>En mode Magique</Text>
            <Text style={[styles.modeCardSub, writeMode === 'ai' && styles.modeCardSubActive]}>C'est l'IA qui s'en charge !</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeCard, writeMode === 'manual' && styles.modeCardActive]}
            onPress={() => setWriteMode('manual')}
            activeOpacity={0.8}
          >
            <Text style={styles.modeCardEmoji}>✏️</Text>
            <Text style={[styles.modeCardTitle, writeMode === 'manual' && styles.modeCardTitleActive]}>À ma façon</Text>
            <Text style={[styles.modeCardSub, writeMode === 'manual' && styles.modeCardSubActive]}>J'écris moi-même mon propre texte</Text>
          </TouchableOpacity>
        </View>

        {/* ── Champs IA uniquement ──────────────────────── */}
        {writeMode === 'ai' && <>

        {/* ── Occasion ─────────────────────────────────── */}
        <SectionLabel text="Pour quelle occasion ?" large />
        <View style={styles.occasionGrid}>
          {OCCASIONS.map((o) => (
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
        </View>

        {/* ── Bandeau soutien ──────────────────────────── */}
        {isSupportOccasion(occasion) && (
          <View style={styles.supportBanner}>
            <Text style={styles.supportBannerText}>
              🤍 Ces messages sont écrits avec douceur et sincérité, loin des formules toutes faites.
            </Text>
          </View>
        )}

        {/* ── Champs spécifiques à l'occasion ──────────── */}
        <ExtraFields color={selectedOccasion?.color ?? '#607D8B'} />

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
              {['Frère', 'Sœur', 'Père', 'Mère', 'Grand-père', 'Grand-mère', 'Oncle', 'Tante', 'Cousin·e', 'Fils', 'Fille'].map((sub) => (
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
        {hasPersonality(occasion) && (
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

        {/* ── Mode "J'ai oublié" (si pertinent) ───────── */}
        {hasLateMode(occasion) && (
          <View style={styles.lateRow}>
            <View>
              <Text style={styles.lateTitle}>😅 Tu as oublié ou laissé passer la date ?</Text>
              <Text style={styles.lateSub}>🙈 Alors ajoute une touche d'excuse légère !</Text>
            </View>
            <Switch
              value={lateMode}
              onValueChange={setLateMode}
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor={lateMode ? Colors.primary : Colors.outlineVariant}
            />
          </View>
        )}

        {/* ── Erreur ───────────────────────────────────── */}
        {generationError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{generationError}</Text>
          </View>
        )}

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

        {/* ── CTA Manuel ───────────────────────────────── */}
        {writeMode === 'manual' && (
          <TouchableOpacity
            style={[styles.ctaBtn, (!firstNameInput.trim() || isCreatingManual) && { opacity: 0.5 }]}
            onPress={handleWriteManually}
            disabled={!firstNameInput.trim() || isCreatingManual}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>
              {isCreatingManual ? '...' : '✏️ Commence à écrire'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },

  content: { padding: Spacing[4], paddingBottom: 80 },
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
  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant, marginTop: Spacing[5], marginBottom: Spacing[2],
  },
  sectionLabelLarge: {
    fontSize: Typography.md,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: 0.3,
    textTransform: 'none',
    color: Colors.onSurface,
  },

  // Occasions (2-column grid)
  occasionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  occasionBtn: {
    width: (SCREEN_WIDTH - Spacing[4] * 2 - 8) / 2,
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingVertical: 9, paddingHorizontal: 12,
    borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  occasionEmoji: { fontSize: 16 },
  occasionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant,
    flexShrink: 1,
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
  manualBtn: {
    marginTop: Spacing[3], paddingVertical: 17, borderRadius: Radii.full,
    borderWidth: 2, borderColor: C.primary,
    backgroundColor: Colors.white, alignItems: 'center',
  },
  manualBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: C.primary,
  },
  modeRow: {
    flexDirection: 'row', gap: 12,
    marginTop: Spacing[5], marginBottom: Spacing[2],
  },
  modeCard: {
    flex: 1, alignItems: 'center', gap: 6,
    paddingVertical: 18, paddingHorizontal: 8,
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
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  modeCardSubActive: { color: C.onPrimary },

  // Contact chooser
  chooserContent: { flex: 1, padding: Spacing[5], justifyContent: 'center', gap: 16 },
  chooserTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center' },
  chooserSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: 16 },
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
