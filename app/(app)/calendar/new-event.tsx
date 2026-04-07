import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateCustomEvent, useUpdateCustomEvent } from '../../../src/hooks/useCustomEvents';
import { useAuthStore } from '../../../src/stores/authStore';
import { scheduleCustomEventReminders } from '../../../src/services/notifications.service';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';

const REMIND_OPTIONS = [
  { value: 0, label: 'Le jour même' },
  { value: 1, label: 'La veille' },
  { value: 3, label: '3 jours avant' },
  { value: 7, label: '1 semaine avant' },
];

export default function NewEventScreen() {
  const router = useRouter();
  const { editId, editTitle, editDate, editDescription, editRemind } =
    useLocalSearchParams<{
      editId?: string;
      editTitle?: string;
      editDate?: string;
      editDescription?: string;
      editRemind?: string;
    }>();

  const isEditing = !!editId;

  const { mutateAsync: createEvent, isPending: isCreating } = useCreateCustomEvent();
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateCustomEvent();
  const isPending = isCreating || isUpdating;

  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [remindBefore, setRemindBefore] = useState(1);

  // Pré-remplir si mode édition
  useEffect(() => {
    if (!isEditing) return;
    if (editTitle) setTitle(editTitle);
    if (editDescription) setDescription(editDescription);
    if (editRemind !== undefined) setRemindBefore(parseInt(editRemind, 10));
    if (editDate) {
      const [y, mo, d] = editDate.split('-').map(Number);
      setDate(new Date(y, mo - 1, d));
    }
  }, [isEditing, editTitle, editDate, editDescription, editRemind]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez entrer un titre pour cet événement.');
      return;
    }

    const eventDateISO = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
      if (isEditing && editId) {
        await updateEvent({
          id: editId,
          updates: {
            title: title.trim(),
            description: description.trim() || null,
            event_date: eventDateISO,
            remind_before: remindBefore,
          },
        });
      } else {
        await createEvent({
          title: title.trim(),
          description: description.trim() || null,
          event_date: eventDateISO,
          remind_before: remindBefore,
        });

        scheduleCustomEventReminders(title.trim(), eventDateISO, remindBefore).catch(() => {});
      }

      await queryClient.refetchQueries({ queryKey: ['custom_events', userId] });
      router.back();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null
          ? JSON.stringify(err)
          : String(err);
      Alert.alert('Erreur lors de la sauvegarde', msg);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>
          {isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isPending || !title.trim()}
          style={[styles.saveBtn, (!title.trim() || isPending) && { opacity: 0.4 }]}
        >
          <Text style={styles.saveBtnText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Titre */}
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Réunion famille, Voyage à Paris..."
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="sentences"
          autoFocus={!isEditing}
        />

        {/* Date */}
        <Text style={styles.label}>Date *</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
          <Text style={styles.inputText}>
            {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.pickerWrap}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Choisir la date</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.pickerOk}>OK</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              minimumDate={new Date()}
              textColor={Colors.primary}
              accentColor={Colors.primary}
              style={{ width: '100%' }}
              onChange={(_event: unknown, d?: Date) => {
                if (Platform.OS === 'android') setShowPicker(false);
                if (d) setDate(d);
              }}
            />
          </View>
        )}

        {/* Description */}
        <Text style={styles.label}>Description (optionnel)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Détails, notes..."
          placeholderTextColor={Colors.outlineVariant}
          multiline
          numberOfLines={3}
        />

        {/* Rappel */}
        <Text style={styles.label}>Me rappeler</Text>
        <View style={styles.remindGrid}>
          {REMIND_OPTIONS.map((o) => (
            <TouchableOpacity
              key={o.value}
              style={[styles.remindBtn, remindBefore === o.value && styles.remindBtnActive]}
              onPress={() => setRemindBefore(o.value)}
            >
              <Text style={[styles.remindLabel, remindBefore === o.value && styles.remindLabelActive]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton */}
        <TouchableOpacity
          style={[styles.submitBtn, (!title.trim() || isPending) && { opacity: 0.4 }]}
          onPress={handleSave}
          disabled={isPending || !title.trim()}
        >
          <Text style={styles.submitBtnText}>
            {isPending
              ? 'Enregistrement...'
              : isEditing
              ? '✓ Enregistrer les modifications'
              : '✓ Ajouter l\'événement'}
          </Text>
        </TouchableOpacity>
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
  topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.onSurface },
  saveBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: Radii.full, backgroundColor: Colors.primary },
  saveBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  content: { padding: Spacing[5], paddingBottom: 80 },
  label: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant, marginBottom: Spacing[2], marginTop: Spacing[4],
  },
  input: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.primaryContainer,
    borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: Spacing[3],
    fontSize: Typography.md, fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurface,
    justifyContent: 'center',
  },
  inputText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface },
  textArea: { height: 88, textAlignVertical: 'top', paddingTop: 10 },

  pickerWrap: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.primaryContainer, overflow: 'hidden', marginTop: 8,
  },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.primaryContainer,
  },
  pickerTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.primary },
  pickerOk: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.primary },

  remindGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  remindBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.primaryContainer, backgroundColor: Colors.white,
  },
  remindBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  remindLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
  remindLabelActive: { color: Colors.white },

  submitBtn: {
    marginTop: Spacing[6], paddingVertical: 15, borderRadius: Radii.full,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  submitBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.white },
});
