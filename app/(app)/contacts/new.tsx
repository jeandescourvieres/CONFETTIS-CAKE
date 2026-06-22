import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Image,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { uploadContactAvatar } from '../../../src/services/contacts.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateContact, useContact, useUpdateContact, useContacts } from '../../../src/hooks/useContacts';
import { getNameDayForName, getCompoundNameDays, type CompoundNameDay } from '../../../src/utils/namedays';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { HelpModal } from '../../../src/components/ui/HelpModal';
import { Button3D } from '../../../src/components/ui/Button3D';
import type { Relation } from '../../../src/types/models';
import { DOG_BREEDS, CAT_BREEDS } from '../../../src/constants/petData';

const PET_TYPE_EMOJIS: Record<string, string> = {
  chien: '🐶', chat: '🐱', lapin: '🐰', perroquet: '🦜',
  hamster: '🐹', poisson: '🐠', cheval: '🐴', autre: '🐾',
};

function buildNotes(relation: string, familyLink: string, notes: string): string | null {
  // Retire un éventuel "Lien : ..." existant des notes
  const cleanNotes = notes.replace(/^Lien\s*:\s*.+?(\n|$)/, '').trim();
  if (relation === 'family' && familyLink.trim()) {
    const combined = `Lien : ${familyLink.trim()}${cleanNotes ? '\n' + cleanNotes : ''}`;
    return combined;
  }
  return cleanNotes || null;
}

export default function NewContactScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const C = useColors();
  const { editId, ownerName: ownerNameParam, resetKey } = useLocalSearchParams<{ editId?: string; ownerName?: string; resetKey?: string }>();
  const isEditing = !!editId;

  const SEND_TIMES: { value: 'morning' | 'afternoon' | 'evening' | 'anytime'; label: string; emoji: string }[] = [
    { value: 'morning',   label: t('contactNew.sendMorning'),   emoji: '🌅' },
    { value: 'afternoon', label: t('contactNew.sendAfternoon'), emoji: '☀️' },
    { value: 'evening',   label: t('contactNew.sendEvening'),   emoji: '🌙' },
    { value: 'anytime',   label: t('contactNew.sendAnytime'),   emoji: '🕐' },
  ];

  const PERSONALITY_TAGS: { value: string; label: string }[] = [
    { value: 'drôle', label: t('contactNew.personalityFunny') },
    { value: 'calme', label: t('contactNew.personalityCalm') },
    { value: 'passionné', label: t('contactNew.personalityPassionate') },
    { value: 'créatif', label: t('contactNew.personalityCreative') },
    { value: 'sportif', label: t('contactNew.personalitySporty') },
    { value: 'gourmand', label: t('contactNew.personalityFoodie') },
    { value: 'voyageur', label: t('contactNew.personalityTraveler') },
    { value: 'geek', label: t('contactNew.personalityGeek') },
  ];

  const PET_PERSONALITY_TAGS: { value: string; label: string }[] = [
    { value: 'joueur',       label: `🎾 ${t('contactNew.petPersonalityPlayful')}` },
    { value: 'câlin',        label: `🤗 ${t('contactNew.petPersonalityCuddly')}` },
    { value: 'indépendant',  label: `😎 ${t('contactNew.petPersonalityIndependent')}` },
    { value: 'gourmand',     label: `🍖 ${t('contactNew.petPersonalityFoodie')}` },
    { value: 'peureux',      label: `😨 ${t('contactNew.petPersonalityFearful')}` },
    { value: 'actif',        label: `⚡ ${t('contactNew.petPersonalityActive')}` },
    { value: 'dormeur',      label: `😴 ${t('contactNew.petPersonalitySleepy')}` },
    { value: 'affectueux',   label: `💛 ${t('contactNew.petPersonalityAffectionate')}` },
    { value: 'espiègle',     label: `😏 ${t('contactNew.petPersonalityMischievous')}` },
    { value: 'protecteur',   label: `🛡️ ${t('contactNew.petPersonalityProtective')}` },
    { value: 'bavard',       label: `🗣️ ${t('contactNew.petPersonalityChatty')}` },
    { value: 'timide',       label: `🙈 ${t('contactNew.petPersonalityShy')}` },
  ];

  const RELATIONS: { value: Relation; label: string; emoji: string }[] = [
    { value: 'best_friend', label: t('contacts.relations.best_friend'), emoji: '💜' },
    { value: 'friend', label: t('contacts.relations.friend'), emoji: '😊' },
    { value: 'family', label: t('contacts.relations.family'), emoji: '👨‍👩‍👧' },
    { value: 'partner', label: t('contacts.relations.partner'), emoji: '💑' },
    { value: 'colleague', label: t('contacts.relations.colleague'), emoji: '💼' },
    { value: 'child_of', label: t('contacts.relations.child_of'), emoji: '👶' },
    { value: 'pet', label: t('contacts.relations.pet'), emoji: '🐾' },
    { value: 'other', label: t('contacts.relations.other'), emoji: '👤' },
  ];

  const { mutateAsync: createContact, isPending: isCreating } = useCreateContact();
  const { mutateAsync: updateContact, isPending: isUpdating } = useUpdateContact();
  const { data: existingContact } = useContact(editId ?? '');
  const { data: allContacts = [] } = useContacts();
  const isPending = isCreating || isUpdating;

  // Animaux liés à ce contact (mode édition uniquement)
  const linkedPets = useMemo(
    () => allContacts.filter((c) => c.relation === 'pet' && (c as { pet_owner_contact_id?: string | null }).pet_owner_contact_id === editId),
    [allContacts, editId],
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [relation, setRelation] = useState<Relation>('friend');
  const [familyLink, setFamilyLink] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [personalityTags, setPersonalityTags] = useState<string[]>([]);
  const [preferredChannel, setPreferredChannel] = useState<'sms' | 'email' | null>(null);
  const [preferredSendTime, setPreferredSendTime] = useState<'morning' | 'afternoon' | 'evening' | 'anytime' | null>(null);
  const [petOwnerName, setPetOwnerName] = useState(ownerNameParam ?? '');
  const [petType, setPetType] = useState<'chien' | 'chat' | 'lapin' | 'perroquet' | 'hamster' | 'poisson' | 'cheval' | 'oiseau' | 'autre' | null>(null);
  const [petGender, setPetGender] = useState<'male' | 'female' | null>(null);
  const [petBreed, setPetBreed] = useState<string>('');
  const petSoundRef = useRef<Audio.Sound | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<string | null>(null);
  const [favouriteColor, setFavouriteColor] = useState<string>('');
  const [civilite, setCivilite] = useState<'M.' | 'Mme' | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [childGender, setChildGender] = useState<'male' | 'female' | null>(null);
  const [childParentContactId, setChildParentContactId] = useState<string | null>(null);
  const [childParentName, setChildParentName] = useState<string>('');
  const [showChildParentPicker, setShowChildParentPicker] = useState(false);
  const [childParentSearch, setChildParentSearch] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nameDay, setNameDay] = useState<Date | null>(null);
  const [showNameDayPicker, setShowNameDayPicker] = useState(false);
  // Phase 10 — prénom composé
  const [compoundChoices, setCompoundChoices] = useState<CompoundNameDay[]>([]);
  const [showCompoundModal, setShowCompoundModal] = useState(false);

  // Auto-remplir la fête quand le prénom change (seulement si pas déjà renseigné)
  useEffect(() => {
    if (!firstName.trim() || nameDay) return;
    const name = firstName.trim();

    // Prénom composé avec tiret → popup de choix
    if (name.includes('-')) {
      const choices = getCompoundNameDays(name);
      if (choices.length > 1) {
        setCompoundChoices(choices);
        setShowCompoundModal(true);
        return;
      }
    }

    const mmdd = getNameDayForName(name);
    if (mmdd) {
      const [m, d] = mmdd.split('-').map(Number);
      setNameDay(new Date(2000, m - 1, d));
    }
  }, [firstName]);

  // Réinitialiser à chaque navigation vers "nouveau contact"
  // resetKey change à chaque push → force le reset même si le composant est gardé en mémoire
  useEffect(() => {
    if (!editId) {
      setFirstName('');
      setLastName('');
      setRelation('friend');
      setFamilyLink('');
      setPhone('');
      setEmail('');
      setNotes('');
      setPersonalityTags([]);
      setPreferredChannel(null);
      setPreferredSendTime(null);
      setPetOwnerName(ownerNameParam ?? '');
      setPetType(null);
      setBirthday(null);
      setNameDay(null);
      setAvatarUri(null);
      setPreferredLanguage(null);
      setFavouriteColor('');
      setCivilite(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, editId]);

  // Pré-remplir les champs si on est en mode édition
  useEffect(() => {
    if (!isEditing || !existingContact || existingContact.id !== editId) return;
    const parts = existingContact.name.split(' ');
    const isPetContact = existingContact.relation === 'pet';
    setLastName(isPetContact ? (parts[0] ?? '') : formatLastName(parts[0] ?? ''));
    setFirstName(formatFirstName(parts.slice(1).join(' ')));
    setRelation(existingContact.relation);
    const linkMatch = existingContact.notes?.match(/^Lien\s*:\s*(.+?)(\n|$)/);
    if (linkMatch) {
      setFamilyLink(linkMatch[1].trim());
    }
    setPhone(existingContact.phone ?? '');
    setEmail(existingContact.email ?? '');
    setNotes(existingContact.notes ?? '');
    setPersonalityTags(Array.isArray(existingContact.personality_tags) ? existingContact.personality_tags : []);
    setPreferredChannel(existingContact.preferred_channel ?? null);
    setPreferredSendTime(existingContact.preferred_send_time ?? null);
    setPetOwnerName(existingContact.pet_owner_name ?? '');
    setPetType((existingContact as { pet_type?: 'chien' | 'chat' | 'lapin' | 'oiseau' | 'autre' | null }).pet_type ?? null);
    setPetGender((existingContact.pet_gender as 'male' | 'female' | null) ?? null);
    setPetBreed((existingContact as any).breed ?? '');
    setPreferredLanguage(existingContact.preferred_language ?? null);
    setFavouriteColor(existingContact.favourite_color ?? '');
    setCivilite((existingContact as { civilite?: 'M.' | 'Mme' | null }).civilite ?? null);
    if (existingContact.birthday) {
      const raw = existingContact.birthday.startsWith('0000-')
        ? existingContact.birthday.replace('0000-', '2000-')
        : existingContact.birthday;
      const [y, m, d] = raw.split('-').map(Number);
      setBirthday(new Date(y, m - 1, d));
    }
    if (existingContact.name_day) {
      const [m, d] = existingContact.name_day.split('-').map(Number);
      setNameDay(new Date(2000, m - 1, d));
    }
    setAvatarUri(existingContact.avatar_url ?? null);
  }, [isEditing, existingContact]);

  // Sons animaux — fichiers MP3 dans assets/sounds/
  // À télécharger sur Freesound.org / Pixabay.com et déposer dans assets/sounds/
  const PET_SOUNDS: Partial<Record<string, any>> = {
    chien:     require('../../../assets/sounds/chien.mp3'),
    chat:      require('../../../assets/sounds/chat.mp3'),
    lapin:     require('../../../assets/sounds/lapin.mp3'),
    perroquet: require('../../../assets/sounds/perroquet.mp3'),
    hamster:   require('../../../assets/sounds/hamster.mp3'),
    poisson:   require('../../../assets/sounds/poisson.mp3'),
    cheval:    require('../../../assets/sounds/cheval.mp3'),
  };

  const playPetSound = async (type: string) => {
    try {
      // Décharger le son précédent
      if (petSoundRef.current) {
        await petSoundRef.current.unloadAsync();
        petSoundRef.current = null;
      }
      const source = PET_SOUNDS[type];
      if (!source) return;
      // playsInSilentModeIOS: false → respecte le mode silencieux
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true, volume: 1 });
      petSoundRef.current = sound;
      // Libération automatique après lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          petSoundRef.current = null;
        }
      });
    } catch {
      // Son indisponible — silencieux
    }
  };

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

  const pickAvatar = () => setShowAvatarPicker(true);

  const pickFromCamera = async () => {
    setShowAvatarPicker(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('contactNew.permissionDeniedTitle'), t('contactNew.cameraPermissionMsg')); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    setShowAvatarPicker(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('contactNew.permissionDeniedTitle'), t('contactNew.photosPermissionMsg')); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const normalizePhone = (raw: string): string | null => {
    const cleaned = raw.replace(/[\s\-\.\(\)]/g, '');
    if (!cleaned) return null;
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.startsWith('00')) return '+' + cleaned.slice(2);
    if (cleaned.startsWith('0') && cleaned.length >= 9) return '+33' + cleaned.slice(1);
    return cleaned || null;
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  const handleSave = async () => {
    const missing: string[] = [];
    if (!lastName.trim())
      missing.push(relation === 'pet' ? t('contactNew.missingPetName') : t('contactNew.missingLastName'));
    if (relation !== 'pet') {
      if (!firstName.trim())           missing.push(t('contactNew.missingFirstName'));
      if (!civilite && relation !== 'child_of') missing.push(t('contactNew.missingCivilite'));
      if (relation === 'child_of' && !childParentContactId) missing.push(t('contactNew.missingParentContact'));
      if (relation === 'child_of' && !childGender)          missing.push(t('contactNew.missingChildGender'));
      if (!birthday)                   missing.push(t('contactNew.missingBirthday'));
      if (relation === 'family' && !familyLink.trim()) missing.push(t('contactNew.missingFamilyLink'));
      if (relation !== 'child_of' && !phone.trim() && !email.trim()) missing.push(t('contactNew.missingPhoneOrEmail'));
    }
    if (missing.length > 0) {
      Alert.alert(
        t('contactNew.missingFieldsTitle'),
        t('contactNew.missingFieldsMsg') + missing.join('\n'),
        [{ text: t('contactNew.ok') }]
      );
      return;
    }
    const fullName = [lastName.trim(), firstName.trim()].filter(Boolean).join(' ');

    // Vérification doublon (uniquement en création)
    if (!isEditing) {
      const duplicate = allContacts.find(
        (c) => c.name.toLowerCase() === fullName.toLowerCase()
      );
      if (duplicate) {
        Alert.alert(
          t('contactNew.duplicateTitle'),
          t('contactNew.duplicateMsg', { name: duplicate.name }),
          [
            { text: t('contactNew.cancel'), style: 'cancel' },
            { text: t('contactNew.addAnyway'), onPress: async () => { const id = await doSave(fullName); if (id) router.back(); } },
          ]
        );
        return;
      }
    }

    const id = await doSave(fullName);
    if (id) router.back();
  };

  const handleSaveAndAddPet = async () => {
    if (isEditing && editId) {
      router.push(`/(app)/animaux/new?ownerId=${editId}` as never);
      return;
    }
    // Mode création : enregistre le contact d'abord, puis navigue
    if (!lastName.trim() || !firstName.trim()) {
      Alert.alert(t('contactNew.nameRequiredTitle'), t('contactNew.nameRequiredMsg'));
      return;
    }
    const fullName = [lastName.trim(), firstName.trim()].filter(Boolean).join(' ');
    const id = await doSave(fullName);
    if (id) {
      router.push(`/(app)/animaux/new?ownerId=${id}` as never);
    }
  };

  const doSave = async (fullName: string): Promise<string | null> => {
    const birthdayStr = birthday
      ? `${birthday.getFullYear()}-${String(birthday.getMonth() + 1).padStart(2, '0')}-${String(birthday.getDate()).padStart(2, '0')}`
      : null;
    const nameDayStr = nameDay
      ? `${String(nameDay.getMonth() + 1).padStart(2, '0')}-${String(nameDay.getDate()).padStart(2, '0')}`
      : null;
    try {
      let finalAvatarUrl: string | null = isEditing ? (existingContact?.avatar_url ?? null) : null;
      if (avatarUri && !avatarUri.startsWith('http')) {
        finalAvatarUrl = await uploadContactAvatar(avatarUri);
      }

      if (isEditing && editId) {
        await updateContact({
          id: editId,
          updates: {
            name: fullName,
            relation,
            phone: normalizePhone(phone.trim()),
            email: email.trim() || null,
            notes: buildNotes(relation, familyLink, notes),
            birthday: birthdayStr,
            name_day: nameDayStr,
            personality_tags: personalityTags,
            preferred_channel: preferredChannel,
            preferred_send_time: preferredSendTime,
            pet_owner_name: relation === 'pet' ? (petOwnerName.trim() || null) : null,
            pet_type: relation === 'pet' ? (petType ?? null) : null,
            pet_gender: relation === 'pet' ? (petGender ?? null) : null,
            breed: relation === 'pet' ? (petBreed.trim() || null) : null,
            preferred_language: (preferredLanguage as import('../../../src/types/models').AppLanguage | null) ?? null,
            avatar_url: finalAvatarUrl,
            favourite_color: favouriteColor.trim() || null,
            civilite: civilite ?? null,
          },
        });
        return editId;
      } else {
        const created = await createContact({
          name: fullName,
          relation,
          phone: normalizePhone(phone.trim()),
          email: email.trim() || null,
          notes: buildNotes(relation, familyLink, notes),
          birthday: birthdayStr,
          personality_tags: personalityTags,
          name_day: nameDayStr,
          avatar_url: finalAvatarUrl,
          imported_from: 'manual',
          preferred_channel: preferredChannel,
          preferred_send_time: preferredSendTime,
          pet_owner_name: relation === 'pet' ? (petOwnerName.trim() || null) : null,
          pet_type: relation === 'pet' ? (petType ?? null) : null,
          preferred_language: (preferredLanguage as import('../../../src/types/models').AppLanguage | null) ?? null,
          favourite_color: favouriteColor.trim() || null,
          civilite: civilite ?? null,
          pet_gender: null,
          pet_owner_contact_id: null,
          breed: relation === 'pet' ? (petBreed.trim() || null) : null,
          child_gender: relation === 'child_of' ? (childGender ?? null) : undefined,
          child_parent_name: relation === 'child_of' ? (childParentName || null) : undefined,
          child_parent_contact_id: relation === 'child_of' ? (childParentContactId ?? null) : undefined,
        } as any);
        return created.id;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('contactNew.saveErrorMsg');
      Alert.alert(t('contactNew.errorTitle'), msg);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>{t('contactNew.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{isEditing ? t('contacts.editContact') : t('contacts.newContact')}</Text>
        <View style={styles.topbarRight}>
          <HelpModal
            title={t('contacts.detail.title')}
            content={t('contactNew.helpContent')}
          />
          <Button3D label={t('contactNew.save')} onPress={handleSave} disabled={isPending} size="sm" />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Carte intro photo/avatar */}
        <View style={{ backgroundColor: '#F0F9FF', borderRadius: 14, borderWidth: 1.5, borderColor: '#BAE6FD', padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: Spacing[2] }}>
          <Text style={{ fontSize: 22 }}>🖼️</Text>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: '#0369A1' }}>{t('contactNew.photoIntroTitle')}</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#0284C7', lineHeight: 18 }}>
              {t('contactNew.photoIntroBefore')}
              <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{t('contactNew.photoIntroBold')}</Text>
              {t('contactNew.photoIntroAfter')}
            </Text>
          </View>
        </View>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarPickerWrap} onPress={pickAvatar} activeOpacity={0.8}>
          <View style={{ position: 'relative' }}>
            <View style={styles.avatarCircle}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitials}>
                  {[lastName.charAt(0), firstName.charAt(0)].filter(Boolean).join('').toUpperCase() || '?'}
                </Text>
              )}
            </View>
            <View style={styles.avatarCameraBtn}>
              <Text style={{ fontSize: 12 }}>📷</Text>
            </View>
          </View>
          <Text style={styles.avatarHint}>
            {avatarUri ? t('contactNew.changePhoto') : t('contactNew.addPhoto')}
          </Text>
        </TouchableOpacity>

        {/* Nom + Prénom */}
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{relation === 'pet' ? t('contactNew.petNameLabel') : t('contactNew.lastNameLabel')}</Text>
        </View>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(v) => setLastName(relation === 'pet' ? v : formatLastName(v))}
          placeholder={relation === 'pet' ? t('contactNew.petNamePlaceholder') : t('contactNew.lastNamePlaceholder')}
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize={relation === 'pet' ? 'words' : 'characters'}
          returnKeyType="next"
        />

        {relation !== 'pet' && (
          <>
            <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.firstNameLabel')}</Text></View>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={(v) => setFirstName(formatFirstName(v))}
              placeholder={t('contactNew.firstNamePlaceholder')}
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </>
        )}

        {/* Civilité — humains seulement */}
        {relation !== 'pet' && (
          <>
            <View style={styles.labelWrap}>
              <Text style={styles.label}>{t('contactNew.civiliteLabel')} <Text style={{ color: Colors.error }}>*</Text></Text>
            </View>
            <View style={[
              styles.civiliteRow,
              !civilite && lastName.trim() && { padding: 6, borderRadius: Radii.lg, borderWidth: 1.5, borderColor: Colors.error },
            ]}>
              {(['M.', 'Mme'] as const).map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[styles.civiliteBtn, civilite === val && styles.civiliteBtnActive]}
                  onPress={() => setCivilite(prev => prev === val ? null : val)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.civiliteBtnText, civilite === val && styles.civiliteBtnTextActive]}>
                    {val === 'M.' ? t('contactNew.civiliteM') : t('contactNew.civiliteMme')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {!civilite && lastName.trim() && (
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.error, marginTop: 2 }}>
                {t('contactNew.civiliteWarning')}
              </Text>
            )}
          </>
        )}

        {/* Date de naissance */}
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.birthdayLabel')} <Text style={{ color: Colors.error }}>*</Text></Text></View>
        <TouchableOpacity
          style={[styles.input, !birthday && relation === 'child_of' && { borderColor: Colors.error, borderWidth: 1.5 }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={birthday ? styles.inputText : styles.inputPlaceholder}>
            {birthday
              ? birthday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : t('contactNew.selectDatePlaceholder')}
          </Text>
        </TouchableOpacity>
        {!birthday && (relation === 'child_of' || lastName.trim()) && relation !== 'pet' && (
          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.error, marginTop: 2 }}>
            {t('contactNew.birthdayWarning')}
          </Text>
        )}
        {showDatePicker && Platform.OS === 'ios' && (
          <Modal transparent animationType="slide" visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
            <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowDatePicker(false)}>
              <View style={styles.pickerSheet}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>{t('contactNew.birthdayLabel')}</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.pickerOk}>{t('contactNew.pickerOk')}</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={birthday ?? new Date(1985, 0, 1)}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                  maximumDate={new Date()}
                  textColor={Colors.primary}
                  accentColor={Colors.primary}
                  style={{ width: '100%', height: 215 }}
                  onChange={(_event: unknown, date?: Date) => {
                    if (date) setBirthday(date);
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        {showDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={birthday ?? new Date(1985, 0, 1)}
            mode="date"
            display="spinner"
            minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
            maximumDate={new Date()}
            onChange={(_event: unknown, date?: Date) => {
              setShowDatePicker(false);
              if (date) setBirthday(date);
            }}
          />
        )}

        {/* Fête */}
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.namedayLabel')}</Text></View>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowNameDayPicker(true)}
        >
          <Text style={nameDay ? styles.inputText : styles.inputPlaceholder}>
            {nameDay
              ? nameDay.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
              : t('contactNew.selectNamedayPlaceholder')}
          </Text>
        </TouchableOpacity>
        {nameDay && (
          <TouchableOpacity
            onPress={() => setNameDay(null)}
            style={{ alignSelf: 'flex-end', marginTop: 4 }}
          >
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant }}>
              {t('contactNew.removeNameday')}
            </Text>
          </TouchableOpacity>
        )}
        {showNameDayPicker && Platform.OS === 'ios' && (
          <Modal transparent animationType="slide" visible={showNameDayPicker} onRequestClose={() => setShowNameDayPicker(false)}>
            <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowNameDayPicker(false)}>
              <View style={styles.pickerSheet}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>{t('contactNew.namedayPickerTitle')}</Text>
                  <TouchableOpacity onPress={() => setShowNameDayPicker(false)}>
                    <Text style={styles.pickerOk}>{t('contactNew.pickerOk')}</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={nameDay ?? new Date(2000, 3, 1)}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date(2000, 0, 1)}
                  maximumDate={new Date(2000, 11, 31)}
                  textColor={Colors.primary}
                  accentColor={Colors.primary}
                  style={{ width: '100%', height: 215 }}
                  onChange={(_event: unknown, date?: Date) => {
                    if (date) setNameDay(date);
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        {showNameDayPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={nameDay ?? new Date(2000, 3, 1)}
            mode="date"
            display="spinner"
            minimumDate={new Date(2000, 0, 1)}
            maximumDate={new Date(2000, 11, 31)}
            onChange={(_event: unknown, date?: Date) => {
              setShowNameDayPicker(false);
              if (date) setNameDay(date);
            }}
          />
        )}

        {/* Téléphone — masqué pour les animaux */}
        {relation !== 'pet' && <>
        {relation !== 'child_of' && (
          <Text style={styles.sublabel}>{t('contactNew.phoneOrEmailHint')}</Text>
        )}
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contacts.phone')}</Text></View>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder={t('contactNew.phonePlaceholder')}
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="phone-pad"
        />
        </>}

        {/* Email — masqué pour les animaux */}
        {relation !== 'pet' && <>
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contacts.email')}</Text></View>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={t('contactNew.emailPlaceholder')}
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        </>}

        {/* Relation — masqué pour les animaux */}
        {relation !== 'pet' && <>
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.relationLabel')}</Text></View>
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

        {/* Précisez le lien — famille */}
        {relation === 'family' && (
          <View style={[styles.familyLinkBox, !familyLink.trim() && styles.familyLinkBoxRequired]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.familyLinkTitle}>{t('contactNew.familyLinkTitle')}</Text>
              <Text style={styles.familyLinkRequired}>{t('contactNew.required')}</Text>
            </View>
            <View style={styles.familyLinkChips}>
              {[
                { value: 'frère', label: t('contactNew.familyLinkBrother') },
                { value: 'sœur', label: t('contactNew.familyLinkSister') },
                { value: 'beau-frère', label: t('contactNew.familyLinkBroInLaw') },
                { value: 'belle-sœur', label: t('contactNew.familyLinkSisInLaw') },
                { value: 'père', label: t('contactNew.familyLinkFather') },
                { value: 'mère', label: t('contactNew.familyLinkMother') },
                { value: 'grand-père', label: t('contactNew.familyLinkGrandpa') },
                { value: 'grand-mère', label: t('contactNew.familyLinkGrandma') },
                { value: 'oncle', label: t('contactNew.familyLinkUncle') },
                { value: 'tante', label: t('contactNew.familyLinkAunt') },
                { value: 'cousin', label: t('contactNew.familyLinkCousinM') },
                { value: 'cousine', label: t('contactNew.familyLinkCousinF') },
                { value: 'fils', label: t('contactNew.familyLinkSon') },
                { value: 'fille', label: t('contactNew.familyLinkDaughter') },
                { value: 'belle-fille', label: t('contactNew.familyLinkDaughterInLaw') },
                { value: 'gendre', label: t('contactNew.familyLinkSonInLaw') },
                { value: 'petit-fils', label: t('contactNew.familyLinkGrandson') },
                { value: 'petite-fille', label: t('contactNew.familyLinkGranddaughter') },
              ].map((sub) => (
                <TouchableOpacity
                  key={sub.value}
                  style={[styles.tagBtn, familyLink === sub.value && styles.tagBtnActive]}
                  onPress={() => setFamilyLink(familyLink === sub.value ? '' : sub.value)}
                >
                  <Text style={[styles.tagLabel, familyLink === sub.value && styles.tagLabelActive]}>
                    {sub.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={familyLink}
              onChangeText={setFamilyLink}
              placeholder={t('contactNew.familyLinkCustomPlaceholder')}
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="none"
            />
          </View>
        )}
        </>}

        {/* Champs spécifiques enfant */}
        {relation === 'child_of' && (
          <View style={{ gap: 12, marginTop: 4 }}>
            {/* Genre */}
            <View>
              <Text style={styles.label}>{t('contactNew.childGenderLabel')}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                {([{ value: 'female', label: t('contactNew.girl') }, { value: 'male', label: t('contactNew.boy') }] as const).map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.relationBtn, childGender === g.value && styles.relationBtnActive, { flex: 1, justifyContent: 'center', paddingVertical: 10 }]}
                    onPress={() => setChildGender(g.value)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.relationLabel, childGender === g.value && styles.relationLabelActive]}>{g.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Sélecteur parent */}
            <View>
              <Text style={styles.label}>{t('contactNew.childParentLabel')}</Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center', marginTop: 6 }]}
                onPress={() => { setChildParentSearch(''); setShowChildParentPicker(true); }}
                activeOpacity={0.75}
              >
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: childParentName ? Colors.onSurface : Colors.outlineVariant }}>
                  {childParentName || t('contactNew.selectParentPlaceholder')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Champs spécifiques animal */}
        {relation === 'pet' && (
          <>
            {/* Type d'animal */}
            <View style={styles.labelWrap}>
              <Text style={styles.label}>{t('contactNew.petTypeLabel')}</Text>
            </View>
            <View style={styles.relationGrid}>
              {([
                { value: 'chien',     label: t('contactNew.petTypeDog'),    emoji: '🐶' },
                { value: 'chat',      label: t('contactNew.petTypeCat'),    emoji: '🐱' },
                { value: 'lapin',     label: t('contactNew.petTypeRabbit'), emoji: '🐰' },
                { value: 'perroquet', label: t('contactNew.petTypeParrot'), emoji: '🦜' },
                { value: 'hamster',   label: t('contactNew.petTypeHamster'), emoji: '🐹' },
                { value: 'poisson',   label: t('contactNew.petTypeFish'),   emoji: '🐠' },
                { value: 'cheval',    label: t('contactNew.petTypeHorse'),  emoji: '🐴' },
                { value: 'autre',     label: t('contactNew.petTypeOther'),  emoji: '🐾' },
              ] as const).map((pt) => (
                <TouchableOpacity
                  key={pt.value}
                  style={[styles.relationBtn, petType === pt.value && styles.relationBtnActive]}
                  onPress={() => {
                    setPetType(pt.value);
                    playPetSound(pt.value); // joue le son à chaque appui (mode replay inclus)
                  }}
                >
                  <Text style={styles.relationEmoji}>{pt.emoji}</Text>
                  <Text style={[styles.relationLabel, petType === pt.value && styles.relationLabelActive]}>
                    {pt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Genre */}
            <View style={styles.labelWrap}>
              <Text style={styles.label}>{t('contactNew.petGenderLabel')}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {([
                { value: 'male',   label: t('contactNew.male'),   emoji: '🔵' },
                { value: 'female', label: t('contactNew.female'), emoji: '🟣' },
              ] as const).map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.relationBtn, petGender === g.value && styles.relationBtnActive, { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6 }]}
                  onPress={() => setPetGender(g.value)}
                  activeOpacity={0.8}
                >
                  <Text>{g.emoji}</Text>
                  <Text style={[styles.relationLabel, petGender === g.value && styles.relationLabelActive]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Race (chien ou chat uniquement) */}
            {(petType === 'chien' || petType === 'chat') && (
              <>
                <View style={styles.labelWrap}>
                  <Text style={styles.label}>{petType === 'chien' ? t('contactNew.breedLabelDog') : t('contactNew.breedLabelCat')}</Text>
                </View>
                <View style={styles.relationGrid}>
                  {(petType === 'chien' ? DOG_BREEDS : CAT_BREEDS).map((b) => (
                    <TouchableOpacity
                      key={b}
                      style={[styles.relationBtn, petBreed === b && styles.relationBtnActive]}
                      onPress={() => setPetBreed(b)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.relationLabel, petBreed === b && styles.relationLabelActive]}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

          </>
        )}

        {/* Personnalité / Caractère */}
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{relation === 'pet' ? t('contactNew.characterLabel') : t('contactNew.personalityLabel')}</Text>
        </View>
        <View style={styles.tagGrid}>
          {(relation === 'pet' ? PET_PERSONALITY_TAGS : PERSONALITY_TAGS).map((t) => {
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
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contacts.detail.notes')}</Text></View>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('contactNew.notesPlaceholder')}
          placeholderTextColor={Colors.outlineVariant}
          multiline
          numberOfLines={3}
        />

        {/* Couleur préférée */}
        {relation !== 'pet' && (
          <>
            <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.favColorLabel')}</Text></View>
            <TextInput
              style={styles.input}
              value={favouriteColor}
              onChangeText={setFavouriteColor}
              placeholder={t('contactNew.favColorPlaceholder')}
              placeholderTextColor={Colors.outlineVariant}
            />
          </>
        )}

        {/* Canal, langue, moment — masqués pour les animaux */}
        {relation !== 'pet' && <>

        {/* Canal préféré */}
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.channelLabel')}</Text></View>
        <Text style={styles.sublabel}>
          {t('contactNew.channelSublabel', { name: firstName.trim() || t('contactNew.defaultContact') })}
        </Text>
        <View style={styles.channelRow}>
          {([{ value: 'sms', label: t('contactNew.channelSms'), emoji: '📱' }, { value: 'email', label: t('contactNew.channelEmail'), emoji: '📧' }] as const).map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[styles.channelBtn, preferredChannel === c.value && styles.channelBtnActive]}
              onPress={() => setPreferredChannel(prev => prev === c.value ? null : c.value)}
            >
              <Text style={styles.channelEmoji}>{c.emoji}</Text>
              <Text style={[styles.channelLabel, preferredChannel === c.value && styles.channelLabelActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Langue préférée du message IA */}
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.aiLanguageLabel')}</Text></View>
        <Text style={styles.sublabel}>
          {t('contactNew.aiLanguageSublabel', { name: firstName.trim() || t('contactNew.defaultContact') })}
        </Text>
        <View style={styles.channelRow}>
          {[
            { code: 'fr', flag: '🇫🇷', label: t('contactNew.langFr') },
            { code: 'en', flag: '🇬🇧', label: t('contactNew.langEn') },
            { code: 'de', flag: '🇩🇪', label: t('contactNew.langDe') },
            { code: 'es', flag: '🇪🇸', label: t('contactNew.langEs') },
            { code: 'it', flag: '🇮🇹', label: t('contactNew.langIt') },
            { code: 'pt', flag: '🇵🇹', label: t('contactNew.langPt') },
          ].map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.channelBtn, preferredLanguage === l.code && styles.channelBtnActive]}
              onPress={() => setPreferredLanguage(prev => prev === l.code ? null : l.code)}
            >
              <Text style={styles.channelEmoji}>{l.flag}</Text>
              <Text style={[styles.channelLabel, preferredLanguage === l.code && styles.channelLabelActive]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Heure idéale d'envoi */}
        <View style={styles.labelWrap}><Text style={styles.label}>{t('contactNew.sendTimeLabel')}</Text></View>
        <Text style={styles.sublabel}>
          {t('contactNew.sendTimeSublabel', { name: firstName.trim() || t('contactNew.defaultContact') })} <Text style={{ fontStyle: 'italic' }}>{t('contactNew.optional')}</Text>
        </Text>
        <View style={styles.channelRow}>
          {SEND_TIMES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.channelBtn, preferredSendTime === t.value && styles.channelBtnActive]}
              onPress={() => setPreferredSendTime(prev => prev === t.value ? null : t.value)}
            >
              <Text style={styles.channelEmoji}>{t.emoji}</Text>
              <Text style={[styles.channelLabel, preferredSendTime === t.value && styles.channelLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </>}

        {/* Animal de compagnie */}
        {relation !== 'pet' && (
          <>
            <View style={styles.labelWrap}>
              <Text style={styles.label}>{t('contactNew.petSectionLabel')}</Text>
            </View>
            <View style={{ backgroundColor: '#FFF7ED', borderRadius: 12, padding: 14, gap: 8, borderLeftWidth: 4, borderLeftColor: '#D97706', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#92400E' }}>
                {t('contactNew.petInfoTitle')}
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#92400E', lineHeight: 18 }}>
                {t('contactNew.petInfoIntro')}
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#92400E', lineHeight: 18 }}>
                {'📬 '}
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{t('contactNew.petInfoWriteBold')}</Text>
                {t('contactNew.petInfoWriteRest')}
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#92400E', lineHeight: 18 }}>
                {'🐾 '}
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{t('contactNew.petInfoFromPetBold')}</Text>
                {t('contactNew.petInfoFromPetRest')}
              </Text>
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#92400E', lineHeight: 18 }}>
                {'✍️ '}
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{t('contactNew.petInfoToOtherBold')}</Text>
                {t('contactNew.petInfoToOtherRest')}
              </Text>
            </View>
            {isEditing && linkedPets.length > 0 && (
              <View style={styles.petList}>
                {linkedPets.map((pet, i) => (
                  <View key={pet.id}>
                    <TouchableOpacity
                      style={styles.petRow}
                      onPress={() => router.push(`/(app)/contact/${pet.id}` as never)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.petRowEmoji}>
                        {PET_TYPE_EMOJIS[(pet as { pet_type?: string | null }).pet_type ?? ''] ?? '🐾'}
                      </Text>
                      <Text style={styles.petRowName}>{pet.name}</Text>
                      <Text style={styles.petRowArrow}>›</Text>
                    </TouchableOpacity>
                    {i < linkedPets.length - 1 && <View style={styles.petDivider} />}
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={[styles.addPetBtn, { borderColor: C.primary }]}
              onPress={handleSaveAndAddPet}
              activeOpacity={0.8}
            >
              <Text style={[styles.addPetBtnText, { color: C.primary }]}>
                {isEditing && linkedPets.length > 0 ? t('contactNew.addAnotherPet') : t('contactNew.addPet')}
              </Text>
            </TouchableOpacity>
            {!isEditing && (
              <Text style={styles.petHintText}>
                {t('contactNew.petAutoSaveHint')}
              </Text>
            )}
          </>
        )}

      </ScrollView>

      {/* Bouton enregistrer — fixé en bas */}
      <View style={styles.submitBar}>
        <Button3D
          label={isPending ? t('contactNew.saving') : isEditing ? t('contactNew.saveEditBtn') : t('contactNew.saveNewBtn')}
          onPress={handleSave}
          disabled={isPending}
          fullWidth
          size="lg"
        />
      </View>

      {/* ── Phase 10 — Popup prénom composé ── */}
      <Modal
        visible={showCompoundModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompoundModal(false)}
      >
        <TouchableOpacity
          style={compoundStyles.overlay}
          activeOpacity={1}
          onPress={() => setShowCompoundModal(false)}
        >
          <View style={compoundStyles.card}>
            <Text style={compoundStyles.title}>
              {t('contactNew.compoundTitle', { name: firstName.trim() })}
            </Text>
            <Text style={compoundStyles.sub}>
              {t('contactNew.compoundSub')}
            </Text>

            {compoundChoices.map((choice) => (
              <TouchableOpacity
                key={choice.mmdd}
                style={[compoundStyles.choiceBtn, { borderColor: C.primary }]}
                onPress={() => {
                  const [m, d] = choice.mmdd.split('-').map(Number);
                  setNameDay(new Date(2000, m - 1, d));
                  setShowCompoundModal(false);
                }}
              >
                <Text style={[compoundStyles.choiceName, { color: C.primary }]}>{choice.part}</Text>
                <Text style={compoundStyles.choiceDate}>{choice.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[compoundStyles.choiceBtn, compoundStyles.bothBtn, { borderColor: C.primary, backgroundColor: C.primary }]}
              onPress={() => {
                // Prend la première date mais l'info des deux fêtes sera dans les notes
                if (compoundChoices[0]) {
                  const [m, d] = compoundChoices[0].mmdd.split('-').map(Number);
                  setNameDay(new Date(2000, m - 1, d));
                }
                setShowCompoundModal(false);
              }}
            >
              <Text style={[compoundStyles.choiceName, { color: Colors.white }]}>{t('contactNew.compoundBoth')}</Text>
              <Text style={[compoundStyles.choiceDate, { color: Colors.white + 'CC' }]}>
                {compoundChoices.map((c) => c.label).join(' & ')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={compoundStyles.skipBtn}
              onPress={() => setShowCompoundModal(false)}
            >
              <Text style={[compoundStyles.skipText, { color: Colors.onSurfaceVariant }]}>
                {t('contactNew.compoundSkip')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal sélection parent pour child_of */}
      <Modal visible={showChildParentPicker} animationType="slide" transparent onRequestClose={() => setShowChildParentPicker(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: Colors.onSurface }}>{t('contactNew.childParentPickerTitle')}</Text>
              <TouchableOpacity onPress={() => setShowChildParentPicker(false)}>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: Colors.primary }}>{t('contactNew.closeModal')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 12 }}>
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                placeholder={t('contactNew.searchContactPlaceholder')}
                placeholderTextColor={Colors.outlineVariant}
                value={childParentSearch}
                onChangeText={setChildParentSearch}
                autoCapitalize="words"
              />
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
              {(() => {
                const filtered = allContacts.filter((c) => c.relation !== 'pet' && c.relation !== 'child_of' && (!childParentSearch.trim() || c.name.toLowerCase().includes(childParentSearch.toLowerCase())));
                return (
                  <>
                    {filtered.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={{ paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                        onPress={() => {
                          setChildParentContactId(c.id);
                          setChildParentName(c.name);
                          setShowChildParentPicker(false);
                        }}
                        activeOpacity={0.75}
                      >
                        <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: Colors.onSurface, flex: 1 }}>{c.name}</Text>
                        <Text style={{ color: Colors.primary, fontSize: 13 }}>{t('contactNew.chooseArrow')}</Text>
                      </TouchableOpacity>
                    ))}
                    {filtered.length === 0 && (
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', paddingVertical: 16, fontStyle: 'italic' }}>
                        {t('contactNew.noContactFound')}
                      </Text>
                    )}
                    {/* Créer un nouveau contact parent */}
                    <TouchableOpacity
                      style={{ marginTop: 16, backgroundColor: Colors.primary + '15', borderRadius: 12, borderWidth: 1.5, borderColor: Colors.primary + '40', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                      onPress={() => {
                        setShowChildParentPicker(false);
                        router.push('/(app)/contacts/new' as never);
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={{ fontSize: 20 }}>➕</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 14, color: Colors.primary }}>
                          {t('contactNew.createParentContact')}
                        </Text>
                        <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 }}>
                          {t('contactNew.createParentContactHint')}
                        </Text>
                      </View>
                      <Text style={{ color: Colors.primary, fontSize: 16 }}>›</Text>
                    </TouchableOpacity>
                  </>
                );
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Bottom sheet photo ── */}
      <Modal visible={showAvatarPicker} transparent animationType="slide" onRequestClose={() => setShowAvatarPicker(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} activeOpacity={1} onPress={() => setShowAvatarPicker(false)}>
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12, paddingBottom: 36 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.outlineVariant, alignSelf: 'center', marginBottom: 4 }} />
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18, color: Colors.onSurface, textAlign: 'center' }}>{t('contactNew.photoModalTitle')}</Text>
            <TouchableOpacity onPress={pickFromCamera} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 28 }}>📸</Text>
              <View>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: Colors.onSurface }}>{t('contactNew.takePhotoTitle')}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant }}>{t('contactNew.takePhotoSub')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickFromGallery} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 28 }}>🖼️</Text>
              <View>
                <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 15, color: Colors.onSurface }}>{t('contactNew.pickGalleryTitle')}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: Colors.onSurfaceVariant }}>{t('contactNew.pickGallerySub')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAvatarPicker(false)} activeOpacity={0.8} style={{ alignItems: 'center', paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.outlineVariant }}>
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: Colors.onSurfaceVariant }}>{t('contactNew.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const compoundStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: 24,
    padding: 24, width: '100%', gap: 10,
  },
  title: {
    fontFamily: 'BeVietnamPro_800ExtraBold',
    fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center',
  },
  sub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm, color: Colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 20, marginBottom: 4,
  },
  choiceBtn: {
    borderWidth: 1.5, borderRadius: Radii.xl,
    paddingVertical: 12, paddingHorizontal: 16,
    alignItems: 'center', gap: 2,
  },
  bothBtn: {},
  choiceName: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base,
  },
  choiceDate: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm },
});

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    flex: 1,
    textAlign: 'center',
    marginTop: 4,
  },
  topbarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  saveBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: C.onPrimary,
  },

  content: { padding: Spacing[5], paddingBottom: 20 },

  avatarPickerWrap: { alignItems: 'center', marginTop: Spacing[3], marginBottom: Spacing[2], gap: 6 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2, borderColor: C.primaryContainer,
  },
  avatarImg: { width: 80, height: 80 },
  avatarInitials: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['3xl'], color: C.primary },
  avatarCameraBtn: {
    position: 'absolute', bottom: 0, right: -2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  avatarHint: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },

  labelWrap: {
    borderLeftWidth: 2,
    borderLeftColor: C.primary,
    paddingLeft: 8,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  label: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
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

  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    overflow: 'visible',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.primaryContainer,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  pickerOk: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
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
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  relationEmoji: { fontSize: 16 },
  relationLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  relationLabelActive: { color: Colors.white },

  petHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    fontStyle: 'italic',
  },
  sublabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing[3],
    marginTop: -Spacing[2],
  },
  channelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  channelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  channelBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  channelEmoji: { fontSize: 16 },
  channelLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  channelLabelActive: { color: Colors.white },

  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  familyLinkBox: {
    marginTop: Spacing[3],
    backgroundColor: C.primaryContainer + '60',
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 10,
  },
  familyLinkBoxRequired: {
    borderWidth: 1.5,
    borderColor: Colors.primary + '80',
  },
  familyLinkTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  familyLinkRequired: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 11,
    color: Colors.primary,
    backgroundColor: C.primaryContainer,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  familyLinkChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBtn: {
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  tagBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  tagLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant,
  },
  tagLabelActive: { color: Colors.white },

  petList: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
    marginBottom: 8,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: Spacing[3],
  },
  petRowEmoji: { fontSize: 20 },
  petRowName: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  petRowArrow: { fontSize: 22, color: Colors.onSurfaceVariant },
  petDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainerHighest,
    marginLeft: Spacing[3],
  },
  addPetBtn: {
    borderWidth: 1.5,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addPetBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
  },
  petHintText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },

  civiliteRow: { flexDirection: 'row', gap: 10 },
  civiliteBtn: {
    paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: Radii.full,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  civiliteBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
  civiliteBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  civiliteBtnTextActive: { color: Colors.white },

  submitBar: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    paddingBottom: Spacing[5],
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHighest,
  },
  submitBtn: {
    paddingVertical: 15,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    alignItems: 'center',
  },
  submitBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: C.onPrimary,
  },
  });
}
