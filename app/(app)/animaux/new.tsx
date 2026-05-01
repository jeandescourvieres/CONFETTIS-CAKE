import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../../../src/stores/authStore';
import { useContacts } from '../../../src/hooks/useContacts';
import { createContact } from '../../../src/services/contacts.service';
import { useQueryClient } from '@tanstack/react-query';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { Avatar } from '../../../src/components/ui/Avatar';
import type { Contact } from '../../../src/types/models';

// ── Types d'animaux ───────────────────────────────────────────────────────────
const PET_TYPES: { value: string; emoji: string; label: string }[] = [
  { value: 'chien',     emoji: '🐶', label: 'Chien'      },
  { value: 'chat',      emoji: '🐱', label: 'Chat'       },
  { value: 'lapin',     emoji: '🐰', label: 'Lapin'      },
  { value: 'perroquet', emoji: '🦜', label: 'Perroquet'  },
  { value: 'hamster',   emoji: '🐹', label: 'Hamster'    },
  { value: 'poisson',   emoji: '🐠', label: 'Poisson'    },
  { value: 'cheval',    emoji: '🐴', label: 'Cheval'     },
  { value: 'autre',     emoji: '🐾', label: 'Autre'      },
];

// ── Tags de caractère par espèce ──────────────────────────────────────────────
const TAGS_CHIEN = [
  'câlin', 'joueur', 'gourmand', 'peureux', 'protecteur',
  'bavard', 'énergique', 'canapé-addict', 'chasseur', 'fidèle',
];
const TAGS_CHAT = [
  'royal', 'indifférent', 'destructeur', 'chasseur nocturne',
  'gourmet difficile', 'câlin capricieux', 'contemplatif',
  'jaloux', 'acrobate', 'mystérieux',
];
const TAGS_GENERIQUES = [
  'câlin', 'joueur', 'gourmand', 'énergique', 'peureux',
  'curieux', 'fidèle', 'indépendant', 'bavard', 'calme',
];

function tagsForSpecies(species: string | null): string[] {
  if (species === 'chien') return TAGS_CHIEN;
  if (species === 'chat') return TAGS_CHAT;
  return TAGS_GENERIQUES;
}

export default function NewPetScreen() {
  const C = useColors();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(C), [C]);
  const queryClient = useQueryClient();
  const { ownerId } = useLocalSearchParams<{ ownerId?: string }>();

  const user = useAuthStore((s) => s.user);
  const { data: contacts = [] } = useContacts();

  // ── Champs du formulaire ─────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [personalityTags, setPersonalityTags] = useState<string[]>([]);
  const [ownerContact, setOwnerContact] = useState<Contact | null>(null);
  const [showOwnerPicker, setShowOwnerPicker] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Pré-sélectionner le propriétaire si ownerId est passé en param
  useEffect(() => {
    if (ownerId && contacts.length > 0 && !ownerContact) {
      const found = contacts.find((c) => c.id === ownerId);
      if (found) setOwnerContact(found);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId, contacts]);

  const availableTags = tagsForSpecies(species);

  const toggleTag = (tag: string) =>
    setPersonalityTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const petEmoji = PET_TYPES.find((p) => p.value === species)?.emoji ?? '🐾';
  const displayName = name.trim() || 'ton animal';

  const filteredContacts = useMemo(() => {
    const q = ownerSearch.toLowerCase().trim();
    return q ? contacts.filter((c) => c.name.toLowerCase().includes(q)) : contacts;
  }, [contacts, ownerSearch]);

  // ── Sauvegarde ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Nom manquant', 'Donne un nom à cet animal.');
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      await createContact(user.id, {
        name: name.trim(),
        relation: 'pet',
        birthday: birthday ? birthday.toISOString().split('T')[0] : null,
        name_day: null,
        phone: null,
        email: null,
        notes: null,
        avatar_url: null,
        imported_from: 'manual',
        personality_tags: personalityTags,
        preferred_channel: null,
        preferred_send_time: null,
        pet_owner_name: ownerContact?.name ?? null,
        pet_owner_contact_id: ownerContact?.id ?? null,
        pet_type: (species as Contact['pet_type']) ?? null,
        pet_gender: gender,
        preferred_language: null,
        favourite_color: null,
      });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      router.back();
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvel animal 🐾</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Nom ──────────────────────────────────────── */}
        <Text style={styles.label}>Nom {petEmoji}</Text>
        <TextInput
          style={[styles.input, { borderColor: name ? C.primary : Colors.surfaceContainerHighest }]}
          placeholder="Ex : Rex, Luna, Micio…"
          placeholderTextColor={Colors.onSurfaceVariant}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* ── Type d'animal ─────────────────────────────── */}
        <Text style={styles.label}>Type d'animal</Text>
        <View style={styles.chipGrid}>
          {PET_TYPES.map((p) => {
            const active = species === p.value;
            return (
              <TouchableOpacity
                key={p.value}
                style={[styles.typeChip, active && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                onPress={() => { setSpecies(p.value); setPersonalityTags([]); }}
                activeOpacity={0.8}
              >
                <Text style={styles.typeChipEmoji}>{p.emoji}</Text>
                <Text style={[styles.typeChipLabel, active && { color: C.primary, fontFamily: 'BeVietnamPro_700Bold' }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Genre ─────────────────────────────────────── */}
        <Text style={styles.label}>Genre</Text>
        <View style={styles.genderRow}>
          {([
            { value: 'male',   label: '♂ Mâle',    emoji: '🔵' },
            { value: 'female', label: '♀ Femelle',  emoji: '🟣' },
          ] as { value: 'male' | 'female'; label: string; emoji: string }[]).map((g) => {
            const active = gender === g.value;
            return (
              <TouchableOpacity
                key={g.value}
                style={[styles.genderBtn, active && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                onPress={() => setGender(g.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.genderEmoji}>{g.emoji}</Text>
                <Text style={[styles.genderLabel, active && { color: C.primary, fontFamily: 'BeVietnamPro_700Bold' }]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Date de naissance ─────────────────────────── */}
        <Text style={styles.label}>Date de naissance (optionnel)</Text>
        <TouchableOpacity
          style={[styles.dateBtn, { borderColor: birthday ? C.primary : Colors.surfaceContainerHighest }]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.dateBtnText, !birthday && { color: Colors.onSurfaceVariant }]}>
            {birthday
              ? birthday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Choisir une date…'}
          </Text>
          <Text style={styles.dateBtnIcon}>📅</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthday ?? new Date(2020, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setBirthday(date);
            }}
          />
        )}
        {Platform.OS === 'ios' && showDatePicker && (
          <TouchableOpacity
            style={[styles.dateConfirmBtn, { backgroundColor: C.primary }]}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.dateConfirmBtnText}>Confirmer</Text>
          </TouchableOpacity>
        )}

        {/* ── Caractère ─────────────────────────────────── */}
        <Text style={styles.label}>
          Caractère de {displayName}
          {species === 'chien' ? ' 🐶' : species === 'chat' ? ' 🐱' : ' 🐾'}
        </Text>
        <Text style={styles.subLabel}>Plusieurs choix possibles</Text>
        <View style={styles.chipGrid}>
          {availableTags.map((tag) => {
            const active = personalityTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, active && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tagChipText, active && { color: C.primary, fontFamily: 'BeVietnamPro_700Bold' }]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Propriétaire ──────────────────────────────── */}
        <Text style={styles.label}>À quel contact appartient {displayName} ? 👤</Text>
        <Text style={styles.subLabel}>
          Cette info permettra de relier l'animal à son maître ou sa maîtresse.
        </Text>

        {ownerContact ? (
          <View style={styles.ownerCard}>
            <Avatar uri={ownerContact.avatar_url} name={ownerContact.name} size="sm" />
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{ownerContact.name}</Text>
              <Text style={styles.ownerSub}>Contact sélectionné</Text>
            </View>
            <TouchableOpacity onPress={() => setOwnerContact(null)} style={styles.ownerRemoveBtn}>
              <Text style={[styles.ownerRemoveText, { color: Colors.error }]}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.ownerPickerBtn, { borderColor: C.primary }]}
            onPress={() => setShowOwnerPicker((v) => !v)}
            activeOpacity={0.8}
          >
            <Text style={[styles.ownerPickerBtnText, { color: C.primary }]}>
              {showOwnerPicker ? '▲ Fermer la liste' : '👥 Choisir parmi mes contacts'}
            </Text>
          </TouchableOpacity>
        )}

        {showOwnerPicker && !ownerContact && (
          <View style={styles.ownerPickerBox}>
            <TextInput
              style={[styles.ownerSearchInput, { borderColor: C.primaryContainer }]}
              placeholder="Rechercher…"
              placeholderTextColor={Colors.onSurfaceVariant}
              value={ownerSearch}
              onChangeText={setOwnerSearch}
            />
            {filteredContacts
              .filter((c) => c.relation !== 'pet')
              .map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.ownerRow}
                  onPress={() => { setOwnerContact(c); setShowOwnerPicker(false); setOwnerSearch(''); }}
                  activeOpacity={0.8}
                >
                  <Avatar uri={c.avatar_url} name={c.name} size="sm" />
                  <Text style={styles.ownerRowName}>{c.name}</Text>
                </TouchableOpacity>
              ))
            }
            <TouchableOpacity
              style={[styles.ownerNewContactBtn, { borderColor: C.primary }]}
              onPress={() => {
                setShowOwnerPicker(false);
                router.push('/(app)/contacts/new' as never);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.ownerNewContactText, { color: C.primary }]}>
                + Créer une nouvelle fiche contact
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Bouton Enregistrer ────────────────────────── */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: name.trim() ? C.primary : Colors.surfaceContainerHighest }, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={!name.trim() || saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={[styles.saveBtnText, !name.trim() && { color: Colors.onSurfaceVariant }]}>
                Enregistrer {petEmoji}
              </Text>
          }
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], gap: 8,
      borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backBtnText: { fontSize: 28, color: C.primary, fontFamily: 'BeVietnamPro_700Bold', lineHeight: 32 },
    headerTitle: {
      flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center',
    },

    content: { padding: Spacing[5], gap: 14 },

    label: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.base,
      color: Colors.onSurface,
      marginBottom: -6,
    },
    subLabel: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      marginTop: -8,
      marginBottom: -4,
    },

    input: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      borderWidth: 1.5,
      borderRadius: Radii.lg,
      paddingVertical: 12,
      paddingHorizontal: 14,
      color: Colors.onSurface,
      backgroundColor: Colors.white,
    },

    // Type d'animal
    chipGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    typeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: Radii.full,
      borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      backgroundColor: Colors.white,
    },
    typeChipEmoji: { fontSize: 18 },
    typeChipLabel: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },

    // Genre
    genderRow: { flexDirection: 'row', gap: 12 },
    genderBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: Radii.lg,
      borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      backgroundColor: Colors.white,
    },
    genderEmoji: { fontSize: 18 },
    genderLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.base,
      color: Colors.onSurfaceVariant,
    },

    // Date
    dateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderRadius: Radii.lg,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: Colors.white,
    },
    dateBtnText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurface,
    },
    dateBtnIcon: { fontSize: 18 },
    dateConfirmBtn: {
      borderRadius: Radii.full,
      paddingVertical: 10,
      alignItems: 'center',
    },
    dateConfirmBtnText: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: Colors.white,
    },

    // Tags caractère
    tagChip: {
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderRadius: Radii.full,
      borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      backgroundColor: Colors.white,
    },
    tagChipText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },

    // Propriétaire
    ownerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: C.primaryContainer + '50',
      borderRadius: Radii.lg,
      padding: Spacing[3],
      borderWidth: 1.5,
      borderColor: C.primary,
    },
    ownerName: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: Colors.onSurface,
    },
    ownerSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    ownerRemoveBtn: { padding: 4 },
    ownerRemoveText: { fontSize: 16, fontFamily: 'BeVietnamPro_700Bold' },
    ownerPickerBtn: {
      borderWidth: 1.5,
      borderRadius: Radii.lg,
      paddingVertical: 12,
      alignItems: 'center',
    },
    ownerPickerBtnText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.base,
    },
    ownerPickerBox: {
      backgroundColor: Colors.surfaceContainerLow,
      borderRadius: Radii.xl,
      padding: Spacing[3],
      gap: 6,
      ...Shadows.sm,
    },
    ownerSearchInput: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      borderWidth: 1.5,
      borderRadius: Radii.lg,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: Colors.white,
      color: Colors.onSurface,
      marginBottom: 4,
    },
    ownerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.surfaceContainerHighest,
    },
    ownerRowName: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurface,
      flex: 1,
    },
    ownerNewContactBtn: {
      borderWidth: 1.5,
      borderRadius: Radii.full,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 6,
    },
    ownerNewContactText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
    },

    // Save
    saveBtn: {
      borderRadius: Radii.full,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 8,
      ...Shadows.sm,
    },
    saveBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.white,
    },
  });
}
