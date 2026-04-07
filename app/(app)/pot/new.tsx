import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useContacts } from '../../../src/hooks/useContacts';
import { useCreatePot } from '../../../src/hooks/usePot';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';

export default function PotNewScreen() {
  const router = useRouter();
  const { data: contacts = [] } = useContacts();
  const { mutateAsync: createPot, isPending } = useCreatePot();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  const parsedAmount = parseFloat(targetAmount.replace(',', '.'));
  const isValid = title.trim() && selectedContactId && parsedAmount > 0;

  const handleCreate = async () => {
    if (!isValid) return;
    try {
      const pot = await createPot({
        contact_id: selectedContactId!,
        title: title.trim(),
        target_amount: parsedAmount,
        gift_description: giftDescription.trim() || null,
        deadline: deadline
          ? `${deadline.getFullYear()}-${String(deadline.getMonth() + 1).padStart(2, '0')}-${String(deadline.getDate()).padStart(2, '0')}`
          : null,
      });
      router.replace(`/(app)/pot/${pot.id}` as never);
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de créer la cagnotte.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Nouvelle cagnotte</Text>
        <TouchableOpacity
          onPress={handleCreate}
          disabled={!isValid || isPending}
          style={[styles.saveBtn, (!isValid || isPending) && { opacity: 0.4 }]}
        >
          <Text style={styles.saveBtnText}>Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Titre ─────────────────────────────────── */}
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Voyage surprise pour Marie"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="sentences"
        />

        {/* ── Contact ───────────────────────────────── */}
        <Text style={styles.label}>Pour qui ? *</Text>
        <TouchableOpacity
          style={[styles.input, styles.pickerBtn]}
          onPress={() => setShowContactPicker(!showContactPicker)}
        >
          <Text style={selectedContact ? styles.inputText : styles.inputPlaceholder}>
            {selectedContact ? `${selectedContact.name}` : 'Sélectionner un contact'}
          </Text>
          <Text style={styles.pickerArrow}>▾</Text>
        </TouchableOpacity>
        {showContactPicker && (
          <View style={styles.dropdown}>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
              {contacts.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.dropdownRow, selectedContactId === c.id && styles.dropdownRowActive]}
                  onPress={() => { setSelectedContactId(c.id); setShowContactPicker(false); }}
                >
                  <Text style={styles.dropdownName}>{c.name}</Text>
                  <Text style={styles.dropdownRelation}>{c.relation}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Objectif ──────────────────────────────── */}
        <Text style={styles.label}>Objectif (€) *</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="Ex: 150"
            placeholderTextColor={Colors.outlineVariant}
            keyboardType="decimal-pad"
          />
          <View style={styles.euroTag}>
            <Text style={styles.euroTagText}>€</Text>
          </View>
        </View>
        {parsedAmount > 0 && (
          <Text style={styles.amountHint}>
            Chaque participant peut contribuer librement.
          </Text>
        )}

        {/* ── Description cadeau ────────────────────── */}
        <Text style={styles.label}>Description du cadeau (optionnel)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={giftDescription}
          onChangeText={setGiftDescription}
          placeholder="Ex: week-end à Paris, console de jeux..."
          placeholderTextColor={Colors.outlineVariant}
          multiline
          numberOfLines={3}
        />

        {/* ── Date limite ───────────────────────────── */}
        <Text style={styles.label}>Date limite (optionnel)</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={deadline ? styles.inputText : styles.inputPlaceholder}>
            {deadline
              ? deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Sélectionner une date'}
          </Text>
        </TouchableOpacity>
        {deadline && (
          <TouchableOpacity onPress={() => setDeadline(null)}>
            <Text style={styles.clearDate}>✕ Retirer la date</Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={deadline ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(_event: unknown, date?: Date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setDeadline(date);
            }}
          />
        )}

        {/* ── Info card ─────────────────────────────── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Un lien de partage unique sera généré. Vos proches pourront contribuer sans avoir l'application.
          </Text>
        </View>

        {/* ── CTA ───────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.ctaBtn, (!isValid || isPending) && { opacity: 0.45 }]}
          onPress={handleCreate}
          disabled={!isValid || isPending}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {isPending ? 'Création...' : '🎁 Créer la cagnotte'}
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
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
  saveBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: Radii.full, backgroundColor: Colors.primary },
  saveBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  content: { padding: Spacing[4], paddingBottom: 80 },
  label: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant, marginTop: Spacing[4], marginBottom: Spacing[2],
  },
  input: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.primaryContainer,
    borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: Spacing[3],
    fontSize: Typography.md, fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurface,
  },
  inputText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface },
  inputPlaceholder: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.outlineVariant },
  textArea: { height: 88, textAlignVertical: 'top', paddingTop: 10 },

  pickerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerArrow: { fontSize: 16, color: Colors.outlineVariant },
  dropdown: {
    backgroundColor: Colors.white, borderRadius: Radii.md,
    borderWidth: 0.5, borderColor: Colors.primaryContainer, marginTop: 4, ...Shadows.sm,
  },
  dropdownRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 14,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainer,
  },
  dropdownRowActive: { backgroundColor: Colors.surfaceContainerLow },
  dropdownName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
  dropdownRelation: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  amountRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  euroTag: {
    width: 44, height: 48, borderRadius: Radii.md,
    backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  euroTagText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.primary },
  amountHint: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, marginTop: 6,
  },

  clearDate: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs,
    color: Colors.error, marginTop: 6,
  },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    marginTop: Spacing[5], padding: Spacing[4],
    backgroundColor: Colors.primaryContainer + '50',
    borderRadius: Radii.lg, borderWidth: 0.5, borderColor: Colors.primaryContainer,
  },
  infoEmoji: { fontSize: 20 },
  infoText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base,
    color: Colors.onPrimaryContainer, lineHeight: 20, flex: 1,
  },

  ctaBtn: {
    marginTop: Spacing[6], paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: Colors.primary, alignItems: 'center', ...Shadows.lg,
  },
  ctaBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },
});
