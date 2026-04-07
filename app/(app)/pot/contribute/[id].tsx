import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';
import { usePot } from '../../../../src/hooks/usePot';
import { createPaymentIntent } from '../../../../src/services/pot.service';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../../src/constants/theme';

const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

export default function ContributeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { data: pot } = usePot(id ?? null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parsedAmount = parseFloat(amountStr.replace(',', '.'));
  const isValid = name.trim() && email.trim().includes('@') && parsedAmount >= 1;

  const contact = pot?.contact as { name?: string } | undefined;
  const remaining = pot ? Math.max(pot.target_amount - pot.current_amount, 0) : 0;

  const handleContribute = async () => {
    if (!isValid || !pot) return;
    setIsLoading(true);
    try {
      const amountCents = Math.round(parsedAmount * 100);

      const { client_secret } = await createPaymentIntent({
        pot_id: pot.id,
        contributor_name: name.trim(),
        contributor_email: email.trim(),
        amount_cents: amountCents,
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: client_secret,
        merchantDisplayName: 'Confettis & Cake',
        defaultBillingDetails: { name: name.trim(), email: email.trim() },
        appearance: {
          colors: { primary: Colors.primary },
        },
      });

      if (initError) throw new Error(initError.message);

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Paiement échoué', presentError.message);
        }
        return;
      }

      // Succès
      Alert.alert(
        '🎉 Merci !',
        `Votre contribution de ${parsedAmount.toFixed(2)} € a bien été enregistrée.`,
        [{ text: 'Super !', onPress: () => router.back() }],
      );
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!pot) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Contribuer</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Info pot ──────────────────────────────── */}
        <View style={styles.potCard}>
          <Text style={styles.potEmoji}>🎁</Text>
          <View style={styles.potInfo}>
            <Text style={styles.potTitle}>{pot.title}</Text>
            <Text style={styles.potFor}>Pour {contact?.name ?? '—'}</Text>
          </View>
          <View style={styles.potRemaining}>
            <Text style={styles.potRemainingAmount}>{remaining.toFixed(0)} €</Text>
            <Text style={styles.potRemainingLabel}>restants</Text>
          </View>
        </View>

        {/* ── Montant ───────────────────────────────── */}
        <Text style={styles.label}>Votre contribution *</Text>
        <View style={styles.presetRow}>
          {PRESET_AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.presetBtn, parsedAmount === a && styles.presetBtnActive]}
              onPress={() => setAmountStr(String(a))}
            >
              <Text style={[styles.presetBtnText, parsedAmount === a && styles.presetBtnTextActive]}>
                {a} €
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.amountInputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={amountStr}
            onChangeText={setAmountStr}
            placeholder="Montant libre"
            placeholderTextColor={Colors.outlineVariant}
            keyboardType="decimal-pad"
          />
          <View style={styles.euroTag}>
            <Text style={styles.euroTagText}>€</Text>
          </View>
        </View>
        <Text style={styles.hint}>Montant minimum : 1 €</Text>

        {/* ── Identité ──────────────────────────────── */}
        <Text style={styles.label}>Votre prénom / nom *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Jean Dupont"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Votre email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="jean.dupont@email.com"
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* ── Sécurité Stripe ───────────────────────── */}
        <View style={styles.secureRow}>
          <Text style={styles.secureEmoji}>🔒</Text>
          <Text style={styles.secureText}>
            Paiement sécurisé par Stripe. Vos données ne sont jamais stockées sur nos serveurs.
          </Text>
        </View>

        {/* ── CTA ───────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.ctaBtn, (!isValid || isLoading) && { opacity: 0.45 }]}
          onPress={handleContribute}
          disabled={!isValid || isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {isLoading
              ? 'Traitement...'
              : isValid
              ? `💳 Payer ${parsedAmount.toFixed(2)} €`
              : '💳 Contribuer'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant },

  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: Colors.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },

  content: { padding: Spacing[4], paddingBottom: 80 },
  label: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant, marginTop: Spacing[4], marginBottom: Spacing[2],
  },

  potCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: Radii.xl, padding: Spacing[4],
    marginBottom: Spacing[2], ...Shadows.sm,
  },
  potEmoji: { fontSize: 36 },
  potInfo: { flex: 1 },
  potTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
  potFor: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, marginTop: 2 },
  potRemaining: { alignItems: 'flex-end' },
  potRemainingAmount: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: Colors.primary },
  potRemainingLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  presetRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing[3] },
  presetBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Radii.lg,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white, alignItems: 'center',
  },
  presetBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  presetBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  presetBtnTextActive: { color: Colors.white },

  amountInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  euroTag: {
    width: 44, height: 48, borderRadius: Radii.md,
    backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  euroTagText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.primary },

  hint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 6 },

  input: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.primaryContainer,
    borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: Spacing[3],
    fontSize: Typography.md, fontFamily: 'BeVietnamPro_400Regular', color: Colors.onSurface,
  },

  secureRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginTop: Spacing[5], padding: Spacing[3],
    backgroundColor: Colors.surfaceContainerLow, borderRadius: Radii.lg,
  },
  secureEmoji: { fontSize: 18 },
  secureText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, flex: 1, lineHeight: 18 },

  ctaBtn: {
    marginTop: Spacing[6], paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: Colors.primary, alignItems: 'center', ...Shadows.lg,
  },
  ctaBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },
});
