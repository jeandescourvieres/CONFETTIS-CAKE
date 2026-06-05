import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useCreateReminder, useUpdateReminder,
  DOW_FR, DOW_FULL, MONTH_FR,
  type Recurrence,
} from '../../../src/hooks/useReminders';
import { useContacts } from '../../../src/hooks/useContacts';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { Button3D } from '../../../src/components/ui/Button3D';

// ── Helpers ────────────────────────────────────────────────────────────────────

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ── Component ──────────────────────────────────────────────────────────────────

const RECURRENCE_OPTIONS: { value: Recurrence; label: string; emoji: string; desc: string }[] = [
  { value: 'weekly',  emoji: '📅', label: 'Hebdomadaire', desc: 'Un jour par semaine' },
  { value: 'monthly', emoji: '🗓', label: 'Mensuel',      desc: 'Un jour par mois'    },
  { value: 'yearly',  emoji: '🎯', label: 'Annuel',       desc: 'Une fois par an'     },
  { value: 'once',    emoji: '📌', label: 'Une seule fois', desc: 'Date précise'      },
];

// Ordre d'affichage : Lun à Dim (index JS : 1,2,3,4,5,6,0)
const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function NewReminderScreen() {
  const router  = useRouter();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const params  = useLocalSearchParams<{
    editId?: string; editTitle?: string; editRecurrence?: string;
    editDayOfWeek?: string; editDayOfMonth?: string; editMonth?: string;
    editOnceDate?: string; editContactId?: string;
  }>();

  const isEditing = !!params.editId;

  const { mutateAsync: create, isPending: creating } = useCreateReminder();
  const { mutateAsync: update, isPending: updating  } = useUpdateReminder();
  const isPending = creating || updating;
  const { data: contacts = [] } = useContacts();

  // Form state — pré-rempli si édition
  const [title,       setTitle]       = useState(params.editTitle ?? '');
  const [contactId,   setContactId]   = useState<string | null>(params.editContactId || null);
  const [recurrence,  setRecurrence]  = useState<Recurrence>((params.editRecurrence as Recurrence) ?? 'weekly');
  const [dayOfWeek,   setDayOfWeek]   = useState(params.editDayOfWeek ? Number(params.editDayOfWeek) : 1);
  const [dayOfMonth,  setDayOfMonth]  = useState(params.editDayOfMonth ? Number(params.editDayOfMonth) : 1);
  const [month,       setMonth]       = useState(params.editMonth ? Number(params.editMonth) : 1);
  const [onceDate,    setOnceDate]    = useState(() => {
    if (params.editOnceDate) { try { return new Date(params.editOnceDate); } catch { /* */ } }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);

  const selectedContact = contacts.find((c) => c.id === contactId) ?? null;

  const canSave = title.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    const payload = {
      title:        title.trim(),
      contact_id:   contactId,
      recurrence,
      day_of_week:  recurrence === 'weekly'  ? dayOfWeek  : null,
      day_of_month: recurrence === 'monthly' || recurrence === 'yearly' ? dayOfMonth : null,
      month:        recurrence === 'yearly'  ? month      : null,
      once_date:    recurrence === 'once'    ? toISO(onceDate) : null,
    };
    try {
      if (isEditing) {
        await update({ id: params.editId!, ...payload });
      } else {
        await create(payload);
      }
      router.back();
    } catch (e: unknown) {
      Alert.alert('Erreur', e instanceof Error ? e.message : isEditing ? 'Impossible de modifier le rappel' : 'Impossible de créer le rappel');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>{isEditing ? 'Modifier le rappel' : 'Nouveau rappel'}</Text>

        {/* ── Titre ───────────────────────────────────────── */}
        <Text style={styles.label}>De quoi veux-tu te rappeler ?</Text>
        <TextInput
          style={styles.input}
          placeholder='ex: "Appelle papa", "Envoie des fleurs"'
          placeholderTextColor={Colors.onSurfaceVariant}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
          returnKeyType="done"
        />

        {/* ── Contact (optionnel) ─────────────────────────── */}
        <Text style={styles.label}>Contact associé <Text style={styles.optional}>(optionnel)</Text></Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowContactPicker(!showContactPicker)}
          activeOpacity={0.8}
        >
          <Text style={[styles.selectorText, !selectedContact && styles.selectorPlaceholder]}>
            {selectedContact ? `👤 ${selectedContact.name}` : 'Choisir un contact...'}
          </Text>
          <Text style={styles.selectorChevron}>
            {showContactPicker ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {showContactPicker && (
          <View style={styles.pickerList}>
            <TouchableOpacity
              style={styles.pickerItem}
              onPress={() => { setContactId(null); setShowContactPicker(false); }}
            >
              <Text style={styles.pickerItemText}>— Aucun contact —</Text>
            </TouchableOpacity>
            {contacts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.pickerItem, c.id === contactId && { backgroundColor: C.primaryContainer }]}
                onPress={() => { setContactId(c.id); setShowContactPicker(false); }}
              >
                <Text style={[styles.pickerItemText, c.id === contactId && { color: C.primary }]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Récurrence ──────────────────────────────────── */}
        <Text style={[styles.label, { marginTop: 20 }]}>Fréquence</Text>
        <View style={styles.recurrenceGrid}>
          {RECURRENCE_OPTIONS.map((opt) => {
            const active = recurrence === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.recurrenceCard, active && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                onPress={() => setRecurrence(opt.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.recurrenceEmoji}>{opt.emoji}</Text>
                <Text style={[styles.recurrenceLabel, active && { color: C.primary }]}>{opt.label}</Text>
                <Text style={styles.recurrenceDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Détail récurrence ───────────────────────────── */}

        {/* Hebdo → jour de la semaine */}
        {recurrence === 'weekly' && (
          <View>
            <Text style={styles.label}>Quel jour ?</Text>
            <View style={styles.chipRow}>
              {DOW_ORDER.map((dow) => (
                <TouchableOpacity
                  key={dow}
                  style={[styles.chip, dayOfWeek === dow && { backgroundColor: C.primary }]}
                  onPress={() => setDayOfWeek(dow)}
                >
                  <Text style={[styles.chipText, dayOfWeek === dow && { color: '#fff' }]}>
                    {DOW_FR[dow]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.previewText}>
              Rappel chaque {DOW_FULL[dayOfWeek]}
            </Text>
          </View>
        )}

        {/* Mensuel → jour du mois */}
        {recurrence === 'monthly' && (
          <View>
            <Text style={styles.label}>Quel jour du mois ? (1–28)</Text>
            <View style={styles.chipRow}>
              {[1, 5, 10, 14, 15, 20, 25, 28].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, dayOfMonth === d && { backgroundColor: C.primary }]}
                  onPress={() => setDayOfMonth(d)}
                >
                  <Text style={[styles.chipText, dayOfMonth === d && { color: '#fff' }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.previewText}>
              Rappel le {dayOfMonth} de chaque mois
            </Text>
          </View>
        )}

        {/* Annuel → jour + mois */}
        {recurrence === 'yearly' && (
          <View style={{ gap: 12 }}>
            <View>
              <Text style={styles.label}>Quel mois ?</Text>
              <View style={styles.chipRow}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.chip, month === m && { backgroundColor: C.primary }]}
                    onPress={() => setMonth(m)}
                  >
                    <Text style={[styles.chipText, month === m && { color: '#fff' }]}>
                      {MONTH_FR[m].slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View>
              <Text style={styles.label}>Quel jour ? (1–28)</Text>
              <View style={styles.chipRow}>
                {[1, 5, 8, 10, 14, 15, 20, 25, 28].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, dayOfMonth === d && { backgroundColor: C.primary }]}
                    onPress={() => setDayOfMonth(d)}
                  >
                    <Text style={[styles.chipText, dayOfMonth === d && { color: '#fff' }]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text style={styles.previewText}>
              Rappel chaque {dayOfMonth} {MONTH_FR[month]}
            </Text>
          </View>
        )}

        {/* Une fois → date picker */}
        {recurrence === 'once' && (
          <View>
            <Text style={styles.label}>Quelle date ?</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.selectorText}>
                📅 {onceDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={onceDate}
                mode="date"
                minimumDate={new Date()}
                onChange={(_, date) => {
                  setShowDatePicker(false);
                  if (date) setOnceDate(date);
                }}
              />
            )}
          </View>
        )}

        {/* ── Bouton sauvegarder ──────────────────────────── */}
        <Button3D
          label={isPending ? 'Enregistrement...' : isEditing ? 'Enregistrer les modifications' : 'Créer le rappel'}
          onPress={handleSave}
          fullWidth
          size="lg"
          disabled={!canSave || isPending}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content:   { paddingHorizontal: Spacing[4], paddingBottom: 24 },

    pageTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      marginTop: 8,
      marginBottom: 20,
    },

    label: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
      marginBottom: 8,
    },
    optional: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },

    input: {
      backgroundColor: Colors.surfaceContainer,
      borderRadius: Radii.md,
      padding: Spacing[3],
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      marginBottom: 20,
    },

    selector: {
      backgroundColor: Colors.surfaceContainer,
      borderRadius: Radii.md,
      padding: Spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    selectorText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      flex: 1,
    },
    selectorPlaceholder: { color: Colors.onSurfaceVariant },
    selectorChevron: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },

    pickerList: {
      backgroundColor: Colors.surfaceContainerHighest,
      borderRadius: Radii.md,
      marginBottom: 20,
      maxHeight: 200,
      overflow: 'hidden',
    },
    pickerItem: {
      padding: Spacing[3],
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.outlineVariant,
    },
    pickerItemText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },

    recurrenceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 20,
    },
    recurrenceCard: {
      width: '47%',
      borderRadius: Radii.lg,
      borderWidth: 1.5,
      borderColor: Colors.outlineVariant,
      padding: 12,
      gap: 2,
    },
    recurrenceEmoji: { fontSize: 22, marginBottom: 4 },
    recurrenceLabel: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },
    recurrenceDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },

    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 10,
    },
    chip: {
      borderRadius: Radii.full,
      paddingVertical: 6,
      paddingHorizontal: 14,
      backgroundColor: Colors.surfaceContainer,
    },
    chipText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },

    previewText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      fontStyle: 'italic',
      marginBottom: 20,
    },

    saveBtn: {
      borderRadius: Radii.full,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 28,
    },
    saveBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: '#fff',
    },
  });
}
