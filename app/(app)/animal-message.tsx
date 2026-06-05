import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ActivityIndicator, TextInput, Share, Alert, Modal, Image, Switch, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/services/supabase';
import { getPetMessages, getPetMessagesTo } from '../../src/constants/petMessages';
import type { PetType } from '../../src/constants/petMessages';
import { getPetImageUrl } from '../../src/utils/petImageUrl';
import { getPetThirdPartyMessages, buildPetIdentite, fillPetThirdPartyMessage, type PetThirdPartyOccasion } from '../../src/constants/petThirdPartyMessages';
import { getLibraryKey, getLibraryMessageCount } from '../../src/constants/petMessagesLibrary';
import { useContacts } from '../../src/hooks/useContacts';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { extractFirstName } from '../../src/utils/nameHelpers';

// ── Types ────────────────────────────────────────────────────────────────────

type Direction = 'to' | 'from' | 'from_to_third';
type Mode = 'ai' | 'template' | 'manual' | null;
type Occasion = 'birthday' | 'nameday' | 'bonjour' | 'merci' | 'encouragement' | 'bonne_nouvelle' | null;
type Template = { id: string; title: string; content: string };

const PET_EMOJI: Record<string, string> = {
  chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴',
  hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭',
  poisson: '🐠', tortue: '🐢', autre: '🐾',
};

const OCCASIONS: { value: Exclude<Occasion, null>; emoji: string; label: string }[] = [
  { value: 'birthday',       emoji: '🎂', label: 'Anniversaire'   },
  { value: 'nameday',        emoji: '🌸', label: 'Bonne Fête'     },
  { value: 'bonjour',        emoji: '👋', label: 'Simple bonjour' },
  { value: 'merci',          emoji: '🙏', label: 'Remerciement'   },
  { value: 'encouragement',  emoji: '💪', label: 'Encouragement'  },
  { value: 'bonne_nouvelle', emoji: '🎉', label: 'Bonne nouvelle' },
];

// Occasions avec des modèles locaux (les autres = IA uniquement)
const HAS_TEMPLATES = new Set(['birthday', 'nameday']);

// Occasions masquées dans le contexte animal (pas encore de messages)
const PET_HIDDEN_OCCASIONS = new Set(['bonjour', 'merci', 'encouragement', 'bonne_nouvelle']);

// ── Screen ───────────────────────────────────────────────────────────────────

export default function AnimalMessageScreen() {
  const C = useColors();
  const router = useRouter();
  const {
    petId, petName, petType, breed, petGender, direction,
    ownerName, ownerId,
    thirdName, thirdId,
    personalityTags: rawTags,
  } = useLocalSearchParams<{
    petId: string;
    petName: string;
    petType: string;
    breed?: string;
    petGender?: string;
    direction: Direction;
    ownerName?: string;
    ownerId?: string;
    thirdName?: string;
    thirdId?: string;
    personalityTags?: string;
  }>();

  const isFrom        = direction === 'from';
  const isFromToThird = direction === 'from_to_third';
  const visibleOccasions = (isFrom || isFromToThird)
    ? OCCASIONS.filter(o => !PET_HIDDEN_OCCASIONS.has(o.value))
    : OCCASIONS.filter(o => o.value === 'birthday' || o.value === 'nameday');

  // Extrait le prénom depuis un nom stocké "NOM Prénom" (last name ALL CAPS first)
  // Identité enrichie de l'animal pour les messages from_to_third
  const ownerFirstName = ownerName ? extractFirstName(ownerName) : '';
  const petIdentite = buildPetIdentite(petName, petType ?? 'autre', breed, petGender, ownerName ?? '');

  // Contact picker pour from_to_third sans destinataire pré-sélectionné
  const { data: allContacts = [] } = useContacts();
  const humanContacts = allContacts.filter((c) => c.relation !== 'pet');
  const [selectedThirdId,   setSelectedThirdId]   = useState<string | null>(thirdId ?? null);
  const [selectedThirdName, setSelectedThirdName] = useState<string>(
    thirdName ? thirdName.split(' ').reverse().join(' ').trim() : ''
  );
  const [showContactPicker, setShowContactPicker] = useState(false);

  const rawRecipientName = isFromToThird
    ? (thirdName || (selectedThirdName ? selectedThirdName.split(/\s+/).reverse().join(' ') : '') || '')
    : (ownerName ?? '');
  // Prénom seulement (pas "CLOT Sophie" mais "Sophie")
  const recipientFirstName = extractFirstName(rawRecipientName);

  // Genre du destinataire pour l'accord Cher/Chère
  const recipientContact = allContacts.find((c) => c.id === (selectedThirdId || thirdId));
  const recipientIsFemale = recipientContact?.civilite === 'Mme';

  // Genre du propriétaire (maître) pour les pronoms il/elle dans les templates
  // Si ownerId correspond à un contact connu, on utilise sa civilité ; sinon celle du profil connecté
  const myProfile = useAuthStore((s) => s.profile);
  const ownerContact = allContacts.find((c) => c.id === ownerId);
  const ownerIsMale = ownerContact
    ? ownerContact.civilite === 'M.'
    : myProfile?.civilite === 'M.';

  const recipientName = recipientFirstName;
  const petEmoji = PET_EMOJI[petType ?? ''] ?? '🐾';
  const tags: string[] = rawTags ? JSON.parse(rawTags) : [];

  // ── État ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>(null);
  const [occasion, setOccasion] = useState<Occasion>(null);
  const [fromRecipientId,   setFromRecipientId]   = useState<string | null>(ownerId ?? null);
  const [fromRecipientName, setFromRecipientName] = useState<string>(ownerName ?? '');
  const [showFromPicker,    setShowFromPicker]    = useState(false);
  const [fromPickerSearch,  setFromPickerSearch]  = useState('');
  const [fromStep,          setFromStep]          = useState<'recipient' | 'mode'>('recipient');

  // Interception du bouton retour physique pour revenir à l'étape précédente dans l'écran
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (mode !== null) {
        setMode(null);
        setGenerated(null);
        setAiError(null);
        setManualText('');
        return true;
      }
      if (occasion !== null) {
        setOccasion(null);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [mode, occasion]);

  // Reset complet si direction OU destinataire change (réutilisation du composant par Expo Router)
  useEffect(() => {
    setMode(null);
    setOccasion(null);
    setTemplates([]);
    setGenerated(null);
    setAiError(null);
    setManualText('');
    setFromStep('recipient');
    setFromRecipientId(ownerId ?? null);
    setFromRecipientName(ownerName ?? '');
    setSelectedThirdId(thirdId || null);
    setSelectedThirdName(thirdName ? thirdName.split(' ').reverse().join(' ').trim() : '');
  }, [direction, thirdId, petId, ownerId, ownerName]);
  const [withImage, setWithImage] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [previewMsg, setPreviewMsg] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [manualOccasionOpen, setManualOccasionOpen] = useState(false);

  // ── Chargement des modèles locaux ────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'template') return;
    // Nouvelles occasions sans templates → bascule automatique en IA
    if (occasion && !HAS_TEMPLATES.has(occasion)) {
      setMode('ai');
      handleGenerateAI(occasion);
      return;
    }
    let msgs: string[] = [];
    if (isFromToThird && occasion) {
      const raw = getPetThirdPartyMessages(petType ?? 'autre', occasion as PetThirdPartyOccasion);
      msgs = raw.map((tpl) => {
        let filled = fillPetThirdPartyMessage(tpl, recipientName, petIdentite, petName, ownerFirstName);
        // Accord genre destinataire
        if (recipientIsFemale) filled = filled.replace(/\bCher\b/g, 'Chère');
        // Accord genre propriétaire (templates écrits au féminin par défaut)
        if (ownerIsMale) {
          filled = filled
            .replace(/\bElle-même\b/g, 'Lui-même')
            .replace(/\belle-même\b/g, 'lui-même')
            .replace(/\bElle\b/g, 'Il')
            .replace(/\belle\b/g, 'il')
            .replace(/\bOccupée\b/g, 'Occupé')
            .replace(/\boccupée\b/g, 'occupé')
            .replace(/\bcontente\b/g, 'content')
            .replace(/\bContente\b/g, 'Content');
        }
        return filled;
      });
    } else if (isFrom) {
      if (!occasion) { setTemplates([]); return; }
      const occ = (occasion === 'birthday' || occasion === 'nameday') ? occasion : undefined;
      msgs = getPetMessages(petType as PetType, petName, null, fromRecipientName || ownerName || '', occ);
    } else {
      if (!occasion) { setTemplates([]); return; }
      const occ = (occasion === 'birthday' || occasion === 'nameday') ? occasion : undefined;
      msgs = getPetMessagesTo(petType as PetType, petName, ownerName ?? '', occ);
    }
    setTemplates(msgs.map((text, i) => ({ id: String(i), title: '', content: text })));
  }, [mode, occasion, direction, recipientName, thirdId]);

  // ── Génération IA ─────────────────────────────────────────────────────────
  const handleGenerateAI = async (occ: string) => {
    setGenerating(true);
    setGenerated(null);
    setAiError(null);
    try {
      const body = isFromToThird
        ? {
            format: 'message', tone: 'playful',
            relation: 'pet',
            contact_name: recipientName,
            occasion: occ,
            pet_from_mode: true,
            pet_from_name: petName,
            pet_from_type: petType ?? 'autre',
            pet_owner_name: ownerFirstName,
            personality_tags: tags,
            is_regeneration: false, language: 'fr',
          }
        : isFrom
        ? {
            format: 'message', tone: 'playful',
            relation: petType ?? 'autre',
            contact_name: fromRecipientName || ownerName || '',
            occasion: occ,
            pet_from_mode: true,
            pet_from_name: petName,
            pet_from_type: petType ?? 'autre',
            personality_tags: tags,
            is_regeneration: false, language: 'fr',
          }
        : {
            format: 'message', tone: 'playful',
            relation: 'pet',
            contact_name: petName,
            occasion: occ,
            personality_tags: tags,
            is_regeneration: false, language: 'fr',
          };

      const { data, error } = await supabase.functions.invoke('generate-message', { body });
      if (error) throw new Error((error as Error).message ?? 'Erreur génération');
      const raw = (data as { content?: string })?.content;
      if (!raw) throw new Error('Réponse vide');
      setGenerated(raw.trim().replace(/^[*"«\s]+/, '').replace(/[*"»\s]+$/, '').trim());
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur de génération');
    } finally {
      setGenerating(false);
    }
  };

  // ── Image header selon race + occasion ───────────────────────────────────
  const canHaveImage = (isFrom || isFromToThird) && !!petType;
  const getImageUrl = (occ: string | null) =>
    occ && canHaveImage ? getPetImageUrl(petType, breed ?? null, occ) : null;

  // ── Utiliser un message ───────────────────────────────────────────────────
  const useMessage = (content: string, occ?: string | null) => {
    const imageUrl = withImage ? getImageUrl(occ ?? occasion) : null;
    const destId   = isFromToThird ? (selectedThirdId ?? thirdId ?? ownerId ?? petId) : petId;
    router.push({
      pathname: '/(app)/create/preview',
      params: {
        contactId: destId,
        prefillMessage: content,
        petDirection: direction,
        petName: petName,
        petType: petType ?? 'autre',
        petBreed: breed ?? '',
        petGender: petGender ?? '',
        petOwnerName: ownerName ?? '',
        petId: petId,
        petOwnerId: ownerId ?? '',
        petThirdId: selectedThirdId ?? thirdId ?? '',
        petThirdName: selectedThirdName || thirdName || '',
        petPersonalityTags: rawTags ?? '[]',
        ...(imageUrl ? { petImageUrl: imageUrl } : {}),
        ...(isFromToThird ? { noEdit: '1' } : {}),
      },
    } as never);
  };

  const shareMessage = async (content: string) => {
    await Share.share({ message: content });
  };

  // ── Header ────────────────────────────────────────────────────────────────
  const headerTitle = isFromToThird
    ? recipientName ? `${petName} écrit à ${recipientName}` : `${petName} prend la plume`
    : isFrom
      ? `De la part de ${petName}`
      : `Message à ${petName}`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{petEmoji} {headerTitle}</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Mode from_to_third ───────────────────────────────────────── */}
        {isFromToThird && mode === null && (() => {
          const sophieId = selectedThirdId ?? thirdId ?? null;
          const sophiePets = sophieId
            ? allContacts.filter((c) => c.relation === 'pet' && (c as any).pet_owner_contact_id === sophieId)
            : [];
          const sophiePetNames = sophiePets.map((p) => p.name);

          return (
            <View style={{ gap: 12 }}>

              {/* ── Sélecteur de destinataire — masqué si contact déjà fourni ── */}
              {!thirdId && (
                <View style={{ gap: 6 }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderRadius: Radii.lg, padding: 12, borderWidth: 1.5, borderColor: selectedThirdId ? '#EA580C' : C.outline }}
                    onPress={() => setShowContactPicker((v) => !v)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 18 }}>👤</Text>
                    <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: selectedThirdId ? '#EA580C' : C.onSurfaceVariant }}>
                      {selectedThirdName || 'Choisir un contact...'}
                    </Text>
                    <Text style={{ color: C.onSurfaceVariant, fontSize: 14 }}>{showContactPicker ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {showContactPicker && (
                    <View style={{ backgroundColor: C.surfaceContainerHighest, borderRadius: Radii.lg, overflow: 'hidden' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderBottomWidth: 0.5, borderBottomColor: C.outlineVariant }}>
                        <Text style={{ fontSize: 14, color: C.onSurfaceVariant }}>🔍</Text>
                        <TextInput
                          value={fromPickerSearch}
                          onChangeText={setFromPickerSearch}
                          placeholder="Rechercher…"
                          placeholderTextColor={C.onSurfaceVariant}
                          style={{ flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurface, padding: 0 }}
                          autoFocus
                        />
                      </View>
                      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
                        {[...humanContacts]
                          .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
                          .filter(c => fromPickerSearch === '' || c.name.toLowerCase().includes(fromPickerSearch.toLowerCase()))
                          .map((c) => (
                            <TouchableOpacity
                              key={c.id}
                              style={{ padding: 12, borderBottomWidth: 0.5, borderBottomColor: C.outlineVariant, backgroundColor: c.id === selectedThirdId ? '#FFF7ED' : 'transparent' }}
                              onPress={() => { setSelectedThirdId(c.id); setSelectedThirdName(c.name.split(' ').reverse().join(' ').trim()); setShowContactPicker(false); setFromPickerSearch(''); }}
                              activeOpacity={0.75}
                            >
                              <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: c.id === selectedThirdId ? '#EA580C' : C.onSurface }}>{c.name}</Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}

              {!!sophieId && (
                <>
                  {/* ── Carte fun — animaux de Sophie — masquée si destinataire pré-sélectionné ── */}
                  {!thirdId && sophiePets.length > 0 && (
                    <View style={{ backgroundColor: '#F5F3FF', borderRadius: 16, borderWidth: 1.5, borderColor: '#C4B5FD', padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: 22, marginTop: 2 }}>🐾</Text>
                      <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#4C1D95', lineHeight: 20 }}>
                        {'Et pour le fun, tu peux aussi écrire à '}
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{sophiePetNames.join(' ou ')}</Text>
                        {', ET faire écrire '}
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{sophiePetNames.join(' ou ')}</Text>
                        {` à ${recipientName} ou à n'importe quel autre proche ! 💛`}
                      </Text>
                    </View>
                  )}

                  {/* ── Section Animaux de compagnie — masquée si destinataire pré-sélectionné ── */}
                  {!thirdId && sophiePets.length > 0 && (
                    <View style={{ gap: 8 }}>
                      <View style={{ paddingLeft: 2, borderLeftWidth: 3, borderLeftColor: C.primary, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: C.onSurface }}>
                          Animaux de compagnie 🐾
                        </Text>
                      </View>
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurfaceVariant }}>
                        Clique sur un animal pour lui écrire ou le laisser prendre la plume
                      </Text>
                      {sophiePets.map((pet) => {
                        const pEmoji = PET_EMOJI[(pet as any).pet_type ?? ''] ?? '🐾';
                        return (
                          <TouchableOpacity
                            key={pet.id}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderRadius: Radii.lg, padding: 14, ...Shadows.sm }}
                            onPress={() => router.push({
                              pathname: '/(app)/animal-message',
                              params: {
                                petId: pet.id, petName: pet.name,
                                petType: (pet as any).pet_type ?? 'autre',
                                breed: (pet as any).breed ?? '',
                                petGender: (pet as any).pet_gender ?? '',
                                direction: 'from',
                                ownerName: recipientName, ownerId: sophieId,
                              },
                            } as never)}
                            activeOpacity={0.8}
                          >
                            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ fontSize: 24 }}>{pEmoji}</Text>
                            </View>
                            <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: C.onSurface }}>{pet.name}</Text>
                            <TouchableOpacity
                              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}
                              onPress={(e) => { e.stopPropagation(); router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never); }}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Text style={{ fontSize: 16 }}>✏️</Text>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        );
                      })}
                      <TouchableOpacity
                        style={{ borderWidth: 1.5, borderColor: C.primary, borderStyle: 'dashed', borderRadius: Radii.lg, paddingVertical: 12, alignItems: 'center' }}
                        onPress={() => router.push({ pathname: '/(app)/animaux/new', params: { ownerId: sophieId } } as never)}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: C.primary }}>+ Ajouter un autre animal</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {!thirdId && sophiePets.length === 0 && (
                    <TouchableOpacity
                      style={{ borderWidth: 1.5, borderColor: '#FCD34D', borderStyle: 'dashed', borderRadius: Radii.lg, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FFFBF0' }}
                      onPress={() => router.push({ pathname: '/(app)/animaux/new', params: { ownerId: sophieId } } as never)}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: '#B45309' }}>
                        🐾 Ajouter un animal à {recipientName}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* ── Sélection occasion + mode ── */}
                  <View style={{ gap: 16 }}>

                    {/* Banner identité */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.primaryContainer, borderRadius: Radii.xl, padding: 16 }}>
                      <Text style={{ fontSize: 36 }}>{petEmoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: C.primary }}>
                          {petName}
                        </Text>
                        <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: C.onSurfaceVariant, marginTop: 2 }}>
                          {recipientName ? `écrit à ${recipientName} ✍️` : `prend la plume ✍️`}
                        </Text>
                      </View>
                    </View>

                    {/* Intro contextuelle selon le scénario */}
                    <View style={{ backgroundColor: C.surface, borderRadius: Radii.lg, padding: 12, borderLeftWidth: 3, borderLeftColor: C.primary }}>
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurfaceVariant, lineHeight: 20 }}>
                        {ownerContact
                          ? recipientName
                            ? `${petName} va écrire à ${recipientName} — un message inattendu et attendrissant rédigé par l'IA comme si c'était vraiment ${petName} qui écrivait ! 🐾`
                            : `${petName} va prendre la plume ! Choisis à qui il va écrire, puis l'IA s'exprimera à sa place 🐾`
                          : recipientName
                            ? `C'est ${petName} qui tient le clavier ! L'IA va rédiger à sa place le message pour ${recipientName} — jalousie, tendresse, réclamations de croquettes 😄`
                            : `${petName} prend la plume ! Choisis à qui il va écrire, puis l'IA s'exprimera à sa place — hilarant et attendrissant ✨`}
                      </Text>
                    </View>

                    {/* Occasion */}
                    <View style={{ gap: 10 }}>
                      <Text style={[styles.intro, { color: C.onSurface, marginBottom: 0 }]}>
                        Pour quelle occasion ?
                      </Text>
                      <View style={styles.occasionRow}>
                        {visibleOccasions.map((o) => (
                          <TouchableOpacity
                            key={o.value}
                            style={[styles.occasionBtn, { backgroundColor: occasion === o.value ? C.primaryContainer : C.surface, borderColor: occasion === o.value ? C.primary : C.outline }]}
                            onPress={() => setOccasion(occasion === o.value ? null : o.value)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                            <Text style={[styles.occasionLabel, { color: occasion === o.value ? C.primary : C.onSurface }]}>{o.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Modes — apparaissent après choix d'occasion */}
                    {!!occasion && (
                      <View style={{ gap: 10 }}>
                        <Text style={[styles.intro, { color: C.onSurface, marginBottom: 0 }]}>
                          Comment veux-tu écrire ?
                        </Text>
                        {HAS_TEMPLATES.has(occasion) && (
                          <TouchableOpacity
                            style={[styles.modeCard, { backgroundColor: C.surface }]}
                            onPress={() => setMode('template')}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.modeEmoji}>📋</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.modeTitle, { color: C.onSurface }]}>Choisir un modèle</Text>
                              <Text style={[styles.modeSub, { color: C.onSurfaceVariant }]}>
                                {`Messages tout faits signés ${petName}`}
                              </Text>
                            </View>
                            <Text style={[styles.modeArrow, { color: C.outlineVariant }]}>›</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={[styles.modeCard, { backgroundColor: C.primaryContainer, borderColor: C.primary + '40' }]}
                          onPress={() => { setMode('ai'); handleGenerateAI(occasion); }}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.modeEmoji}>✨</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.modeTitle, { color: C.primary }]}>Générer avec l'IA</Text>
                            <Text style={[styles.modeSub, { color: C.onSurfaceVariant }]}>
                              {`Un message unique, comme si c'était vraiment ${petName}`}
                            </Text>
                          </View>
                          <Text style={[styles.modeArrow, { color: C.primary }]}>›</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          );
        })()}

        {/* ── Étape 1 (from) : choisir le destinataire ─────────────────── */}
        {mode === null && isFrom && fromStep === 'recipient' && (
          <>
            <Text style={[styles.intro, { color: C.onSurface }]}>
              {`À qui ${petName} écrit ?`}
            </Text>

            {/* Sélecteur déroulant avec recherche */}
            <View style={{ gap: 8 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderRadius: Radii.lg, padding: 12, borderWidth: 1.5, borderColor: fromRecipientId ? C.primary : C.outline }}
                onPress={() => { setShowFromPicker(v => !v); setFromPickerSearch(''); }}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 18 }}>👤</Text>
                <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: fromRecipientId ? C.primary : C.onSurfaceVariant }}>
                  {fromRecipientName || 'Choisir un contact…'}
                </Text>
                <Text style={{ color: C.onSurfaceVariant, fontSize: 14 }}>{showFromPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showFromPicker && (
                <View style={{ backgroundColor: C.surfaceContainerHighest, borderRadius: Radii.lg, overflow: 'hidden' }}>
                  {/* Recherche */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderBottomWidth: 0.5, borderBottomColor: C.outlineVariant }}>
                    <Text style={{ fontSize: 14, color: C.onSurfaceVariant }}>🔍</Text>
                    <TextInput
                      value={fromPickerSearch}
                      onChangeText={setFromPickerSearch}
                      placeholder="Rechercher…"
                      placeholderTextColor={C.onSurfaceVariant}
                      style={{ flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurface, padding: 0 }}
                      autoFocus
                    />
                  </View>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
                    {[...humanContacts]
                      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
                      .filter(c => fromPickerSearch === '' || c.name.toLowerCase().includes(fromPickerSearch.toLowerCase()))
                      .map((c) => (
                        <TouchableOpacity
                          key={c.id}
                          style={{ padding: 12, borderBottomWidth: 0.5, borderBottomColor: C.outlineVariant, backgroundColor: c.id === fromRecipientId ? C.primaryContainer : 'transparent' }}
                          onPress={() => { setFromRecipientId(c.id); setFromRecipientName(c.name); setShowFromPicker(false); setFromPickerSearch(''); }}
                          activeOpacity={0.75}
                        >
                          <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: c.id === fromRecipientId ? C.primary : C.onSurface }}>{c.name}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {fromRecipientId && (
              <TouchableOpacity
                style={{ backgroundColor: C.primary, borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center' }}
                onPress={() => {
                  const isOwner = fromRecipientId === ownerId;
                  if (isOwner || !fromRecipientId) {
                    setFromStep('mode');
                  } else {
                    router.replace({
                      pathname: '/(app)/animal-message',
                      params: {
                        petId: petId ?? '',
                        petName: petName ?? '',
                        petType: petType ?? '',
                        breed: breed ?? '',
                        petGender: petGender ?? '',
                        direction: 'from_to_third',
                        ownerName: ownerName ?? '',
                        ownerId: ownerId ?? '',
                        thirdName: fromRecipientName,
                        thirdId: fromRecipientId,
                      },
                    } as never);
                  }
                }}
                activeOpacity={0.85}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#fff' }}>
                  Continuer →
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* ── Sélection du mode ─────────────────────────────────────────── */}
        {mode === null && (!isFrom || fromStep === 'mode') && !isFromToThird && (
          <>
            {isFrom && (
              <TouchableOpacity onPress={() => setFromStep('recipient')} style={styles.backLink}>
                <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Changer de destinataire</Text>
              </TouchableOpacity>
            )}
            {/* Intro contextuelle */}
            <View style={{ backgroundColor: C.surface, borderRadius: Radii.lg, padding: 12, borderLeftWidth: 3, borderLeftColor: C.primary }}>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurfaceVariant, lineHeight: 20 }}>
                {isFrom && ownerContact
                  ? `${petName} va écrire à ${extractFirstName(fromRecipientName || ownerName || '')} — son humain préféré ! L'IA rédige le message à sa place, comme si c'était vraiment ${petName} qui écrivait. Attendrissant et hilarant 🐾`
                  : isFrom
                    ? `${petName} va écrire à ${extractFirstName(fromRecipientName || ownerName || '')} ! L'IA rédige à sa place — jalousie, tendresse, réclamations de croquettes 😄`
                    : `Comment veux-tu écrire à ${petName} ?`}
              </Text>
            </View>
            <Text style={[styles.intro, { color: C.onSurface }]}>
              {isFrom
                ? `Comment veux-tu que ${petName} s'exprime ?`
                : `Comment veux-tu écrire à ${petName} ?`}
            </Text>

            {/* Mode magique */}
            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: C.primaryContainer, borderColor: C.primary + '40' }]}
              onPress={() => setMode('ai')}
              activeOpacity={0.85}
            >
              <Text style={styles.modeEmoji}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modeTitle, { color: C.primary }]}>Mode magique</Text>
                <Text style={[styles.modeSub, { color: C.onSurfaceVariant }]}>
                  {isFrom
                    ? `L'IA rédige un message comme si c'était ${petName} qui parlait`
                    : `L'IA génère un message unique et personnalisé pour ${petName}`}
                </Text>
              </View>
              <Text style={[styles.modeArrow, { color: C.primary }]}>›</Text>
            </TouchableOpacity>

            {/* Librairie (chien/chat) : 2 boutons directs par occasion */}
            {isFrom && getLibraryKey(petType ?? '', 'birthday') ? (
              <>
                {(['birthday', 'nameday'] as const).map((occ) => {
                  const emoji = occ === 'birthday' ? '🎂' : '🌸';
                  const label = occ === 'birthday' ? 'Anniversaire' : 'Bonne fête';
                  return (
                    <TouchableOpacity
                      key={occ}
                      style={[styles.modeCard, { backgroundColor: C.surface }]}
                      onPress={() => router.push({
                        pathname: '/(app)/animal-message-library',
                        params: {
                          petId: petId ?? '',
                          petName: petName ?? '',
                          petType: petType ?? '',
                          petGender: petGender ?? '',
                          breed: breed ?? '',
                          targetName: fromRecipientName || ownerName || '',
                          targetId: fromRecipientId || ownerId || '',
                          occasion: occ,
                          ownerName: fromRecipientName || ownerName || '',
                          ownerId: fromRecipientId || ownerId || '',
                        },
                      } as never)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modeEmoji}>{emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modeTitle, { color: C.onSurface }]}>{label}</Text>
                        <Text style={[styles.modeSub, { color: C.onSurfaceVariant }]}>
                          {`Messages de ${petName ?? 'ton animal'} — choix par thème`}
                        </Text>
                      </View>
                      <Text style={[styles.modeArrow, { color: C.outlineVariant }]}>›</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : (
              <TouchableOpacity
                style={[styles.modeCard, { backgroundColor: C.surface }]}
                onPress={() => setMode('template')}
                activeOpacity={0.85}
              >
                <Text style={styles.modeEmoji}>📋</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeTitle, { color: C.onSurface }]}>Choisir un modèle</Text>
                  <Text style={[styles.modeSub, { color: C.onSurfaceVariant }]}>
                    Parcours des modèles prêts à l'emploi
                  </Text>
                </View>
                <Text style={[styles.modeArrow, { color: C.outlineVariant }]}>›</Text>
              </TouchableOpacity>
            )}

          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MODE MAGIQUE
        ══════════════════════════════════════════════════════════════════ */}
        {mode === 'ai' && (
          <>
            <TouchableOpacity onPress={() => { setMode(null); setGenerated(null); setAiError(null); }} style={styles.backLink}>
              <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: C.onSurface }]}>Pour quelle occasion ?</Text>
            <View style={styles.occasionRow}>
              {visibleOccasions.map((o) => (
                <TouchableOpacity
                  key={o.value}
                  style={[styles.occasionBtn, { backgroundColor: C.surface, borderColor: C.outline }]}
                  onPress={() => handleGenerateAI(o.value)}
                  activeOpacity={0.8}
                  disabled={generating}
                >
                  <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                  <Text style={[styles.occasionLabel, { color: C.onSurface }]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {generating && (
              <View style={styles.generatingBox}>
                <ActivityIndicator color={C.primary} />
                <Text style={[styles.generatingText, { color: C.onSurfaceVariant }]}>
                  {isFrom ? `${petName} rédige son message…` : 'L\'IA génère le message…'}
                </Text>
              </View>
            )}

            {aiError && (
              <View style={[styles.errorBox, { backgroundColor: Colors.errorContainer }]}>
                <Text style={[styles.errorText, { color: Colors.error }]}>{aiError}</Text>
              </View>
            )}

            {generated && (
              <View style={[styles.resultBox, { backgroundColor: C.surface }]}>
                <Text style={[styles.resultText, { color: C.onSurface }]}>{generated}</Text>
                {canHaveImage && occasion && getImageUrl(occasion) && (
                  <View style={{ gap: 6 }}>
                    <Text style={[styles.imageToggleSub, { color: C.onSurfaceVariant, fontStyle: 'italic' }]}>
                      {'💡 Option : tu peux ajouter une illustration de '}
                      {petName}
                      {' en haut du message. Active ou désactive selon ta préférence.'}
                    </Text>
                    <View style={styles.imageToggleRow}>
                      <Image source={{ uri: getImageUrl(occasion)! }} style={styles.imageThumb} resizeMode="cover" />
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[styles.imageToggleLabel, { color: C.onSurface }]}>Ajouter l'image de {petName} en header</Text>
                        <Text style={[styles.imageToggleSub, { color: C.onSurfaceVariant }]}>Elle apparaîtra au-dessus du message</Text>
                      </View>
                      <Switch value={withImage} onValueChange={setWithImage} trackColor={{ false: Colors.outlineVariant, true: C.primary }} thumbColor="#fff" />
                    </View>
                  </View>
                )}
                <View style={styles.resultBtns}>
                  <TouchableOpacity
                    style={[styles.resultBtn, { backgroundColor: C.primary }]}
                    onPress={() => useMessage(generated, occasion)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.resultBtnText}>Utiliser ce message ›</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.resultBtnOutline, { borderColor: C.primary, backgroundColor: C.primaryContainer + '60' }]}
                    onPress={() => shareMessage(generated)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.resultBtnOutlineText, { color: C.primary }]}>
                      {isFrom && ownerFirstName ? `📲 Envoyer à ${ownerFirstName}` : '📲 Envoyer'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.resultBtnOutline, { borderColor: C.outline }]}
                    onPress={() => { setGenerated(null); }}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.resultBtnOutlineText, { color: C.onSurface }]}>↺ Régénérer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CHOISIR UN MODÈLE
        ══════════════════════════════════════════════════════════════════ */}
        {mode === 'template' && (
          <>
            <TouchableOpacity onPress={() => { setMode(null); setOccasion(null); setTemplates([]); }} style={styles.backLink}>
              <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
            </TouchableOpacity>

            {canHaveImage && isFromToThird && occasion && getImageUrl(occasion) && (
              <View style={styles.imageToggleRow}>
                <Image source={{ uri: getImageUrl(occasion)! }} style={styles.imageThumb} resizeMode="cover" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.imageToggleLabel, { color: C.onSurface }]}>Ajouter l'image en header</Text>
                  <Text style={[styles.imageToggleSub, { color: C.onSurfaceVariant }]}>Au-dessus du message</Text>
                </View>
                <Switch value={withImage} onValueChange={setWithImage} trackColor={{ false: Colors.outlineVariant, true: C.primary }} thumbColor="#fff" />
              </View>
            )}


            {!isFromToThird && (
              <View style={{ gap: 8, marginBottom: 4 }}>
                <Text style={[styles.sectionTitle, { color: C.onSurface, fontSize: Typography.sm }]}>
                  {canHaveImage && isFrom ? '📸 Occasion :' : '🎉 Occasion :'}
                </Text>
                <View style={styles.occasionRow}>
                  {visibleOccasions.map((o) => {
                    const libKey = getLibraryKey(petType ?? '', o.value);
                    return (
                      <TouchableOpacity
                        key={o.value}
                        style={[styles.occasionBtn, { backgroundColor: occasion === o.value ? C.primaryContainer : C.surface, borderColor: occasion === o.value ? C.primary : C.outline }]}
                        onPress={() => {
                          if (libKey && isFrom) {
                            router.push({
                              pathname: '/(app)/animal-message-library',
                              params: {
                                petId: petId ?? '',
                                petName: petName ?? '',
                                petType: petType ?? '',
                                petGender: petGender ?? '',
                                breed: breed ?? '',
                                targetName: ownerName ?? '',
                                targetId: ownerId ?? '',
                                occasion: o.value,
                                ownerName: ownerName ?? '',
                                ownerId: ownerId ?? '',
                              },
                            } as never);
                          } else {
                            setOccasion(occasion === o.value ? null : o.value);
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                        <Text style={[styles.occasionLabel, { color: C.onSurface }]}>{o.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {occasion && getImageUrl(occasion) && (
                  <View style={styles.imageToggleRow}>
                    <Image source={{ uri: getImageUrl(occasion)! }} style={styles.imageThumb} resizeMode="cover" />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.imageToggleLabel, { color: C.onSurface }]}>Ajouter l'image en header</Text>
                      <Text style={[styles.imageToggleSub, { color: C.onSurfaceVariant }]}>Au-dessus du message</Text>
                    </View>
                    <Switch value={withImage} onValueChange={setWithImage} trackColor={{ false: Colors.outlineVariant, true: C.primary }} thumbColor="#fff" />
                  </View>
                )}
              </View>
            )}

            {templates.length === 0 ? (
              <Text style={[styles.emptyTemplates, { color: C.outlineVariant }]}>Aucun modèle disponible.</Text>
            ) : (
              templates.map((tpl) => (
                <View key={tpl.id} style={[styles.templateCard, { backgroundColor: C.surface }]}>
                  <Text style={[styles.templatePreview, { color: C.onSurface }]} numberOfLines={4}>
                    {tpl.content}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <TouchableOpacity onPress={() => setPreviewMsg(tpl.content)} activeOpacity={0.75}>
                      <Text style={[styles.seeMoreBtn, { color: C.primary }]}>👁️ Voir en entier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.templateUseBtn, { backgroundColor: C.primary }]}
                      onPress={() => useMessage(tpl.content)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.templateUseBtnText}>Utiliser ›</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            À MA FAÇON
        ══════════════════════════════════════════════════════════════════ */}
        {mode === 'manual' && (
          <>
            <TouchableOpacity onPress={() => { setMode(null); setManualText(''); setManualOccasionOpen(false); }} style={styles.backLink}>
              <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.manualInput, { backgroundColor: C.surface, borderColor: C.outline, color: C.onSurface }]}
              value={manualText}
              onChangeText={setManualText}
              placeholder={isFrom
                ? `Écris le message comme si c'était ${petName} qui parlait…`
                : `Écris ton message pour ${petName}…`}
              placeholderTextColor={C.outlineVariant}
              multiline
              textAlignVertical="top"
            />


            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: C.primary }, !manualText.trim() && { opacity: 0.4 }]}
              onPress={() => useMessage(manualText.trim())}
              disabled={!manualText.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.sendBtnText}>Continuer ›</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>

      {/* Modale aperçu message complet */}
      <Modal visible={!!previewMsg} transparent animationType="slide" onRequestClose={() => setPreviewMsg(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPreviewMsg(null)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.modalTitle, { color: C.onSurface }]}>📄 Message complet</Text>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: C.onSurface }]}>{previewMsg ?? ''}</Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: C.outline, flex: 1 }]} onPress={() => setPreviewMsg(null)}>
                <Text style={[styles.modalBtnText, { color: C.onSurface }]}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: C.primary, flex: 1 }]} onPress={() => { const m = previewMsg; setPreviewMsg(null); if (m) useMessage(m); }}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Utiliser ›</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  topbar:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: 10, gap: 8 },
  backLink:     { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: { flex: 1, fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, textAlign: 'center', color: Colors.onSurface },
  content:     { padding: Spacing[4], gap: 12, paddingBottom: 80 },
  intro:       { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, marginBottom: 4 },
  backLink:    { marginBottom: 4 },
  backLinkText:{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

  // Mode cards
  modeCard:    { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radii.xl, padding: 16, borderWidth: 1, ...Shadows.sm },
  modeEmoji:   { fontSize: 32 },
  modeTitle:   { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, marginBottom: 2 },
  modeSub:     { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, lineHeight: 18 },
  modeArrow:   { fontSize: 24 },

  // Occasions
  sectionTitle:{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, color: Colors.onSurface, marginTop: 4 },
  occasionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  occasionBtn: { width: '30%', flexGrow: 1, alignItems: 'center', gap: 4, borderRadius: Radii.xl, paddingVertical: 12, paddingHorizontal: 6, borderWidth: 1.5 },
  occasionEmoji:{ fontSize: 24 },
  occasionLabel:{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, textAlign: 'center' },

  // AI result
  generatingBox:{ alignItems: 'center', gap: 10, padding: 24 },
  generatingText:{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm },
  errorBox:    { borderRadius: Radii.lg, padding: 12 },
  errorText:   { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm },
  resultBox:   { borderRadius: Radii.xl, padding: 16, gap: 12, ...Shadows.sm },
  resultText:  { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, lineHeight: 24 },
  resultBtns:  { gap: 8 },
  resultBtn:   { borderRadius: Radii.full, paddingVertical: 12, alignItems: 'center' },
  resultBtnText:{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },
  resultBtnOutline:{ borderRadius: Radii.full, paddingVertical: 11, alignItems: 'center', borderWidth: 1.5 },
  resultBtnOutlineText:{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

  // Templates
  emptyTemplates:{ textAlign: 'center', fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, marginTop: 24 },
  seeMoreBtn: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  modalTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, marginBottom: 12 },
  modalText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, lineHeight: 22 },
  modalBtn: { borderRadius: Radii.full, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  modalBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm },
  templateCard:  { borderRadius: Radii.xl, padding: 14, gap: 10, ...Shadows.sm },
  templatePreview:{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, lineHeight: 20 },
  templateUseBtn:{ borderRadius: Radii.full, paddingVertical: 10, alignItems: 'center' },
  templateUseBtnText:{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },

  // Image toggle
  imageToggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F3EFFF', borderRadius: Radii.lg, padding: 10 },
  imageThumb: { width: 52, height: 52, borderRadius: Radii.md },
  imageToggleLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm },
  imageToggleSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs },

  // Manual
  manualInput: { borderRadius: Radii.xl, borderWidth: 1.5, padding: 16, fontSize: Typography.md, minHeight: 240, fontFamily: 'BeVietnamPro_400Regular', lineHeight: 24 },
  ideasBtn:    { borderRadius: Radii.full, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' },
  ideasBtnText:{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  sendBtn:     { borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  sendBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.white },

  // Library button (from_to_third + chien/chat + birthday/nameday)
  libraryBtn:    { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radii.xl, padding: 14, borderWidth: 1.5, ...Shadows.sm },
  libraryBtnEmoji:{ fontSize: 28 },
  libraryBtnTitle:{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, marginBottom: 2 },
  libraryBtnSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, lineHeight: 16 },
  libraryBtnArrow:{ fontSize: 24 },
});
