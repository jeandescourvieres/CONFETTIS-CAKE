import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useContacts } from '../../../src/hooks/useContacts';
import { useAuthStore } from '../../../src/stores/authStore';
import { supabase } from '../../../src/services/supabase';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { HelpModal } from '../../../src/components/ui/HelpModal';

// ── Étapes ───────────────────────────────────────────────────
type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Message',
  2: 'Adresse',
  3: 'Aperçu',
};

// ── Composant principal ───────────────────────────────────────
export default function PostcardScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const params = useLocalSearchParams<{ contactId?: string; message?: string }>();
  const { data: contacts = [] } = useContacts();
  const profile = useAuthStore((s) => s.profile);

  // Step
  const [step, setStep] = useState<Step>(1);

  // Step 1 — Message
  const [message, setMessage] = useState(params.message ?? '');
  const [senderName, setSenderName] = useState(
    profile ? (profile as { full_name?: string }).full_name ?? '' : ''
  );

  // Step 2 — Adresse
  const [selectedContactId, setSelectedContactId] = useState<string | null>(params.contactId ?? null);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientLine1, setRecipientLine1] = useState('');
  const [recipientLine2, setRecipientLine2] = useState('');
  const [recipientZip, setRecipientZip] = useState('');
  const [recipientCity, setRecipientCity] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('FR');

  // Submit
  const [isSending, setIsSending] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  // Auto-remplir le nom du destinataire depuis le contact
  const handleSelectContact = (contactId: string) => {
    const c = contacts.find((x) => x.id === contactId);
    setSelectedContactId(contactId);
    if (c && !recipientName) setRecipientName(c.name);
    setShowContactPicker(false);
  };

  // Validations par étape
  const step1Valid = message.trim().length >= 10;
  const step2Valid =
    recipientName.trim() &&
    recipientLine1.trim() &&
    recipientZip.trim().length >= 4 &&
    recipientCity.trim();

  const handleNext = () => {
    if (step === 1 && step1Valid) setStep(2);
    else if (step === 2 && step2Valid) setStep(3);
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else setStep((step - 1) as Step);
  };

  const handleOrder = async () => {
    if (!step2Valid || isSending) return;
    setIsSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Non authentifié');

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-postcard`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact_id: selectedContactId ?? null,
            message: message.trim(),
            sender_name: senderName.trim(),
            recipient_name: recipientName.trim(),
            recipient_line1: recipientLine1.trim(),
            recipient_line2: recipientLine2.trim() || null,
            recipient_zip: recipientZip.trim(),
            recipient_city: recipientCity.trim(),
            recipient_country: recipientCountry,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur lors de la commande');

      setOrderDone(true);
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible d\'envoyer la carte postale.');
    } finally {
      setIsSending(false);
    }
  };

  // ── Écran confirmation ─────────────────────────────────────
  if (orderDone) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successWrap}>
          <Text style={styles.successEmoji}>💌</Text>
          <Text style={styles.successTitle}>Carte postale commandée !</Text>
          <Text style={styles.successSub}>
            Ton message est en route vers {recipientName}.{'\n'}
            Délai de livraison estimé : 5 à 7 jours ouvrés.
          </Text>
          <View style={styles.successInfoCard}>
            <Text style={styles.successInfoText}>
              📬 Une confirmation t'a été envoyée par email.{'\n'}
              💳 Montant débité : <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold' }}>3,49 €</Text> TTC.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => router.replace('/(app)' as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.successBtnText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ── Topbar ─────────────────────────────────── */}
        <View style={styles.topbar}>
          <TouchableOpacity onPress={handleBack} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Carte postale</Text>
          <HelpModal
            title="Carte postale physique"
            content={
              "💌 COMMENT ÇA MARCHE ?\n" +
              "Tu rédiges un message personnalisé, tu renseignes l'adresse du destinataire, et on imprime + expédie une vraie carte postale en papier premium.\n\n" +
              "✍️ LE MESSAGE\n" +
              "Ton message s'imprimera au verso de la carte, avec ton prénom en bas. Au recto, un beau visuel Confettis & Cake.\n\n" +
              "📦 DÉLAI & PRIX\n" +
              "• Prix : 3,49 € TTC (port inclus)\n" +
              "• Délai : 5 à 7 jours ouvrés\n" +
              "• Disponible pour la France et l'international\n\n" +
              "🌍 INTERNATIONAL\n" +
              "Pour une adresse hors France, change le code pays dans le champ correspondant (FR, BE, CH, DE...)\n\n" +
              "🔒 Paiement 100% sécurisé via Stripe."
            }
          />
        </View>

        {/* ── Indicateur d'étapes ─────────────────────── */}
        <View style={styles.stepsRow}>
          {([1, 2, 3] as Step[]).map((s) => (
            <React.Fragment key={s}>
              <TouchableOpacity
                style={[styles.stepDot, step >= s && { backgroundColor: C.primary }]}
                onPress={() => { if (s < step) setStep(s); }}
                disabled={s >= step}
              >
                <Text style={[styles.stepDotText, step >= s && { color: '#fff' }]}>{s}</Text>
              </TouchableOpacity>
              <View style={[styles.stepLine, s < 3 && step > s && { backgroundColor: C.primary }]} />
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.stepLabel}>{STEP_LABELS[step]}</Text>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ══ ÉTAPE 1 — Message ══════════════════════════ */}
          {step === 1 && (
            <>
              <View style={styles.introCard}>
                <Text style={styles.introTitle}>✍️ Ton message</Text>
                <Text style={styles.introText}>
                  Écris ce qui sera imprimé au verso de la carte. Sois toi-même — c'est ce qui touchera vraiment.
                </Text>
              </View>

              {/* Message */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Message *</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Cher(e) [Prénom],&#10;&#10;Je voulais juste te dire..."
                placeholderTextColor={Colors.outlineVariant}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                autoCapitalize="sentences"
              />
              <Text style={styles.charCount}>{message.length} caractères (max recommandé : 300)</Text>

              {/* Signature */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Signature (ton prénom)</Text>
              </View>
              <TextInput
                style={styles.input}
                value={senderName}
                onChangeText={setSenderName}
                placeholder="Ex: Marie"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />

              {/* Aperçu carte */}
              <View style={styles.postcardPreview}>
                <View style={styles.postcardFront}>
                  <Text style={styles.postcardFrontEmoji}>🎉</Text>
                  <Text style={styles.postcardFrontBrand}>Confettis & Cake</Text>
                </View>
                <View style={styles.postcardBack}>
                  <Text style={styles.postcardBackMessage} numberOfLines={6}>
                    {message || 'Ton message apparaîtra ici...'}
                  </Text>
                  {senderName ? (
                    <Text style={styles.postcardBackSender}>— {senderName}</Text>
                  ) : null}
                  <View style={styles.postcardBackDivider} />
                  <View style={styles.postcardBackAddress}>
                    <Text style={styles.postcardAddressPlaceholder}>Adresse du destinataire</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* ══ ÉTAPE 2 — Adresse ══════════════════════════ */}
          {step === 2 && (
            <>
              <View style={styles.introCard}>
                <Text style={styles.introTitle}>📬 Adresse du destinataire</Text>
                <Text style={styles.introText}>
                  Renseigne l'adresse postale complète où la carte doit être livrée.
                </Text>
              </View>

              {/* Contact (optionnel) */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Contact associé (optionnel)</Text>
              </View>
              <TouchableOpacity
                style={[styles.input, styles.pickerBtn]}
                onPress={() => setShowContactPicker(!showContactPicker)}
              >
                <Text style={selectedContact ? styles.inputText : styles.inputPlaceholder}>
                  {selectedContact ? selectedContact.name : 'Associer un contact'}
                </Text>
                <Text style={styles.pickerArrow}>▾</Text>
              </TouchableOpacity>
              {showContactPicker && (
                <View style={styles.dropdown}>
                  <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                    <TouchableOpacity
                      style={styles.dropdownRow}
                      onPress={() => { setSelectedContactId(null); setShowContactPicker(false); }}
                    >
                      <Text style={styles.dropdownName}>— Aucun contact —</Text>
                    </TouchableOpacity>
                    {contacts.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.dropdownRow, selectedContactId === c.id && styles.dropdownRowActive]}
                        onPress={() => handleSelectContact(c.id)}
                      >
                        <Text style={styles.dropdownName}>{c.name}</Text>
                        <Text style={styles.dropdownRelation}>{c.relation}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Nom destinataire */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Nom complet du destinataire *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="Ex: Jean Dupont"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />

              {/* Adresse ligne 1 */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Adresse (ligne 1) *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={recipientLine1}
                onChangeText={setRecipientLine1}
                placeholder="Ex: 12 rue des Lilas"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="sentences"
              />

              {/* Adresse ligne 2 */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Complément d'adresse</Text>
              </View>
              <TextInput
                style={styles.input}
                value={recipientLine2}
                onChangeText={setRecipientLine2}
                placeholder="Ex: Bât. B, Apt 42"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="sentences"
              />

              {/* CP + Ville */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Code postal & Ville *</Text>
              </View>
              <View style={styles.zipCityRow}>
                <TextInput
                  style={[styles.input, { width: 110 }]}
                  value={recipientZip}
                  onChangeText={setRecipientZip}
                  placeholder="75001"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={recipientCity}
                  onChangeText={setRecipientCity}
                  placeholder="Paris"
                  placeholderTextColor={Colors.outlineVariant}
                  autoCapitalize="words"
                />
              </View>

              {/* Pays */}
              <View style={styles.labelWrap}>
                <Text style={styles.label}>Pays (code ISO)</Text>
              </View>
              <TextInput
                style={styles.input}
                value={recipientCountry}
                onChangeText={(v) => setRecipientCountry(v.toUpperCase())}
                placeholder="FR"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="characters"
                maxLength={2}
              />
              <Text style={styles.fieldHint}>FR = France, BE = Belgique, CH = Suisse, DE = Allemagne…</Text>
            </>
          )}

          {/* ══ ÉTAPE 3 — Aperçu & Commande ══════════════════ */}
          {step === 3 && (
            <>
              <View style={styles.introCard}>
                <Text style={styles.introTitle}>👁 Aperçu final</Text>
                <Text style={styles.introText}>
                  Vérifie bien les informations avant de confirmer ta commande.
                </Text>
              </View>

              {/* Recap message */}
              <View style={styles.recapCard}>
                <Text style={styles.recapSection}>✍️ MESSAGE</Text>
                <Text style={styles.recapContent}>{message}</Text>
                {senderName ? (
                  <Text style={[styles.recapContent, { marginTop: 6, color: C.primary }]}>
                    — {senderName}
                  </Text>
                ) : null}
              </View>

              {/* Recap adresse */}
              <View style={styles.recapCard}>
                <Text style={styles.recapSection}>📬 DESTINATAIRE</Text>
                <Text style={styles.recapContent}>{recipientName}</Text>
                <Text style={styles.recapContent}>{recipientLine1}</Text>
                {recipientLine2 ? <Text style={styles.recapContent}>{recipientLine2}</Text> : null}
                <Text style={styles.recapContent}>{recipientZip} {recipientCity}</Text>
                <Text style={styles.recapContent}>{recipientCountry}</Text>
              </View>

              {/* Prix */}
              <View style={styles.priceCard}>
                <Text style={styles.priceEmoji}>💳</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.priceTitle}>Total à régler</Text>
                  <Text style={styles.priceSub}>Impression + expédition incluses</Text>
                </View>
                <Text style={styles.priceAmount}>3,49 €</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  📦 Délai estimé : 5 à 7 jours ouvrés{'\n'}
                  🔒 Paiement sécurisé via Stripe
                </Text>
              </View>

              {/* CTA Commande */}
              <TouchableOpacity
                style={[styles.orderBtn, isSending && { opacity: 0.5 }]}
                onPress={handleOrder}
                disabled={isSending}
                activeOpacity={0.85}
              >
                {isSending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.orderBtnText}>💌 Commander — 3,49 €</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.legalNote}>
                En commandant, tu acceptes que l'adresse fournie soit transmise à notre partenaire d'impression.
              </Text>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* ── Bouton Suivant (steps 1 & 2) ─────────────── */}
        {step < 3 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[
                styles.nextBtn,
                ((step === 1 && !step1Valid) || (step === 2 && !step2Valid)) && { opacity: 0.4 },
              ]}
              onPress={handleNext}
              disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>
                {step === 1 ? 'Suivant — Adresse' : 'Suivant — Aperçu'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    topbar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: Spacing[4], paddingVertical: 12,
      borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
      backgroundColor: Colors.surfaceContainerLow,
    },
    backLink: { justifyContent: 'center', minWidth: 70 },
    backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },

    // Étapes
    stepsRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: Spacing[8], paddingTop: Spacing[4], paddingBottom: 4,
    },
    stepDot: {
      width: 32, height: 32, borderRadius: 16,
      backgroundColor: Colors.surfaceContainer,
      alignItems: 'center', justifyContent: 'center',
    },
    stepDotText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
    stepLine: { flex: 1, height: 2, backgroundColor: Colors.surfaceContainer },
    stepLabel: {
      textAlign: 'center', fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs, color: C.primary,
      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
    },

    content: { padding: Spacing[4], paddingBottom: 100 },

    introCard: {
      backgroundColor: C.primaryContainer + '60',
      borderRadius: Radii.xl, padding: Spacing[4], marginBottom: Spacing[3],
      borderLeftWidth: 4, borderLeftColor: C.primary,
    },
    introTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: C.primary, marginBottom: 6 },
    introText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface, lineHeight: 22 },

    labelWrap: {
      borderLeftWidth: 3, borderLeftColor: C.primary,
      paddingLeft: 8, marginTop: Spacing[4], marginBottom: Spacing[2],
    },
    label: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.onSurface },

    input: {
      backgroundColor: Colors.white, borderWidth: 0.5, borderColor: C.primaryContainer,
      borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: Spacing[3],
      fontSize: Typography.md, fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurface,
    },
    inputText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface },
    inputPlaceholder: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.outlineVariant },
    textArea: { height: 140, textAlignVertical: 'top', paddingTop: 10 },
    charCount: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.outlineVariant, marginTop: 4, textAlign: 'right' },
    fieldHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 4 },

    pickerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pickerArrow: { fontSize: 16, color: Colors.outlineVariant },
    dropdown: {
      backgroundColor: Colors.white, borderRadius: Radii.md,
      borderWidth: 0.5, borderColor: C.primaryContainer, marginTop: 4, ...Shadows.sm,
    },
    dropdownRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 12, paddingHorizontal: 14,
      borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainer,
    },
    dropdownRowActive: { backgroundColor: Colors.surfaceContainerLow },
    dropdownName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
    dropdownRelation: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

    zipCityRow: { flexDirection: 'row', gap: 10 },

    // Aperçu carte (step 1)
    postcardPreview: {
      flexDirection: 'row', gap: 12,
      marginTop: Spacing[5], marginBottom: Spacing[2],
    },
    postcardFront: {
      flex: 1, aspectRatio: 0.7,
      borderRadius: Radii.lg,
      backgroundColor: C.primary,
      alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: 12,
      ...Shadows.md,
    },
    postcardFrontEmoji: { fontSize: 40 },
    postcardFrontBrand: {
      fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 11,
      color: '#fff', textAlign: 'center', opacity: 0.9,
    },
    postcardBack: {
      flex: 1.3, borderRadius: Radii.lg,
      backgroundColor: Colors.white,
      padding: 12, justifyContent: 'space-between',
      borderWidth: 0.5, borderColor: C.primaryContainer,
      ...Shadows.sm,
    },
    postcardBackMessage: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: 10,
      color: Colors.onSurface, lineHeight: 15,
    },
    postcardBackSender: {
      fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 10,
      color: C.primary, marginTop: 4,
    },
    postcardBackDivider: { height: 0.5, backgroundColor: Colors.outlineVariant, marginVertical: 8 },
    postcardBackAddress: {
      backgroundColor: Colors.surfaceContainerLow,
      borderRadius: 4, padding: 6, height: 50, justifyContent: 'center',
    },
    postcardAddressPlaceholder: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: 9,
      color: Colors.outlineVariant, textAlign: 'center',
    },

    // Recap (step 3)
    recapCard: {
      backgroundColor: Colors.white, borderRadius: Radii.lg,
      borderWidth: 0.5, borderColor: C.primaryContainer,
      padding: Spacing[4], marginBottom: Spacing[3],
    },
    recapSection: {
      fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
      color: C.primary, textTransform: 'uppercase', letterSpacing: 1,
      marginBottom: 8,
    },
    recapContent: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
      color: Colors.onSurface, lineHeight: 22,
    },

    priceCard: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: C.primaryContainer + '50',
      borderRadius: Radii.lg, padding: Spacing[4],
      marginBottom: Spacing[3], borderWidth: 1, borderColor: C.primary + '40',
    },
    priceEmoji: { fontSize: 28 },
    priceTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface },
    priceSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    priceAmount: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: C.primary },

    infoCard: {
      backgroundColor: C.primaryContainer + '40',
      borderRadius: Radii.lg, padding: Spacing[4], marginBottom: Spacing[4],
    },
    infoText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface, lineHeight: 24 },

    orderBtn: {
      paddingVertical: 17, borderRadius: Radii.full,
      backgroundColor: C.primary, alignItems: 'center', ...Shadows.lg,
    },
    orderBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: '#fff' },

    legalNote: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
      color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: Spacing[4], lineHeight: 18,
    },

    bottomBar: {
      paddingHorizontal: Spacing[4], paddingVertical: 12,
      backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: Colors.surfaceContainer,
    },
    nextBtn: {
      paddingVertical: 15, borderRadius: Radii.full,
      backgroundColor: C.primary, alignItems: 'center',
    },
    nextBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: '#fff' },

    // Succès
    successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing[6], gap: 20 },
    successEmoji: { fontSize: 72 },
    successTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 28, color: Colors.onSurface, textAlign: 'center' },
    successSub: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.lg,
      color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 26,
    },
    successInfoCard: {
      backgroundColor: C.primaryContainer + '60',
      borderRadius: Radii.xl, padding: Spacing[5],
      borderWidth: 1, borderColor: C.primary + '50',
    },
    successInfoText: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
      color: Colors.onSurface, lineHeight: 26, textAlign: 'center',
    },
    successBtn: {
      marginTop: Spacing[2], paddingVertical: 15, paddingHorizontal: 40,
      borderRadius: Radii.full, backgroundColor: C.primary, ...Shadows.md,
    },
    successBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: '#fff' },
  });
}
