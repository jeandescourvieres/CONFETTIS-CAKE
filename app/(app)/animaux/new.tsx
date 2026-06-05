import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Platform, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../../../src/stores/authStore';
import { useContacts } from '../../../src/hooks/useContacts';
import { DOG_BREEDS, CAT_BREEDS } from '../../../src/constants/petData';
import { createContact } from '../../../src/services/contacts.service';
import { useQueryClient } from '@tanstack/react-query';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { Avatar } from '../../../src/components/ui/Avatar';
import type { Contact } from '../../../src/types/models';

// ── Types d'animaux ───────────────────────────────────────────────────────────
const PET_TYPES: { value: string; emoji: string; label: string }[] = [
  { value: 'chien',        emoji: '🐶', label: 'Chien'         },
  { value: 'chat',         emoji: '🐱', label: 'Chat'          },
  { value: 'lapin',        emoji: '🐰', label: 'Lapin'         },
  { value: 'cheval',       emoji: '🐴', label: 'Cheval'        },
  { value: 'hamster',      emoji: '🐹', label: 'Hamster'       },
  { value: 'perroquet',    emoji: '🦜', label: 'Perroquet'     },
  { value: 'cochon_d_inde',emoji: '🐾', label: 'Cochon d\'Inde'},
  { value: 'souris',       emoji: '🐭', label: 'Souris'        },
  { value: 'poisson',      emoji: '🐠', label: 'Poisson'       },
  { value: 'tortue',       emoji: '🐢', label: 'Tortue'        },
  { value: 'autre',        emoji: '🐾', label: 'Autre'         },
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
  const { ownerId, myPet } = useLocalSearchParams<{ ownerId?: string; myPet?: string }>();

  const user = useAuthStore((s) => s.user);
  const { data: contacts = [] } = useContacts();

  // ── Champs du formulaire ─────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<string | null>(null);
  const [breed, setBreed] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [personalityTags, setPersonalityTags] = useState<string[]>([]);
  const [ownerContact, setOwnerContact] = useState<Contact | null>(null);
  const [isMyPet, setIsMyPet] = useState(myPet === '1');
  const [showOwnerPicker, setShowOwnerPicker] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; species?: boolean; gender?: boolean; owner?: boolean }>({});

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
    const newErrors = {
      name:    !name.trim(),
      species: !species,
      gender:  !gender,
      owner:   !ownerContact && !isMyPet,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      Alert.alert('Champs obligatoires', 'Merci de renseigner les champs indiqués en rouge avant de continuer.');
      return;
    }
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      return;
    }
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
        breed: breed ?? null,
      } as any);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      router.back();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message :
        (err as { message?: string })?.message ??
        JSON.stringify(err) ??
        'Erreur inconnue';
      Alert.alert('Erreur sauvegarde', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isMyPet ? 'Mon animal 🐾' : 'Nouvel animal 🐾'}</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Nom ──────────────────────────────────────── */}
        <Text style={styles.label}>Nom {petEmoji} <Text style={{ color: Colors.error }}>*</Text></Text>
        <TextInput
          style={[styles.input, { borderColor: errors.name ? Colors.error : name ? C.primary : Colors.surfaceContainerHighest }]}
          placeholder="Ex : Rex, Luna, Micio…"
          placeholderTextColor={Colors.onSurfaceVariant}
          value={name}
          onChangeText={(v) => { setName(v); if (v.trim()) setErrors((e) => ({ ...e, name: false })); }}
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.errorMsg}>⚠ Le nom est obligatoire</Text>}

        {/* ── Type d'animal ─────────────────────────────── */}
        <Text style={styles.label}>Type d'animal <Text style={{ color: Colors.error }}>*</Text></Text>
        {errors.species && <Text style={styles.errorMsg}>⚠ Choisis le type d'animal</Text>}
        <View style={[styles.chipGrid, errors.species && { borderWidth: 1.5, borderColor: Colors.error, borderRadius: Radii.lg, padding: 8 }]}>
          {PET_TYPES.map((p) => {
            const active = species === p.value;
            return (
              <TouchableOpacity
                key={p.value}
                style={[styles.typeChip, active && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                onPress={() => { setSpecies(p.value); setPersonalityTags([]); if (p.value !== 'chien') setBreed(null); }}
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

        {/* ── Races (chien ou chat) ─────────────────────── */}
        {(species === 'chien' || species === 'chat') && (
          <View style={styles.breedSection}>
            <Text style={styles.label}>{species === 'chien' ? 'Race 🐶' : 'Race 🐱'}</Text>
            <View style={styles.breedGrid}>
              {(species === 'chien' ? DOG_BREEDS : CAT_BREEDS).map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.breedChip, breed === b && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                  onPress={() => setBreed(b)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.breedChipLabel, breed === b && { color: C.primary, fontFamily: 'BeVietnamPro_700Bold' }]}>
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Genre ─────────────────────────────────────── */}
        <Text style={styles.label}>Genre <Text style={{ color: Colors.error }}>*</Text></Text>
        {errors.gender && <Text style={styles.errorMsg}>⚠ Le genre est obligatoire</Text>}
        <View style={[styles.genderRow, errors.gender && { borderWidth: 1.5, borderColor: Colors.error, borderRadius: Radii.lg, padding: 8 }]}>
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
          Caractère de l'animal
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
        {isMyPet ? (
          /* Mode "mon animal" : confirmation visuelle + lien pour basculer */
          <View style={{ gap: 10 }}>
            <View style={{ backgroundColor: C.primaryContainer, borderRadius: Radii.lg, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>🐾</Text>
              <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: C.primary, lineHeight: 20 }}>
                {'Cet animal sera ajouté à votre profil — il pourra ensuite écrire à vos contacts pour leurs occasions 💛'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsMyPet(false)}
              activeOpacity={0.7}
              style={{ alignSelf: 'flex-start' }}
            >
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, textDecorationLine: 'underline' }}>
                Ce n'est pas mon animal → assigner à un contact
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.label}>À qui appartient cet animal ? 👤 <Text style={{ color: Colors.error }}>*</Text></Text>

            {/* Bouton "C'est mon animal" */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.primaryContainer, borderRadius: Radii.lg, padding: 14, borderWidth: 1.5, borderColor: C.primary + '60' }}
              onPress={() => { setIsMyPet(true); setOwnerContact(null); setShowOwnerPicker(false); setErrors((e) => ({ ...e, owner: false })); }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 22 }}>🙋</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: C.primary }}>
                  C'est mon animal
                </Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: C.primary, opacity: 0.8, marginTop: 2 }}>
                  Il pourra écrire à mes contacts depuis l'appli
                </Text>
              </View>
              <Text style={{ fontSize: 18, color: C.primary }}>›</Text>
            </TouchableOpacity>

            <Text style={[styles.subLabel, { textAlign: 'center', marginVertical: 4 }]}>— ou —</Text>

            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginBottom: -4 }}>
              Cet animal appartient à un de mes contacts
            </Text>
            <Text style={styles.subLabel}>
              Cette info permettra de relier l'animal à son maître ou sa maîtresse.
            </Text>
            {errors.owner && <Text style={styles.errorMsg}>⚠ Relie cet animal à un contact ou choisis "C'est mon animal"</Text>}

            {ownerContact ? (
              <View style={[styles.ownerCard, { borderColor: C.primary }]}>
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
                style={[styles.ownerPickerBtn, { borderColor: errors.owner ? Colors.error : C.primary }]}
                onPress={() => { setShowOwnerPicker((v) => !v); setErrors((e) => ({ ...e, owner: false })); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.ownerPickerBtnText, { color: errors.owner ? Colors.error : C.primary }]}>
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
                      onPress={() => { Keyboard.dismiss(); setOwnerContact(c); setShowOwnerPicker(false); setOwnerSearch(''); }}
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
          </>
        )}

        {/* ── Bouton Enregistrer ────────────────────────── */}
        {(() => {
          const isReady = !!name.trim() && !!species && !!gender && (isMyPet || !!ownerContact);
          return (
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: isReady ? C.primary : Colors.surfaceContainerHighest }, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={!isReady || saving}
              activeOpacity={0.85}
            >
              {saving
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={[styles.saveBtnText, !isReady && { color: Colors.onSurfaceVariant }]}>
                    Enregistrer {petEmoji}
                  </Text>
              }
            </TouchableOpacity>
          );
        })()}
        <View style={{ height: 200 }} />
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
    backLink: { justifyContent: 'center', minWidth: 70 },
    backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    headerTitle: {
      flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center',
    },

    content: { padding: Spacing[5], gap: 14 },

    label: {
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: 8,
      paddingVertical: 4,      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: C.primary,
      marginTop: Spacing[4],
      marginBottom: Spacing[2],
    },
    subLabel: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      marginTop: -8,
      marginBottom: -4,
    },
    errorMsg: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: Colors.error,
      marginTop: -4,
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

    // Races
    breedSection: { marginTop: 4 },
    breedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    breedChip: {
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderRadius: Radii.full,
      borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      backgroundColor: Colors.white,
    },
    breedChipLabel: {
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
