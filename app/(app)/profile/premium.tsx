import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

// ── Feature comparison ─────────────────────────────────────────────────────────
const FEATURES: { label: string; free: string | boolean; premium: string | boolean }[] = [
  { label: 'Messages IA par mois', free: '5', premium: 'Illimités' },
  { label: 'Occasions', free: 'Anniversaire & Fête', premium: 'Toutes (8 occasions)' },
  { label: 'Formats', free: 'Message & Humour', premium: 'Chanson, Poème, Message, Humour' },
  { label: 'Tonalités', free: '2', premium: 'Toutes (5)' },
  { label: 'Studio d\'édition', free: false, premium: true },
  { label: 'QR Code de partage', free: false, premium: true },
  { label: 'Cagnottes actives', free: '1', premium: 'Illimitées' },
  { label: 'Priorité serveur IA', free: false, premium: true },
  { label: 'Historique illimité', free: false, premium: true },
  { label: 'Support prioritaire', free: false, premium: true },
];

// ── Pricing plans ──────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'monthly',
    label: 'Mensuel',
    price: '4,99 €',
    period: 'par mois',
    badge: null,
    priceId: 'price_monthly_499',
  },
  {
    id: 'yearly',
    label: 'Annuel',
    price: '34,99 €',
    period: 'par an',
    badge: '🎉 −42 %',
    priceId: 'price_yearly_3499',
  },
];

function FeatureRow({ label, free, premium }: { label: string; free: string | boolean; premium: string | boolean }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureFree}>
        {typeof free === 'boolean' ? (free ? '✓' : '—') : free}
      </Text>
      <Text style={styles.featurePremium}>
        {typeof premium === 'boolean' ? (premium ? '✓' : '—') : premium}
      </Text>
    </View>
  );
}

export default function PremiumScreen() {
  const C = useColors();
  const router = useRouter();
  const { profile } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = profile?.plan === 'premium';

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // TODO Phase 7 : intégration Stripe Billing / In-App Purchase
      Alert.alert(
        '🚧 Bientôt disponible',
        "L'abonnement Premium sera disponible lors du lancement officiel de l'app.",
        [{ text: 'OK' }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Premium ⭐</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ─────────────────────────────────── */}
        <LinearGradient
          colors={['#fdd34d', '#c97d10']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.heroTitle}>Confettis & Cake Premium</Text>
          <Text style={styles.heroSub}>
            {isPremium
              ? 'Tu bénéficies déjà du plan Premium 🎉'
              : 'Créez des messages magiques sans limite'}
          </Text>
        </LinearGradient>

        {/* ── Plans tarifaires ──────────────────────── */}
        {!isPremium && (
          <>
            <Text style={styles.sectionTitle}>Choisis ton plan</Text>
            <View style={styles.plansRow}>
              {PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.planCardActive,
                  ]}
                  onPress={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                  activeOpacity={0.85}
                >
                  {plan.badge && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}
                  <Text style={[styles.planLabel, selectedPlan === plan.id && styles.planLabelActive]}>
                    {plan.label}
                  </Text>
                  <Text style={[styles.planPrice, selectedPlan === plan.id && styles.planPriceActive]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.planPeriod, selectedPlan === plan.id && styles.planPeriodActive]}>
                    {plan.period}
                  </Text>
                  {selectedPlan === plan.id && (
                    <View style={styles.planCheck}>
                      <Text style={styles.planCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── Comparatif ───────────────────────────── */}
        <Text style={styles.sectionTitle}>Comparatif des plans</Text>
        <View style={styles.compareTable}>
          {/* Header */}
          <View style={[styles.featureRow, styles.featureHeader]}>
            <Text style={[styles.featureLabel, styles.featureHeaderLabel]}>Fonctionnalité</Text>
            <Text style={[styles.featureFree, styles.featureHeaderCol]}>Gratuit</Text>
            <Text style={[styles.featurePremium, styles.featureHeaderCol, styles.featureHeaderPremium]}>Premium</Text>
          </View>
          {FEATURES.map((f, i) => (
            <View key={i}>
              <FeatureRow {...f} />
              {i < FEATURES.length - 1 && <View style={styles.featureDivider} />}
            </View>
          ))}
        </View>

        {/* ── CTA ──────────────────────────────────── */}
        {!isPremium && (
          <>
            <TouchableOpacity
              style={[styles.ctaBtn, isLoading && { opacity: 0.5 }]}
              onPress={handleSubscribe}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>
                {isLoading ? 'Traitement...' : `✨ Passer à Premium — ${PLANS.find((p) => p.id === selectedPlan)?.price}`}
              </Text>
            </TouchableOpacity>
            <Text style={styles.legalText}>
              Abonnement sans engagement. Résiliable à tout moment. Prix TTC.
            </Text>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: C.primary, lineHeight: 32 },
  topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },

  content: { paddingBottom: 80 },

  hero: {
    margin: Spacing[4], borderRadius: Radii['2xl'],
    padding: Spacing[6], alignItems: 'center', gap: 8, ...Shadows.lg,
  },
  heroEmoji: { fontSize: 52 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.white, textAlign: 'center' },
  heroSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.onSurfaceVariant,
    marginTop: Spacing[4], marginBottom: Spacing[3], paddingHorizontal: Spacing[4],
  },

  // Plans
  plansRow: { flexDirection: 'row', paddingHorizontal: Spacing[4], gap: 12 },
  planCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing[4], alignItems: 'center', gap: 4,
    borderWidth: 2, borderColor: Colors.surfaceContainerHighest,
    ...Shadows.sm, position: 'relative',
  },
  planCardActive: { borderColor: Colors.secondary, backgroundColor: Colors.secondaryContainer + '30' },
  planBadge: {
    position: 'absolute', top: -12,
    paddingVertical: 3, paddingHorizontal: 10,
    borderRadius: Radii.full, backgroundColor: Colors.secondary,
  },
  planBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: Colors.white },
  planLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurfaceVariant, marginTop: 8 },
  planLabelActive: { color: Colors.secondary },
  planPrice: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.onSurface },
  planPriceActive: { color: Colors.secondary },
  planPeriod: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
  planPeriodActive: { color: Colors.onSurfaceVariant },
  planCheck: {
    marginTop: 6, width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
  },
  planCheckText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  // Compare table
  compareTable: {
    marginHorizontal: Spacing[4], backgroundColor: Colors.white,
    borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.sm,
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: Spacing[3],
  },
  featureHeader: {
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
  },
  featureLabel: {
    flex: 1.4, fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm, color: Colors.onSurface,
  },
  featureHeaderLabel: { fontFamily: 'BeVietnamPro_700Bold', color: Colors.onSurface },
  featureFree: {
    flex: 1, textAlign: 'center',
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant,
  },
  featurePremium: {
    flex: 1.1, textAlign: 'center',
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.secondary,
  },
  featureHeaderCol: { fontFamily: 'BeVietnamPro_700Bold', color: Colors.onSurfaceVariant },
  featureHeaderPremium: { color: Colors.secondary },
  featureDivider: { height: 0.5, backgroundColor: Colors.surfaceContainer, marginLeft: Spacing[3] },

  ctaBtn: {
    marginHorizontal: Spacing[4], marginTop: Spacing[5],
    paddingVertical: 17, borderRadius: Radii.full,
    backgroundColor: Colors.secondary, alignItems: 'center', ...Shadows.lg,
  },
  ctaBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },
  legalText: {
    textAlign: 'center', paddingHorizontal: Spacing[6], marginTop: 10,
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.outlineVariant,
  },
  });
}
