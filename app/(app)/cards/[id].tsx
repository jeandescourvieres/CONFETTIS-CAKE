import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions, ActivityIndicator, Share, Alert, Image,
} from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../../src/services/supabase';
import { Config } from '../../../src/constants/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCardTemplate } from '../../../src/hooks/useCards';
import { useAuthStore } from '../../../src/stores/authStore';
import { useContact } from '../../../src/hooks/useContacts';
import { CardComposer } from '../../../src/components/cards/CardComposer';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useCreateStore } from '../../../src/stores/createStore';
import { useColors } from '../../../src/hooks/useColors';
import { extractFirstName } from '../../../src/utils/nameHelpers';

const { width: W } = Dimensions.get('window');

// Hauteur de la carte : format portrait 9/16, ajustée à la largeur disponible
const CARD_W = W;
const CARD_H = CARD_W * (16 / 9);

// Tailles de photo — mêmes valeurs que docs/card.html (sizePx)
const PHOTO_SIZE_PX: Record<'sm' | 'md' | 'lg', number> = { sm: 66, md: 90, lg: 140 };

export default function CardPreviewScreen() {
  const C = useColors();
  const router = useRouter();
  const { id, contactName: paramName, contactId, senderName: paramSender } = useLocalSearchParams<{
    id: string;
    contactName?: string;
    contactId?: string;
    senderName?: string;
  }>();
  const [senderName, setSenderName] = useState(paramSender ?? '');
  const [cardMusic, setCardMusic] = useState<string>('aucune');
  const [cardAnim, setCardAnim]   = useState<string>('confetti');
  const [morseMode,    setMorseMode]    = useState<boolean>(false);
  const [cardMsgBg,    setCardMsgBg]    = useState<string>('');
  const [cardTitle,    setCardTitle]    = useState<string>('');
  const [cardBg,       setCardBg]       = useState<string>('');

  const CARD_ANIMS = [
    { key: 'confetti',  emoji: '🎊', label: 'Particules'       },
    { key: 'hearts',    emoji: '❤️', label: 'Cœurs'            },
    { key: 'stars',     emoji: '⭐', label: 'Étoiles'           },
    { key: 'snow',      emoji: '❄️', label: 'Flocons'           },
    { key: 'balloons',  emoji: '🎈', label: 'Ballons'           },
    { key: 'flowers',   emoji: '🌸', label: 'Pétales'           },
    { key: 'fireworks', emoji: '🎆', label: 'Feux d\'artifice'  },
  ];
  const profile = useAuthStore((s) => s.profile);
  const [cardPhotoUri,   setCardPhotoUri]   = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [cardPhotoSize,  setCardPhotoSize]  = useState<'sm'|'md'|'lg'>('md');
  const [cardPhotoShape, setCardPhotoShape] = useState<'round'|'square'>('round');

  const CARD_MUSIC = [
    { key: 'aucune',     emoji: '🔇', label: 'Aucune'     },
    { key: 'festif',     emoji: '🎉', label: 'Festive'    },
    { key: 'piano',      emoji: '🎹', label: 'Piano'      },
    { key: 'guitare',    emoji: '🎸', label: 'Guitare'    },
    { key: 'romantique', emoji: '💕', label: 'Romantique' },
    { key: 'tendre',     emoji: '💛', label: 'Tendre'     },
    { key: 'jazz',       emoji: '🎷', label: 'Jazz'       },
    { key: 'classique',  emoji: '🎻', label: 'Classique'  },
  ];

  const { data: template, isLoading, isError } = useCardTemplate(id);
  const { data: contactData } = useContact(contactId ?? '');
  const [recipientName, setRecipientName] = useState(() => extractFirstName(paramName ?? ''));
  const [nameEditing, setNameEditing] = useState(false);
  const [recipientAge, setRecipientAge] = useState<number | undefined>(() => {
    if (!contactId) return undefined;
    return undefined;
  });
  const generatedMessage = useCreateStore((s) => s.generatedContent);
  const [personalMessage, setPersonalMessage] = useState(() => generatedMessage?.trim() ?? '');

  // Resynchronise destinataire/expéditeur si on revient sur cet écran (même template) pour un autre contact
  React.useEffect(() => {
    setRecipientName(extractFirstName(paramName ?? ''));
    setSenderName(paramSender ?? '');
  }, [contactId, paramName, paramSender]);

  // Pré-remplit le prénom depuis le contact si le param URL était vide
  React.useEffect(() => {
    if (!recipientName && contactData?.name) {
      setRecipientName(extractFirstName(contactData.name));
    }
  }, [contactData]);

  // Calcule l'âge depuis la date de naissance du contact
  React.useEffect(() => {
    if (!contactData?.birthday) return;
    const birth = new Date(contactData.birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    setRecipientAge(age);
  }, [contactData?.birthday]);

  const uploadCardPhoto = async (localUri: string): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Non authentifié');
    const ext = localUri.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const path = `${session.user.id}/card-${Date.now()}.${ext}`;
    const formData = new FormData();
    formData.append('file', { uri: localUri, type: contentType, name: `photo.${ext}` } as any);
    const response = await fetch(
      `${Config.supabaseUrl}/storage/v1/object/contact-avatars/${path}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': Config.supabaseAnonKey,
          'x-upsert': 'true',
        },
        body: formData,
      }
    );
    if (!response.ok) throw new Error(`Upload échoué (${response.status})`);
    const { data: { publicUrl } } = supabase.storage.from('contact-avatars').getPublicUrl(path);
    return publicUrl;
  };

  const handlePickCardPhoto = useCallback(() => {
    Alert.alert('Photo sur la carte', 'Choisir depuis…', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: '📷 Prendre un selfie',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return;
          const result = await ImagePicker.launchCameraAsync({ cameraType: ImagePicker.CameraType.front, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!result.canceled && result.assets[0]) {
            setIsUploadingPhoto(true);
            try { const url = await uploadCardPhoto(result.assets[0].uri); setCardPhotoUri(url); }
            catch (e) { Alert.alert('Erreur upload', e instanceof Error ? e.message : String(e)); }
            finally { setIsUploadingPhoto(false); }
          }
        },
      },
      {
        text: '🖼️ Choisir dans la galerie',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') return;
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
          if (!result.canceled && result.assets[0]) {
            setIsUploadingPhoto(true);
            try { const url = await uploadCardPhoto(result.assets[0].uri); setCardPhotoUri(url); }
            catch (e) { Alert.alert('Erreur upload', e instanceof Error ? e.message : String(e)); }
            finally { setIsUploadingPhoto(false); }
          }
        },
      },
      {
        text: '👤 Ma photo de profil',
        onPress: () => { if (profile?.avatar_url) setCardPhotoUri(profile.avatar_url); },
      },
      {
        text: '📸 Photo du contact',
        onPress: () => { if (contactData?.avatar_url) setCardPhotoUri(contactData.avatar_url); },
      },
      cardPhotoUri ? { text: '🗑 Supprimer la photo', style: 'destructive' as const, onPress: () => setCardPhotoUri(null) } : null,
    ].filter(Boolean) as any);
  }, [profile, contactData, cardPhotoUri]);

  const buildShareText = useCallback(() => {
    const params = new URLSearchParams({ id });
    if (recipientName) params.set('name', recipientName);
    if (recipientAge)  params.set('age', String(recipientAge));
    if (personalMessage.trim()) params.set('msg', personalMessage.trim());
    if (senderName.trim()) params.set('from', senderName.trim());
    if (cardMusic && cardMusic !== 'aucune') params.set('bg', cardMusic);
    if (cardPhotoUri) {
      params.set('photo', cardPhotoUri);
      params.set('photo_size', cardPhotoSize);
      params.set('photo_shape', cardPhotoShape);
    }
    if (cardAnim) params.set('anim', cardAnim);
    if (morseMode) params.set('morse', '1');
    if (cardMsgBg) params.set('msg_bg', cardMsgBg);
    if (cardBg) params.set('card_bg', cardBg);
    if (cardTitle.trim()) params.set('title', cardTitle.trim());
    const cardLink = `https://jeandescourvieres.github.io/CONFETTIS-CAKE/card.html?${params.toString()}`;
    if (morseMode) {
      return `📡 ${recipientName ? recipientName + ', tu' : 'Tu'} as reçu un message secret en code Morse !\n\nSauras-tu le décoder ? 🔐\n\n🔗 ${cardLink}\n\n— Créé avec Confettis & Cake 🎂`;
    }
    return `🎉 Une carte animée pour toi${recipientName ? `, ${recipientName}` : ''} !\n\n🔗 ${cardLink}\n\n— Créé avec Confettis & Cake 🎂`;
  }, [recipientName, recipientAge, id, generatedMessage, senderName, cardPhotoUri, cardPhotoSize, cardPhotoShape, cardMusic, cardAnim, morseMode, personalMessage, cardMsgBg, cardTitle, cardBg]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: buildShareText() });
    } catch { /* annulé */ }
  }, [buildShareText]);

  const handleWhatsApp = useCallback(async () => {
    const text = encodeURIComponent(buildShareText());
    const url = `whatsapp://send?text=${text}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      await Share.share({ message: buildShareText() });
    }
  }, [buildShareText]);

  const handleCreateMessage = useCallback(() => {
    if (!id) return;
    const store = useCreateStore.getState();
    store.setCardTemplateId(id);
    // Pré-remplir le contact si on vient d'une fiche contact ou du flow IA
    // (le store a peut-être déjà été pré-rempli par ai-create, on ne l'écrase que si on a les infos)
    if (contactId && recipientName && !store.contactId) {
      store.setContact(contactId, recipientName, 'friend');
    }
    router.push('/(app)/create' as never);
  }, [router, id, contactId, recipientName]);

  const styles = useMemo(() => makeStyles(C), [C]);

  // ── Loading / Error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={C.primary} size="large" />
        <Text style={styles.loadingText}>Chargement de la carte…</Text>
      </SafeAreaView>
    );
  }

  if (isError || !template) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Carte introuvable</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {/* ── Aperçu thématique ─────────────────────────────────────────────── */}
      <SafeAreaView style={styles.cardContainer} edges={['top']}>
        <LinearGradient
          colors={(() => {
            if (cardBg === 'violet')    return ['#4A148C','#7B1FA2'];
            if (cardBg === 'bleu')      return ['#0D47A1','#1976D2'];
            if (cardBg === 'rose')      return ['#880E4F','#E91E63'];
            if (cardBg === 'rouge')     return ['#B71C1C','#E53935'];
            if (cardBg === 'vert')      return ['#1B5E20','#388E3C'];
            if (cardBg === 'or')        return ['#E65100','#F9A825'];
            if (cardBg === 'turquoise') return ['#00695C','#00897B'];
            if (cardBg === 'jaune')     return ['#FBC02D','#FFEE58'];
            if (cardBg === 'ardoise')   return ['#37474F','#546E7A'];
            if (cardBg === 'noir')      return ['#1A1A1A','#2D2D2D'];
            const occ = template.occasion;
            if (occ === 'christmas')  return ['#1B5E20','#388E3C'];
            if (occ === 'valentines' || occ === 'wedding' || occ === 'mothersday') return ['#880E4F','#E91E63'];
            if (occ === 'newyear')    return ['#1A237E','#3949AB'];
            if (occ === 'birth')      return ['#0D47A1','#1976D2'];
            if (occ === 'graduation') return ['#E65100','#FF9800'];
            return ['#6A1B9A','#9C27B0'];
          })()}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.cardPreview}
        >
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={[styles.backLinkText, { color: '#fff' }]}>‹ Retour</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 8 }}>
            {/* Photo ou emoji */}
            {cardPhotoUri ? (
              <Image
                source={{ uri: cardPhotoUri }}
                style={{
                  width: PHOTO_SIZE_PX[cardPhotoSize],
                  height: PHOTO_SIZE_PX[cardPhotoSize],
                  borderRadius: cardPhotoShape === 'square' ? 14 : PHOTO_SIZE_PX[cardPhotoSize] / 2,
                  borderWidth: 3,
                  borderColor: 'rgba(255,255,255,0.8)',
                }}
              />
            ) : (
              <Text style={{ fontSize: 40 }}>
                {({ birthday:'🎂', nameday:'🌸', valentines:'💕', wedding:'💍', birth:'👶', graduation:'🎓', mothersday:'💐', fathersday:'👔', christmas:'🎄', newyear:'🎆', support:'🤗', thanks:'🙏', birthday_late:'⏰', courage:'🍀', weekend:'😎' } as Record<string,string>)[template.occasion] ?? '🎉'}
              </Text>
            )}
            {/* Titre perso, sinon prefix du template */}
            {!!(cardTitle.trim() || template.text_style?.config?.prefix) && (
              <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
                {cardTitle.trim() || template.text_style?.config?.prefix}
              </Text>
            )}
            {/* Prénom en grand */}
            <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: recipientName ? 28 : 16, color: '#fff', textAlign: 'center' }}>
              {recipientName || '✏️ Saisis le prénom ci-dessous'}
            </Text>
            {/* Message personnel en direct */}
            {!!personalMessage.trim() && (
              <View style={{ backgroundColor: ({ violet:'rgba(74,20,140,0.78)', bleu:'rgba(13,71,161,0.78)', rose:'rgba(136,14,79,0.78)', rouge:'rgba(183,28,28,0.78)', vert:'rgba(27,94,32,0.78)', or:'rgba(230,81,0,0.78)', turquoise:'rgba(0,105,92,0.78)', jaune:'rgba(251,192,45,0.78)', ardoise:'rgba(55,71,79,0.78)', noir:'rgba(26,26,26,0.82)' } as Record<string,string>)[cardMsgBg] ?? 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 8, marginTop: 2, maxWidth: '100%' }}>
                <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 16 }} numberOfLines={3}>
                  {personalMessage.trim()}
                </Text>
                {!!senderName.trim() && (
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'right', marginTop: 4 }}>
                    — {senderName.trim()}
                  </Text>
                )}
              </View>
            )}
            {!personalMessage.trim() && (
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                L'aperçu se met à jour en temps réel ↓
              </Text>
            )}
          </View>
        </LinearGradient>
      </SafeAreaView>

      {/* ── Panneau bas ──────────────────────────────────────────────────────── */}
      <ScrollView style={[styles.panel, { flex: 1 }]} contentContainerStyle={{ gap: Spacing[6], paddingBottom: 200 }} showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">

        {/* Explication hero */}
        <LinearGradient
          colors={['#7C3AED', '#9b6bb5', '#c084fc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoCard}
        >
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 20, color: '#fff', marginBottom: 4 }}>
            🎴 Message festif animé
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 20, marginBottom: 10 }}>
            {'Ton proche reçoit un lien. En l\'ouvrant, il découvre une animation festive personnalisée — sans avoir besoin de l\'appli. ✨'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {[
              { e: '🎊', l: 'Animation' },
              { e: '✍️', l: 'Titre libre' },
              { e: '💬', l: 'Message perso' },
            ].map((f) => (
              <View key={f.l} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.lg, padding: 8, alignItems: 'center', gap: 3 }}>
                <Text style={{ fontSize: 18 }}>{f.e}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 9, color: '#fff', textAlign: 'center' }}>{f.l}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { e: '📸', l: 'Photo (taille + forme)' },
              { e: '🎨', l: 'Fond coloré' },
              { e: '🎵', l: 'Musique / 📡 Morse' },
            ].map((f) => (
              <View key={f.l} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.lg, padding: 8, alignItems: 'center', gap: 3 }}>
                <Text style={{ fontSize: 18 }}>{f.e}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 9, color: '#fff', textAlign: 'center' }}>{f.l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Champ prénom */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>Prénom du destinataire</Text>
          <Text style={styles.nameSub}>Affiché en grand sur la carte animée — l'aperçu s'active dès qu'il est rempli 👁</Text>
          <TextInput
            style={[styles.nameInput, nameEditing && styles.nameInputFocused]}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Ex : Marie"
            placeholderTextColor={Colors.onSurfaceVariant}
            onFocus={() => setNameEditing(true)}
            onBlur={() => setNameEditing(false)}
            maxLength={40}
            returnKeyType="done"
            autoCorrect={false}
          />
        </View>

        {/* Champ "De la part de" */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>De la part de (optionnel)</Text>
          <Text style={styles.nameSub}>Signature affichée en bas du message — peut être un surnom, un animal, un groupe…</Text>
          <TextInput
            style={styles.nameInput}
            value={senderName}
            onChangeText={setSenderName}
            placeholder="Ex : Lucas, Nemo le poisson rouge…"
            placeholderTextColor={Colors.onSurfaceVariant}
            maxLength={40}
            returnKeyType="done"
            autoCorrect={false}
          />
        </View>

        {/* Titre personnalisé */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>✍️ Titre de la carte (optionnel)</Text>
          <Text style={styles.nameSub}>Remplace le texte d'en-tête par défaut (ex : "Pour toi", "Félicitations !", "Bon courage"…) — max. 50 caractères</Text>
          <TextInput
            style={styles.nameInput}
            value={cardTitle}
            onChangeText={setCardTitle}
            placeholder="Ex : Joyeux Noël, Félicitations, Bon courage…"
            placeholderTextColor={Colors.onSurfaceVariant}
            maxLength={50}
            returnKeyType="done"
            autoCorrect={false}
          />
        </View>

        {/* Champ âge */}
        {(template.mode === 'age' || template.mode === 'age_name') && (
          <View style={styles.nameRow}>
            <Text style={styles.nameLabel}>Âge (chiffre affiché sur la carte)</Text>
            <TextInput
              style={styles.nameInput}
              value={recipientAge !== undefined ? String(recipientAge) : ''}
              onChangeText={(v) => { const n = parseInt(v, 10); setRecipientAge(isNaN(n) ? undefined : n); }}
              placeholder="Ex : 30"
              placeholderTextColor={Colors.onSurfaceVariant}
              keyboardType="number-pad"
              maxLength={3}
              returnKeyType="done"
            />
          </View>
        )}

        {/* Message personnel */}
        <View style={styles.nameRow}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={styles.nameLabel}>💬 Message personnel (optionnel)</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: Colors.onSurfaceVariant }}>
              {personalMessage.length}/500
            </Text>
          </View>
          <Text style={styles.nameSub} numberOfLines={0}>{'Texte affiché dans un encadré en bas de la carte — max. 500 caractères (environ 5 lignes). Le fond s\'adapte automatiquement à l\'animation, ou choisis une couleur ci-dessous.'}</Text>
          <TextInput
            style={[styles.nameInput, { height: 100, textAlignVertical: 'top', paddingTop: 10, paddingBottom: 10 }]}
            value={personalMessage}
            onChangeText={setPersonalMessage}
            placeholder={'Ex : Je pense fort à toi aujourd\'hui 💛\nMax. 500 caractères — environ 5 lignes.'}
            placeholderTextColor={Colors.onSurfaceVariant}
            maxLength={500}
            multiline
          />
        </View>

        {/* Couleur du fond de la carte */}
        <View style={[styles.nameRow, { gap: 8 }]}>
          <Text style={styles.nameLabel}>🖼️ Fond de la carte</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[
              { key: '',          label: 'Défaut',    color: '#9b59ff' },
              { key: 'violet',    label: 'Violet',    color: '#9b59ff' },
              { key: 'bleu',      label: 'Bleu',      color: '#1976d2' },
              { key: 'rose',      label: 'Rose',      color: '#e91e8c' },
              { key: 'rouge',     label: 'Rouge',     color: '#e53935' },
              { key: 'vert',      label: 'Forêt',     color: '#388e3c' },
              { key: 'or',        label: 'Or',        color: '#f9a825' },
              { key: 'turquoise', label: 'Turquoise', color: '#00897b' },
              { key: 'jaune',     label: 'Jaune',      color: '#FFEE58' },
              { key: 'ardoise',   label: 'Ardoise',   color: '#546e7a' },
              { key: 'noir',      label: 'Noir',      color: '#2d2d2d' },
            ].map((c) => (
              <TouchableOpacity
                key={c.key}
                onPress={() => setCardBg(c.key)}
                style={{ alignItems: 'center', gap: 3 }}
                activeOpacity={0.8}
              >
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.color, borderWidth: cardBg === c.key ? 3 : 1.5, borderColor: cardBg === c.key ? C.primary : 'rgba(0,0,0,0.15)', ...Shadows.sm }} />
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 9, color: cardBg === c.key ? C.primary : Colors.onSurface }}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Couleur du fond du message */}
        {!!personalMessage.trim() && (
          <View style={[styles.nameRow, { gap: 8 }]}>
            <Text style={styles.nameLabel}>🎨 Fond du message</Text>
            <Text style={styles.nameSub}>Choisis la couleur de l'encadré — "Auto" l'adapte au thème d'animation (rouge pour cœurs, bleu nuit pour étoiles, etc.)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {([
                { key: '',          color: '#9b59ff', label: 'Auto'      },
                { key: 'violet',    color: '#9b59ff', label: 'Violet'    },
                { key: 'bleu',      color: '#1976d2', label: 'Bleu'      },
                { key: 'rose',      color: '#e91e8c', label: 'Rose'      },
                { key: 'rouge',     color: '#e53935', label: 'Rouge'     },
                { key: 'vert',      color: '#388e3c', label: 'Forêt'     },
                { key: 'or',        color: '#f9a825', label: 'Or'        },
                { key: 'turquoise', color: '#00897b', label: 'Turquoise' },
                { key: 'jaune',     color: '#FFEE58', label: 'Jaune'      },
                { key: 'ardoise',   color: '#546e7a', label: 'Ardoise'   },
                { key: 'noir',      color: '#2d2d2d', label: 'Noir'      },
              ] as const).map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[
                    { alignItems: 'center', gap: 4, paddingVertical: 7, paddingHorizontal: 10, borderRadius: Radii.lg, borderWidth: 2 },
                    cardMsgBg === c.key
                      ? { borderColor: C.primary, backgroundColor: Colors.primaryContainer }
                      : { borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow },
                  ]}
                  onPress={() => setCardMsgBg(c.key)}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c.color, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 10, color: cardMsgBg === c.key ? C.primary : Colors.onSurface }}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Photo */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>📸 Photo (optionnel)</Text>
          <Text style={styles.nameSub}>Apparaît en médaillon sur la carte — selfie, photo de profil ou photo du contact. Choisis ensuite sa taille et sa forme.</Text>
          <TouchableOpacity
            style={[styles.nameInput, { height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }]}
            onPress={handlePickCardPhoto}
            activeOpacity={0.8}
            disabled={isUploadingPhoto}
          >
            {isUploadingPhoto ? (
              <ActivityIndicator size="small" color={C.primary} />
            ) : cardPhotoUri ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                <Image source={{ uri: cardPhotoUri }} style={{ width: 34, height: 34, borderRadius: 17 }} />
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: C.primary, flex: 1 }}>Photo sélectionnée ✓</Text>
                <TouchableOpacity
                  onPress={() => setCardPhotoUri(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={{ fontSize: 18, color: Colors.onSurfaceVariant }}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>📷 Selfie · Galerie · Mon profil · Contact</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Taille + forme de la photo */}
        {!!cardPhotoUri && (
          <View style={[styles.nameRow, { gap: 10 }]}>
            <Text style={styles.nameLabel}>Taille de la photo</Text>
            <Text style={styles.nameSub}>Petite (discrète), Moyenne (équilibrée), Grande (très visible)</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {([
                { key: 'sm', emoji: '🔹', label: 'Petite' },
                { key: 'md', emoji: '🔷', label: 'Moyenne' },
                { key: 'lg', emoji: '🔶', label: 'Grande' },
              ] as const).map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[
                    { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: Radii.lg, borderWidth: 1.5 },
                    cardPhotoSize === s.key
                      ? { backgroundColor: C.primary, borderColor: C.primary }
                      : { backgroundColor: Colors.surfaceContainerLow, borderColor: Colors.outlineVariant },
                  ]}
                  onPress={() => setCardPhotoSize(s.key)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 14 }}>{s.emoji}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: cardPhotoSize === s.key ? '#fff' : Colors.onSurface }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.nameLabel, { marginTop: 4 }]}>Forme de la photo</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {([
                { key: 'round', emoji: '⭕', label: 'Ronde' },
                { key: 'square', emoji: '⬜', label: 'Carrée' },
              ] as const).map((sh) => (
                <TouchableOpacity
                  key={sh.key}
                  style={[
                    { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: Radii.lg, borderWidth: 1.5 },
                    cardPhotoShape === sh.key
                      ? { backgroundColor: C.primary, borderColor: C.primary }
                      : { backgroundColor: Colors.surfaceContainerLow, borderColor: Colors.outlineVariant },
                  ]}
                  onPress={() => setCardPhotoShape(sh.key)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 14 }}>{sh.emoji}</Text>
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: cardPhotoShape === sh.key ? '#fff' : Colors.onSurface }}>{sh.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sélecteur musique */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>🎵 Musique de fond (optionnel)</Text>
          <Text style={styles.nameSub}>Joue en boucle à l'ouverture de la carte — démarre au premier tap sur mobile si bloquée par le navigateur</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {CARD_MUSIC.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[
                  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radii.full, borderWidth: 1.5 },
                  cardMusic === m.key
                    ? { backgroundColor: C.primary, borderColor: C.primary }
                    : { backgroundColor: Colors.surfaceContainerLow, borderColor: Colors.outlineVariant },
                ]}
                onPress={() => setCardMusic(m.key)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 13 }}>{m.emoji}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: cardMusic === m.key ? '#fff' : Colors.onSurface }}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sélecteur animation */}
        <View style={styles.nameRow}>
          <Text style={styles.nameLabel}>🎊 Animation</Text>
          <Text style={styles.nameSub}>Particules animées en arrière-plan — le fond du message s'adapte automatiquement à ce choix</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {CARD_ANIMS.map((a) => (
              <TouchableOpacity
                key={a.key}
                style={[
                  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radii.full, borderWidth: 1.5 },
                  cardAnim === a.key
                    ? { backgroundColor: C.primary, borderColor: C.primary }
                    : { backgroundColor: Colors.surfaceContainerLow, borderColor: Colors.outlineVariant },
                ]}
                onPress={() => setCardAnim(a.key)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 13 }}>{a.emoji}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: cardAnim === a.key ? '#fff' : Colors.onSurface }}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mode Morse */}
        <TouchableOpacity
          style={[styles.morseToggle, morseMode && { backgroundColor: '#1a1a2e', borderColor: '#00ff88' }]}
          onPress={() => setMorseMode(!morseMode)}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 20 }}>📡</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.morseToggleTitle, morseMode && { color: '#00ff88' }]}>
              Mode Morse {morseMode ? '— ACTIVÉ' : ''}
            </Text>
            <Text style={[styles.morseToggleSub, morseMode && { color: '#00cc66' }]}>
              {morseMode
                ? (personalMessage.trim()
                    ? '· − · · ·  Activé ! Le destinataire voit le code, écoute les bips, et peut révéler le message caché d\'un tap 🤫'
                    : '⚠️ Tape un message personnel ci-dessus pour activer le Morse')
                : 'Ton message personnel est converti en points/tirets. Le destinataire entend les bips, déchiffre le code — et peut révéler le texte original d\'un tap 🔐'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Boutons d'action */}
        <View style={styles.actions}>
          {/* Aperçu — visible seulement si prénom renseigné */}
          {!!recipientName.trim() && (
            <TouchableOpacity
              style={[styles.whatsappBtn, { backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: C.primary }]}
              onPress={() => {
                const urlParams = new URLSearchParams({ id });
                if (recipientName) urlParams.set('name', recipientName);
                if (recipientAge) urlParams.set('age', String(recipientAge));
                if (personalMessage.trim()) urlParams.set('msg', personalMessage.trim());
                if (senderName.trim()) urlParams.set('from', senderName.trim());
                if (cardMusic && cardMusic !== 'aucune') urlParams.set('bg', cardMusic);
                if (cardAnim && cardAnim !== 'auto') urlParams.set('anim', cardAnim);
                if (cardPhotoUri) {
                  urlParams.set('photo', cardPhotoUri);
                  urlParams.set('photo_size', cardPhotoSize);
                  urlParams.set('photo_shape', cardPhotoShape);
                }
                if (cardMsgBg) urlParams.set('msg_bg', cardMsgBg);
                if (cardTitle.trim()) urlParams.set('title', cardTitle.trim());
                if (morseMode) urlParams.set('morse', '1');
                if (cardBg) urlParams.set('card_bg', cardBg);
                WebBrowser.openBrowserAsync(`https://jeandescourvieres.github.io/CONFETTIS-CAKE/card.html?${urlParams.toString()}`);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.whatsappBtnText, { color: C.primary }]}>👁 Voir l'aperçu</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
            <Text style={styles.whatsappBtnText}>💬 Envoyer via WhatsApp</Text>
          </TouchableOpacity>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
              <Text style={styles.shareBtnText}>Partager ›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.msgBtn} onPress={handleCreateMessage} activeOpacity={0.85}>
              <Text style={styles.msgBtnText}>✦ Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },

  // ── Aperçu ──
  cardContainer: {
    height: Math.round(Dimensions.get('window').height * 0.22),
  },
  cardPreview: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    // Simulé par backgroundColor semi-transparent
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingBottom: 12,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ── Panneau bas ──
  panel: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    ...Shadows.lg,
  },
  infoCard: {
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: Spacing[3],
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 0,
    borderColor: C.primary + '30',
  },
  infoText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: C.onSurfaceVariant,
    lineHeight: 19,
  },
  previewBtn: {
    alignSelf: 'flex-start',
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 8,
    paddingHorizontal: Spacing[4],
  },
  previewBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fff',
  },
  nameRow: {
    gap: 6,
  },
  morseToggle: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing[3],
    backgroundColor: Colors.surfaceContainerLow, borderRadius: Radii.lg,
    padding: Spacing[4], borderWidth: 1.5, borderColor: Colors.outlineVariant,
  },
  morseToggleTitle: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface,
  },
  morseToggleSub: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, lineHeight: 18, marginTop: 2,
  },
  nameLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  nameSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginTop: -2,
  },
  nameInput: {
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing[4],
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
  },
  nameInputFocused: {
    borderColor: C.primary,
    backgroundColor: Colors.white,
  },

  messageBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: Spacing[3],
    gap: 4,
  },
  messageBoxLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  messageBoxText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },

  actions: {
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  whatsappBtn: {
    height: 52,
    backgroundColor: '#25D366',
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  whatsappBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  shareBtn: {
    flex: 1,
    height: 48,
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  msgBtn: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  msgBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },

  // ── Loading / Error ──
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  errorEmoji: { fontSize: 48 },
  errorTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  backButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: C.primary,
    borderRadius: Radii.full,
  },
  backButtonText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  });
}
