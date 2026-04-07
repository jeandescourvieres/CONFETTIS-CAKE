import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContacts } from '../../../src/hooks/useContacts';
import { useCreateStore } from '../../../src/stores/createStore';
import { useAIGenerate } from '../../../src/hooks/useAIGenerate';
import { getAge } from '../../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
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
  { value: 'newyear', label: 'Nouvel An', emoji: '🎆', color: '#9C27B0' },
  { value: 'custom', label: 'Autre occasion', emoji: '🎯', color: '#607D8B' },
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
  { value: 'joke', label: 'Humour', emoji: '✨' },
];

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

// ── Extra fields per occasion ─────────────────────────────────────────────────
function ExtraFields() {
  const { occasion, extras, setExtras, contactName } = useCreateStore();

  switch (occasion) {
    case 'wedding':
      return (
        <>
          <SectionLabel text="Prénom·s des mariés" />
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={extras.partner1Name ?? ''}
              onChangeText={(v) => setExtras({ partner1Name: v })}
              placeholder="Prénom 1"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="words"
            />
            <Text style={styles.andSep}>💍</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={extras.partner2Name ?? ''}
              onChangeText={(v) => setExtras({ partner2Name: v })}
              placeholder="Prénom 2"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="words"
            />
          </View>
        </>
      );

    case 'birth':
      return (
        <>
          <SectionLabel text="Prénom du bébé (optionnel)" />
          <TextInput
            style={styles.input}
            value={extras.babyName ?? ''}
            onChangeText={(v) => setExtras({ babyName: v })}
            placeholder="Ex: Léa"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
          <SectionLabel text="Prénom(s) des parents (optionnel)" />
          <TextInput
            style={styles.input}
            value={extras.parentNames ?? ''}
            onChangeText={(v) => setExtras({ parentNames: v })}
            placeholder="Ex: Sophie et Paul"
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="words"
          />
        </>
      );

    case 'graduation':
      return (
        <>
          <SectionLabel text="Diplôme / réussite" />
          <TextInput
            style={styles.input}
            value={extras.diplomaLabel ?? ''}
            onChangeText={(v) => setExtras({ diplomaLabel: v })}
            placeholder="Ex: Master 2, bac, permis de conduire..."
            placeholderTextColor={Colors.outlineVariant}
          />
        </>
      );

    case 'promotion':
      return (
        <>
          <SectionLabel text="Nouveau poste / entreprise (optionnel)" />
          <TextInput
            style={styles.input}
            value={extras.newJobTitle ?? ''}
            onChangeText={(v) => setExtras({ newJobTitle: v })}
            placeholder="Ex: Directrice Marketing chez Acme"
            placeholderTextColor={Colors.outlineVariant}
          />
        </>
      );

    case 'thanks':
      return (
        <>
          <SectionLabel text="Motif du remerciement (optionnel)" />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={extras.thankReason ?? ''}
            onChangeText={(v) => setExtras({ thankReason: v })}
            placeholder="Ex: m'avoir aidé pendant mon déménagement..."
            placeholderTextColor={Colors.outlineVariant}
            multiline
            numberOfLines={3}
          />
        </>
      );

    case 'custom':
      return (
        <>
          <SectionLabel text="Précise l'occasion" />
          <TextInput
            style={styles.input}
            value={extras.customOccasionLabel ?? ''}
            onChangeText={(v) => setExtras({ customOccasionLabel: v })}
            placeholder="Ex: Départ à la retraite, Encouragement 💪, Victoire sportive..."
            placeholderTextColor={Colors.outlineVariant}
            autoCapitalize="sentences"
          />
        </>
      );

    default:
      return null;
  }
}

// ── Contact chooser (étape initiale) ─────────────────────────────────────────
function ContactChooser({ onExisting, onNew }: { onExisting: () => void; onNew: () => void }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.topbarTitle}>Nouveau message ✨</Text>
      </View>
      <View style={styles.chooserContent}>
        <Text style={styles.chooserTitle}>Pour qui est ce message ?</Text>
        <Text style={styles.chooserSub}>Choisissez un contact existant ou créez-en un nouveau</Text>

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
  const { data: contacts = [] } = useContacts();
  const { generate, isPending } = useAIGenerate();

  const {
    contactId, contactName, relation, occasion, age,
    personalityTags, memories, lateMode, format, tone,
    setContact, setOccasion, setAge, togglePersonalityTag,
    setMemories, setLateMode, setFormat, setTone,
    generationError,
  } = useCreateStore();

  const nameParts = contactName.split(' ');
  const [firstNameInput, setFirstNameInput] = useState(nameParts[0] ?? '');
  const [lastNameInput, setLastNameInput] = useState(nameParts.slice(1).join(' '));
  const [ageInput, setAgeInput] = useState(age ? String(age) : '');
  const [autoMode, setAutoMode] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [step, setStep] = useState<'choose' | 'pick' | 'form'>(contactName ? 'form' : 'choose');

  const selectedOccasion = OCCASIONS.find((o) => o.value === occasion)!;

  const firstNamePlaceholder: Record<Occasion, string> = {
    birthday: 'Ex: Marie', nameday: 'Ex: Jean', wedding: 'Ex: Sophie',
    birth: 'Ex: Sophie', graduation: 'Ex: Lucas', promotion: 'Ex: Camille',
    thanks: 'Ex: Marc', newyear: 'Ex: Famille', custom: 'Ex: Lucie',
  };

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
    const first = parts[0] ?? '';
    const last = parts.slice(1).join(' ');
    setFirstNameInput(first);
    setLastNameInput(last);
    setContact(id, name, rel);
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

  const handleGenerate = async () => {
    await generate();
    const content = useCreateStore.getState().generatedContent;
    if (content) router.push('/(app)/create/studio' as never);
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
        <View style={styles.autoToggle}>
          <Text style={styles.autoLabel}>Auto</Text>
          <Switch
            value={autoMode}
            onValueChange={setAutoMode}
            trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
            thumbColor={autoMode ? Colors.primary : Colors.outlineVariant}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Occasion ─────────────────────────────────── */}
        <SectionLabel text="Occasion" />
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

        {/* ── Relation ─────────────────────────────────── */}
        <SectionLabel text="Relation" />
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

        {/* ── Destinataire ──────────────────────────────── */}
        <SectionLabel text="Destinataire" />
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

        {/* ── Champs spécifiques à l'occasion ──────────── */}
        <ExtraFields />

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
            <SectionLabel text="Personnalité" />
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
        <SectionLabel text="Souvenirs / contexte (optionnel)" />
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
        <SectionLabel text="Tonalité" />
        <View style={styles.toneGrid}>
          {TONES.map((t) => (
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
        <SectionLabel text="Format" />
        <View style={styles.toneGrid}>
          {FORMATS.map((f) => (
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
              <Text style={styles.lateTitle}>J'ai oublié 😅</Text>
              <Text style={styles.lateSub}>Ajoute une touche d'excuse légère</Text>
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

        {/* ── CTA ──────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.ctaBtn, (isPending || !firstNameInput.trim()) && { opacity: 0.5 }]}
          onPress={handleGenerate}
          disabled={isPending || !firstNameInput.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {isPending ? `⏳ Génération...` : `${selectedOccasion.emoji} Lancer la Magie`}
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: Colors.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
  autoToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  autoLabel: { fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.base, color: Colors.onSurfaceVariant },

  content: { padding: Spacing[4], paddingBottom: 80 },
  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant, marginTop: Spacing[5], marginBottom: Spacing[2],
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
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipEmoji: { fontSize: 14 },
  chipLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  chipLabelActive: { color: Colors.white },

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
    borderWidth: 0.5, borderColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  contactPickerIcon: { fontSize: 22 },
  contactDropdown: {
    backgroundColor: Colors.white, borderRadius: Radii.md,
    borderWidth: 0.5, borderColor: Colors.primaryContainer, marginTop: 4, ...Shadows.sm,
  },
  contactRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainer,
  },
  contactRowName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
  contactRowRelation: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  input: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.primaryContainer,
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
  toneBtnActive: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primary },
  toneEmoji: { fontSize: 22 },
  toneLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurface },
  toneLabelActive: { color: Colors.onPrimaryContainer },

  // Late mode
  lateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing[5], padding: Spacing[4],
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    borderWidth: 0.5, borderColor: Colors.primaryContainer, ...Shadows.sm,
  },
  lateTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
  lateSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },

  errorBox: { marginTop: Spacing[4], padding: Spacing[3], backgroundColor: Colors.errorContainer, borderRadius: Radii.md },
  errorText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onError },

  ctaBtn: {
    marginTop: Spacing[6], paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: Colors.primary, alignItems: 'center', ...Shadows.lg,
  },
  ctaBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },

  // Contact chooser
  chooserContent: { flex: 1, padding: Spacing[5], justifyContent: 'center', gap: 16 },
  chooserTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center' },
  chooserSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center', marginBottom: 16 },
  chooserBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.primary, borderRadius: Radii.xl,
    padding: Spacing[4], ...Shadows.md,
  },
  chooserBtnSecondary: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.primaryContainer },
  chooserBtnEmoji: { fontSize: 28 },
  chooserBtnText: { flex: 1 },
  chooserBtnTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.white },
  chooserBtnSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.primaryContainer, marginTop: 2 },
  chooserArrow: { fontSize: 24, color: Colors.primary },

  // Contact avatar
  contactAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
});
