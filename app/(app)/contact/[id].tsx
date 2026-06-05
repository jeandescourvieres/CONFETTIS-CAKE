import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useContact, useDeleteContact, useUpdateContact, useCreateContact, usePetsByOwnerName, useMyPets, useChildrenByParentName, useContacts } from '../../../src/hooks/useContacts';
import { useWishItems, useAddWishItem, useToggleWishItem, useDeleteWishItem } from '../../../src/hooks/useWishlist';
import { useGiftSuggestions } from '../../../src/hooks/useGiftSuggestions';
import type { GiftIdea } from '../../../src/hooks/useGiftSuggestions';
import { getPetMessages, getPetMessagesTo } from '../../../src/constants/petMessages';
import type { PetType } from '../../../src/constants/petMessages';
import * as ImagePicker from 'expo-image-picker';
import { uploadContactAvatar } from '../../../src/services/contacts.service';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Badge } from '../../../src/components/ui/Badge';
import { Colors, Typography, Spacing, Radii, Gradients, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import {
  daysUntilBirthday,
  daysUntilNextOccurrence,
  formatDate,
  formatShortDate,
  getAge,
  isUrgent,
  humanDaysUntil,
} from '../../../src/utils/dateHelpers';
import { getNameDayForName, getNamesForDate } from '../../../src/utils/namedays';
import { NAME_MEANINGS } from '../../../src/utils/nameMeanings';
import { getZodiacSign, getZodiacCompatibility, getChineseZodiac } from '../../../src/utils/zodiac';
import { calcNumerology, calcLifePath, getNumerologyProfile } from '../../../src/utils/numerology';
import { extractFirstName, extractLastName } from '../../../src/utils/nameHelpers';
import { useAuthStore } from '../../../src/stores/authStore';
import { supabase } from '../../../src/services/supabase';
import type { Relation } from '../../../src/types/models';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';
import { DOG_BREEDS, CAT_BREEDS } from '../../../src/constants/petData';

const RELATION_LABELS: Record<Relation, string> = {
  best_friend: '💜 Meilleur·e ami·e',
  friend: '😊 Ami·e',
  family: '👨‍👩‍👧 Famille',
  partner: '💑 Partenaire',
  colleague: '💼 Collègue',
  pet: '🐾 Animal',
  child_of: '👶 Enfant',
  other: '👤 Connaissance',
};

const FORMAT_ICONS: Record<string, string> = {
  song: '🎵',
  poem: '✍️',
  message: '💬',
  joke: '😄',
};

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const C = useColors();
  const { data: contact, isLoading } = useContact(id);
  const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteContact();
  const { mutateAsync: updateContact } = useUpdateContact();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [giftBudget, setGiftBudget] = useState<string | null>(null);
  const { suggest, suggestions, isLoading: isLoadingGifts, error: giftError, reset: resetGifts } = useGiftSuggestions();
  const [petMsgModalVisible, setPetMsgModalVisible] = useState(false);
  const [petToMsgModalVisible, setPetToMsgModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [addPetModalVisible, setAddPetModalVisible] = useState(false);
  const [newPetType, setNewPetType] = useState<'chien' | 'chat' | 'lapin' | 'oiseau' | 'cheval' | 'hamster' | 'perroquet' | 'cochon_d_inde' | 'souris' | 'poisson' | 'tortue' | 'autre' | null>(null);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBirthday, setNewPetBirthday] = useState('');
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [isSavingPet, setIsSavingPet] = useState(false);
  const [newPetGender, setNewPetGender] = useState<'male' | 'female' | null>(null);
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetPersonalityTags, setNewPetPersonalityTags] = useState<string[]>([]);
  const [partnerPickerVisible, setPartnerPickerVisible] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [addChildModalVisible, setAddChildModalVisible] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildBirthday, setNewChildBirthday] = useState('');
  const [newChildBirthdayDate, setNewChildBirthdayDate] = useState<Date | null>(null);
  const [showChildBirthdayPicker, setShowChildBirthdayPicker] = useState(false);
  const [newChildNameDay, setNewChildNameDay] = useState('');
  const [newChildGender, setNewChildGender] = useState<'male' | 'female' | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [isSavingChild, setIsSavingChild] = useState(false);
  const { mutateAsync: createContact } = useCreateContact();
  const [firstNameMeaning, setFirstNameMeaning] = useState<string | null>(null);
  const [isFirstNameMeaningLoading, setIsFirstNameMeaningLoading] = useState(false);
  const [lastNameMeaning, setLastNameMeaning] = useState<string | null>(null);
  const [isLastNameMeaningLoading, setIsLastNameMeaningLoading] = useState(false);

  type InseePoint = { year: number; count: number };
  const [inseeFirst, setInseeFirst] = useState<InseePoint[] | null>(null);
  const [inseeFirstLoading, setInseeFirstLoading] = useState(false);
  const [inseeFirstNotFound, setInseeFirstNotFound] = useState(false);
  const [inseeFirstPeak, setInseeFirstPeak] = useState<{ year: number; count: number } | null>(null);
  const [inseeFirstSel, setInseeFirstSel] = useState<InseePoint | null>(null);
  const [showCompat, setShowCompat] = useState(false);
  const [interestsHelpVisible, setInterestsHelpVisible] = useState(false);
  const [chineseZodiacHelpVisible, setChineseZodiacHelpVisible] = useState(false);
  const [numerologyHelpVisible, setNumerologyHelpVisible] = useState(false);
  const [ageFunHelpVisible, setAgeFunHelpVisible] = useState(false);

  // Phase 7 — Ce qui s'est passé l'année de naissance
  const [yearFacts, setYearFacts] = useState<string | null>(null);
  const [isLoadingYearFacts, setIsLoadingYearFacts] = useState(false);
  const [yearFactsHelpVisible, setYearFactsHelpVisible] = useState(false);

  // Phase 7 — Personnalités nées le même jour
  const [celebrities, setCelebrities] = useState<string | null>(null);
  const [isLoadingCelebs, setIsLoadingCelebs] = useState(false);
  const [celebsHelpVisible, setCelebsHelpVisible] = useState(false);

  // Phase 7 — Ce qui s'est passé le JOUR de naissance
  const [dayFacts, setDayFacts] = useState<string | null>(null);
  const [isLoadingDayFacts, setIsLoadingDayFacts] = useState(false);
  const [dayFactsHelpVisible, setDayFactsHelpVisible] = useState(false);

  // Phase 5 — Chemin de vie
  const [lifePathAi, setLifePathAi] = useState<{ content: string; number: number; name: string } | null>(null);
  const [isLoadingLifePath, setIsLoadingLifePath] = useState(false);
  const [lifePathHelpVisible, setLifePathHelpVisible] = useState(false);

  // Phase 2 — Couleur préférée
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [colorInput, setColorInput] = useState('');
  const [colorHelpVisible, setColorHelpVisible] = useState(false);

  // Messages animaux
  const [petToHelpVisible, setPetToHelpVisible] = useState(false);
  const [petFromHelpVisible, setPetFromHelpVisible] = useState(false);
  const [petFromAiModalVisible, setPetFromAiModalVisible] = useState(false);
  const [petFromAiOccasion, setPetFromAiOccasion] = useState<string>('birthday');
  const [petFromAiGenerating, setPetFromAiGenerating] = useState(false);
  const [petFromAiResult, setPetFromAiResult] = useState<string | null>(null);
  const [petFromAiError, setPetFromAiError] = useState<string | null>(null);

  // ── Reset des données chargées à la demande quand on change de contact ────────
  // Expo Router réutilise le composant entre deux contacts → les useState persistent
  useEffect(() => {
    setFirstNameMeaning(null);
    setIsFirstNameMeaningLoading(false);
    setLastNameMeaning(null);
    setIsLastNameMeaningLoading(false);
    setShowCompat(false);
    setYearFacts(null);
    setIsLoadingYearFacts(false);
    setCelebrities(null);
    setIsLoadingCelebs(false);
    setDayFacts(null);
    setIsLoadingDayFacts(false);
    setLifePathAi(null);
    setIsLoadingLifePath(false);
    setPetFromAiResult(null);
    setPetFromAiError(null);
  }, [id]);

  // Phase 9 — Rappel partagé
  const [sharedReminderVisible, setSharedReminderVisible] = useState(false);
  const [sharedReminderText, setSharedReminderText] = useState('');

  // Phase 2 — Liste de souhaits
  const { data: wishItems = [] } = useWishItems(id);
  const { mutateAsync: addWish, isPending: isAddingWish } = useAddWishItem();
  const { mutateAsync: toggleWish } = useToggleWishItem();
  const { mutateAsync: deleteWish } = useDeleteWishItem();
  const [wishModalVisible, setWishModalVisible] = useState(false);
  const [wishHelpVisible, setWishHelpVisible] = useState(false);
  const [newWishDesc, setNewWishDesc] = useState('');
  const [newWishCategory, setNewWishCategory] = useState<string | null>(null);
  const [newWishBudget, setNewWishBudget] = useState('');

  // Phase 2 — Avatar IA (DALL-E)
  const [aiAvatarVisible, setAiAvatarVisible] = useState(false);
  const [aiAvatarStyle, setAiAvatarStyle] = useState<string>('aquarelle');
  const [aiAvatarLoading, setAiAvatarLoading] = useState(false);
  const [aiAvatarError, setAiAvatarError] = useState<string | null>(null);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer ce contact ?',
      `${contact?.name} sera supprimé définitivement.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteContact(id);
            if (router.canGoBack()) router.back();
            else router.replace('/(app)/contacts/index' as never);
          },
        },
      ],
    );
  };

  const handleCall = () => {
    if (contact?.phone) Linking.openURL(`tel:${contact.phone}`);
  };

  const handleOpenSharedReminder = () => {
    if (!contact) return;
    const firstName = contact.name.split(' ')[0];
    let eventLabel = '';
    let daysLeft = 0;
    let eventDate = '';

    if (contact.birthday) {
      const d = daysUntilBirthday(contact.birthday);
      const dateStr = formatShortDate(contact.birthday);
      eventLabel = 'anniversaire';
      daysLeft = d;
      eventDate = dateStr;
    }

    let prefill = '';
    if (eventLabel && eventDate) {
      prefill = `🎂 Hey ! L'${eventLabel} de ${firstName} c'est le ${eventDate}${daysLeft > 0 ? ` (dans ${humanDaysUntil(daysLeft)})` : " — c'est aujourd'hui !"}.\nPense à lui souhaiter 💛`;
    } else {
      prefill = `💛 Hey ! Pense à ${firstName} prochainement — c'est quelqu'un qui compte 🎉`;
    }

    setSharedReminderText(prefill);
    setSharedReminderVisible(true);
  };

  const handleAddWish = async () => {
    if (!newWishDesc.trim()) return;
    const budgetCents = newWishBudget.trim()
      ? Math.round(parseFloat(newWishBudget.replace(',', '.')) * 100)
      : null;
    await addWish({
      contact_id: id,
      description: newWishDesc.trim(),
      category: newWishCategory,
      budget_max: isNaN(budgetCents!) ? null : budgetCents,
    });
    setNewWishDesc('');
    setNewWishCategory(null);
    setNewWishBudget('');
    setWishModalVisible(false);
  };

  const handleGenerateAiAvatar = async () => {
    if (!contact) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setAiAvatarLoading(true);
    setAiAvatarError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('generate-avatar', {
        body: { contact_id: id, style: aiAvatarStyle, user_id: user.id },
      });
      if (fnErr) {
        let detail = (fnErr as Error).message ?? 'Erreur';
        try {
          const ctx = (fnErr as unknown as { context?: unknown }).context;
          if (ctx && typeof (ctx as Response).json === 'function') {
            const b = await (ctx as Response).json();
            if (b?.error) detail = b.error;
          }
        } catch { /* ignore */ }
        throw new Error(detail);
      }
      if (data?.error) throw new Error(data.error);
      // Le contact est mis à jour en DB par l'edge function → invalider le cache
      await updateContact({ id, updates: { avatar_url: data.url } });
      setAiAvatarVisible(false);
    } catch (err) {
      setAiAvatarError(err instanceof Error ? err.message : 'Erreur de génération');
    } finally {
      setAiAvatarLoading(false);
    }
  };

  const handleCreateMessage = () =>
    router.push({ pathname: '/(app)/create', params: { contactId: id } } as never);

  const handleOpenPot = () => router.push('/(app)/pot/new' as never);
  const handleOpenQR = () => router.push('/(app)/qr' as never);
  const handleOpenPostcard = () =>
    router.push({ pathname: '/(app)/postcard', params: { contactId: id } } as never);

  const pets = usePetsByOwnerName(contact?.name ?? '');
  const selectedPet = pets.find((p) => p.id === selectedPetId) ?? pets[0] ?? null;
  const myPets = useMyPets();
  const { data: allContacts = [] } = useContacts();
  const partnerContact  = allContacts.find((c) => c.id === (contact as any)?.partner_contact_id) ?? null;
  const ownChildren     = useChildrenByParentName(contact?.name ?? '');
  const partnerChildren = useChildrenByParentName(partnerContact?.name ?? '');
  const children = [
    ...ownChildren,
    ...partnerChildren.filter((pc) => !ownChildren.some((c) => c.id === pc.id)),
  ];
  const [showMyPetPicker, setShowMyPetPicker] = useState(false);
  const [showContactPetPicker, setShowContactPetPicker] = useState(false);
  const [contactPetPickerDirection, setContactPetPickerDirection] = useState<'to' | 'from'>('from');
  const siblingPets = usePetsByOwnerName(
    contact?.relation === 'pet' ? (contact?.pet_owner_name ?? '') : ''
  ).filter((p) => p.id !== id);

  const runGiftSuggestions = (budget: string | null) => {
    if (!contact) return;
    resetGifts();
    const age = contact.birthday ? getAge(contact.birthday) : null;
    suggest({
      contact_name: contact.name,
      relation: contact.relation,
      age,
      personality_tags: (contact as { personality_tags?: string[] }).personality_tags ?? [],
      budget: budget ?? undefined,
    });
  };

  const handleGiftSuggestions = () => {
    if (!contact) return;
    setGiftBudget(null);
    setGiftModalVisible(true);
    runGiftSuggestions(null);
  };

  const openAddPet = () => {
    setEditingPetId(null);
    setNewPetType('chien'); // défaut — modifiable
    setNewPetName('');
    setNewPetBirthday('');
    setNewPetBreed('');
    setNewPetPersonalityTags([]);
    setAddPetModalVisible(true);
  };

  const openAddChild = () => {
    setEditingChildId(null);
    setNewChildName('');
    setNewChildBirthday('');
    setNewChildBirthdayDate(null);
    setNewChildNameDay('');
    setNewChildGender(null);
    setAddChildModalVisible(true);
  };

  const openEditChild = (child: typeof children[0]) => {
    setEditingChildId(child.id);
    setNewChildName(child.name);
    setNewChildGender((child as any).child_gender ?? null);
    const bday = child.birthday ?? '';
    setNewChildBirthday(bday ? bday.replace(/^0000-/, '').split('-').reverse().join('/') : '');
    if (bday && !bday.startsWith('0000-')) {
      setNewChildBirthdayDate(new Date(bday));
    } else {
      setNewChildBirthdayDate(null);
    }
    const nday = child.name_day ?? '';
    setNewChildNameDay(nday ? nday.split('-').reverse().join('/') : '');
    setAddChildModalVisible(true);
  };

  const handleSaveChild = async () => {
    if (!newChildName.trim() || !newChildGender) return;
    setIsSavingChild(true);
    const parseDate = (raw: string): string | null => {
      const parts = raw.trim().split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      if (parts.length === 2) return `0000-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      return null;
    };
    const parseNameDay = (raw: string): string | null => {
      const parts = raw.trim().split('/');
      if (parts.length >= 2) return `${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      return null;
    };
    const birthday = newChildBirthday.trim() ? parseDate(newChildBirthday) : null;
    const name_day = newChildNameDay.trim() ? parseNameDay(newChildNameDay) : null;
    try {
      if (editingChildId) {
        await updateContact({ id: editingChildId, updates: { name: newChildName.trim(), child_gender: newChildGender, birthday, name_day } as any });
      } else {
        await createContact({
          name: newChildName.trim(),
          relation: 'child_of',
          child_parent_name: contact!.name,
          child_parent_contact_id: contact!.id,
          child_gender: newChildGender,
          birthday,
          name_day,
          phone: null,
          email: null,
          notes: null,
          avatar_url: null,
          imported_from: null,
          personality_tags: [],
          preferred_channel: null,
          preferred_send_time: null,
          preferred_language: null,
          favourite_color: null,
        } as any);
      }
      setAddChildModalVisible(false);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible d'enregistrer l'enfant.");
    } finally {
      setIsSavingChild(false);
    }
  };

  const openEditPet = (pet: typeof pets[0]) => {
    setEditingPetId(pet.id);
    setNewPetType((pet.pet_type as 'chien' | 'chat' | 'lapin' | 'oiseau' | 'cheval' | 'hamster' | 'perroquet' | 'cochon_d_inde' | 'souris' | 'poisson' | 'tortue' | 'autre') ?? null);
    setNewPetName(pet.name);
    setNewPetBirthday(pet.birthday ?? '');
    setNewPetBreed((pet as any).breed ?? '');
    setNewPetGender((pet.pet_gender as 'male' | 'female' | null) ?? null);
    setNewPetPersonalityTags((pet.personality_tags ?? []) as string[]);
    setAddPetModalVisible(true);
  };

  const handleSavePet = async () => {
    if (!newPetType || !newPetName.trim() || !newPetGender) return;
    setIsSavingPet(true);
    // Convertit "JJ/MM/AAAA" ou "JJ/MM" en ISO "YYYY-MM-DD" ou "0000-MM-DD"
    const parseBirthday = (raw: string): string | null => {
      const parts = raw.trim().split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      if (parts.length === 2) return `0000-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      return null;
    };
    const birthday = newPetBirthday.trim() ? parseBirthday(newPetBirthday) : null;
    try {
      if (editingPetId) {
        await updateContact({ id: editingPetId, updates: { name: newPetName.trim(), pet_type: newPetType, pet_gender: newPetGender, birthday, personality_tags: newPetPersonalityTags, breed: newPetBreed.trim() || null } as any });
      } else {
        await createContact({
          name: newPetName.trim(),
          relation: 'pet',
          pet_owner_name: contact!.name,
          pet_type: newPetType,
          birthday,
          name_day: null,
          phone: null,
          email: null,
          notes: null,
          avatar_url: null,
          imported_from: null,
          personality_tags: newPetPersonalityTags,
          preferred_channel: null,
          preferred_send_time: null,
          preferred_language: null,
          favourite_color: null,
          pet_gender: newPetGender,
          pet_owner_contact_id: contact!.id,
          breed: newPetBreed.trim() || null,
        } as any);
      }
      setAddPetModalVisible(false);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible d'enregistrer l'animal.");
    } finally {
      setIsSavingPet(false);
    }
  };

  const handleGeneratePetFrom = async () => {
    if (!selectedPet || !contact) return;
    setPetFromAiGenerating(true);
    setPetFromAiResult(null);
    setPetFromAiError(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-message', {
        body: {
          format: 'message',
          tone: 'playful',
          relation: selectedPet.pet_type ?? 'autre',
          contact_name: contact.name,
          occasion: petFromAiOccasion,
          pet_from_mode: true,
          pet_from_name: selectedPet.name,
          pet_from_type: selectedPet.pet_type ?? 'autre',
          personality_tags: (selectedPet as { personality_tags?: string[] }).personality_tags ?? [],
          is_regeneration: false,
          language: 'fr',
        },
      });
      if (error) {
        let detail = (error as Error).message ?? 'Erreur génération';
        try {
          const ctx = (error as unknown as { context?: unknown }).context;
          if (ctx && typeof (ctx as Response).text === 'function') {
            const rawText = await (ctx as Response).text();
            try { const b = JSON.parse(rawText); if (b?.error) detail = b.error; } catch { detail = rawText; }
          }
        } catch { /* ignore */ }
        throw new Error(detail);
      }
      const raw = (data as { content?: string })?.content;
      if (!raw) throw new Error('Réponse vide du générateur IA');
      const cleaned = raw.trim().replace(/^[*"«\s]+/, '').replace(/[*"»\s]+$/, '').trim();
      setPetFromAiResult(cleaned);
    } catch (err) {
      setPetFromAiError(err instanceof Error ? err.message : 'Erreur de génération');
    } finally {
      setPetFromAiGenerating(false);
    }
  };

  const handleLoadFirstNameMeaning = async () => {
    if (firstNameMeaning || isFirstNameMeaningLoading || !contact) return;
    const firstName = contact.name.split(' ').slice(1).join(' ');
    if (!firstName.trim()) return;
    // 1. Fichier local (instantané)
    const staticMeaning = NAME_MEANINGS[firstName];
    if (staticMeaning) { setFirstNameMeaning(staticMeaning); return; }
    // 2. Cache Supabase
    const { data: cached } = await (supabase as any)
      .from('name_meanings_cache')
      .select('meaning')
      .eq('name', firstName)
      .eq('type', 'prénom')
      .maybeSingle();
    if (cached?.meaning) { setFirstNameMeaning(cached.meaning); return; }
    // 3. Edge Function Mistral + sauvegarde en cache
    setIsFirstNameMeaningLoading(true);
    try {
      const { data } = await supabase.functions.invoke('name-meaning', { body: { name: firstName, type: 'prénom' } });
      const meaning = data?.meaning ?? 'Signification introuvable pour ce prénom.';
      setFirstNameMeaning(meaning);
      if (data?.meaning) {
        await (supabase as any).from('name_meanings_cache').upsert({ name: firstName, type: 'prénom', meaning }).throwOnError();
      }
    } catch {
      setFirstNameMeaning('Impossible de charger la signification pour le moment.');
    } finally {
      setIsFirstNameMeaningLoading(false);
    }
  };

  const handleLoadLastNameMeaning = async () => {
    if (lastNameMeaning || isLastNameMeaningLoading || !contact) return;
    const lastName = contact.name.split(' ')[0];
    if (!lastName.trim()) return;
    // 1. Cache Supabase
    const { data: cached } = await (supabase as any)
      .from('name_meanings_cache')
      .select('meaning')
      .eq('name', lastName)
      .eq('type', 'nom')
      .maybeSingle();
    if (cached?.meaning) { setLastNameMeaning(cached.meaning); return; }
    // 2. Edge Function Mistral + sauvegarde en cache
    setIsLastNameMeaningLoading(true);
    try {
      const { data } = await supabase.functions.invoke('name-meaning', { body: { name: lastName, type: 'nom' } });
      const meaning = data?.meaning ?? 'Signification introuvable pour ce nom de famille.';
      setLastNameMeaning(meaning);
      if (data?.meaning) {
        await (supabase as any).from('name_meanings_cache').upsert({ name: lastName, type: 'nom', meaning }).throwOnError();
      }
    } catch {
      setLastNameMeaning('Impossible de charger la signification pour le moment.');
    } finally {
      setIsLastNameMeaningLoading(false);
    }
  };

  const loadInsee = async (name: string) => {
    setInseeFirstLoading(true); setInseeFirstNotFound(false); setInseeFirst(null);
    try {
      // 1. Cache Supabase
      const { data: cached } = await (supabase as any)
        .from('insee_prenoms_cache')
        .select('data, peak_year, peak_count')
        .eq('name', name.toUpperCase())
        .maybeSingle();
      if (cached?.data?.length) {
        setInseeFirst(cached.data);
        if (cached.peak_year) setInseeFirstPeak({ year: cached.peak_year, count: cached.peak_count ?? 0 });
        return;
      }
      // 2. Edge Function + sauvegarde en cache
      const { data } = await supabase.functions.invoke('insee-prenoms', { body: { name } });
      if (data?.not_found || !data?.data?.length) { setInseeFirstNotFound(true); }
      else {
        setInseeFirst(data.data);
        if (data.peak_year) setInseeFirstPeak({ year: data.peak_year, count: data.peak_count ?? 0 });
        await (supabase as any).from('insee_prenoms_cache').upsert({
          name: name.toUpperCase(),
          data: data.data,
          peak_year: data.peak_year ?? null,
          peak_count: data.peak_count ?? null,
        });
      }
    } catch { setInseeFirstNotFound(true); }
    finally { setInseeFirstLoading(false); }
  };

  const handleLoadYearFacts = async () => {
    if (!contact || isLoadingYearFacts) return;
    if (yearFacts && !yearFacts.startsWith('⚠️')) return; // déjà chargé avec succès
    setYearFacts(null);
    const bday = contact.birthday;
    if (!bday || bday.startsWith('0000-')) return;
    const year = parseInt(bday.split('-')[0], 10);
    if (isNaN(year)) return;
    setIsLoadingYearFacts(true);
    try {
      const { data, error } = await supabase.functions.invoke('birth-insights', {
        body: { type: 'year_facts', year, contact_name: contactFirstName },
      });
      if (error) throw error;
      if (!data?.content) throw new Error('empty');
      setYearFacts(data.content);
    } catch (e) {
      setYearFacts(`⚠️ Impossible de charger. Réessaie dans quelques instants.`);
      console.error('birth-insights year_facts:', e);
    } finally {
      setIsLoadingYearFacts(false);
    }
  };

  const handleLoadCelebrities = async () => {
    if (!contact || isLoadingCelebs) return;
    if (celebrities && !celebrities.startsWith('⚠️')) return;
    setCelebrities(null);
    const bday = contact.birthday;
    if (!bday || bday.startsWith('0000-')) return;
    const parts = bday.split('-');
    const month = parseInt(parts[1] ?? '0', 10);
    const day   = parseInt(parts[2] ?? '0', 10);
    if (!month || !day) return;
    setIsLoadingCelebs(true);
    try {
      const { data, error } = await supabase.functions.invoke('birth-insights', {
        body: { type: 'celebrities', day, month, contact_name: contactFirstName },
      });
      if (error) throw error;
      if (!data?.content) throw new Error('empty');
      setCelebrities(data.content);
    } catch (e) {
      setCelebrities('⚠️ Impossible de charger. Réessaie dans quelques instants.');
      console.error('birth-insights celebrities:', e);
    } finally {
      setIsLoadingCelebs(false);
    }
  };

  const handleLoadDayFacts = async () => {
    if (!contact || isLoadingDayFacts) return;
    if (dayFacts && !dayFacts.startsWith('⚠️')) return;
    setDayFacts(null);
    const bday = contact.birthday;
    if (!bday || bday.startsWith('0000-')) return;
    const parts = bday.split('-');
    const year  = parseInt(parts[0] ?? '0', 10);
    const month = parseInt(parts[1] ?? '0', 10);
    const day   = parseInt(parts[2] ?? '0', 10);
    if (!year || !month || !day) return;
    setIsLoadingDayFacts(true);
    try {
      const { data, error } = await supabase.functions.invoke('birth-insights', {
        body: { type: 'day_facts', year, month, day, contact_name: contactFirstName },
      });
      if (error) throw error;
      if (!data?.content) throw new Error('empty');
      setDayFacts(data.content);
    } catch (e) {
      setDayFacts('⚠️ Impossible de charger. Réessaie dans quelques instants.');
      console.error('birth-insights day_facts:', e);
    } finally {
      setIsLoadingDayFacts(false);
    }
  };

  const handleLoadLifePath = async () => {
    if (!contact || isLoadingLifePath) return;
    if (lifePathAi && !lifePathAi.content.startsWith('⚠️')) return;
    setLifePathAi(null);
    const bday = contact.birthday;
    if (!bday || bday.startsWith('0000-')) return;
    const parts = bday.split('-');
    const year  = parseInt(parts[0] ?? '0', 10);
    const month = parseInt(parts[1] ?? '0', 10);
    const day   = parseInt(parts[2] ?? '0', 10);
    if (!year || !month || !day) return;
    setIsLoadingLifePath(true);
    try {
      const { data, error } = await supabase.functions.invoke('birth-insights', {
        body: { type: 'life_path', year, month, day, contact_name: contactFirstName },
      });
      if (error) throw error;
      if (!data?.content) throw new Error('empty');
      setLifePathAi({
        content: data.content,
        number: data.life_path_number ?? 0,
        name: data.life_path_name ?? '',
      });
    } catch (e) {
      setLifePathAi({ content: '⚠️ Impossible de charger. Réessaie dans quelques instants.', number: 0, name: '' });
      console.error('birth-insights life_path:', e);
    } finally {
      setIsLoadingLifePath(false);
    }
  };

  const doAvatarUpload = async (uri: string) => {
    try {
      setIsUploadingAvatar(true);
      const url = await uploadContactAvatar(uri);
      await updateContact({ id, updates: { avatar_url: url } });
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour la photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert('Photo de profil', 'Choisissez une source', [
      {
        text: 'Prendre une photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission refusée', "Autorisez l'accès à la caméra dans les réglages.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
          if (!result.canceled) await doAvatarUpload(result.assets[0].uri);
        },
      },
      {
        text: 'Choisir dans la galerie',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission refusée', "Autorisez l'accès aux photos dans les réglages.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });
          if (!result.canceled) await doAvatarUpload(result.assets[0].uri);
        },
      },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const myProfile = useAuthStore((s) => s.profile);
  const styles = useMemo(() => makeStyles(C), [C]);

  // ⚠️ useMemo doit être appelé AVANT tout early return (règles des Hooks)
  const ageFun = useMemo(() => {
    const bday = contact?.birthday;
    if (!bday || bday.startsWith('0000-')) return null;
    const birthDate = new Date(bday);
    if (isNaN(birthDate.getTime())) return null;
    const diffMs = Date.now() - birthDate.getTime();
    if (diffMs <= 0) return null;
    const jours = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const semaines = Math.floor(jours / 7);
    const mois = Math.floor(jours / 30.44);
    return {
      jours,
      semaines,
      mois,
      heures: jours * 24,
      battements: Math.round(jours * 24 * 60 * 70),
      repas:       jours * 3,
      nuits:       jours,
      minutes:     jours * 24 * 60,
    };
  }, [contact?.birthday]);

  if (isLoading || !contact) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // Calculs dates
  const zodiac = contact.birthday ? getZodiacSign(contact.birthday) : null;
  const chineseZodiac = contact.birthday ? getChineseZodiac(contact.birthday) : null;

  // Numérologie — nom stocké "NOM Prénom"
  const contactFirstName = extractFirstName(contact.name);
  const contactLastName  = extractLastName(contact.name);
  const numéroPrenom = contactFirstName ? getNumerologyProfile(calcNumerology(contactFirstName)) : null;
  const numéroNom = contactLastName && contactLastName !== contactFirstName ? getNumerologyProfile(calcNumerology(contactLastName)) : null;
  const numéroExpression = (contactFirstName && contactLastName && contactLastName !== contactFirstName)
    ? getNumerologyProfile(calcNumerology(contactFirstName + contactLastName))
    : null;
  const cheminDeVie = contact.birthday ? calcLifePath(contact.birthday) : null;
  const cheminProfile = cheminDeVie !== null ? getNumerologyProfile(cheminDeVie) : null;
  const myZodiac = myProfile?.birthday ? getZodiacSign(myProfile.birthday) : null;

  const compatibility = zodiac && myZodiac ? getZodiacCompatibility(zodiac, myZodiac) : null;
  const birthdayDays = contact.birthday ? daysUntilBirthday(contact.birthday) : null;
  const birthdayUrgent = birthdayDays !== null && isUrgent(birthdayDays);
  const hasYear = contact.birthday && !contact.birthday.startsWith('0000-');
  const age = hasYear ? getAge(contact.birthday!, false) : null; // âge actuel (inconnu si année absente)

  const nameDayMmdd =
    contact.name_day ?? getNameDayForName(contact.name.split(' ')[0]);
  const nameDayDays = nameDayMmdd ? daysUntilNextOccurrence(nameDayMmdd) : null;
  const nameDayNames = nameDayMmdd ? getNamesForDate(nameDayMmdd) : [];

  const nextEvent =
    birthdayDays !== null && (nameDayDays === null || birthdayDays <= nameDayDays)
      ? { type: 'birthday', days: birthdayDays }
      : nameDayDays !== null
      ? { type: 'name_day', days: nameDayDays }
      : null;

  const renderInseeChart = (
    data: { year: number; count: number }[],
    peak: { year: number; count: number } | null,
    selected: { year: number; count: number } | null,
    setSelected: (p: { year: number; count: number } | null) => void,
  ) => {
    const W = Dimensions.get('window').width - 32 - 28 - 32;
    const H = 130, PAD_L = 36, PAD_R = 8, PAD_T = 10, PAD_B = 24;
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;
    const minYear = data[0].year, maxYear = data[data.length - 1].year;
    const maxCount = Math.max(...data.map((d) => d.count));
    const toX = (y: number) => PAD_L + ((y - minYear) / (maxYear - minYear || 1)) * chartW;
    const toY = (c: number) => PAD_T + chartH - (c / (maxCount || 1)) * chartH;
    const points = data.map((d) => `${toX(d.year).toFixed(1)},${toY(d.count).toFixed(1)}`).join(' ');
    const xLabels: number[] = [];
    for (let y = Math.ceil(minYear / 20) * 20; y <= maxYear; y += 20) xLabels.push(y);
    const yLabels = [0, Math.round(maxCount / 2), maxCount];
    return (
      <View style={{ marginTop: 10, gap: 4 }}>
        {peak && (
          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary }}>
            🏆 Record : <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{peak.year}</Text> ({peak.count.toLocaleString('fr-FR')} naissances)
          </Text>
        )}
        <View style={{ position: 'relative' }}>
          <View style={{ width: W, height: H, backgroundColor: Colors.white, borderRadius: Radii.md, borderWidth: 0.5, borderColor: Colors.surfaceContainerHighest, overflow: 'hidden' }}>
            <Svg width={W} height={H}>
              {yLabels.map((v) => (
                <Line key={v} x1={PAD_L} y1={toY(v)} x2={W - PAD_R} y2={toY(v)} stroke={Colors.surfaceContainerHighest} strokeWidth={1} />
              ))}
              {yLabels.map((v) => (
                <SvgText key={`yl-${v}`} x={PAD_L - 3} y={toY(v) + 3} fontSize={7} textAnchor="end" fill={Colors.outlineVariant}>
                  {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                </SvgText>
              ))}
              <Polyline points={points} fill="none" stroke={C.primary} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {peak && (() => { const p = data.find((d) => d.year === peak.year); if (!p) return null; return <Circle cx={toX(p.year)} cy={toY(p.count)} r={5} fill={C.primary} />; })()}
              {selected && <Circle cx={toX(selected.year)} cy={toY(selected.count)} r={6} fill={Colors.white} stroke={C.primary} strokeWidth={2.5} />}
              {xLabels.map((y) => (
                <SvgText key={`xl-${y}`} x={toX(y)} y={H - 4} fontSize={8} textAnchor="middle" fill={Colors.outlineVariant}>{y}</SvgText>
              ))}
            </Svg>
          </View>
          <View style={{ position: 'absolute', top: 0, left: 0, width: W, height: H - PAD_B }}>
            {data.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={{ position: 'absolute', left: toX(d.year) - 10, top: toY(d.count) - 10, width: 20, height: 20 }}
                onPress={() => setSelected(selected?.year === d.year ? null : d)}
                activeOpacity={1}
              />
            ))}
          </View>
        </View>
        {selected && (
          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary, marginTop: 2 }}>
            {selected.year} — {selected.count.toLocaleString('fr-FR')} naissances
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(app)/contacts/index' as never)}
          style={styles.backLink}
        >
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Fiche contact</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            router.push({ pathname: '/(app)/contacts/new', params: { editId: id } } as never)
          }
        >
          <Text style={styles.editBtnText}>✏️ Modifier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <LinearGradient colors={[...Gradients.primary]} style={styles.hero}>
          <View style={styles.heroPattern} />
          <View style={styles.heroContent}>
            <TouchableOpacity onPress={() => { setAiAvatarError(null); setAiAvatarVisible(true); }} activeOpacity={0.8} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.full, paddingVertical: 4, paddingHorizontal: 12, marginBottom: 8 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 14, color: '#fff' }}>🎨 Générer un portrait IA unique</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <TouchableOpacity style={styles.aiAvatarBtn} onPress={() => { setAiAvatarError(null); setAiAvatarVisible(true); }}>
                  <Text style={{ fontSize: 16 }}>✨</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>Avatar IA</Text>
              </View>
              <View style={styles.avatarWrap}>
                <Avatar uri={contact.avatar_url} name={contact.name} size="xl" />
              </View>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <TouchableOpacity style={styles.editAvatarBtn} onPress={handleChangeAvatar} disabled={isUploadingAvatar}>
                  <Text style={{ fontSize: 16 }}>{isUploadingAvatar ? '⏳' : '📷'}</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>Ma photo</Text>
              </View>
            </View>
            <Text style={styles.heroName}>
              {contact.relation === 'pet'
                ? contact.name
                : `${contact.civilite ? contact.civilite + ' ' : ''}${contactFirstName && contactLastName !== contactFirstName ? `${contactFirstName} ${contactLastName}` : contactFirstName || contactLastName}`}
              {age !== null ? <Text style={styles.heroNameAge}> · {age} ans</Text> : null}
            </Text>
            <Text style={[styles.heroBirthday, !contact.birthday && styles.heroBirthdayEmpty]}>
              {contact.birthday
                ? contact.birthday.startsWith('0000-')
                  ? `Né·e le ${formatDate(contact.birthday.replace('0000-', '2000-'), 'd MMMM')}`
                  : `Né·e le ${formatDate(contact.birthday, 'd MMMM yyyy')}`
                : 'Date de naissance non renseignée'}
            </Text>
            {nameDayMmdd && (
              <Text style={styles.heroNameDay}>
                🌸 Fête le {formatShortDate(nameDayMmdd)}
                {nameDayDays !== null
                  ? nameDayDays === 0 ? ' · aujourd\'hui !'
                  : nameDayDays === 1 ? ' · demain'
                  : ` · dans ${nameDayDays}j`
                  : ''}
              </Text>
            )}
            <View style={styles.heroBadges}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>
                  {contact.relation === 'pet' && (contact as any).pet_type
                    ? ({ chien: '🐶 Chien', chat: '🐱 Chat', lapin: '🐰 Lapin', oiseau: '🐦 Oiseau', cheval: '🐴 Cheval', hamster: '🐹 Hamster', perroquet: '🦜 Perroquet', cochon_d_inde: '🐾 Cochon d\'Inde', souris: '🐭 Souris', poisson: '🐠 Poisson', tortue: '🐢 Tortue', autre: '🐾 Animal' } as Record<string, string>)[(contact as any).pet_type] ?? '🐾 Animal'
                    : RELATION_LABELS[contact.relation]}
                </Text>
              </View>
              {age && (
                <View style={[styles.heroBadge, styles.heroBadgeYellow]}>
                  <Text style={[styles.heroBadgeText, { color: Colors.secondaryContainer }]}>
                    {age} ans
                  </Text>
                </View>
              )}
            </View>
            {contact.relation === 'pet' && contact.pet_owner_name ? (
              <Text style={{ fontFamily: 'BeVietnamPro_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 0 }}>
                {`🏠 de ${(contact.pet_owner_name.trim().split(/\s+/).find((p: string) => p !== p.toUpperCase()) ?? contact.pet_owner_name.trim().split(/\s+/)[0]) || contact.pet_owner_name}`}
              </Text>
            ) : null}

            {/* Alerte prochaine occasion */}
            {nextEvent && isUrgent(nextEvent.days) && (
              <View style={styles.alertBox}>
                <Text style={styles.alertIcon}>{nextEvent.days === 0 ? '🎉' : '🔥'}</Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>
                    {nextEvent.type === 'birthday' ? 'Anniversaire' : 'Fête'}{' '}
                    {nextEvent.days === 0 ? "aujourd'hui !" : nextEvent.days === 1 ? 'demain !' : `dans ${nextEvent.days} jours !`}
                  </Text>
                  {contact.birthday && (
                    <Text style={styles.alertSub}>
                      {formatShortDate(contact.birthday.slice(5))} — {age} ans
                    </Text>
                  )}
                </View>
                <TouchableOpacity style={styles.alertBtn} onPress={handleCreateMessage}>
                  <Text style={styles.alertBtnText}>✦ Créer</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* ── Autres animaux du même propriétaire (vue fiche animal) ── */}
            {contact.relation === 'pet' && siblingPets.length > 0 && (
              <View style={styles.heroPetsRow}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: 'rgba(255,255,255,0.9)', textAlign: 'center', width: '100%' }}>
                  {(() => {
                    const parts = (contact.pet_owner_name ?? '').trim().split(/\s+/);
                    const first = parts.filter(p => !(p === p.toUpperCase() && /[A-Z]/.test(p))).join(' ');
                    const last  = parts.filter(p =>   p === p.toUpperCase() && /[A-Z]/.test(p) ).join(' ');
                    const full  = [first, last].filter(Boolean).join(' ') || contact.pet_owner_name;
                    return `Aussi chez ${full} :`;
                  })()}
                </Text>
                {siblingPets.map((pet) => {
                  const petEmoji = ({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[pet.pet_type ?? ''] ?? '🐾';
                  return (
                    <TouchableOpacity
                      key={pet.id}
                      style={styles.heroPetChip}
                      onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.heroPetChipText}>{petEmoji} {pet.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* ── Animal(aux) de compagnie ── */}
            {contact.relation !== 'pet' && contact.relation !== 'child_of' && pets.length > 0 && (
              <View style={styles.heroPetsRow}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: 'rgba(255,255,255,0.85)', textAlign: 'center', width: '100%' }}>
                  {pets.length > 1 ? 'Ses animaux :' : 'Son animal :'}
                </Text>
                {pets.map((pet) => {
                  const petEmoji = ({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[pet.pet_type ?? ''] ?? '🐾';
                  return (
                    <TouchableOpacity
                      key={pet.id}
                      style={styles.heroPetChip}
                      onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.heroPetChipText}>{petEmoji} {pet.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Dates importantes */}
        <View style={styles.datesGrid}>
          {contact.birthday && (
            <View style={styles.dateCard}>
              <View style={[styles.dateIcon, { backgroundColor: Colors.primary }]}>
                <Text style={{ fontSize: 14 }}>📅</Text>
              </View>
              <View>
                <Text style={styles.dateCardLabel}>Anniversaire</Text>
                <Text style={styles.dateCardValue}>
                  {formatDate(
                    new Date(2000, parseInt(contact.birthday.split('-')[1]) - 1, parseInt(contact.birthday.split('-')[2])),
                  )}
                </Text>
                {birthdayDays !== null && (
                  <Text style={[styles.dateCardSub, birthdayUrgent && { color: Colors.primary }]}>
                    {humanDaysUntil(birthdayDays)}
                  </Text>
                )}
              </View>
            </View>
          )}
          {nameDayMmdd && (
            <View style={styles.dateCard}>
              <View style={[styles.dateIcon, { backgroundColor: Colors.primaryContainer }]}>
                <Text style={{ fontSize: 14 }}>🌸</Text>
              </View>
              <View>
                <Text style={styles.dateCardLabel}>Fête</Text>
                <Text style={styles.dateCardValue}>{formatShortDate(nameDayMmdd)}</Text>
                <Text style={styles.dateCardSub}>{nameDayNames.slice(0, 2).join(', ')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Son humain — affiché uniquement pour les animaux, au-dessus du bouton */}
        {contact.relation === 'pet' && contact.pet_owner_name && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🧑 Son humain</Text>
            <TouchableOpacity
              style={styles.coordsCard}
              activeOpacity={contact.pet_owner_contact_id ? 0.75 : 1}
              onPress={() => {
                if (contact.pet_owner_contact_id) {
                  router.push({ pathname: '/(app)/contact/[id]', params: { id: contact.pet_owner_contact_id } } as never);
                }
              }}
            >
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>👤</Text>
                <Text style={[styles.coordValue, contact.pet_owner_contact_id && { color: C.primary }]}>
                  {contact.pet_owner_name}
                </Text>
                {contact.pet_owner_contact_id && (
                  <Text style={{ color: C.primary, fontSize: 18, marginLeft: 'auto' }}>›</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton envoyer un message */}
        {contact.relation === 'pet' ? (
          (() => {
            const navBase = {
              petId: contact.id,
              petName: contact.name,
              petType: (contact as any).pet_type ?? 'autre',
              breed: (contact as any).breed ?? '',
              petGender: contact.pet_gender ?? '',
              ownerName: contact.pet_owner_name ?? '',
              ownerId: contact.pet_owner_contact_id ?? '',
              personalityTags: JSON.stringify((contact as any).personality_tags ?? []),
            };
            const ownerFirst = (contact.pet_owner_name ?? '').trim().split(/\s+/).find((p: string) => p !== p.toUpperCase()) ?? (contact.pet_owner_name ?? '').split(' ')[0] ?? '';
            return (
              <View style={{ gap: 10 }}>
                {/* Intro Message à l'animal */}
                <View style={{ borderLeftWidth: 4, borderLeftColor: '#0284C7', backgroundColor: '#EFF6FF', borderRadius: Radii.lg, padding: 14, gap: 4 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.sm, color: '#0284C7' }}>📬 Écrire à {contactFirstName}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#0369A1', lineHeight: 20 }}>
                    {`Tu veux marquer un moment avec ${contactFirstName} ? Génère un message tendre ou drôle — une belle façon de célébrer votre complicité 🐾`}
                  </Text>
                </View>
                {/* Bouton principal */}
                <TouchableOpacity
                  style={[styles.sendMessageBtn, { backgroundColor: '#0284C7' }]}
                  onPress={() => router.push({ pathname: '/(app)/animal-message', params: { ...navBase, direction: 'to' } } as never)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendMessageBtnText}>📬 Message à {contactFirstName}</Text>
                </TouchableOpacity>
                {/* Intro + bouton "De la part de" */}
                <View style={{ borderLeftWidth: 4, borderLeftColor: C.primary, backgroundColor: C.primaryContainer + '55', borderRadius: Radii.lg, padding: 14, gap: 6 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.sm, color: C.primary }}>🐾 Messages de {contact.name}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: C.onSurfaceVariant, lineHeight: 20 }}>
                    {'Et si c\'était '}
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: C.onSurface }}>{contact.name}</Text>
                    {(() => {
                      const il = contact.pet_gender === 'female' ? 'Elle' : 'Il';
                      const lui = contact.pet_gender === 'female' ? 'elle' : 'lui';
                      return ` qui prenait la plume ? ${il} écrit à ${ownerFirst || 'son maître'} — un message rédigé comme si c'était ${lui} qui l'avait envoyé — hilarant, attendrissant et totalement inattendu 💛✨`;
                    })()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.sendMessageBtn, { backgroundColor: C.primary }]}
                  onPress={() => router.push({ pathname: '/(app)/animal-message', params: { ...navBase, direction: 'from' } } as never)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendMessageBtnText}>
                    🐾 {ownerFirst ? `Message de la part de ${contactFirstName} à ${ownerFirst}` : `Message de la part de ${contactFirstName}`}
                  </Text>
                </TouchableOpacity>

                {/* Intro + bouton "écrit à quelqu'un" */}
                <View style={{ borderLeftWidth: 4, borderLeftColor: '#D97706', backgroundColor: '#FFF7ED', borderRadius: Radii.lg, padding: 14, gap: 4 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.sm, color: '#92400E' }}>✍️ {contactFirstName} écrit à quelqu'un</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#92400E', lineHeight: 20, opacity: 0.8 }}>
                    {`${contactFirstName} peut aussi écrire à un autre contact — un ami de la famille, un proche. L'IA rédige le message à sa façon 🐾`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.sendMessageBtn, { backgroundColor: '#D97706' }]}
                  onPress={() => router.push({ pathname: '/(app)/animal-message', params: { ...navBase, direction: 'from_to_third' } } as never)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendMessageBtnText}>✍️ {contactFirstName} écrit à quelqu'un</Text>
                </TouchableOpacity>
              </View>
            );
          })()
        ) : (
          <View style={{ gap: 8 }}>
            {/* Carte intro photo/avatar */}
            <View style={{ marginHorizontal: Spacing[4], backgroundColor: '#F0F9FF', borderRadius: Radii.lg, borderWidth: 1.5, borderColor: '#BAE6FD', padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 22 }}>🖼️</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: '#0369A1' }}>Personnalise la fiche de {contactFirstName}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: '#0284C7', lineHeight: 18 }}>
                  {'📷 Charge une vraie photo depuis ton téléphone — ou laisse l\'IA créer un '}
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>portrait illustré unique</Text>
                  {' ✨ en appuyant sur les boutons de la photo ci-dessus.'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.sendMessageBtn, { backgroundColor: C.primary, marginBottom: 0 }]}
              onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: id } } as never)}
              activeOpacity={0.85}
            >
              <Text style={styles.sendMessageBtnText}>✨ J'écris un message à {contactFirstName}</Text>
            </TouchableOpacity>
            {pets.length > 0 && (
              <>
                <TouchableOpacity
                  style={[styles.sendMessageBtn, { backgroundColor: '#0891B2', marginBottom: 0 }]}
                  onPress={() => {
                    if (pets.length === 1) {
                      router.push({ pathname: '/(app)/animal-message', params: { petId: pets[0].id, petName: pets[0].name, petType: (pets[0] as any).pet_type ?? 'autre', breed: (pets[0] as any).breed ?? '', petGender: (pets[0] as any).pet_gender ?? '', direction: 'to', ownerName: contact.name, ownerId: id } } as never);
                    } else {
                      setContactPetPickerDirection('to');
                      setShowContactPetPicker(true);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendMessageBtnText}>
                    🐾 {pets.length === 1 ? `J'écris à l'animal de ${contactFirstName}` : `J'écris à un des animaux de ${contactFirstName}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendMessageBtn, { backgroundColor: '#C2410C', marginBottom: 0 }]}
                  onPress={() => {
                    if (pets.length === 1) {
                      router.push({ pathname: '/(app)/animal-message', params: { petId: pets[0].id, petName: pets[0].name, petType: (pets[0] as any).pet_type ?? 'autre', breed: (pets[0] as any).breed ?? '', petGender: (pets[0] as any).pet_gender ?? '', direction: 'from', ownerName: contact.name, ownerId: id } } as never);
                    } else {
                      setContactPetPickerDirection('from');
                      setShowContactPetPicker(true);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendMessageBtnText}>
                    🐾 {pets.length === 1 ? `L'animal de ${contactFirstName} écrit` : `Un des animaux de ${contactFirstName} écrit`}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* ── Boutons animaux rapides ── */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && myPets.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.sendMessageBtn, { backgroundColor: '#D97706' }]}
              onPress={() => setShowMyPetPicker(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.sendMessageBtnText}>
                🐾 {myPets.length === 1 ? `${myPets[0].name} écrit à ${contactFirstName}` : `Un de mes animaux écrit à ${contactFirstName}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Animaux de compagnie — juste sous l'accroche */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Animaux de compagnie 🐾</Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 4 }}>
            Clique sur un animal pour lui écrire ou le laisser prendre la plume 🐾
          </Text>
          {pets.length === 0 ? (
            <TouchableOpacity style={styles.addPetBtn} onPress={openAddPet} activeOpacity={0.85}>
              <Text style={styles.addPetBtnText}>🐾 Ajouter son animal de compagnie</Text>
            </TouchableOpacity>
          ) : (
            <>
              {pets.map((pet) => {
                const petEmoji = ({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[pet.pet_type ?? ''] ?? '🐾';
                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={styles.ownerPetCard}
                    onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.ownerPetAvatar}>
                      <Text style={{ fontSize: 22 }}>{petEmoji}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.ownerPetName}>{pet.name}</Text>
                      {pet.birthday && (
                        <Text style={styles.ownerPetSub}>
                          Né{pet.pet_gender === 'female' ? 'e' : ''} le {pet.birthday.replace(/^0000-/, '').split('-').reverse().join('/')}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.petEditBtn}
                      onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)}
                      activeOpacity={0.75}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.petEditBtnText}>✏️</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.addPetBtnSmall} onPress={openAddPet} activeOpacity={0.85}>
                <Text style={styles.addPetBtnSmallText}>＋ Ajouter un autre animal</Text>
              </TouchableOpacity>
            </>
          )}
        </View>}

        {/* Enfants du contact */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Enfants 👶</Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 8 }}>
            {`🎂 Fête son anniversaire ou sa fête — 💌 laisse-le écrire lui-même à ${contactFirstName} — 🎴 ajoute une carte animée. Tout ça en quelques secondes.`}
          </Text>
          {children.length === 0 ? (
            <TouchableOpacity style={styles.addPetBtn} onPress={openAddChild} activeOpacity={0.85}>
              <Text style={styles.addPetBtnText}>👶 Ajouter un enfant</Text>
            </TouchableOpacity>
          ) : (
            <>
              {children.map((child) => {
                const emoji = (child as any).child_gender === 'female' ? '👧' : '👦';
                const bday = child.birthday ? child.birthday.replace(/^0000-/, '').split('-').reverse().join('/') : null;
                return (
                  <View key={child.id} style={{ gap: 6 }}>
                  <View style={styles.ownerPetCard}>
                    <View style={styles.ownerPetAvatar}>
                      <Text style={{ fontSize: 22 }}>{emoji}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={styles.ownerPetName}>{child.name}</Text>
                      {bday && <Text style={styles.ownerPetSub}>Né{(child as any).child_gender === 'female' ? 'e' : ''} le {bday}</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      {child.birthday && (() => {
                        const age = child.birthday && !child.birthday.startsWith('0000-') ? (() => {
                          const b = new Date(child.birthday!); const t = new Date();
                          let a = t.getFullYear() - b.getFullYear();
                          if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) a--;
                          return a >= 0 ? a : null;
                        })() : null;
                        return (
                          <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: contact.id, occasion: 'birthday', childName: child.name, ...(age !== null ? { childAge: String(age) } : {}) } } as never)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.75}
                          >
                            <Text style={{ fontSize: 18 }}>🎂</Text>
                          </TouchableOpacity>
                        );
                      })()}
                      {child.name_day && (
                        <TouchableOpacity
                          onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: contact.id, occasion: 'nameday', childName: child.name } } as never)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          activeOpacity={0.75}
                        >
                          <Text style={{ fontSize: 18 }}>🎉</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.petEditBtn}
                        onPress={() => openEditChild(child)}
                        activeOpacity={0.75}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.petEditBtnText}>✏️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                    {/* De la part de l'enfant → au parent + au partenaire */}
                    {(() => {
                      const age = child.birthday && !child.birthday.startsWith('0000-') ? (() => {
                        const b = new Date(child.birthday!); const t = new Date();
                        let a = t.getFullYear() - b.getFullYear();
                        if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) a--;
                        return a >= 0 ? a : null;
                      })() : null;
                      const ageParams = age !== null ? { childFromAge: String(age) } : {};
                      return (
                        <View style={{ marginTop: 6, gap: 6 }}>
                          {/* → maman/papa (contact courant) */}
                          <TouchableOpacity
                            style={{ backgroundColor: '#FDF4FF', borderRadius: 10, borderWidth: 1.5, borderColor: '#9333EA40', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                            onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: contact.id, childFromName: child.name, ...ageParams } } as never)}
                            activeOpacity={0.85}
                          >
                            <Text style={{ fontSize: 18 }}>💌</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, color: '#7C3AED' }}>
                                De la part de {child.name} → {contactFirstName}{contact.civilite === 'Mme' ? ', sa mère' : contact.civilite === 'M.' ? ', son père' : ''}
                              </Text>
                              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#7C3AED', opacity: 0.8 }}>
                                Pour son anniversaire ou sa fête
                              </Text>
                            </View>
                            <Text style={{ color: '#9333EA', fontSize: 14 }}>›</Text>
                          </TouchableOpacity>
                          {/* → partenaire (si lié) */}
                          {partnerContact && (
                            <TouchableOpacity
                              style={{ backgroundColor: '#FFF7ED', borderRadius: 10, borderWidth: 1.5, borderColor: '#D9770640', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                              onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: partnerContact.id, childFromName: child.name, ...ageParams } } as never)}
                              activeOpacity={0.85}
                            >
                              <Text style={{ fontSize: 18 }}>💌</Text>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 12, color: '#92400E' }}>
                                  {(() => { const pFirst = partnerContact.name.split(' ').slice(1).join(' ') || partnerContact.name.split(' ')[0]; const pRole = partnerContact.civilite === 'Mme' ? ', sa mère' : partnerContact.civilite === 'M.' ? ', son père' : ''; return `De la part de ${child.name} → ${pFirst}${pRole}`; })()}
                                </Text>
                                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#92400E', opacity: 0.8 }}>
                                  Pour son anniversaire ou sa fête
                                </Text>
                              </View>
                              <Text style={{ color: '#D97706', fontSize: 14 }}>›</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })()}
                  </View>
                );
              })}
              <TouchableOpacity style={styles.addPetBtnSmall} onPress={openAddChild} activeOpacity={0.85}>
                <Text style={styles.addPetBtnSmallText}>＋ Ajouter un autre enfant</Text>
              </TouchableOpacity>
            </>
          )}
        </View>}

        {/* Partenaire / conjoint(e) */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Partenaire / conjoint(e) 💑</Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 8 }}>
            {partnerContact ? (() => {
              const partnerFirst = partnerContact.name.split(' ').slice(1).join(' ') || partnerContact.name.split(' ')[0];
              return `${contactFirstName} et ${partnerFirst} sont liés 💑\n\nMaintenant, quand c'est l'anniversaire ou la fête de ${contactFirstName}, leurs enfants peuvent lui envoyer un message comme si c'était eux qui l'avaient écrit — "Bon anni Maman !". Et pareil pour ${partnerFirst} — "Bon anni Papa !"\n\nChaque parent reçoit son message, chaque enfant signe à sa façon. Une attention qui touche au cœur, organisée par toi en quelques secondes ✨`;
            })()
              : `Lie le partenaire de ${contactFirstName} pour que leurs enfants puissent écrire à Maman ET à Papa pour leur anniversaire ou leur fête 💑`
            }
          </Text>
          {partnerContact ? (
            <View style={{ gap: 8 }}>
              <TouchableOpacity
                style={styles.ownerPetCard}
                onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: partnerContact.id } } as never)}
                activeOpacity={0.8}
              >
                <View style={styles.ownerPetAvatar}>
                  <Text style={{ fontSize: 22 }}>💑</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.ownerPetName}>{partnerContact.name}</Text>
                  <Text style={styles.ownerPetSub}>Voir sa fiche →</Text>
                </View>
                <TouchableOpacity
                  style={styles.petEditBtn}
                  onPress={async () => { await updateContact({ id: contact.id, updates: { partner_contact_id: null } as any }); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.petEditBtnText}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addPetBtn} onPress={() => { setPartnerSearch(''); setPartnerPickerVisible(true); }} activeOpacity={0.85}>
              <Text style={styles.addPetBtnText}>💑 Lier son partenaire</Text>
            </TouchableOpacity>
          )}
        </View>}

        {/* Bandeau transition — En savoir plus sur [contact] */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && (
          <View style={styles.transitionBanner}>
            <Text style={styles.transitionBannerText}>En savoir plus sur {contactFirstName}</Text>
          </View>
        )}

        {/* Prénom & Astrologie — masqué pour les animaux et les enfants */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && (
          <>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nom, Prénom & Astrologie</Text>
            <View style={styles.coordsCard}>

              {/* Signification du nom de famille */}
              <TouchableOpacity
                style={styles.coordRow}
                onPress={handleLoadLastNameMeaning}
                activeOpacity={lastNameMeaning ? 1 : 0.7}
                disabled={isLastNameMeaningLoading}
              >
                <Text style={styles.coordIcon}>🏷️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.coordValue, { fontFamily: 'BeVietnamPro_600SemiBold', marginBottom: lastNameMeaning ? 6 : 0 }]}>
                    Origine du nom {contact.name.split(' ')[0]}
                  </Text>
                  {isLastNameMeaningLoading && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <ActivityIndicator size="small" color={C.primary} />
                      <Text style={styles.coordEmpty}>Chargement…</Text>
                    </View>
                  )}
                  {lastNameMeaning ? (
                    <>
                      <Text style={[styles.coordEmpty, { color: Colors.onSurface, fontStyle: 'normal', fontSize: Typography.sm, lineHeight: 20 }]}>
                        {lastNameMeaning}
                      </Text>
                      <Text style={styles.aiDisclaimer}>Texte généré par IA à titre indicatif 🤖✨</Text>
                    </>
                  ) : !isLastNameMeaningLoading ? (
                    <Text style={[styles.coordEmpty, { color: C.primary }]}>Appuyer pour découvrir ›</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              <View style={styles.coordDivider} />

              {/* Signification du prénom */}
              <TouchableOpacity
                style={styles.coordRow}
                onPress={handleLoadFirstNameMeaning}
                activeOpacity={firstNameMeaning ? 1 : 0.7}
                disabled={isFirstNameMeaningLoading}
              >
                <Text style={styles.coordIcon}>📖</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.coordValue, { fontFamily: 'BeVietnamPro_600SemiBold', marginBottom: firstNameMeaning ? 6 : 0 }]}>
                    Signification du prénom {contact.name.split(' ').slice(1).join(' ')}
                  </Text>
                  {isFirstNameMeaningLoading && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <ActivityIndicator size="small" color={C.primary} />
                      <Text style={styles.coordEmpty}>Chargement…</Text>
                    </View>
                  )}
                  {firstNameMeaning ? (
                    <>
                      <Text style={[styles.coordEmpty, { color: Colors.onSurface, fontStyle: 'normal', fontSize: Typography.sm, lineHeight: 20 }]}>
                        {firstNameMeaning}
                      </Text>
                      <Text style={styles.aiDisclaimer}>Texte généré par IA à titre indicatif 🤖✨</Text>
                      {/* Courbe INSEE prénom */}
                      {!inseeFirst && !inseeFirstLoading && !inseeFirstNotFound && (
                        <TouchableOpacity onPress={() => loadInsee(contact.name.split(' ').slice(1).join(' '))} activeOpacity={0.75} style={{ marginTop: 8 }}>
                          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary }}>📊 Voir la courbe de popularité INSEE ›</Text>
                        </TouchableOpacity>
                      )}
                      {inseeFirstLoading && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}><ActivityIndicator size="small" color={C.primary} /><Text style={[styles.coordEmpty]}>Chargement INSEE…</Text></View>}
                      {inseeFirstNotFound && <Text style={[styles.coordEmpty, { marginTop: 6 }]}>Prénom introuvable dans les données INSEE.</Text>}
                      {inseeFirst && inseeFirst.length > 0 && renderInseeChart(inseeFirst, inseeFirstPeak, inseeFirstSel, setInseeFirstSel)}
                    </>
                  ) : !isFirstNameMeaningLoading ? (
                    <Text style={[styles.coordEmpty, { color: C.primary }]}>Appuyer pour découvrir ›</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              {/* Signe astrologique */}
              {zodiac && (
                <>
                  <View style={styles.coordDivider} />
                  <View style={styles.zodiacBlock}>
                    {/* En-tête : signe + élément + dates */}
                    <View style={styles.zodiacHeader}>
                      <Text style={styles.zodiacEmoji}>{zodiac.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <Text style={styles.zodiacName}>{zodiac.name}</Text>
                          <View style={styles.zodiacElementPill}>
                            <Text style={styles.zodiacElementText}>{zodiac.elementEmoji} {zodiac.element}</Text>
                          </View>
                        </View>
                        <Text style={styles.zodiacDateRange}>{zodiac.dateRange}</Text>
                      </View>
                    </View>

                    {/* Trait court en italique */}
                    <Text style={styles.zodiacTrait}>✦ {zodiac.trait}</Text>

                    {/* Description complète */}
                    <Text style={styles.zodiacDescription}>{zodiac.description}</Text>

                    {/* Mots-clés */}
                    <View style={styles.zodiacKeywords}>
                      {zodiac.keywords.map((kw) => (
                        <View key={kw} style={styles.zodiacKeywordPill}>
                          <Text style={styles.zodiacKeywordText}>{kw}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Points forts */}
                    <Text style={styles.zodiacSectionLabel}>💪 Points forts</Text>
                    <Text style={styles.zodiacSubText}>{zodiac.strengths}</Text>

                    {/* En relation */}
                    <Text style={styles.zodiacSectionLabel}>💜 En amitié & en amour</Text>
                    <Text style={styles.zodiacSubText}>{zodiac.inRelationship}</Text>

                    {/* Titre compatibilité */}
                    <View style={styles.compatSectionHeader}>
                      <Text style={styles.compatSectionTitle}>
                        🔮 Ta compatibilité avec {contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0]}
                      </Text>
                    </View>

                    {/* Compatibilité avec l'utilisateur — masquée derrière un teaser */}
                    {!showCompat ? (
                      <TouchableOpacity
                        style={styles.compatTeaser}
                        onPress={() => setShowCompat(true)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.compatTeaserEmoji}>🔮</Text>
                        <Text style={styles.compatTeaserText}>Voir notre compatibilité ?</Text>
                        <Text style={styles.compatTeaserArrow}>›</Text>
                      </TouchableOpacity>
                    ) : compatibility ? (
                      <View style={styles.compatBlock}>
                        <View style={styles.compatHeader}>
                          <Text style={styles.compatEmoji}>{compatibility.emoji}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.compatLabel}>{compatibility.label}</Text>
                            <View style={styles.compatStars}>
                              {[1,2,3,4,5].map((s) => (
                                <Text key={s} style={[styles.compatStar, s <= compatibility.score && styles.compatStarActive]}>★</Text>
                              ))}
                              <Text style={styles.compatSignsText}>
                                {myZodiac!.emoji} {myZodiac!.name} × {zodiac.emoji} {zodiac.name}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.compatDesc}>{compatibility.description}</Text>
                      </View>
                    ) : (
                      <View style={styles.compatMissing}>
                        <Text style={styles.compatMissingText}>
                          🔮 Ajoute ta date de naissance dans ton profil pour voir ta compatibilité avec {contact.name} !
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}

            </View>
          </View>

          {/* Bouton compatibilité complète */}
          <TouchableOpacity
            style={styles.compatFullBtn}
            onPress={() => router.push({ pathname: '/(app)/contact/compat/[id]', params: { id } } as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.compatFullBtnEmoji}>💫</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.compatFullBtnTitle, { color: C.primary }]}>Voir la compatibilité complète</Text>
              <Text style={styles.compatFullBtnSub}>Numérologie · Astrologie · Zodiaque chinois</Text>
            </View>
            <Text style={[styles.compatFullBtnArrow, { color: C.primary }]}>›</Text>
          </TouchableOpacity>

          {/* Bouton compatibilité libre */}
          {(() => {
            const parts = (myProfile?.full_name ?? '').trim().split(' ');
            // Format stocké : "NOM Prénom" — premier segment = nom, reste = prénom
            const myLastName  = parts[0] ?? '';
            const myFirstName = parts.slice(1).join(' ');
            return (
              <TouchableOpacity
                style={[styles.compatFreeBtn, { borderColor: C.primary }]}
                onPress={() => router.push({
                  pathname: '/(app)/compat',
                  params: { preA: myFirstName, nomA: myLastName },
                } as never)}
                activeOpacity={0.85}
              >
                <Text style={styles.compatFreeBtnEmoji}>💞</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.compatFreeBtnTitle, { color: C.primary }]}>
                    Ta compatibilité avec un autre prénom
                  </Text>
                  <Text style={styles.compatFreeBtnSub}>Ton prénom déjà pré-rempli</Text>
                </View>
                <Text style={[styles.compatFullBtnArrow, { color: C.primary }]}>›</Text>
              </TouchableOpacity>
            );
          })()}

          {/* Signe chinois */}
          {chineseZodiac && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>Signe du zodiaque chinois</Text>
                <TouchableOpacity onPress={() => setChineseZodiacHelpVisible(true)} style={styles.helpInfoBtn}>
                  <Text style={styles.helpInfoBtnText}>ℹ️</Text>
                </TouchableOpacity>
              </View>
              <FeatureIntroCard
                introText={"Dans la tradition chinoise, on dit que l'animal de ton année de naissance te suit toute ta vie 🐉 Rat, Bœuf, Tigre, Lapin, Dragon... depuis plus de 2000 ans le zodiaque chinois associe chaque être humain à un animal porteur de sens et de vertus uniques — découvre l'animal qui accompagne ton proche depuis sa naissance et ce qu'il révèle de sa personnalité profonde selon des millénaires de sagesse ancestrale 🌟💛✨"}
                modeEmploiLines={[
                  "🐉 L'année de naissance suffit — son animal est détecté automatiquement",
                  "✨ Son profil complet s'affiche : animal, emoji, élément, vertus et traits",
                  "💫 Description détaillée de sa personnalité selon la tradition chinoise",
                  "🌟 Explore les forces et défis que des millénaires de sagesse lui attribuent",
                  "🎯 Rends-toi dans l'onglet Compatibilité pour voir comment vos animaux s'entendent 💛✨",
                ]}
                backgroundColor={Colors.white}
                borderWidth={4}
                containerStyle={{ marginBottom: 10 }}
              />
              <View style={styles.chineseZodiacCard}>
                <View style={styles.chineseZodiacHeader}>
                  <Text style={styles.chineseZodiacEmoji}>{chineseZodiac.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Text style={styles.chineseZodiacName}>{chineseZodiac.name}</Text>
                      <View style={styles.chineseZodiacElementPill}>
                        <Text style={styles.chineseZodiacElementText}>{chineseZodiac.elementEmoji} {chineseZodiac.element}</Text>
                      </View>
                    </View>
                    <Text style={styles.chineseZodiacVirtues}>{chineseZodiac.virtues}</Text>
                  </View>
                </View>
                <View style={styles.chineseZodiacTraits}>
                  {chineseZodiac.traits.map((t) => (
                    <View key={t} style={styles.chineseZodiacTraitPill}>
                      <Text style={styles.chineseZodiacTraitText}>{t}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.chineseZodiacDesc}>{chineseZodiac.description}</Text>
              </View>
            </View>
          )}
          </>
        )}

        {/* Numérologie */}
        {contact.relation !== 'pet' && numéroPrenom && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Numérologie</Text>
              <TouchableOpacity onPress={() => setNumerologyHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={`Et si le prénom de ${contactFirstName} en disait plus long que tu ne le crois ? 🤔 La numérologie révèle à travers un chiffre unique la personnalité profonde et l'énergie vibratoire de celui qui le porte 🔢✨`}
              modeEmploiLines={[
                `🔢 Le chiffre vibratoire de ${contactFirstName} est calculé automatiquement`,
                "✨ Son chiffre s'affiche avec son nom et sa couleur associée",
                "💫 Consulte ses traits de caractère et la description de sa personnalité",
                contact.birthday && !contact.birthday.startsWith('0000-')
                  ? "🌟 Sa date de naissance permet aussi de découvrir son chemin de vie !"
                  : "🎯 Ajoute sa date de naissance pour découvrir aussi son chemin de vie",
              ].filter(Boolean) as string[]}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />

            {/* Chiffre du prénom */}
            <NumerologyCard
              label={`Chiffre du prénom ${contactFirstName}`}
              profile={numéroPrenom}
              C={C}
              styles={styles}
            />

            {/* Chiffre du nom de famille */}
            {numéroNom && (
              <NumerologyCard
                label={`Chiffre du nom ${contactLastName}`}
                profile={numéroNom}
                C={C}
                styles={styles}
              />
            )}

            {/* Chiffre d'expression */}
            {numéroExpression && (
              <NumerologyCard
                label="Chiffre d'expression (prénom + nom)"
                profile={numéroExpression}
                C={C}
                styles={styles}
              />
            )}

            {/* Chemin de vie */}
            {cheminProfile && (
              <>
                <View style={styles.cheminVieHeaderRow}>
                  <Text style={styles.cheminVieHeaderLabel}>🌟 Chemin de vie</Text>
                  <TouchableOpacity onPress={() => setLifePathHelpVisible(true)} style={styles.helpInfoBtn}>
                    <Text style={styles.helpInfoBtnText}>ℹ️</Text>
                  </TouchableOpacity>
                </View>
                <FeatureIntroCard
                  introText={`La date de naissance de ${contactFirstName} n'est peut-être pas un hasard 🌟 En numérologie, le chemin de vie est le chiffre le plus puissant de tous — il révèle la mission profonde, les talents naturels et les défis à surmonter dans cette vie 🔢💛✨`}
                  modeEmploiLines={[
                    "🌟 La date de naissance complète suffit — le chemin de vie est calculé automatiquement",
                    "✨ Tous les chiffres de la date sont additionnés jusqu'à obtenir 1-9, sauf 11 et 22 (nombres maîtres)",
                    `💫 Exemple : né le 23/04/1985 → 2+3+0+4+1+9+8+5 = 32 → 3+2 = 5 — Chemin de vie 5 : Le Libre`,
                    "🔢 Son chiffre s'affiche avec son nom, sa couleur et sa signification profonde",
                  ]}
                  accentColor={cheminProfile.color}
                  backgroundColor={Colors.white}
                  borderWidth={4}
                  containerStyle={{ marginBottom: 10 }}
                />
              <View style={[styles.numCard, { borderLeftColor: cheminProfile.color }]}>
                <View style={styles.numCardHeader}>
                  <View style={[styles.numColorDot, { backgroundColor: cheminProfile.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.numCardLabel}>🌟 Chemin de vie</Text>
                    <View style={styles.numCardTitleRow}>
                      <Text style={[styles.numCardNumber, { color: cheminProfile.color }]}>{cheminProfile.number}</Text>
                      <Text style={styles.numCardName}>{cheminProfile.name}</Text>
                      <View style={[styles.numColorPill, { backgroundColor: cheminProfile.color + '20', borderColor: cheminProfile.color + '60' }]}>
                        <Text style={[styles.numColorPillText, { color: cheminProfile.color }]}>{cheminProfile.colorName}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.numKeywords}>
                  {cheminProfile.keywords.map((k) => (
                    <View key={k} style={styles.numKeywordPill}><Text style={styles.numKeywordText}>{k}</Text></View>
                  ))}
                </View>
                <Text style={styles.numDescription}>{cheminProfile.description}</Text>
                <Text style={styles.numNote}>🌟 Le chiffre numérologique le plus important — révèle la mission de vie</Text>
              </View>
              </>
            )}
          </View>
        )}

        {/* Âge en chiffres fun */}
        {contact.relation !== 'pet' && ageFun && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Âge en chiffres fun 🤯</Text>
              <TouchableOpacity onPress={() => setAgeFunHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={"On dit souvent qu'on a l'âge qu'on se donne... mais en chiffres c'est une autre histoire ! 😄 14 600 jours, 350 400 heures, 500 millions de battements de cœur... 🤯 Découvre la vie de tes proches à travers des chiffres fous, fascinants et insolites qui donnent une toute autre dimension à chaque anniversaire et transforment chaque année vécue en une véritable célébration de la vie 🎂💛✨"}
              modeEmploiLines={[
                "🎂 Calculé automatiquement depuis la date de naissance, mis à jour chaque jour",
                "✨ Jours vécus, heures, minutes, battements de cœur, repas pris, nuits dormies...",
                "💫 Chaque chiffre accompagné d'une anecdote amusante sur l'immensité de la vie",
                "🎉 Partage via WhatsApp ou SMS 💛✨",
              ]}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />
            {/* Grille de stats */}
            <View style={styles.ageFunGrid}>
              {[
                { emoji: '📅', value: ageFun.jours.toLocaleString('fr-FR'),    label: 'jours vécus' },
                { emoji: '🗓',  value: ageFun.semaines.toLocaleString('fr-FR'), label: 'semaines' },
                { emoji: '🌙',  value: ageFun.mois.toLocaleString('fr-FR'),     label: 'mois' },
                { emoji: '⏰',  value: ageFun.heures.toLocaleString('fr-FR'),   label: 'heures' },
                { emoji: '❤️', value: ageFun.battements.toLocaleString('fr-FR'), label: 'battements de cœur' },
                { emoji: '🍽',  value: ageFun.repas.toLocaleString('fr-FR'),    label: 'repas pris' },
                { emoji: '😴',  value: ageFun.nuits.toLocaleString('fr-FR'),    label: 'nuits dormies' },
                { emoji: '⏱',   value: ageFun.minutes.toLocaleString('fr-FR'), label: 'minutes vécues' },
              ].map((stat) => (
                <View key={stat.label} style={styles.ageFunCard}>
                  <Text style={styles.ageFunEmoji}>{stat.emoji}</Text>
                  <Text style={[styles.ageFunValue, { color: C.primary }]}>{stat.value}</Text>
                  <Text style={styles.ageFunLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.ageFunNote}>
              💡 Calculs sur la base de moyennes statistiques : 70 battements/min, 3 repas/jour, 8h sommeil/nuit
            </Text>
            <TouchableOpacity
              style={[styles.shareAgeFunBtn, { borderColor: C.primary }]}
              activeOpacity={0.8}
              onPress={() => {
                const prenom = contactFirstName || contact.name.split(' ')[0];
                const msg =
                  `🤯 ${prenom} en chiffres :\n\n` +
                  `📅 ${ageFun!.jours.toLocaleString('fr-FR')} jours vécus\n` +
                  `🗓 ${ageFun!.semaines.toLocaleString('fr-FR')} semaines\n` +
                  `⏰ ${ageFun!.heures.toLocaleString('fr-FR')} heures\n` +
                  `❤️ ${ageFun!.battements.toLocaleString('fr-FR')} battements de cœur\n` +
                  `🍽 ${ageFun!.repas.toLocaleString('fr-FR')} repas pris\n` +
                  `😴 ${ageFun!.nuits.toLocaleString('fr-FR')} nuits dormies\n` +
                  `⏱ ${ageFun!.minutes.toLocaleString('fr-FR')} minutes vécues\n\n` +
                  `Généré avec Confettis & Cake 🎂💛`;
                Share.share({ message: msg });
              }}
            >
              <Text style={[styles.shareAgeFunBtnText, { color: C.primary }]}>📲 Partager ces chiffres</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ce qui s'est passé l'année de naissance */}
        {contact.relation !== 'pet' && contact.birthday && !contact.birthday.startsWith('0000-') && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>📖 L'année de sa naissance</Text>
              <TouchableOpacity onPress={() => setYearFactsHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={"Cette année-là, le monde écrivait une page unique de son histoire 📖 Chaque année laisse une empreinte fascinante — événements majeurs, chansons cultes, films mythiques, prix d'une baguette ou d'une voiture... 😄 Plonge dans l'année de naissance de ton proche et découvre le monde tel qu'il était quand tout a commencé pour lui — un voyage dans le temps qui donne une toute autre dimension à chaque anniversaire 🌍🎂💛✨"}
              modeEmploiLines={[
                "🌍 L'année de naissance suffit — Claude AI génère automatiquement un portrait complet",
                "✨ 3 à 4 événements historiques majeurs en France et dans le monde",
                "🎵 La chanson et le film les plus populaires de l'année en France",
                "💰 Les prix nostalgiques du quotidien — café, baguette, voiture, salaire minimum",
                "👑 Le président de la République et le président des États-Unis cette année-là",
                "🎉 Partage via WhatsApp ou SMS 💛✨",
              ]}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />
            {!yearFacts ? (
              <TouchableOpacity
                style={[styles.loadInsightBtn, { borderColor: C.primary }, isLoadingYearFacts && { opacity: 0.6 }]}
                onPress={handleLoadYearFacts}
                disabled={isLoadingYearFacts}
                activeOpacity={0.85}
              >
                {isLoadingYearFacts
                  ? <ActivityIndicator size="small" color={C.primary} />
                  : <Text style={[styles.loadInsightBtnText, { color: C.primary }]}>🌍 Découvrir l'année {contact.birthday?.split('-')[0]}</Text>}
              </TouchableOpacity>
            ) : (
              <View style={styles.insightCard}>
                {yearFacts.split(/\n{1,}/).filter(Boolean).map((line, i) => {
                  const isLabel = line.startsWith('[') && line.includes(']');
                  if (isLabel) {
                    const label = line.replace(/^\[/, '').replace(/\].*$/, '');
                    const rest  = line.replace(/^\[[^\]]*\]/, '').trim();
                    return (
                      <View key={i} style={styles.insightSection}>
                        <Text style={[styles.insightSectionTitle, { color: C.primary }]}>{label}</Text>
                        {rest ? <Text style={styles.insightText}>{rest}</Text> : null}
                      </View>
                    );
                  }
                  return <Text key={i} style={styles.insightText}>{line}</Text>;
                })}
              </View>
            )}
          </View>
        )}

        {/* Personnalités nées le même jour */}
        {contact.relation !== 'pet' && contact.birthday && !contact.birthday.startsWith('0000-') && (() => {
          const parts = contact.birthday.split('-');
          return parts[1] !== '00' && parts[2] !== '00';
        })() && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>🌟 Personnalités nées ce jour-là</Text>
              <TouchableOpacity onPress={() => setCelebsHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={"Ce jour-là, d'autres destins extraordinaires ont aussi commencé 🌟 Et si ton proche partageait son jour de naissance avec une star, un champion ou un génie ? 😄 Découvre quelles personnalités célèbres du monde entier sont nées exactement le même jour que lui et offre-lui une anecdote unique qui transforme son anniversaire en une rencontre inattendue avec l'histoire 🎂💛✨"}
              modeEmploiLines={[
                "🌟 Jour et mois de naissance suffisent — Claude AI génère automatiquement la liste",
                "✨ 4 à 5 personnalités célèbres : acteurs, sportifs, musiciens, politiques, personnages historiques",
                "💫 Chaque personnalité : nom, domaine, courte description",
                "🎭 Un commentaire amusant accompagne chaque découverte",
                "🎉 Partage via WhatsApp ou SMS 💛✨",
              ]}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />
            {!celebrities ? (
              <TouchableOpacity
                style={[styles.loadInsightBtn, { borderColor: C.primary }, isLoadingCelebs && { opacity: 0.6 }]}
                onPress={handleLoadCelebrities}
                disabled={isLoadingCelebs}
                activeOpacity={0.85}
              >
                {isLoadingCelebs
                  ? <ActivityIndicator size="small" color={C.primary} />
                  : <Text style={[styles.loadInsightBtnText, { color: C.primary }]}>⭐ Découvrir les personnalités</Text>}
              </TouchableOpacity>
            ) : (
              <View style={styles.celebsCard}>
                {celebrities.split(/\n(?=\[NOM\])/).filter(Boolean).map((block, i) => {
                  const nomMatch    = block.match(/\[NOM\]\s*(.+)/);
                  const domaineMatch = block.match(/\[DOMAINE\]\s*(.+)/);
                  const commentMatch = block.match(/\[COMMENTAIRE\]\s*(.+)/);
                  if (!nomMatch) return <Text key={i} style={styles.insightText}>{block}</Text>;
                  return (
                    <View key={i} style={styles.celebRow}>
                      <View style={[styles.celebDot, { backgroundColor: C.primary }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.celebName, { color: C.primary }]}>{nomMatch[1]}</Text>
                        {domaineMatch && <Text style={styles.celebDomain}>{domaineMatch[1]}</Text>}
                        {commentMatch && <Text style={styles.celebComment}>{commentMatch[1]}</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Ce qui s'est passé le jour de naissance */}
        {contact.relation !== 'pet' && contact.birthday && !contact.birthday.startsWith('0000-') && (() => {
          const p = contact.birthday.split('-');
          return p[0] !== '0000' && p[1] !== '00' && p[2] !== '00';
        })() && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>🌍 Le jour de sa naissance</Text>
              <TouchableOpacity onPress={() => setDayFactsHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={"Le jour où ton proche est né, le monde entier écrivait sa propre page d'histoire 🌍 Événements marquants, chanson n°1, film au cinéma, actualité du jour... Plonge dans le temps et découvre tout ce qui s'est passé exactement le jour de sa naissance — un voyage unique qui transforme chaque anniversaire en une fenêtre ouverte sur l'histoire 🎂🌟💛✨"}
              modeEmploiLines={[
                "🌍 La date de naissance complète suffit — Claude AI génère une page unique",
                "✨ 2 à 3 événements historiques marquants ce jour-là dans le monde",
                "🎵 La chanson n°1 en France ce jour-là",
                "🎬 Le film n°1 au box-office ce jour-là",
                "📰 L'actualité marquante en France ce jour-là",
                "🎉 Partage via WhatsApp ou SMS 💛✨",
              ]}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />
            {!dayFacts ? (
              <TouchableOpacity
                style={[styles.loadInsightBtn, { borderColor: C.primary }, isLoadingDayFacts && { opacity: 0.6 }]}
                onPress={handleLoadDayFacts}
                disabled={isLoadingDayFacts}
                activeOpacity={0.85}
              >
                {isLoadingDayFacts
                  ? <ActivityIndicator size="small" color={C.primary} />
                  : <Text style={[styles.loadInsightBtnText, { color: C.primary }]}>
                      {`🗓 Découvrir le ${(() => { const p = contact.birthday!.split('-'); return `${parseInt(p[2],10)}/${parseInt(p[1],10)}/${p[0]}`; })()}`}
                    </Text>}
              </TouchableOpacity>
            ) : (
              <View style={styles.insightCard}>
                {dayFacts.split(/\n{1,}/).filter(Boolean).map((line, i) => {
                  const isLabel = line.startsWith('[') && line.includes(']');
                  if (isLabel) {
                    const label = line.replace(/^\[/, '').replace(/\].*$/, '');
                    const rest  = line.replace(/^\[[^\]]*\]/, '').trim();
                    return (
                      <View key={i} style={styles.insightSection}>
                        <Text style={[styles.insightSectionTitle, { color: C.primary }]}>{label}</Text>
                        {rest ? <Text style={styles.insightText}>{rest}</Text> : null}
                      </View>
                    );
                  }
                  return <Text key={i} style={styles.insightText}>{line}</Text>;
                })}
              </View>
            )}
          </View>
        )}

        {/* Chemin de vie */}
        {contact.relation !== 'pet' && cheminProfile && contact.birthday && !contact.birthday.startsWith('0000-') && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>🌟 Chemin de vie</Text>
              <TouchableOpacity onPress={() => setLifePathHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={"Ta date de naissance n'est peut-être pas un hasard 🌟 En numérologie, le chemin de vie est le chiffre le plus puissant de tous — considéré comme la boussole de ton existence, il révèle ta mission profonde, ce que tu es venu accomplir, tes talents naturels et les défis que tu es venu surmonter dans cette vie 🔢 Et si ta date de naissance cachait le secret de qui tu es vraiment ? 💛✨"}
              modeEmploiLines={[
                "🌟 La date de naissance complète suffit — le chemin de vie est calculé automatiquement",
                "✨ Tous les chiffres de la date sont additionnés jusqu'à obtenir 1-9, sauf 11 et 22 (nombres maîtres)",
                "💫 Exemple : né le 23/04/1985 → 2+3+0+4+1+9+8+5 = 32 → 3+2 = 5 — Chemin de vie 5 : Le Libre",
                "🔢 Son chiffre s'affiche avec son nom, sa couleur et sa signification profonde",
                "🌟 Claude AI génère une description complète de la mission de vie, des talents naturels et des défis",
              ]}
              accentColor={cheminProfile.color}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />

            {/* Analyse IA approfondissante */}
            {!lifePathAi ? (
              <TouchableOpacity
                style={[styles.loadInsightBtn, { borderColor: cheminProfile.color }, isLoadingLifePath && { opacity: 0.6 }]}
                onPress={handleLoadLifePath}
                disabled={isLoadingLifePath}
                activeOpacity={0.85}
              >
                {isLoadingLifePath
                  ? <ActivityIndicator size="small" color={cheminProfile.color} />
                  : <Text style={[styles.loadInsightBtnText, { color: cheminProfile.color }]}>🌟 Approfondir avec l'IA</Text>}
              </TouchableOpacity>
            ) : (
              <View style={[styles.insightCard, { borderLeftColor: cheminProfile.color }]}>
                {lifePathAi.content.split(/\n{1,}/).filter(Boolean).map((line, i) => {
                  const isLabel = line.startsWith('[') && line.includes(']');
                  if (isLabel) {
                    const label = line.replace(/^\[/, '').replace(/\].*$/, '');
                    const rest  = line.replace(/^\[[^\]]*\]/, '').trim();
                    return (
                      <View key={i} style={styles.insightSection}>
                        <Text style={[styles.insightSectionTitle, { color: cheminProfile.color }]}>{label}</Text>
                        {rest ? <Text style={styles.insightText}>{rest}</Text> : null}
                      </View>
                    );
                  }
                  return <Text key={i} style={styles.insightText}>{line}</Text>;
                })}
              </View>
            )}
          </View>
        )}

        {/* Actions rapides — masquées pour les animaux */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <ActionButton emoji="✦" line1="Créer un" line2="message" color={Colors.primary} onPress={handleCreateMessage} />
            <ActionButton emoji="🎁" line1="Lancer une" line2="cagnotte" color="#c97d10" onPress={handleOpenPot} />
            {/* Carte postale — désactivée pour l'instant */}
            <ActionButton emoji="⬛" line1="Générer un" line2="QR code" color="#4dd4c4" onPress={handleOpenQR} />
            <ActionButton
              emoji="📞"
              line1="Pour"
              line2="appeler"
              color={Colors.onSurfaceVariant}
              onPress={handleCall}
              disabled={!contact.phone}
            />
            <ActionButton
              emoji="🔔"
              line1="Partager"
              line2="un rappel"
              color="#FF6B35"
              onPress={handleOpenSharedReminder}
            />
            <ActionButton
              emoji="📒"
              line1="Livre d'or"
              line2="numérique"
              color="#7B1FA2"
              onPress={() => router.push({ pathname: '/(app)/guestbook', params: { contactId: id } } as never)}
            />
          </View>
        </View>}

        {/* Liste de souhaits — masquée pour les animaux */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>🎁 Liste de souhaits</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => setWishHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.helpInfoBtn, { backgroundColor: C.primary, borderRadius: Radii.full, paddingHorizontal: 10 }]}
                onPress={() => { setNewWishDesc(''); setNewWishCategory(null); setNewWishBudget(''); setWishModalVisible(true); }}
              >
                <Text style={{ color: Colors.white, fontSize: 16, lineHeight: 22 }}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FeatureIntroCard
            introText={`Fini les cadeaux ratés et les doublons ! 🎁 Note ici les envies de ${contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0]} au fil de l'eau — une idée entendue en passant, un livre mentionné, un hobby découvert — et coche quand le cadeau est offert 🎉`}
            modeEmploiLines={[
              '💡 Ajoute une envie dès que tu l\'entends mentionner',
              '🏷️ Catégorie optionnelle : Livre, Tech, Mode, Expérience...',
              '💰 Budget max optionnel pour filtrer les idées',
              '✅ Coche quand le cadeau est offert — il reste visible mais barré',
              '🗑️ Appui long sur un souhait pour le supprimer',
            ]}
            backgroundColor={Colors.white}
            borderWidth={4}
            containerStyle={{ marginBottom: 10 }}
          />
          {wishItems.length === 0 ? (
            <TouchableOpacity
              style={styles.wishEmptyCard}
              onPress={() => { setNewWishDesc(''); setNewWishCategory(null); setNewWishBudget(''); setWishModalVisible(true); }}
              activeOpacity={0.75}
            >
              <Text style={styles.wishEmptyText}>＋ Ajouter un premier souhait</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.wishList}>
              {wishItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.wishCard, item.is_done && styles.wishCardDone]}
                  onPress={() => toggleWish({ id: item.id, is_done: !item.is_done, contact_id: id })}
                  onLongPress={() =>
                    Alert.alert('Supprimer ?', `"${item.description}" sera supprimé.`, [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Supprimer', style: 'destructive', onPress: () => deleteWish({ id: item.id, contact_id: id }) },
                    ])
                  }
                  activeOpacity={0.75}
                >
                  <View style={[styles.wishCheck, item.is_done && { backgroundColor: C.primary, borderColor: C.primary }]}>
                    {item.is_done && <Text style={{ color: Colors.white, fontSize: 10, fontFamily: 'BeVietnamPro_700Bold' }}>✓</Text>}
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={[styles.wishDesc, item.is_done && styles.wishDescDone]}>{item.description}</Text>
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                      {item.category && (
                        <View style={styles.wishTag}>
                          <Text style={styles.wishTagText}>{item.category}</Text>
                        </View>
                      )}
                      {item.budget_max && (
                        <View style={[styles.wishTag, { backgroundColor: '#fff8e1' }]}>
                          <Text style={[styles.wishTagText, { color: '#c97d10' }]}>
                            max {(item.budget_max / 100).toLocaleString('fr-FR')} €
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.wishAddMore}
                onPress={() => { setNewWishDesc(''); setNewWishCategory(null); setNewWishBudget(''); setWishModalVisible(true); }}
                activeOpacity={0.75}
              >
                <Text style={styles.wishAddMoreText}>＋ Ajouter un souhait</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>}

        {/* Notes */}
        {(contact.notes || true) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Notes personnelles</Text>
            <TouchableOpacity style={styles.notesCard}>
              <Text style={styles.notesText}>
                {contact.notes || 'Appuyez pour ajouter des notes...'}
              </Text>
              <Text style={{ color: Colors.primary, fontSize: 14 }}>✏️</Text>
            </TouchableOpacity>
          </View>
        )}


        {/* Coordonnées — masquées pour les animaux */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Coordonnées</Text>
          <View style={styles.coordsCard}>
            {contact.phone ? (
              <TouchableOpacity onPress={handleCall} style={styles.coordRow}>
                <Text style={styles.coordIcon}>📱</Text>
                <Text style={styles.coordValue}>{contact.phone}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>📱</Text>
                <Text style={styles.coordEmpty}>Téléphone non renseigné</Text>
              </View>
            )}
            <View style={styles.coordDivider} />
            {contact.email ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${contact.email}`)}
                style={styles.coordRow}
              >
                <Text style={styles.coordIcon}>📧</Text>
                <Text style={styles.coordValue}>{contact.email}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>📧</Text>
                <Text style={styles.coordEmpty}>Email non renseigné</Text>
              </View>
            )}
          </View>
        </View>}

        {/* Centres d'intérêt — masqués pour les animaux */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Centres d'intérêt</Text>
            <TouchableOpacity onPress={() => setInterestsHelpVisible(true)} style={styles.helpInfoBtn}>
              <Text style={styles.helpInfoBtnText}>ℹ️</Text>
            </TouchableOpacity>
          </View>
          <FeatureIntroCard
            introText={"Mieux tu connais tes proches, mieux tu peux les surprendre 💛 Chaque personne est unique et ses cadeaux devraient l'être aussi 🎁 Renseigne les centres d'intérêt de tes contacts et laisse l'appli s'en inspirer pour générer des messages touchants, des idées cadeaux sur mesure et des suggestions d'activités qui leur ressemblent vraiment — parce qu'un message qui parle vraiment de lui c'est magique 🌟✨"}
            modeEmploiLines={[
              "🎯 Ouvre la fiche contact et accède à la section Centres d'intérêt",
              "✨ Deux modes de saisie au choix :",
              "📋 Liste prédéfinie — coche parmi Sport, Musique, Cinéma, Voyage, Cuisine, Lecture, Mode, Gaming, Nature, Art, Animaux, Bien-être, Technologie, Jardinage, Bricolage...",
              "✏️ Saisie libre — ajoute des centres d'intérêt personnalisés",
              "💫 Claude AI utilise ces infos pour personnaliser tes messages et suggérer des cadeaux adaptés",
              "🌟 Plus tu renseignes d'informations, plus les suggestions seront précises et magiques 💛✨",
            ]}
            backgroundColor={Colors.white}
            borderWidth={4}
            containerStyle={{ marginBottom: 10 }}
          />
          {Array.isArray(contact.personality_tags) && contact.personality_tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {(contact.personality_tags as string[]).map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyField}>
              <Text style={styles.emptyFieldText}>— Aucune caractéristique renseignée</Text>
            </View>
          )}
        </View>}

        {/* Couleur préférée */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>🎨 Couleur préférée</Text>
              <TouchableOpacity onPress={() => setColorHelpVisible(true)} style={styles.helpInfoBtn}>
                <Text style={styles.helpInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <FeatureIntroCard
              introText={"Chaque couleur raconte une histoire et révèle une personnalité 🎨 Le bleu de la sérénité, le rouge de la passion, le vert de l'espoir... les couleurs parlent de nous bien plus qu'on ne le croit ! Renseigne la couleur favorite de ton proche et laisse l'appli s'en inspirer pour personnaliser ses messages 💛✨"}
              modeEmploiLines={[
                "🎨 Saisis la couleur préférée de ton proche — ex : bleu, rouge cerise, vert forêt...",
                "✨ Claude AI l'utilisera pour personnaliser les messages générés et les cartes",
                "🔢 Compare avec la couleur numérologique calculée automatiquement 💛",
              ]}
              backgroundColor={Colors.white}
              borderWidth={4}
              containerStyle={{ marginBottom: 10 }}
            />
            {isEditingColor ? (
              <View style={styles.colorEditRow}>
                <TextInput
                  style={styles.colorInput}
                  value={colorInput}
                  onChangeText={setColorInput}
                  placeholder="Ex : bleu marine, rouge, vert forêt..."
                  placeholderTextColor={Colors.outlineVariant}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={async () => {
                    await updateContact({ id, updates: { favourite_color: colorInput.trim() || null } });
                    setIsEditingColor(false);
                  }}
                />
                <TouchableOpacity
                  style={[styles.colorSaveBtn, { backgroundColor: C.primary }]}
                  onPress={async () => {
                    await updateContact({ id, updates: { favourite_color: colorInput.trim() || null } });
                    setIsEditingColor(false);
                  }}
                >
                  <Text style={styles.colorSaveBtnText}>✓</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.colorDisplay, contact.favourite_color ? { borderColor: C.primary } : {}]}
                onPress={() => { setColorInput(contact.favourite_color ?? ''); setIsEditingColor(true); }}
                activeOpacity={0.8}
              >
                <Text style={styles.colorDisplayEmoji}>🎨</Text>
                <Text style={[styles.colorDisplayText, !contact.favourite_color && { color: Colors.outlineVariant, fontStyle: 'italic' }]}>
                  {contact.favourite_color || 'Appuyer pour renseigner...'}
                </Text>
                <Text style={[styles.colorEditIcon, { color: C.primary }]}>✏️</Text>
              </TouchableOpacity>
            )}
            {/* Couleur numérologique pour comparaison */}
            {numéroPrenom && (
              <View style={styles.colorNumerRow}>
                <View style={[styles.colorNumerDot, { backgroundColor: numéroPrenom.color }]} />
                <Text style={styles.colorNumerText}>
                  Couleur numérologique : <Text style={{ color: numéroPrenom.color, fontFamily: 'BeVietnamPro_700Bold' }}>{numéroPrenom.colorName}</Text>
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Préférences de communication — masquées pour les animaux */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Préférences d'envoi</Text>
          <View style={styles.coordsCard}>
            {contact.preferred_channel ? (
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>{contact.preferred_channel === 'sms' ? '📱' : '📧'}</Text>
                <Text style={styles.coordValue}>
                  Préfère recevoir par {contact.preferred_channel === 'sms' ? 'SMS' : 'Email'}
                </Text>
              </View>
            ) : (
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>📡</Text>
                <Text style={styles.coordEmpty}>Canal non renseigné</Text>
              </View>
            )}
            <View style={styles.coordDivider} />
            {contact.preferred_send_time ? (
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>
                  {contact.preferred_send_time === 'morning' ? '🌅' : contact.preferred_send_time === 'afternoon' ? '☀️' : contact.preferred_send_time === 'evening' ? '🌙' : '🕐'}
                </Text>
                <Text style={styles.coordValue}>
                  Heure idéale : {contact.preferred_send_time === 'morning' ? 'le matin' : contact.preferred_send_time === 'afternoon' ? "l'après-midi" : contact.preferred_send_time === 'evening' ? 'le soir' : 'peu importe'}
                </Text>
              </View>
            ) : (
              <View style={styles.coordRow}>
                <Text style={styles.coordIcon}>🕐</Text>
                <Text style={styles.coordEmpty}>Moment idéal non renseigné</Text>
              </View>
            )}
          </View>
        </View>}

        {/* Langue préférée — masquée pour les animaux */}
        {contact.relation !== 'pet' && contact.relation !== 'child_of' && <View style={styles.section}>
          <Text style={styles.sectionLabel}>Langue du message IA</Text>
          <View style={styles.coordsCard}>
            <View style={styles.coordRow}>
              <Text style={styles.coordIcon}>🌍</Text>
              {contact.preferred_language ? (
                <Text style={styles.coordValue}>
                  {({ fr: 'Français', en: 'Anglais', de: 'Allemand', es: 'Espagnol', it: 'Italien', pt: 'Portugais' } as Record<string, string>)[contact.preferred_language] ?? contact.preferred_language}
                </Text>
              ) : (
                <Text style={styles.coordEmpty}>Français par défaut</Text>
              )}
            </View>
          </View>
        </View>}

        {/* Timeline messages */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.giftBtn}
            onPress={() => router.push(`/(app)/contact-timeline/${contact.id}` as never)}
            activeOpacity={0.85}
          >
            <View style={styles.giftBtnIcon}>
              <Text style={{ fontSize: 22 }}>📜</Text>
            </View>
            <View style={styles.giftBtnText}>
              <Text style={styles.giftBtnTitle}>Historique des messages</Text>
              <Text style={styles.giftBtnSub}>Tous les messages créés pour {contact.name.split(' ')[0]}</Text>
            </View>
            <Text style={styles.giftBtnArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Idées cadeaux IA */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.giftBtn} onPress={handleGiftSuggestions} activeOpacity={0.85}>
            <View style={styles.giftBtnIcon}>
              <Text style={{ fontSize: 22 }}>🎁</Text>
            </View>
            <View style={styles.giftBtnText}>
              <Text style={styles.giftBtnTitle}>Idées cadeaux IA</Text>
              <Text style={styles.giftBtnSub}>5 idées personnalisées pour {contact.name}</Text>
            </View>
            <Text style={styles.giftBtnArrow}>✦</Text>
          </TouchableOpacity>
        </View>

        {/* Bouton supprimer */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteBtnText}>
              {isDeleting ? 'Suppression...' : '🗑 Supprimer ce contact'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal sélection de mon animal */}
      <Modal visible={showMyPetPicker} transparent animationType="slide" onRequestClose={() => setShowMyPetPicker(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setShowMyPetPicker(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.helpModalCard, { gap: 14 }]}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center' }}>
              🐾 Quel animal écrit à {contactFirstName} ?
            </Text>
            {myPets.map((pet) => {
              const petEmoji = ({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[pet.pet_type ?? ''] ?? '🐾';
              return (
                <TouchableOpacity
                  key={pet.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF7ED', borderRadius: Radii.lg, padding: Spacing[3], borderWidth: 1.5, borderColor: '#D97706' }}
                  onPress={() => {
                    setShowMyPetPicker(false);
                    router.push({
                      pathname: '/(app)/animal-message',
                      params: {
                        petId: pet.id,
                        petName: pet.name,
                        petType: (pet as any).pet_type ?? 'autre',
                        breed: (pet as any).breed ?? '',
                        petGender: pet.pet_gender ?? '',
                        direction: 'from_to_third',
                        ownerName: myProfile?.full_name ?? '',
                        ownerId: '',
                        thirdName: contact.name,
                        thirdId: contact.id,
                        personalityTags: JSON.stringify((pet as any).personality_tags ?? []),
                      },
                    } as never);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FED7AA', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>{petEmoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#92400E' }}>{pet.name}</Text>
                    {(pet as any).pet_type && <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: '#92400E', opacity: 0.8 }}>écrit à {contactFirstName}</Text>}
                  </View>
                  <Text style={{ color: '#D97706', fontSize: 20 }}>›</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setShowMyPetPicker(false)} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>Annuler</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal sélection animal de Sophie */}
      <Modal visible={showContactPetPicker} transparent animationType="slide" onRequestClose={() => setShowContactPetPicker(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setShowContactPetPicker(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.helpModalCard, { gap: 14 }]}>
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center' }}>
              {contactPetPickerDirection === 'to' ? `🐾 À quel animal veux-tu écrire ?` : `🐾 Quel animal écrit ?`}
            </Text>
            {pets.map((pet) => {
              const petEmoji = ({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[pet.pet_type ?? ''] ?? '🐾';
              return (
                <TouchableOpacity
                  key={pet.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF7ED', borderRadius: Radii.lg, padding: Spacing[3], borderWidth: 1.5, borderColor: '#D97706' }}
                  onPress={() => {
                    setShowContactPetPicker(false);
                    router.push({ pathname: '/(app)/animal-message', params: { petId: pet.id, petName: pet.name, petType: (pet as any).pet_type ?? 'autre', breed: (pet as any).breed ?? '', petGender: (pet as any).pet_gender ?? '', direction: contactPetPickerDirection, ownerName: contact.name, ownerId: id } } as never);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FED7AA', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>{petEmoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#92400E' }}>{pet.name}</Text>
                  </View>
                  <Text style={{ color: '#D97706', fontSize: 20 }}>›</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setShowContactPetPicker(false)} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>Annuler</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Message À l'animal */}
      <Modal visible={petToHelpVisible} transparent animationType="fade" onRequestClose={() => setPetToHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setPetToHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le message à l'animal ? 🐾</Text>
              <TouchableOpacity onPress={() => setPetToHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: "C'est quoi exactement ?", body: "Tu écris un message adressé directement à l'animal de ton proche — c'est lui le destinataire ! Le message est ensuite envoyé au maître qui adorera cette attention originale et attendrissante." },
              { title: "Le message personnalisé", body: "Claude AI génère un message unique selon le type d'animal (un chien ne parle pas comme un chat 😄), son nom, son caractère et l'occasion choisie." },
              { title: "Les occasions possibles", body: "Anniversaire de l'animal, simple bonjour, fête, remerciement... toutes les occasions sont bonnes pour penser à nos amis à quatre pattes !" },
              { title: "Envoyer le message", body: "Le message est envoyé au maître de l'animal via WhatsApp, SMS ou email — il sera surpris et attendri à coup sûr 💛" },
              { title: "Bon à savoir 💡", body: "Plus la fiche de l'animal est complète — nom, type, caractère, date de naissance — plus le message généré par Claude AI sera personnalisé et amusant !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Message DE la part de l'animal */}
      <Modal visible={petFromHelpVisible} transparent animationType="fade" onRequestClose={() => setPetFromHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setPetFromHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le message de la part de l'animal ? 🐾</Text>
              <TouchableOpacity onPress={() => setPetFromHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: "C'est quoi exactement ?", body: "Tu écris un message à ton proche mais comme si c'était son animal qui l'avait envoyé ! Claude AI se glisse dans la peau de l'animal et rédige le message à la première personne avec son vocabulaire, ses tics et sa personnalité." },
              { title: "Le message personnalisé", body: "Claude AI adapte le message selon le type d'animal (un chien joyeux ne s'exprime pas comme un chat ronchon 😄), son nom, son caractère et l'occasion choisie." },
              { title: "Exemples selon l'animal", body: "🐶 Chien joueur : \"Wouf wouf ! Joyeux anniversaire Maman !\"\n🐱 Chat ronchon : \"Bon... je suppose que c'est ton anniversaire. Je daigne interrompre ma sieste.\"" },
              { title: "La signature", body: "Le message est signé du nom de l'animal avec une patte 🐾 — ton proche ne s'y attendra pas du tout !" },
              { title: "Bon à savoir 💡", body: "Plus la fiche de l'animal est complète — nom, type, caractère — plus le message sera drôle et personnalisé !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal messages de la part de l'animal */}
      {selectedPet && (
        <Modal
          visible={petMsgModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setPetMsgModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[selectedPet.pet_type ?? ''] ?? '🐾'}{' '}
                  De la part de {selectedPet.name}
                </Text>
                <TouchableOpacity onPress={() => setPetMsgModalVisible(false)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                <Text style={styles.petMsgModalSub}>
                  Choisis un message — {selectedPet.name} l'envoie à {contact.name} 😄
                </Text>
                {getPetMessages(selectedPet.pet_type as PetType, selectedPet.name, contact.civilite, contact.name).map((msg, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.petMsgCard}
                    activeOpacity={0.75}
                    onPress={() => {
                      setPetMsgModalVisible(false);
                      router.push({
                        pathname: '/(app)/create/',
                        params: { contactId: id, prefillMessage: msg },
                      } as never);
                    }}
                  >
                    <Text style={styles.petMsgCardText}>{msg}</Text>
                    <Text style={styles.petMsgCardArrow}>→ Utiliser</Text>
                  </TouchableOpacity>
                ))}
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal messages pour l'animal (human → animal) */}
      {selectedPet && (
        <Modal
          visible={petToMsgModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setPetToMsgModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[selectedPet.pet_type ?? ''] ?? '🐾'}{' '}
                  Pour {selectedPet.name}
                </Text>
                <TouchableOpacity onPress={() => setPetToMsgModalVisible(false)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={styles.petMsgModalSub}>
                  Choisis un message — tu l'envoies à {selectedPet.name} 🐾
                </Text>
                {getPetMessagesTo(selectedPet.pet_type as PetType, selectedPet.name, contact.name).map((msg, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.petMsgCard}
                    activeOpacity={0.75}
                    onPress={() => {
                      setPetToMsgModalVisible(false);
                      router.push({
                        pathname: '/(app)/create/',
                        params: { contactId: selectedPet.id, prefillMessage: msg },
                      } as never);
                    }}
                  >
                    <Text style={styles.petMsgCardText}>{msg}</Text>
                    <Text style={styles.petMsgCardArrow}>→ Utiliser</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.addPetSaveBtn, { marginTop: 8, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.primary }]}
                  onPress={() => {
                    setPetToMsgModalVisible(false);
                    router.push({ pathname: '/(app)/create/', params: { contactId: selectedPet.id, occasion: 'birthday' } } as never);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.addPetSaveBtnText, { color: C.primary }]}>✏️ Créer librement</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal génération IA — Message de la part de l'animal */}
      {selectedPet && (
        <Modal
          visible={petFromAiModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => { setPetFromAiModalVisible(false); setPetFromAiResult(null); }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[selectedPet.pet_type ?? ''] ?? '🐾'}{' '}
                  De la part de {selectedPet.name}
                </Text>
                <TouchableOpacity onPress={() => { setPetFromAiModalVisible(false); setPetFromAiResult(null); }} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {!petFromAiResult ? (
                  <>
                    <Text style={[styles.petMsgModalSub, { marginBottom: 16 }]}>
                      Choisis l'occasion — {selectedPet.name} écrira pour toi 🐾
                    </Text>
                    <View style={[styles.addPetTypesRow, { marginBottom: 20 }]}>
                      {([
                        { key: 'birthday',  emoji: '🎂', label: 'Anniversaire' },
                        { key: 'nameday',   emoji: '🌸', label: 'Fête' },
                        { key: 'christmas', emoji: '🎄', label: 'Noël' },
                        { key: 'newyear',   emoji: '🎆', label: 'Nouvel an' },
                        { key: 'thanks',    emoji: '🙏', label: 'Merci' },
                        { key: 'custom',    emoji: '💬', label: 'Bonjour' },
                      ] as const).map(({ key, emoji, label }) => (
                        <TouchableOpacity
                          key={key}
                          style={[styles.addPetTypeBtn, petFromAiOccasion === key && styles.addPetTypeBtnActive]}
                          onPress={() => setPetFromAiOccasion(key)}
                          activeOpacity={0.75}
                        >
                          <Text style={{ fontSize: 24 }}>{emoji}</Text>
                          <Text style={[styles.addPetTypeBtnLabel, petFromAiOccasion === key && styles.addPetTypeBtnLabelActive]}>{label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {petFromAiError && (
                      <Text style={{ color: Colors.error, textAlign: 'center', marginBottom: 12, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm }}>
                        {petFromAiError}
                      </Text>
                    )}
                    <TouchableOpacity
                      style={[styles.addPetSaveBtn, petFromAiGenerating && { opacity: 0.6 }]}
                      onPress={handleGeneratePetFrom}
                      disabled={petFromAiGenerating}
                      activeOpacity={0.85}
                    >
                      {petFromAiGenerating
                        ? <ActivityIndicator color={Colors.white} />
                        : <Text style={styles.addPetSaveBtnText}>🤖 Générer le message</Text>
                      }
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={[styles.petMsgCard, { marginHorizontal: 0, marginBottom: 16 }]}>
                      <Text style={styles.petMsgCardText}>{petFromAiResult}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addPetSaveBtn}
                      onPress={() => {
                        setPetFromAiModalVisible(false);
                        router.push({
                          pathname: '/(app)/create/',
                          params: { contactId: id, prefillMessage: petFromAiResult },
                        } as never);
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.addPetSaveBtnText}>→ Utiliser ce message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addPetSaveBtn, { marginTop: 10, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.primary }]}
                      onPress={() => { setPetFromAiResult(null); setPetFromAiError(null); }}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.addPetSaveBtnText, { color: C.primary }]}>↺ Regénérer</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal ajouter / modifier animal de compagnie */}
      <Modal
        visible={addPetModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddPetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPetId ? '✏️ Modifier l\'animal' : '🐾 Ajouter un animal'}
              </Text>
              <TouchableOpacity onPress={() => setAddPetModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ paddingHorizontal: 20, paddingTop: 16 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 320 }}
            >
              <Text style={styles.addPetSectionLabel}>Type d'animal</Text>
              <View style={styles.addPetTypesRow}>
                {([
                  { key: 'chien', emoji: '🐶', label: 'Chien' },
                  { key: 'chat', emoji: '🐱', label: 'Chat' },
                  { key: 'lapin', emoji: '🐰', label: 'Lapin' },
                  { key: 'oiseau', emoji: '🐦', label: 'Oiseau' },
                  { key: 'cheval', emoji: '🐴', label: 'Cheval' },
                  { key: 'hamster', emoji: '🐹', label: 'Hamster' },
                  { key: 'perroquet', emoji: '🦜', label: 'Perroquet' },
                  { key: 'cochon_d_inde', emoji: '🐾', label: 'Cochon d\'Inde' },
                  { key: 'souris', emoji: '🐭', label: 'Souris' },
                  { key: 'poisson', emoji: '🐠', label: 'Poisson' },
                  { key: 'tortue', emoji: '🐢', label: 'Tortue' },
                  { key: 'autre', emoji: '🐾', label: 'Autre' },
                ] as const).map(({ key, emoji, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.addPetTypeBtn, newPetType === key && styles.addPetTypeBtnActive]}
                    onPress={() => { setNewPetType(key); setNewPetBreed(''); }}
                    activeOpacity={0.75}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                    <Text style={[styles.addPetTypeBtnLabel, newPetType === key && styles.addPetTypeBtnLabelActive]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.addPetSectionLabel}>Sexe</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
                {([
                  { value: 'male',   label: '♂ Mâle' },
                  { value: 'female', label: '♀ Femelle' },
                ] as const).map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.addPetTypeBtn, newPetGender === g.value && styles.addPetTypeBtnActive, { flex: 1, justifyContent: 'center' }]}
                    onPress={() => setNewPetGender(g.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.addPetTypeBtnLabel, newPetGender === g.value && styles.addPetTypeBtnLabelActive]}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(newPetType === 'chien' || newPetType === 'chat') && (
                <>
                  <Text style={styles.addPetSectionLabel}>{newPetType === 'chien' ? 'Race 🐶' : 'Race 🐱'}</Text>
                  <View style={styles.breedGrid}>
                    {(newPetType === 'chien' ? DOG_BREEDS : CAT_BREEDS).map((b) => (
                      <TouchableOpacity
                        key={b}
                        style={[styles.breedChip, newPetBreed === b && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                        onPress={() => setNewPetBreed(newPetBreed === b ? '' : b)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.breedChipLabel, newPetBreed === b && { color: C.primary, fontFamily: 'BeVietnamPro_700Bold' }]}>
                          {b}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.addPetSectionLabel}>Nom</Text>
              <TextInput
                style={styles.addPetInput}
                placeholder="Ex : Médor, Felix, Noisette…"
                placeholderTextColor="#aaa"
                value={newPetName}
                onChangeText={setNewPetName}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Text style={styles.addPetSectionLabel}>Date de naissance</Text>
              <TextInput
                style={styles.addPetInput}
                placeholder="JJ/MM/AAAA ou JJ/MM"
                placeholderTextColor="#aaa"
                value={newPetBirthday}
                onChangeText={setNewPetBirthday}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                onSubmitEditing={handleSavePet}
              />
              <Text style={styles.addPetHint}>Pour ne pas oublier, par exemple, de célébrer son anniversaire.</Text>

              {/* ── Caractère ─────────────────────────────────── */}
              <Text style={styles.addPetSectionLabel}>
                {newPetType === 'chien' ? '🐶 Caractère du chien' : newPetType === 'chat' ? '🐱 Caractère du chat' : '🐾 Caractère (optionnel)'}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {(newPetType === 'chien'
                  ? ['câlin', 'joueur', 'gourmand', 'peureux', 'protecteur', 'bavard', 'énergique', 'canapé-addict', 'chasseur', 'fidèle']
                  : newPetType === 'chat'
                  ? ['royal', 'indifférent', 'destructeur', 'chasseur nocturne', 'gourmet difficile', 'câlin capricieux', 'contemplatif', 'jaloux', 'acrobate', 'mystérieux']
                  : ['câlin', 'joueur', 'gourmand', 'énergique', 'peureux', 'curieux', 'fidèle', 'indépendant', 'bavard', 'calme']
                ).map((tag) => {
                  const active = newPetPersonalityTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={{
                        paddingVertical: 6, paddingHorizontal: 12,
                        borderRadius: 20, borderWidth: 1.5,
                        borderColor: active ? C.primary : Colors.surfaceContainerHighest,
                        backgroundColor: active ? C.primaryContainer : Colors.white,
                      }}
                      onPress={() => setNewPetPersonalityTags(
                        active ? newPetPersonalityTags.filter((t) => t !== tag) : [...newPetPersonalityTags, tag]
                      )}
                      activeOpacity={0.75}
                    >
                      <Text style={{
                        fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12,
                        color: active ? C.primary : Colors.onSurfaceVariant,
                      }}>{tag}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[styles.addPetSaveBtn, (!newPetType || !newPetName.trim() || !newPetGender) && { opacity: 0.4 }]}
                onPress={handleSavePet}
                disabled={!newPetType || !newPetName.trim() || !newPetGender || isSavingPet}
                activeOpacity={0.85}
              >
                {isSavingPet
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.addPetSaveBtnText}>{editingPetId ? 'Enregistrer' : 'Ajouter'}</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal sélection partenaire */}
      <Modal visible={partnerPickerVisible} animationType="slide" transparent onRequestClose={() => setPartnerPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💑 Lier un partenaire</Text>
              <TouchableOpacity onPress={() => setPartnerPickerVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
              <TextInput
                style={styles.addPetInput}
                placeholder="Rechercher un contact…"
                placeholderTextColor="#aaa"
                value={partnerSearch}
                onChangeText={setPartnerSearch}
                autoCapitalize="words"
              />
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}>
              {allContacts
                .filter((c) => c.id !== contact?.id && c.relation !== 'pet' && c.relation !== 'child_of' && (!partnerSearch.trim() || c.name.toLowerCase().includes(partnerSearch.toLowerCase())))
                .map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={{ paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                    onPress={async () => {
                      await updateContact({ id: contact!.id, updates: { partner_contact_id: c.id } as any });
                      setPartnerPickerVisible(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: Colors.onSurface, flex: 1 }}>{c.name}</Text>
                    <Text style={{ color: C.primary, fontSize: 13 }}>Sélectionner</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal ajout/édition enfant */}
      <Modal
        visible={addChildModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddChildModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingChildId ? '✏️ Modifier l\'enfant' : '👶 Ajouter un enfant'}
              </Text>
              <TouchableOpacity onPress={() => setAddChildModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ paddingHorizontal: 20, paddingTop: 16 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 200 }}
            >
              <Text style={styles.addPetSectionLabel}>Fille ou garçon ?</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                {([
                  { value: 'female', label: '👧 Fille' },
                  { value: 'male',   label: '👦 Garçon' },
                ] as const).map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.addPetTypeBtn, newChildGender === g.value && styles.addPetTypeBtnActive, { flex: 1, justifyContent: 'center' }]}
                    onPress={() => setNewChildGender(g.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.addPetTypeBtnLabel, newChildGender === g.value && styles.addPetTypeBtnLabelActive]}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.addPetSectionLabel}>Prénom</Text>
              <TextInput
                style={styles.addPetInput}
                placeholder="Ex : Lucas, Emma, Théo…"
                placeholderTextColor="#aaa"
                value={newChildName}
                onChangeText={setNewChildName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={styles.addPetSectionLabel}>Date de naissance</Text>
              <TouchableOpacity
                style={[styles.addPetInput, { justifyContent: 'center' }]}
                onPress={() => setShowChildBirthdayPicker(true)}
                activeOpacity={0.75}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: newChildBirthdayDate ? Colors.onSurface : '#aaa' }}>
                  {newChildBirthdayDate
                    ? newChildBirthdayDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
                    : 'Choisir une date 📅'}
                </Text>
              </TouchableOpacity>
              {showChildBirthdayPicker && Platform.OS === 'ios' && (
                <Modal transparent animationType="slide" visible={showChildBirthdayPicker} onRequestClose={() => setShowChildBirthdayPicker(false)}>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setShowChildBirthdayPicker(false)}>
                    <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 16, color: Colors.onSurface }}>Date de naissance</Text>
                        <TouchableOpacity onPress={() => setShowChildBirthdayPicker(false)}>
                          <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: C.primary }}>OK ✓</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={newChildBirthdayDate ?? new Date(2015, 0, 1)}
                        mode="date"
                        display="spinner"
                        minimumDate={new Date(new Date().getFullYear() - 30, 0, 1)}
                        maximumDate={new Date()}
                        textColor={C.primary}
                        accentColor={C.primary}
                        style={{ width: '100%', height: 215 }}
                        onChange={(_e: unknown, date?: Date) => {
                          if (date) {
                            setNewChildBirthdayDate(date);
                            setNewChildBirthday(`${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`);
                          }
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
              {showChildBirthdayPicker && Platform.OS === 'android' && (
                <DateTimePicker
                  value={newChildBirthdayDate ?? new Date(2015, 0, 1)}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date(new Date().getFullYear() - 30, 0, 1)}
                  maximumDate={new Date()}
                  onChange={(_e: unknown, date?: Date) => {
                    setShowChildBirthdayPicker(false);
                    if (date) {
                      setNewChildBirthdayDate(date);
                      setNewChildBirthday(`${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`);
                    }
                  }}
                />
              )}

              <Text style={styles.addPetSectionLabel}>Fête (optionnel)</Text>
              <TextInput
                style={styles.addPetInput}
                placeholder="JJ/MM — ex : 25/06"
                placeholderTextColor="#aaa"
                value={newChildNameDay}
                onChangeText={setNewChildNameDay}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                onSubmitEditing={handleSaveChild}
              />
              <Text style={styles.addPetHint}>Pour recevoir un rappel le jour J et envoyer un message à {contactFirstName}.</Text>

              <TouchableOpacity
                style={[styles.addPetSaveBtn, (!newChildName.trim() || !newChildGender) && { opacity: 0.4 }]}
                onPress={handleSaveChild}
                disabled={!newChildName.trim() || !newChildGender || isSavingChild}
                activeOpacity={0.85}
              >
                {isSavingChild
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.addPetSaveBtnText}>{editingChildId ? 'Enregistrer' : 'Ajouter'}</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal suggestions cadeaux */}
      <Modal
        visible={giftModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setGiftModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎁 Idées cadeaux pour {contact.name}</Text>
              <TouchableOpacity onPress={() => setGiftModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Sélecteur budget */}
            <View style={styles.giftBudgetRow}>
              {[
                { key: null,     label: 'Toutes gammes' },
                { key: '<20€',   label: '< 20€' },
                { key: '20-50€', label: '20-50€' },
                { key: '50-100€',label: '50-100€' },
                { key: '>100€',  label: '100€+' },
              ].map(({ key, label }) => {
                const active = giftBudget === key;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.giftBudgetChip, active && { backgroundColor: C.primary, borderColor: C.primary }]}
                    onPress={() => {
                      setGiftBudget(key);
                      runGiftSuggestions(key);
                    }}
                    activeOpacity={0.75}
                    disabled={isLoadingGifts}
                  >
                    <Text style={[styles.giftBudgetChipText, active && { color: '#fff' }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {isLoadingGifts && (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={C.primary} />
                <Text style={styles.modalLoadingText}>L'IA cherche des idées...</Text>
              </View>
            )}

            {giftError && !isLoadingGifts && (
              <View style={styles.modalLoading}>
                <Text style={styles.modalErrorText}>😕 {giftError ?? 'Impossible de charger les suggestions.'}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => runGiftSuggestions(giftBudget)}>
                  <Text style={styles.retryBtnText}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isLoadingGifts && !giftError && suggestions.length > 0 && (
              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                {suggestions.map((idea: GiftIdea, i: number) => (
                  <View key={i} style={styles.giftCard}>
                    <View style={styles.giftCardTop}>
                      <Text style={styles.giftCardTitle}>{idea.title}</Text>
                      <View style={styles.giftCardPricePill}>
                        <Text style={styles.giftCardPrice}>{idea.price_range}</Text>
                      </View>
                    </View>
                    <Text style={styles.giftCardDesc}>{idea.description}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.regenerateBtn} onPress={() => runGiftSuggestions(giftBudget)}>
                  <Text style={styles.regenerateBtnText}>↺ Nouvelles idées</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal aide — Centres d'intérêt */}
      <Modal visible={interestsHelpVisible} transparent animationType="fade" onRequestClose={() => setInterestsHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setInterestsHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionnent les centres d'intérêt ? 🎯</Text>
              <TouchableOpacity onPress={() => setInterestsHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Renseigner les centres d\'intérêt', body: "Deux façons de renseigner les centres d'intérêt de ton proche :\nListe prédéfinie — coche les catégories qui lui correspondent parmi une sélection de thèmes populaires.\nSaisie libre — ajoute des centres d'intérêt personnalisés que tu ne trouves pas dans la liste." },
              { title: 'Comment Claude AI les utilise', body: "Les centres d'intérêt sont utilisés automatiquement par Claude AI pour personnaliser les messages générés, suggérer des idées cadeaux adaptées et proposer des idées d'activités qui correspondent vraiment à ton proche." },
              { title: 'Plus c\'est précis, mieux c\'est', body: "Plus tu renseignes de centres d'intérêt, plus les suggestions de Claude AI seront précises et personnalisées — n'hésite pas à en ajouter autant que tu veux !" },
              { title: 'Bon à savoir 💡', body: "Les centres d'intérêt peuvent être modifiés à tout moment depuis la fiche contact — pense à les mettre à jour quand les goûts de ton proche évoluent !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Numérologie */}
      <Modal visible={numerologyHelpVisible} transparent animationType="fade" onRequestClose={() => setNumerologyHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setNumerologyHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la numérologie ? 🔢</Text>
              <TouchableOpacity onPress={() => setNumerologyHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Le calcul', body: "Chaque lettre du prénom est convertie en chiffre selon la table (A=1, B=2... I=9 puis on recommence). Les chiffres sont additionnés jusqu'à obtenir 1-9, sauf 11 et 22 (nombres maîtres)." },
              { title: 'Le chiffre vibratoire', body: "Révèle la personnalité profonde et l'énergie vibratoire. Chaque chiffre a un nom et une couleur associés — de « Le Leader » (1) à « Le Grand Bâtisseur » (22)." },
              { title: 'Les 3 chiffres', body: "Prénom seul = personnalité au quotidien\nNom seul = héritage familial\nPrénom + nom (expression) = mission de vie et potentiel global." },
              { title: 'Le chemin de vie', body: "Calculé depuis la date de naissance complète en additionnant tous ses chiffres. Le plus important — révèle la mission de vie, les talents naturels et les défis à surmonter." },
              { title: 'Bon à savoir 💡', body: "11 et 22 sont des nombres maîtres — non réduits car ils portent une énergie exceptionnelle. Les accents sont ignorés (José = JOSE)." },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Année de naissance */}
      <Modal visible={yearFactsHelpVisible} transparent animationType="fade" onRequestClose={() => setYearFactsHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setYearFactsHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 📖</Text>
              <TouchableOpacity onPress={() => setYearFactsHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'Le portrait de l\'année', body: "Claude AI génère automatiquement un portrait complet de l'année de naissance — depuis l'année seulement." },
              { title: 'Ce que tu découvres', body: "3-4 événements historiques FR/monde, chanson+film les plus populaires, prix nostalgiques (café, baguette, voiture, SMIC), dirigeants politiques, 1-2 anecdotes insolites." },
              { title: 'La nostalgie', body: "Les prix du quotidien sont particulièrement amusants — ton proche sera surpris de voir ce que coûtait une baguette l'année de sa naissance ! 😄" },
              { title: 'Partager', body: "Bouton Partager pour envoyer via WhatsApp, SMS ou email — un cadeau unique et inoubliable 🎉" },
              { title: 'Bon à savoir 💡', body: "Informations générées par Claude AI à titre indicatif — peuvent varier légèrement selon les sources historiques disponibles !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Personnalités */}
      <Modal visible={celebsHelpVisible} transparent animationType="fade" onRequestClose={() => setCelebsHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setCelebsHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 🌟</Text>
              <TouchableOpacity onPress={() => setCelebsHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'La recherche automatique', body: "Claude AI génère la liste depuis le jour et le mois de naissance seulement — l'année ne compte pas !" },
              { title: 'Les personnalités', body: "4 à 5 célébrités mondiales — acteurs, sportifs, musiciens, politiques, personnages historiques — toutes époques et tous pays." },
              { title: 'La présentation', body: "Nom, domaine, courte description + commentaire amusant pour rendre la découverte fun et surprenante." },
              { title: 'Partager', body: "Bouton Partager pour envoyer via WhatsApp, SMS ou email — une anecdote inoubliable pour son anniversaire 🎉" },
              { title: 'Bon à savoir 💡', body: "Personnalités sélectionnées par Claude AI à titre indicatif — la liste peut varier à chaque génération pour toujours surprendre !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Couleur préférée */}
      <Modal visible={colorHelpVisible} transparent animationType="fade" onRequestClose={() => setColorHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setColorHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la couleur préférée ? 🎨</Text>
              <TouchableOpacity onPress={() => setColorHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'Renseigner la couleur', body: "Appuie sur la zone de saisie et tape la couleur préférée de ton proche — en texte libre (ex : bleu marine, rouge cerise, vert forêt, violet lavande...)." },
              { title: 'Comment l\'appli l\'utilise', body: "Claude AI intègre automatiquement cette couleur dans les messages générés pour ton proche — pour des messages encore plus personnalisés et touchants !" },
              { title: 'La couleur numérologique', body: "La couleur numérologique (calculée depuis le chiffre vibratoire du prénom) est affichée juste en dessous pour comparaison. Parfois identiques, parfois différentes — une anecdote amusante !" },
              { title: 'Bon à savoir 💡', body: "Modifiable à tout moment en appuyant sur le champ. Tu peux aussi ne rien renseigner — l'appli fonctionnera très bien sans !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Chemin de vie */}
      <Modal visible={lifePathHelpVisible} transparent animationType="fade" onRequestClose={() => setLifePathHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setLifePathHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le chemin de vie ? 🌟</Text>
              <TouchableOpacity onPress={() => setLifePathHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'Le calcul', body: "Additionner tous les chiffres de la date de naissance complète jusqu'à obtenir 1-9, sauf 11 et 22." },
              { title: 'Exemple', body: "Né le 23/04/1985 → 2+3+0+4+1+9+8+5 = 32 → 3+2 = 5 — Chemin de vie 5 : Le Libre" },
              { title: 'Ce que révèle le chemin de vie', body: "Le chiffre numérologique le plus important — révèle la mission de vie, les talents naturels et les défis à surmonter." },
              { title: 'Les nombres maîtres', body: "11 et 22 ne sont pas réduits — ils portent une énergie exceptionnelle et une mission de vie particulièrement puissante." },
              { title: 'Approfondissement IA', body: "Appuie sur Approfondir avec l'IA pour obtenir une description détaillée générée par Claude AI : mission de vie, talents naturels, défis et conseils personnalisés 💛" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Jour de naissance */}
      <Modal visible={dayFactsHelpVisible} transparent animationType="fade" onRequestClose={() => setDayFactsHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setDayFactsHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne cette section ? 🌍</Text>
              <TouchableOpacity onPress={() => setDayFactsHelpVisible(false)}><Text style={styles.helpModalClose}>Fermer ✕</Text></TouchableOpacity>
            </View>
            {[
              { title: 'Le voyage dans le temps', body: "Claude AI génère automatiquement une page unique sur le jour exact de naissance, depuis la date de naissance complète." },
              { title: 'Ce que tu découvres', body: "2-3 événements historiques mondiaux ce jour-là, chanson n°1 en France, film n°1 au box-office, actualité française marquante." },
              { title: 'La présentation', body: "Chaque information présentée de façon fun et accessible pour rendre la découverte agréable et surprenante." },
              { title: 'Partager', body: "Bouton Partager pour envoyer via WhatsApp, SMS ou email — une attention unique pour son anniversaire 🎉" },
              { title: 'Bon à savoir 💡', body: "Informations générées par Claude AI à titre indicatif — peuvent varier légèrement selon les sources historiques disponibles !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal aide — Âge en chiffres fun */}
      <Modal visible={ageFunHelpVisible} transparent animationType="fade" onRequestClose={() => setAgeFunHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setAgeFunHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne l'âge en chiffres fun ? 🤯</Text>
              <TouchableOpacity onPress={() => setAgeFunHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Le calcul automatique', body: "Tous les chiffres sont calculés automatiquement depuis la date de naissance complète de ton contact et mis à jour chaque jour !" },
              { title: 'Les chiffres affichés', body: "Jours vécus, semaines, mois, heures, battements de cœur, repas pris, nuits dormies et minutes vécues — de quoi voir la vie sous un angle fascinant 😄" },
              { title: 'La mise à jour', body: "Les chiffres sont recalculés à chaque ouverture de la fiche contact — ils augmentent chaque jour comme la vie de ton proche !" },
              { title: 'Partager', body: "Appuie sur 📲 Partager ces chiffres pour envoyer l'anecdote via WhatsApp, SMS ou email — une attention originale et inoubliable pour un anniversaire 🎉" },
              { title: 'Bon à savoir 💡', body: "Chiffres calculés sur base de moyennes statistiques : 70 battements/min, 3 repas/jour, 8h sommeil/nuit. Les battements de cœur d'une vie... ça donne le vertige ! 🫀" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal — Ajouter un souhait */}
      <Modal
        visible={wishModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setWishModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎁 Ajouter un souhait</Text>
              <TouchableOpacity onPress={() => setWishModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ paddingHorizontal: 20 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 60 }}
            >
              <Text style={styles.reminderInputLabel}>Description *</Text>
              <TextInput
                style={[styles.reminderInput, { minHeight: 56 }]}
                placeholder={`Ex : Le dernier roman de Musso, une expérience parachute...`}
                placeholderTextColor="#aaa"
                value={newWishDesc}
                onChangeText={setNewWishDesc}
                multiline
                autoFocus
                textAlignVertical="top"
              />
              <Text style={styles.reminderInputLabel}>Catégorie (optionnel)</Text>
              <View style={styles.wishCategoryRow}>
                {(['Livre', 'Tech', 'Mode', 'Beauté', 'Sport', 'Maison', 'Voyage', 'Expérience', 'Autre'] as const).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.wishCategoryChip, newWishCategory === cat && styles.wishCategoryChipActive]}
                    onPress={() => setNewWishCategory(newWishCategory === cat ? null : cat)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.wishCategoryChipText, newWishCategory === cat && { color: Colors.white }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.reminderInputLabel}>Budget max en € (optionnel)</Text>
              <TextInput
                style={[styles.reminderInput, { minHeight: 48 }]}
                placeholder="Ex : 30"
                placeholderTextColor="#aaa"
                value={newWishBudget}
                onChangeText={setNewWishBudget}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.addPetSaveBtn, (!newWishDesc.trim() || isAddingWish) && { opacity: 0.5 }]}
                onPress={handleAddWish}
                disabled={!newWishDesc.trim() || isAddingWish}
                activeOpacity={0.85}
              >
                {isAddingWish
                  ? <ActivityIndicator color={Colors.white} />
                  : <Text style={styles.addPetSaveBtnText}>🎁 Ajouter à la liste</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal aide — Liste de souhaits */}
      <Modal visible={wishHelpVisible} transparent animationType="fade" onRequestClose={() => setWishHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setWishHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne la liste de souhaits ? 🎁</Text>
              <TouchableOpacity onPress={() => setWishHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'À quoi ça sert ?', body: "Note les envies de ton proche au fil de l'eau — un livre mentionné en passant, un objet admiré dans une vitrine, une expérience rêvée — pour ne jamais manquer d'inspiration à l'approche d'un anniversaire ou d'une occasion spéciale." },
              { title: 'Ajouter un souhait', body: "Appuie sur ＋ pour ajouter un souhait. La description est obligatoire. La catégorie et le budget max sont optionnels mais pratiques pour filtrer selon l'occasion." },
              { title: 'Cocher quand c\'est offert', body: "Appuie sur un souhait pour le cocher — il apparaît barré pour indiquer que le cadeau a été offert. Il reste visible pour l'historique." },
              { title: 'Supprimer', body: "Appui long sur un souhait pour le supprimer définitivement." },
              { title: 'Bon à savoir 💡', body: "La liste est privée — seul toi y as accès. Elle est parfaite pour noter discrètement ce que tu entends sans que ton proche ne le sache !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal — Avatar IA */}
      <Modal
        visible={aiAvatarVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAiAvatarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✨ Avatar IA — {contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0]}</Text>
              <TouchableOpacity onPress={() => setAiAvatarVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 80 }}>
              <FeatureIntroCard
                introText={`Génère un avatar illustré unique pour ${contact.name.split(' ').slice(1).join(' ') || contact.name.split(' ')[0]} grâce à l'IA ✨ L'IA s'inspire de son signe astrologique, son animal chinois, sa couleur préférée et sa personnalité pour créer une illustration artistique unique — jamais la même deux fois !`}
                modeEmploiLines={[
                  '🎨 Choisis un style artistique parmi 6 propositions',
                  '✨ DALL-E 3 génère un portrait unique en ~20 secondes',
                  '💛 Plus la fiche est complète, plus l\'avatar est personnalisé',
                  '🔄 Régénère autant de fois que tu veux pour trouver le parfait',
                ]}
              />
              <Text style={styles.reminderInputLabel}>Choisis un style</Text>
              <View style={styles.aiStyleGrid}>
                {([
                  { key: 'aquarelle',   emoji: '🎨', label: 'Aquarelle' },
                  { key: 'cartoon',     emoji: '😄', label: 'Cartoon' },
                  { key: 'pixel_art',   emoji: '🕹️', label: 'Pixel Art' },
                  { key: 'manga',       emoji: '⛩️', label: 'Manga' },
                  { key: 'esquisse',    emoji: '✏️', label: 'Esquisse' },
                  { key: 'fantastique', emoji: '🔮', label: 'Fantastique' },
                ] as const).map(({ key, emoji, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.aiStyleBtn, aiAvatarStyle === key && styles.aiStyleBtnActive]}
                    onPress={() => setAiAvatarStyle(key)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.aiStyleEmoji}>{emoji}</Text>
                    <Text style={[styles.aiStyleLabel, aiAvatarStyle === key && { color: C.primary, fontFamily: 'BeVietnamPro_700Bold' }]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {aiAvatarError && (
                <View style={styles.aiAvatarErrorBox}>
                  <Text style={styles.aiAvatarErrorText}>😕 {aiAvatarError}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.addPetSaveBtn, aiAvatarLoading && { opacity: 0.6 }]}
                onPress={handleGenerateAiAvatar}
                disabled={aiAvatarLoading}
                activeOpacity={0.85}
              >
                {aiAvatarLoading
                  ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <ActivityIndicator color={Colors.white} size="small" />
                      <Text style={styles.addPetSaveBtnText}>Génération en cours… (~20s)</Text>
                    </View>
                  )
                  : <Text style={styles.addPetSaveBtnText}>✨ Générer l'avatar IA</Text>
                }
              </TouchableOpacity>
              <Text style={[styles.aiDisclaimer, { textAlign: 'center', marginTop: 8 }]}>
                Avatar généré par DALL-E 3 · Remplace la photo actuelle du contact 🎨
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal — Rappel partagé */}
      <Modal
        visible={sharedReminderVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSharedReminderVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔔 Partager un rappel</Text>
              <TouchableOpacity onPress={() => setSharedReminderVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
              <FeatureIntroCard
                introText={`Envoie un rappel à tes amis pour qu'ils pensent à ${contact.name.split(' ')[0]} 💛 Parfait pour prévenir la famille ou les proches avant un anniversaire important !`}
                modeEmploiLines={[
                  '🔔 Personnalise le message ci-dessous',
                  '📱 Envoie par SMS, WhatsApp ou copie le texte',
                  '💛 Tes proches recevront une petite piqûre de rappel',
                ]}
              />
              <Text style={styles.reminderInputLabel}>Message de rappel</Text>
              <TextInput
                style={styles.reminderInput}
                value={sharedReminderText}
                onChangeText={setSharedReminderText}
                multiline
                numberOfLines={4}
                placeholderTextColor="#aaa"
                textAlignVertical="top"
              />
              <View style={styles.reminderActionsRow}>
                <TouchableOpacity
                  style={[styles.reminderActionBtn, { backgroundColor: '#25D366' }]}
                  activeOpacity={0.85}
                  onPress={() => {
                    const encoded = encodeURIComponent(sharedReminderText);
                    Linking.openURL(`whatsapp://send?text=${encoded}`);
                  }}
                >
                  <Text style={styles.reminderActionBtnText}>💬 WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reminderActionBtn, { backgroundColor: C.primary }]}
                  activeOpacity={0.85}
                  onPress={() => {
                    const encoded = encodeURIComponent(sharedReminderText);
                    Linking.openURL(`sms:?body=${encoded}`);
                  }}
                >
                  <Text style={styles.reminderActionBtnText}>📱 SMS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reminderActionBtn, { backgroundColor: Colors.onSurfaceVariant }]}
                  activeOpacity={0.85}
                  onPress={() => Share.share({ message: sharedReminderText })}
                >
                  <Text style={styles.reminderActionBtnText}>↗ Partager</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal aide — Signe chinois */}
      <Modal visible={chineseZodiacHelpVisible} transparent animationType="fade" onRequestClose={() => setChineseZodiacHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setChineseZodiacHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le signe chinois ? 🐉</Text>
              <TouchableOpacity onPress={() => setChineseZodiacHelpVisible(false)}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Le calcul automatique', body: "Le signe chinois de ton contact est calculé automatiquement à partir de son année de naissance. Le zodiaque chinois comprend 12 animaux qui se répètent en cycle de 12 ans." },
              { title: 'Les 12 animaux', body: "Rat, Bœuf, Tigre, Lapin, Dragon, Serpent, Cheval, Chèvre, Singe, Coq, Chien, Cochon." },
              { title: 'Le profil complet', body: "L'animal s'affiche avec son emoji, son élément (Bois, Feu, Terre, Métal, Eau), ses vertus et ses traits de caractère principaux." },
              { title: 'La compatibilité', body: "Rends-toi dans l'onglet Compatibilité pour découvrir comment l'animal de ton proche s'entend avec le tien selon la tradition ancestrale chinoise." },
              { title: 'Bon à savoir 💡', body: "Le zodiaque chinois est basé sur l'année de naissance — deux personnes nées la même année partagent le même animal, quelle que soit leur date de naissance !" },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function ActionButton({
  emoji,
  line1,
  line2,
  color,
  onPress,
  disabled = false,
}: {
  emoji: string;
  line1: string;
  line2: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity
      style={[styles.actionBtn, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Text style={{ fontSize: 18, color: Colors.white }}>{emoji}</Text>
      </View>
      <Text style={styles.actionLabel}>{line1}</Text>
      <Text style={styles.actionLabel}>{line2}</Text>
    </TouchableOpacity>
  );
}

// ── Composant carte numérologique ─────────────────────────────────────────────
function NumerologyCard({
  label,
  profile,
  C,
  styles,
}: {
  label: string;
  profile: ReturnType<typeof getNumerologyProfile>;
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={[styles.numCard, { borderLeftColor: profile.color }]}>
      <View style={styles.numCardHeader}>
        <View style={[styles.numColorDot, { backgroundColor: profile.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.numCardLabel}>{label}</Text>
          <View style={styles.numCardTitleRow}>
            <Text style={[styles.numCardNumber, { color: profile.color }]}>{profile.number}</Text>
            <Text style={styles.numCardName}>{profile.name}</Text>
            <View style={[styles.numColorPill, { backgroundColor: profile.color + '20', borderColor: profile.color + '60' }]}>
              <Text style={[styles.numColorPillText, { color: profile.color }]}>{profile.colorName}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.numKeywords}>
        {profile.keywords.map((k) => (
          <View key={k} style={styles.numKeywordPill}><Text style={styles.numKeywordText}>{k}</Text></View>
        ))}
      </View>
      <Text style={styles.numDescription}>{profile.description}</Text>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
  },
  editBtn: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: Radii.full, borderWidth: 1,
    borderColor: C.primary, backgroundColor: Colors.white,
  },
  editBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: C.primary },

  scrollContent: { paddingBottom: 100 },

  // Hero
  hero: { padding: Spacing[6], paddingTop: Spacing[6], overflow: 'hidden' },
  heroPattern: {
    position: 'absolute',
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
  },
  heroContent: { alignItems: 'center', zIndex: 1 },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  editAvatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  aiAvatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7B1FA2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  aiStyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  aiStyleBtn: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
    alignItems: 'center',
    gap: 4,
  },
  aiStyleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  aiStyleEmoji: { fontSize: 22 },
  aiStyleLabel: {
    fontSize: Typography.xs,
    fontFamily: 'BeVietnamPro_500Medium',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  aiAvatarErrorBox: {
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  aiAvatarErrorText: {
    fontSize: Typography.sm,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.error,
  },
  heroCivilite: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  heroName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroNameAge: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xl,
    color: 'rgba(255,255,255,0.75)',
  },
  heroBirthday: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xl,
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 10,
    marginTop: -4,
  },
  heroBirthdayEmpty: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
  },
  heroNameDay: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: 8,
  },
  heroBadges: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBadgeYellow: { backgroundColor: 'rgba(253,211,77,0.28)', borderColor: 'rgba(253,211,77,0.5)' },
  transitionBanner: {
    marginHorizontal: Spacing[4],
    marginVertical: Spacing[3],
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderRadius: Radii.lg,
    backgroundColor: C.primaryContainer,
    alignItems: 'center',
  },
  transitionBannerText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.base,
    color: C.primary,
    letterSpacing: 0.3,
  },
  heroPetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    justifyContent: 'center',
  },
  heroPetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: Radii.full,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  heroPetChipText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  heroBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: Radii.md,
    padding: 10,
    width: '100%',
  },
  alertIcon: { fontSize: 20 },
  alertInfo: { flex: 1 },
  alertTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: '#fff',
  },
  alertSub: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 2,
  },
  alertBtn: {
    backgroundColor: Colors.secondaryContainer,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  alertBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.onSecondaryFixed,
  },

  // Dates
  datesGrid: {
    flexDirection: 'row',
    gap: 8,
    padding: Spacing[4],
  },
  sendMessageBtn: {
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendMessageBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.white,
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    padding: 12,
  },
  dateIcon: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dateCardLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
    marginBottom: 1,
  },
  dateCardValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  dateCardSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Section
  section: { paddingHorizontal: Spacing[4], paddingBottom: Spacing[3] },
  sectionLabel: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: 10,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceContainerLow,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  tagChipText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: { flex: 1, alignItems: 'center', gap: 4 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  actionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Notes
  notesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    padding: 12,
  },
  notesText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },

  // Coordonnées
  coordsCard: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  coordIcon: { fontSize: 16 },
  coordValue: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  coordEmpty: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.outlineVariant,
    fontStyle: 'italic',
  },
  aiDisclaimer: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.outlineVariant,
    fontStyle: 'italic',
    marginTop: 8,
  },
  coordDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainerLow,
    marginHorizontal: 12,
  },
  emptyField: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  emptyFieldText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.outlineVariant,
    fontStyle: 'italic',
  },

  // Supprimer
  deleteBtn: {
    paddingVertical: 11,
    borderRadius: Radii.full,
    borderWidth: 0.5,
    borderColor: Colors.errorContainer,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.error,
  },

  // Modal ajout animal
  addPetSectionLabel: {
    borderLeftWidth: 2,
    borderLeftColor: C.primary,
    paddingLeft: 8,
    paddingVertical: 4,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  addPetTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addPetTypeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 62,
    paddingVertical: 10,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.white,
  },
  addPetTypeBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f4ff',
  },
  addPetTypeBtnLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  addPetTypeBtnLabelActive: {
    color: Colors.primary,
  },
  breedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  breedChip: {
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  breedChipLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  addPetInput: {
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  addPetHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: -14,
    marginBottom: 20,
    lineHeight: 16,
  },
  addPetSaveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addPetSaveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  // Bouton ajouter animal
  addPetBtn: {
    paddingVertical: 12,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  addPetBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  // Intro card pet section
  introCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    padding: Spacing[4],
    gap: 6,
  },
  introCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  introCardTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  helpCircle: { fontSize: 16 },
  introCardText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  // Nouvelle carte pet avec 2 boutons
  ownerPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  ownerPetAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: C.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerPetName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  ownerPetSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  petArrow: { fontSize: 22, fontFamily: 'BeVietnamPro_700Bold' },
  petCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  petCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  petCardBtns: { gap: 8 },
  petActionBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  petActionBtnSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
  },
  petActionBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  // Carte animal (wrapper + bouton édition)
  petRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    marginBottom: 8,
  },
  petEditBtn: {
    width: 44,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petEditBtnText: { fontSize: 18 },
  addPetBtnSmall: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.primaryContainer,
    alignItems: 'center',
  },
  addPetBtnSmallText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  // Carte message de la part de l'animal
  petMsgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.xl,
    padding: 14,
  },
  petMsgIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff3e0',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  petMsgText: { flex: 1 },
  petMsgTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  petMsgSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  petMsgArrow: { fontSize: 22, color: C.primary, lineHeight: 26 },

  // Modal messages animal
  petMsgModalSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    paddingHorizontal: Spacing[4],
    paddingTop: 10,
    paddingBottom: 14,
    textAlign: 'center',
  },
  petMsgCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 14,
    marginHorizontal: Spacing[4],
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    gap: 8,
  },
  petMsgCardText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  petMsgCardArrow: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
    textAlign: 'right',
  },

  // Idées cadeaux IA
  giftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.xl,
    padding: 14,
  },
  giftBtnIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  giftBtnText: { flex: 1 },
  giftBtnTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  giftBtnSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  giftBtnArrow: {
    fontSize: 18,
    color: C.primary,
  },

  // Modal cadeaux
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderBottomLeftRadius: Radii['2xl'],
    borderBottomRightRadius: Radii['2xl'],
    paddingTop: 8,
    paddingBottom: 24,
    maxHeight: '93%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainer,
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    flex: 1,
  },
  modalCloseBtn: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  modalLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  modalLoadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  modalErrorText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  retryBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  modalList: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
  },
  giftCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    gap: 6,
  },
  giftCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  giftCardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    flex: 1,
  },
  giftCardPricePill: {
    backgroundColor: C.primaryContainer,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    flexShrink: 0,
  },
  giftCardPrice: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: C.primary,
  },
  giftCardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  regenerateBtn: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: C.primary,
  },
  regenerateBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  giftBudgetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  giftBudgetChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  giftBudgetChipText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Zodiac
  zodiacBlock: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    gap: Spacing[2],
  },
  zodiacHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  zodiacEmoji: {
    fontSize: 24,
    width: 30,
    textAlign: 'center',
    marginTop: 1,
  },
  zodiacName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  zodiacDateRange: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  zodiacElementPill: {
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  zodiacElementText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: C.primary,
  },
  zodiacTrait: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: C.primary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  zodiacDescription: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  zodiacSectionLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    letterSpacing: 0.2,
    marginTop: Spacing[2],
    marginBottom: 4,
  },
  zodiacSubText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  zodiacKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing[1],
  },
  zodiacKeywordPill: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  zodiacKeywordText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Compatibilité zodiacale
  compatBlock: {
    marginTop: Spacing[3],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: Spacing[2],
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
  },
  compatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  compatEmoji: { fontSize: 28, lineHeight: 34 },
  compatLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  compatStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexWrap: 'wrap',
  },
  compatStar: {
    fontSize: 16,
    color: Colors.outlineVariant,
    lineHeight: 20,
  },
  compatStarActive: {
    color: Colors.secondaryContainer,
  },
  compatSignsText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  compatDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  compatMissing: {
    marginTop: Spacing[3],
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    padding: Spacing[3],
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  compatMissingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  compatSectionHeader: {
    marginTop: Spacing[3],
    backgroundColor: C.primary,
    borderRadius: Radii.lg,
    paddingVertical: 10,
    paddingHorizontal: Spacing[4],
  },
  compatSectionTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  compatTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing[3],
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: C.primary + '40',
  },
  compatTeaserEmoji: { fontSize: 22 },
  compatTeaserText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },
  compatTeaserArrow: {
    fontSize: 22,
    color: C.primary,
    lineHeight: 26,
  },

  // Section header row (label + help btn)
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: Spacing[1],
  },
  cheminVieHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: Spacing[2],
  },
  cheminVieHeaderLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },

  // Intro card partagée (centres d'intérêt, signe chinois…)
  featureIntroCard: {
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    borderRadius: Radii.md,
    padding: 12,
    marginBottom: 10,
  },
  featureIntroText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 8,
  },
  featureModeEmploi: { gap: 3 },
  featureModeEmploiLine: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },

  // Help info button (ℹ️ circle)
  helpInfoBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  helpInfoBtnText: { fontSize: 15, lineHeight: 18 },

  // Help modal
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  helpModalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    overflow: 'hidden',
    maxHeight: '85%',
  },
  helpModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primary,
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
  },
  helpModalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
    flex: 1,
    marginRight: 8,
  },
  helpModalClose: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  helpModalSection: {
    paddingHorizontal: Spacing[4],
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  helpModalSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  helpModalSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 8,
  },

  // Signe chinois card
  chineseZodiacCard: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
    borderRadius: Radii.xl,
    padding: 14,
    gap: Spacing[2],
  },
  chineseZodiacHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  chineseZodiacEmoji: { fontSize: 28, width: 34, textAlign: 'center', marginTop: 1 },
  chineseZodiacName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  chineseZodiacVirtues: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  chineseZodiacElementPill: {
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  chineseZodiacElementText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: C.primary,
  },
  chineseZodiacTraits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chineseZodiacTraitPill: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  chineseZodiacTraitText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  chineseZodiacDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
  },

  // ── Numérologie ─────────────────────────────────────────────────────────────
  numCard: {
    borderLeftWidth: 4,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 12,
    gap: Spacing[2],
    marginBottom: 8,
  },
  numCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  numColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    flexShrink: 0,
  },
  numCardLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  numCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  numCardNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    lineHeight: 26,
  },
  numCardName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  numColorPill: {
    borderRadius: Radii.full,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  numColorPillText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
  },
  numKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  numKeywordPill: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  numKeywordText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  numDescription: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  numNote: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ── Phase 2 — Couleur préférée ────────────────────────────────────────────
  colorEditRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  colorInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: Radii.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  colorSaveBtn: {
    width: 42,
    height: 42,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSaveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  colorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  colorDisplayEmoji: { fontSize: 20 },
  colorDisplayText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  colorEditIcon: { fontSize: 16 },
  colorNumerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  colorNumerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  colorNumerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // ── Phase 7 — Insights ──────────────────────────────────────────────────────
  loadInsightBtn: {
    borderWidth: 1.5,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    alignItems: 'center',
  },
  loadInsightBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
  },
  insightCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 14,
    gap: 4,
  },
  insightSection: { gap: 3, marginBottom: 8 },
  insightSectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    marginBottom: 2,
  },
  insightText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 21,
  },
  celebsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 14,
    gap: 12,
  },
  celebRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  celebDot: {
    width: 8, height: 8, borderRadius: 4,
    marginTop: 5, flexShrink: 0,
  },
  celebName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
    marginBottom: 1,
  },
  celebDomain: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginBottom: 2,
  },
  celebComment: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurface,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // ── Bouton compatibilité complète ────────────────────────────────────────────
  compatFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    padding: 14,
    gap: 10,
    marginBottom: Spacing[3],
  },
  compatFullBtnEmoji: { fontSize: 22 },
  compatFullBtnTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
  },
  compatFullBtnSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  compatFullBtnArrow: {
    fontSize: 26,
    lineHeight: 30,
  },
  compatFreeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    padding: 14,
    gap: 10,
    marginBottom: Spacing[3],
  },
  compatFreeBtnEmoji: { fontSize: 22 },
  compatFreeBtnTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.sm,
  },
  compatFreeBtnSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  // ── Âge en chiffres fun ──────────────────────────────────────────────────────
  ageFunGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ageFunCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  ageFunEmoji: { fontSize: 22 },
  ageFunValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    textAlign: 'center',
  },
  ageFunLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  ageFunNote: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  shareAgeFunBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderRadius: Radii.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  shareAgeFunBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
  },

  // ── Rappel partagé ───────────────────────────────────────────────────────────
  reminderInputLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginTop: 16,
    marginBottom: 8,
  },
  reminderInput: {
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    backgroundColor: Colors.white,
    minHeight: 100,
    marginBottom: 20,
  },
  reminderActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  reminderActionBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  reminderActionBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  // ── Liste de souhaits ────────────────────────────────────────────────────────
  wishEmptyCard: {
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    borderStyle: 'dashed',
    borderRadius: Radii.lg,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  wishEmptyText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  wishList: {
    gap: 8,
  },
  wishCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  wishCardDone: {
    backgroundColor: Colors.surfaceContainerLow,
    borderColor: Colors.surfaceContainerHighest,
    opacity: 0.7,
  },
  wishCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  wishDesc: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  wishDescDone: {
    textDecorationLine: 'line-through',
    color: Colors.onSurfaceVariant,
  },
  wishTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: C.primaryContainer,
  },
  wishTagText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.xs - 1,
    color: C.primary,
  },
  wishAddMore: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderStyle: 'dashed',
    borderRadius: Radii.lg,
    marginTop: 4,
  },
  wishAddMoreText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  wishCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  wishCategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.white,
  },
  wishCategoryChipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  wishCategoryChipText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  });
}
