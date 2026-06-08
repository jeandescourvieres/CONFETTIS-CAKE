import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStripeGate } from '../../../../src/hooks/useStripeGate';
import { LinearGradient } from 'expo-linear-gradient';
import { usePot } from '../../../../src/hooks/usePot';
import { createPaymentIntent } from '../../../../src/services/pot.service';
import { useAuthStore } from '../../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../../src/constants/theme';
import { useColors } from '../../../../src/hooks/useColors';
import { HelpModal } from '../../../../src/components/ui/HelpModal';

// Montants suggérés rapides
const QUICK_AMOUNTS = [5, 10, 20, 30, 50];

// ── Écran de confirmation après paiement ─────────────────────────────────────
function SuccessView({ contributorName, amount, email, onClose }: {
  contributorName: string;
  amount: number;
  email: string;
  onClose: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.successScroll}>
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.successHero}
        >
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Merci {contributorName} !</Text>
          <Text style={styles.successAmount}>{amount.toFixed(2)} €</Text>
          <Text style={styles.successSub}>Contribution enregistrée avec succès</Text>
        </LinearGradient>

        {/* Justificatif */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>📧 Ton justificatif comptable</Text>
          <Text style={styles.receiptText}>
            Un reçu de paiement officiel vient d'être envoyé automatiquement à :
          </Text>
          <Text style={styles.receiptEmail}>{email}</Text>
          <Text style={styles.receiptInfo}>
            Ce reçu Stripe mentionne le montant, la date et la nature du paiement. Il est valable comme justificatif comptable pour un remboursement professionnel ou personnel.
          </Text>
          <View style={styles.receiptBadge}>
            <Text style={styles.receiptBadgeText}>🔒 Paiement sécurisé par Stripe</Text>
          </View>
        </View>

        {/* Info organisateur */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💜</Text>
          <Text style={styles.infoText}>
            L'organisateur de la cagnotte sera notifié de ta participation. Ton nom apparaîtra dans la liste des contributeurs.
          </Text>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.closeBtnText}>Fermer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ContributeScreen() {
  const C = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripeGate();

  const { data: pot } = usePot(id ?? null);
  const { profile } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Pré-remplissage dès que le profil est disponible
  useEffect(() => {
    if (!profile) return;
    if (profile.full_name) {
      const parts = profile.full_name.trim().split(' ');
      setFirstName(prev => prev || (parts[0] ?? ''));
      setLastName(prev => prev || parts.slice(1).join(' '));
    }
    if (profile.email) {
      setEmail(prev => prev || profile.email!);
    }
  }, [profile]);
  const [amountInput, setAmountInput] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  const parsedAmount = parseFloat(amountInput.replace(',', '.'));
  const isValid = fullName.length >= 2 && email.includes('@') && parsedAmount >= 1;

  const styles = useMemo(() => makeStyles(C), [C]);

  const handlePay = async () => {
    if (!isValid || !id) return;
    setIsPaying(true);
    try {
      // 1. Créer l'intention de paiement côté serveur
      const { client_secret } = await createPaymentIntent({
        pot_id: id,
        contributor_name: fullName,
        contributor_email: email.trim().toLowerCase(),
        amount_cents: Math.round(parsedAmount * 100),
      });

      // 2. Initialiser la feuille de paiement Stripe
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: client_secret,
        merchantDisplayName: 'Confettis & Cake',
        defaultBillingDetails: {
          name: fullName,
          email: email.trim().toLowerCase(),
        },
        appearance: {
          colors: {
            primary: Colors.primary,
            background: Colors.background,
            componentBackground: Colors.white,
            componentText: Colors.onSurface,
          },
        },
      });
      if (initError) throw new Error(initError.message);

      // 3. Présenter la feuille Stripe
      const { error: payError } = await presentPaymentSheet();
      if (payError) {
        if (payError.code !== 'Canceled') {
          Alert.alert('Paiement échoué', payError.message);
        }
        return;
      }

      // 4. Succès
      setSuccess(true);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Paiement impossible.');
    } finally {
      setIsPaying(false);
    }
  };

  if (success) {
    return (
      <SuccessView
        contributorName={fullName}
        amount={parsedAmount}
        email={email.trim().toLowerCase()}
        onClose={() => router.back()}
      />
    );
  }

  const contact = pot?.contact as { name?: string } | undefined;
  const remaining = pot ? Math.max(pot.target_amount - pot.current_amount, 0) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle} numberOfLines={1}>
          {pot?.title ?? 'Contribuer'}
        </Text>
        <HelpModal
          title="Contribuer à une cagnotte"
          content={
            "💳 COMMENT ÇA MARCHE ?\n\n" +
            "1. Saisis ton prénom et nom\n" +
            "2. Renseigne ton email — c'est là que tu recevras ton justificatif\n" +
            "3. Choisis un montant (à partir de 1 €)\n" +
            "4. Appuie sur 'Payer' — une fenêtre Stripe sécurisée s'ouvre\n\n" +
            "📧 TON JUSTIFICATIF COMPTABLE\n" +
            "Dès que ton paiement est validé, Stripe t'envoie automatiquement un reçu officiel par email. Ce reçu mentionne :\n" +
            "• Ton nom\n" +
            "• Le montant payé\n" +
            "• La date et l'heure\n" +
            "• La nature de la transaction\n\n" +
            "Il est valable comme justificatif comptable (note de frais, remboursement professionnel ou personnel).\n\n" +
            "⚠️ Garde cet email — Confettis & Cake ne peut pas réémettre les reçus.\n\n" +
            "🔒 Paiement 100% sécurisé par Stripe. Tes données bancaires ne sont jamais stockées par l'appli."
          }
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          {pot && (
            <LinearGradient
              colors={['#9b6bb5', '#5e2d80']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <Text style={styles.heroEmoji}>🎁</Text>
              <Text style={styles.heroTitle}>{pot.title}</Text>
              <Text style={styles.heroPour}>Pour {contact?.name ?? '—'}</Text>
              {remaining !== null && remaining > 0 && (
                <Text style={styles.heroRemaining}>Il manque encore {remaining.toFixed(2)} €</Text>
              )}
            </LinearGradient>
          )}

          {/* Justificatif info (avant paiement) */}
          <View style={styles.receiptInfoBanner}>
            <Text style={styles.receiptInfoEmoji}>📧</Text>
            <Text style={styles.receiptInfoText}>
              Tu recevras automatiquement un reçu de paiement par email (via Stripe). Ce reçu est valable comme justificatif comptable.
            </Text>
          </View>

          {/* Formulaire */}
          <Text style={styles.sectionLabel}>Tes coordonnées</Text>

          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Jean"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Dupont"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Ton adresse email * (pour le reçu)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="jean.dupont@gmail.com"
            placeholderTextColor={Colors.outlineVariant}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.sectionLabel}>Montant de ta contribution</Text>

          {/* Montants rapides */}
          <View style={styles.quickAmountsRow}>
            {QUICK_AMOUNTS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[
                  styles.quickAmountBtn,
                  parsedAmount === a && styles.quickAmountBtnActive,
                ]}
                onPress={() => setAmountInput(String(a))}
              >
                <Text style={[
                  styles.quickAmountText,
                  parsedAmount === a && styles.quickAmountTextActive,
                ]}>
                  {a} €
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Montant libre */}
          <View style={styles.amountRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={amountInput}
              onChangeText={setAmountInput}
              placeholder="Autre montant"
              placeholderTextColor={Colors.outlineVariant}
              keyboardType="decimal-pad"
            />
            <View style={styles.euroTag}>
              <Text style={styles.euroTagText}>€</Text>
            </View>
          </View>
          {parsedAmount >= 1 && (
            <Text style={styles.amountHint}>
              Ta contribution : {parsedAmount.toFixed(2)} €
            </Text>
          )}

          {/* Info Stripe */}
          <View style={styles.stripeInfo}>
            <Text style={styles.stripeInfoText}>
              🔒 Paiement sécurisé par Stripe. Confettis & Cake ne stocke jamais tes données bancaires.
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.payBtn, (!isValid || isPaying) && { opacity: 0.45 }]}
            onPress={handlePay}
            disabled={!isValid || isPaying}
            activeOpacity={0.85}
          >
            <Text style={styles.payBtnText}>
              {isPaying
                ? '⏳ Traitement...'
                : isValid
                ? `💳 Payer ${parsedAmount.toFixed(2)} €`
                : '💳 Contribuer'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  topbarTitle: { flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center' },

  content: { padding: Spacing[4], paddingBottom: 80 },

  hero: {
    borderRadius: Radii['2xl'], padding: Spacing[5],
    alignItems: 'center', gap: 6, marginBottom: Spacing[4], ...Shadows.md,
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.white, textAlign: 'center' },
  heroPour: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: 'rgba(255,255,255,0.85)' },
  heroRemaining: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm,
    color: '#fdd34d', marginTop: 4,
  },

  // Justificatif banner
  receiptInfoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#e8f5e9', borderRadius: Radii.lg,
    borderLeftWidth: 4, borderLeftColor: '#4CAF50',
    padding: Spacing[3], marginBottom: Spacing[4],
  },
  receiptInfoEmoji: { fontSize: 18 },
  receiptInfoText: {
    flex: 1, fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm, color: '#2E7D32', lineHeight: 20,
  },

  sectionLabel: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing[4], marginBottom: Spacing[2],
  },
  fieldLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm,
    color: Colors.onSurface, marginBottom: 6, marginTop: Spacing[2],
  },
  input: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: C.primaryContainer,
    borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: Spacing[3],
    fontSize: Typography.md, fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurface,
  },

  nameRow: { flexDirection: 'row', gap: 10 },

  // Quick amounts
  quickAmountsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  quickAmountBtn: {
    paddingVertical: 10, paddingHorizontal: 18,
    borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  quickAmountBtnActive: { borderColor: C.primary, backgroundColor: C.primaryContainer },
  quickAmountText: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  quickAmountTextActive: { color: C.primary },

  amountRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  euroTag: {
    width: 44, height: 48, borderRadius: Radii.md,
    backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  euroTagText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: C.primary },
  amountHint: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm,
    color: C.primary, marginTop: 6,
  },

  stripeInfo: {
    marginTop: Spacing[4], padding: Spacing[3],
    backgroundColor: Colors.surfaceContainerLow, borderRadius: Radii.md,
  },
  stripeInfoText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  payBtn: {
    marginTop: Spacing[5], paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: C.primary, alignItems: 'center', ...Shadows.lg,
  },
  payBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },

  // ── Success screen ──────────────────────────────────────────────────────────
  successScroll: { padding: Spacing[4], paddingBottom: 80 },
  successHero: {
    borderRadius: Radii['2xl'], padding: Spacing[6],
    alignItems: 'center', gap: 8, marginBottom: Spacing[5], ...Shadows.lg,
  },
  successEmoji: { fontSize: 52 },
  successTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.white },
  successAmount: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: '#fdd34d' },
  successSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: 'rgba(255,255,255,0.9)' },

  receiptCard: {
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: '#4CAF5040',
    padding: Spacing[5], gap: 10, marginBottom: Spacing[4], ...Shadows.sm,
  },
  receiptTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: '#2E7D32' },
  receiptText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
    color: Colors.onSurface, lineHeight: 22,
  },
  receiptEmail: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md,
    color: Colors.primary,
  },
  receiptInfo: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: Colors.onSurfaceVariant, lineHeight: 20,
    borderTopWidth: 0.5, borderTopColor: Colors.surfaceContainer,
    paddingTop: 10,
  },
  receiptBadge: {
    alignSelf: 'flex-start', backgroundColor: '#e8f5e9',
    paddingVertical: 4, paddingHorizontal: 12, borderRadius: Radii.full,
  },
  receiptBadgeText: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: '#2E7D32',
  },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: Spacing[4], backgroundColor: C.primaryContainer + '50',
    borderRadius: Radii.lg, marginBottom: Spacing[4],
  },
  infoEmoji: { fontSize: 20 },
  infoText: {
    flex: 1, fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md, color: C.primary, lineHeight: 22,
  },

  closeBtn: {
    paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: C.primary, alignItems: 'center', ...Shadows.md,
  },
  closeBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },
  });
}
