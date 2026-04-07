import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateContact, useContact, useUpdateContact } from '../../../src/hooks/useContacts';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import type { Relation } from '../../../src/types/models';

const PERSONALITY_TAGS: { value: string; label: string }[] = [
  { value: 'drôle', label: 'Drôle' },
  { value: 'calme', label: 'Calme' },
  { value: 'passionné', label: 'Passionné·e' },
  { value: 'créatif', label: 'Créatif·ve' },
  { value: 'sportif', label: 'Sportif·ve' },
  { value: 'gourmand', label: 'Gourmand·e' },
  { value: 'voyageur', label: 'Voyageur·se' },
  { value: 'geek', label: 'Geek' },
];

const RELATIONS: { value: Relation; label: string; emoji: string }[] = [
  { value: 'best_friend', label: 'Meilleur·e ami·e', emoji: '💜' },
  { value: 'friend', label: 'Ami·e', emoji: '😊' },
  { value: 'family', label: 'Famille', emoji: '👨‍👩‍👧' },
  { value: 'partner', label: 'Partenaire', emoji: '💑' },
  { value: 'colleague', label: 'Collègue', emoji: '💼' },
  { value: 'other', label: 'Autre', emoji: '👤' },
];

export default function NewContactScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const { mutateAsync: createContact, isPending: isCreating } = useCreateContact();
  const { mutateAsync: updateContact, isPending: isUpdating } = useUpdateContact();
  const { data: existingContact } = useContact(editId ?? '');
  const isPending = isCreating || isUpdating;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relation, setRelation] = useState<Relation>('friend');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [personalityTags, setPersonalityTags] = useState<string[]>([]);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Réinitialiser quand on crée un nouveau contact
  useEffect(() => {
    if (!isEditing) {
      setFirstName('');
      setLastName('');
      setRelation('friend');
      setPhone('');
      setEmail('');
      setNotes('');
      setPersonalityTags([]);
      setBirthday(null);
    }
  }, [isEditing]);

  // Pré-remplir les champs si on est en mode édition
  useEffect(() => {
    if (!isEditing || !existingContact) return;
    const parts = existingContact.name.split(' ');
    setFirstName(formatFirstName(parts[0] ?? ''));
    setLastName(formatLastName(parts.slice(1).join(' ')));
    setRelation(existingContact.relation);
    setPhone(existingContact.phone ?? '');
    setEmail(existingContact.email ?? '');
    setNotes(existingContact.notes ?? '');
    setPersonalityTags(Array.isArray(existingContact.personality_tags) ? existingContact.personality_tags : []);
    if (existingContact.birthday) {
      const [y, m, d] = existingContact.birthday.split('-').map(Number);
      setBirthday(new Date(y, m - 1, d));
    }
  }, [isEditing, existingContact]);

  // Prénom : 1re lettre de chaque segment (espace ou tiret) en majuscule
  const formatFirstName = (raw: string) =>
    raw
      .split(/(-| )/)
      .map((part) =>
        part === '-' || part === ' '
          ? part
          : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join('');

  // Nom : tout en majuscules
  const formatLastName = (raw: string) => raw.toUpperCase();

  const normalizePhone = (raw: string): string | null => {
    const cleaned = raw.replace(/[\s\-\.\(\)]/g, '');
    if (!cleaned) return null;
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.startsWith('00')) return '+' + cleaned.slice(2);
    if (cleaned.startsWith('0') && cleaned.length >= 9) return '+33' + cleaned.slice(1);
    return cleaned || null;
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Prénom requis', 'Veuillez entrer le prénom du contact.');
      return;
    }
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
    const birthdayStr = birthday
      ? `${birthday.getFullYear()}-${String(birthday.getMonth() + 1).padStart(2, '0')}-${String(birthday.getDate()).padStart(2, '0')}`
      : null;
    try {
      if (isEditing && editId) {
        await updateContact({
          id: editId,
          updates: {
            name: fullName,
            relation,
            phone: normalizePhone(phone.trim()),
            email: email.trim() || null,
            notes: notes.trim() || null,
            birthday: birthdayStr,
            personality_tags: personalityTags,
          },
        });
      } else {
        await createContact({
          name: fullName,
          relation,
          phone: normalizePhone(phone.trim()),
          email: email.trim() || null,
          notes: notes.trim() || null,
          birthday: birthdayStr,
          personality_tags: personalityTags,
          name_day: null,
          avatar_url: null,
          imported_from: 'manual',
        });
      }
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.';
      Alert.alert('Erreur', msg);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{isEditing ? 'Modifier le contact' : 'Nouveau contact'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isPending || !firstName.trim()}
          style={[styles.saveBtn, (!firstName.trim() || isPending) && { opacity: 0.4 }]}
        >
          <Text style={styles.saveBtnText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Prénom + Nom */}
        <Text style={styles.label}>Prénom *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(v) => setFirstName(formatFirstName(v))}
          placeholder="Ex: Marie"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="none"
          returnKeyType="next"
        />

        <Text style={styles.label}>Nom de famille</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(v) => setLastName(formatLastName(v))}
          placeholder="Ex: Dupont"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* Relation */}
        <Text style={styles.label}>Relation</Text>
        <View style={styles.relationGrid}>
          {RELATIONS.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.relationBtn, relation === r.value && styles.relationBtnActive]}
              onPress={() => setRelation(r.value)}
            >
              <Text style={styles.relationEmoji}>{r.emoji}</Text>
              <Text style={[styles.relationLabel, relation === r.value && styles.relationLabelActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date de naissance */}
        <Text style={styles.label}>Date de naissance</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={birthday ? styles.inputText : styles.inputPlaceholder}>
            {birthday
              ? birthday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Sélectionner une date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <View style={styles.pickerWrap}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Date de naissance</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerOk}>OK</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={birthday ?? new Date(1990, 0, 1)}
              mode="date"
              display="spinner"
              minimumDate={new Date(1900, 0, 1)}
              maximumDate={new Date()}
              textColor={Colors.primary}
              accentColor={Colors.primary}
              style={{ width: '100%' }}
              onChange={(_event: unknown, date?: Date) => {
                if (Platform.OS === 'android') setShowDatePicker(false);
                if (date) setBirthday(date);
              }}
            />
          </View>
        )}

        {/* Téléphone */}
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+33 6 00 00 00 00"
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="phone-pad"
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemple.com"
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Personnalité */}
        <Text style={styles.label}>Personnalité</Text>
        <View style={styles.tagGrid}>
          {PERSONALITY_TAGS.map((t) => {
            const active = personalityTags.includes(t.value);
            return (
              <TouchableOpacity
                key={t.value}
                style={[styles.tagBtn, active && styles.tagBtnActive]}
                onPress={() =>
                  setPersonalityTags((prev) =>
                    prev.includes(t.value) ? prev.filter((v) => v !== t.value) : [...prev, t.value]
                  )
                }
              >
                <Text style={[styles.tagLabel, active && styles.tagLabelActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes personnelles</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Intérêts, souvenirs partagés..."
          placeholderTextColor={Colors.outlineVariant}
          multiline
          numberOfLines={3}
        />

        {/* Bouton enregistrer */}
        <TouchableOpacity
          style={[styles.submitBtn, (!firstName.trim() || isPending) && { opacity: 0.42 }]}
          onPress={handleSave}
          disabled={isPending || !firstName.trim()}
        >
          <Text style={styles.submitBtnText}>
            {isPending ? 'Enregistrement...' : isEditing ? '✓ Enregistrer les modifications' : '✓ Enregistrer le contact'}
          </Text>
        </TouchableOpacity>
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
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.white,
  },

  content: { padding: Spacing[5], paddingBottom: 80 },
  label: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    borderRadius: Radii.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing[3],
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
    justifyContent: 'center',
  },
  inputText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  inputPlaceholder: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.outlineVariant,
  },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 10 },

  pickerWrap: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
    overflow: 'hidden',
    marginTop: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primaryContainer,
  },
  pickerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  pickerOk: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.primary,
  },

  relationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  relationBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  relationEmoji: { fontSize: 16 },
  relationLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  relationLabelActive: { color: Colors.white },

  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBtn: {
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  tagBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant,
  },
  tagLabelActive: { color: Colors.white },

  submitBtn: {
    marginTop: Spacing[6],
    paddingVertical: 15,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  submitBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
});
