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
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

// ── Feature comparison ─────────────────────────────────────────────────────────
function getFeatures(t: TFunction): { label: string; free: string | boolean; essentiel: string | boolean; premium: string | boolean }[] {
  return [
    { label: t('premium.features.fullMode'),         free: false,            essentiel: false,                       premium: true },
    { label: t('premium.features.aiCreations'),       free: '5',              essentiel: '10',                        premium: t('premium.unlimited') },
    { label: t('premium.features.occasions'),         free: '2',              essentiel: t('premium.allFem', { count: 8 }),  premium: t('premium.allFem', { count: 8 }) },
    { label: t('premium.features.formats'),           free: '2',              essentiel: t('premium.allMasc', { count: 4 }), premium: t('premium.allMasc', { count: 4 }) },
    { label: t('premium.features.tones'),             free: '2',              essentiel: t('premium.allFem', { count: 5 }),  premium: t('premium.allFem', { count: 5 }) },
    { label: t('premium.features.ads'),                free: t('common.yes'), essentiel: t('common.no'),              premium: t('common.no') },
    { label: t('premium.features.activePots'),        free: '1',              essentiel: '3',                         premium: t('premium.unlimited') },
    { label: t('premium.features.history'),           free: false,            essentiel: true,                        premium: true },
    { label: t('premium.features.studioQr'),          free: false,            essentiel: false,                       premium: true },
    { label: t('premium.features.aiPriority'),        free: false,            essentiel: false,                       premium: true },
    { label: t('premium.features.prioritySupport'),   free: false,            essentiel: false,                       premium: true },
  ];
}

// ── Pricing plans ──────────────────────────────────────────────────────────────
function getPlans(t: TFunction) {
  return [
    {
      id: 'essentiel',
      label: t('premium.planEssentiel'),
      price: '2,49 €',
      period: t('premium.perMonth'),
      badge: null,
      color: '#9b59b6',
      priceId: 'price_essentiel_249',
    },
    {
      id: 'monthly',
      label: t('premium.planPremium'),
      price: '4,99 €',
      period: t('premium.perMonth'),
      badge: null,
      color: '#c97d10',
      priceId: 'price_monthly_499',
    },
    {
      id: 'yearly',
      label: t('premium.planPremium'),
      price: '34,99 €',
      period: t('premium.perYear'),
      badge: '🎉 −42 %',
      color: '#c97d10',
      priceId: 'price_yearly_3499',
    },
  ];
}

function FeatureRow({
  label, free, essentiel, premium,
}: { label: string; free: string | boolean; essentiel: string | boolean; premium: string | boolean }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const fmt = (v: string | boolean) => typeof v === 'boolean' ? (v ? '✓' : '—') : v;
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureFree}>{fmt(free)}</Text>
      <Text style={styles.featureEssentiel}>{fmt(essentiel)}</Text>
      <Text style={styles.featurePremium}>{fmt(premium)}</Text>
    </View>
  );
}

export default function PremiumScreen() {
  const { t } = useTranslation();
  const C = useColors();
  const router = useRouter();
  const { profile } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<'essentiel' | 'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = profile?.plan === 'premium';
  const isEssentiel = profile?.plan === 'essentiel';
  const hasActivePlan = isPremium || isEssentiel;

  const FEATURES = useMemo(() => getFeatures(t), [t]);
  const PLANS = useMemo(() => getPlans(t), [t]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      Alert.alert(
        t('premium.comingSoonTitle'),
        t('premium.comingSoonMessage'),
        [{ text: t('common.ok') }],
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{t('premium.topbarTitle')}</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero ─────────────────────────────────── */}
        <LinearGradient
          colors={isPremium ? ['#fdd34d', '#c97d10'] : isEssentiel ? ['#c39bd3', '#9b59b6'] : [C.primary, C.primaryContainer]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>{isPremium ? '⭐' : isEssentiel ? '✦' : '🚀'}</Text>
          <Text style={styles.heroTitle}>Confettis & Cake</Text>
          <Text style={styles.heroSub}>
            {isPremium
              ? t('premium.heroSubPremium')
              : isEssentiel
              ? t('premium.heroSubEssentiel')
              : t('premium.heroSubDefault')}
          </Text>
        </LinearGradient>

        {/* ── Plans tarifaires ──────────────────────── */}
        {!hasActivePlan && (
          <>
            <Text style={styles.sectionTitle}>{t('premium.chooseYourPlan')}</Text>
            <View style={styles.plansRow}>
              {PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && { borderColor: plan.color, backgroundColor: plan.color + '15' },
                  ]}
                  onPress={() => setSelectedPlan(plan.id as 'essentiel' | 'monthly' | 'yearly')}
                  activeOpacity={0.85}
                >
                  {plan.badge && (
                    <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}
                  <Text style={[styles.planLabel, selectedPlan === plan.id && { color: plan.color }]}>
                    {plan.label}
                  </Text>
                  <Text style={[styles.planPrice, selectedPlan === plan.id && { color: plan.color }]}>
                    {plan.price}
                  </Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                  {selectedPlan === plan.id && (
                    <View style={[styles.planCheck, { backgroundColor: plan.color }]}>
                      <Text style={styles.planCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── Comparatif ───────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('premium.compareTitle')}</Text>
        <View style={styles.compareTable}>
          {/* Header */}
          <View style={[styles.featureRow, styles.featureHeader]}>
            <Text style={[styles.featureLabel, styles.featureHeaderLabel]}> </Text>
            <Text style={[styles.featureFree, styles.featureHeaderCol]}>{t('premium.free')}</Text>
            <Text style={[styles.featureEssentiel, styles.featureHeaderCol, { color: '#9b59b6' }]}>{t('premium.planEssentiel')}</Text>
            <Text style={[styles.featurePremium, styles.featureHeaderCol, { color: Colors.secondary }]}>{t('premium.planPremium')}</Text>
          </View>
          {FEATURES.map((f, i) => (
            <View key={i}>
              <FeatureRow {...f} />
              {i < FEATURES.length - 1 && <View style={styles.featureDivider} />}
            </View>
          ))}
        </View>

        {/* ── CTA ──────────────────────────────────── */}
        {!hasActivePlan && (
          <>
            <TouchableOpacity
              style={[
                styles.ctaBtn,
                isLoading && { opacity: 0.5 },
                selectedPlan === 'essentiel' && { backgroundColor: '#9b59b6' },
              ]}
              onPress={handleSubscribe}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>
                {isLoading
                  ? t('premium.processing')
                  : t('premium.chooseBtn', { label: PLANS.find((p) => p.id === selectedPlan)?.label, price: PLANS.find((p) => p.id === selectedPlan)?.price })}
              </Text>
            </TouchableOpacity>
            <Text style={styles.legalText}>{t('premium.legalText')}</Text>
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
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },

  content: { paddingBottom: 80 },

  hero: {
    margin: Spacing[4], borderRadius: Radii['2xl'],
    padding: Spacing[6], alignItems: 'center', gap: 8, ...Shadows.lg,
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.white, textAlign: 'center' },
  heroSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.onSurfaceVariant,
    marginTop: Spacing[4], marginBottom: Spacing[3], paddingHorizontal: Spacing[4],
  },

  // Plans
  plansRow: { flexDirection: 'row', paddingHorizontal: Spacing[4], gap: 8 },
  planCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing[3], alignItems: 'center', gap: 3,
    borderWidth: 2, borderColor: Colors.surfaceContainerHighest,
    ...Shadows.sm, position: 'relative',
  },
  planBadge: {
    position: 'absolute', top: -11,
    paddingVertical: 2, paddingHorizontal: 8,
    borderRadius: Radii.full,
  },
  planBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 9, color: Colors.white },
  planLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 6 },
  planPrice: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
  planPeriod: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 9, color: Colors.onSurfaceVariant },
  planCheck: {
    marginTop: 4, width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  planCheckText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },

  // Compare table
  compareTable: {
    marginHorizontal: Spacing[4], backgroundColor: Colors.white,
    borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.sm,
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 11, paddingHorizontal: Spacing[3],
  },
  featureHeader: {
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
  },
  featureLabel: {
    flex: 1.6, fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 11, color: Colors.onSurface,
  },
  featureHeaderLabel: { fontFamily: 'BeVietnamPro_700Bold' },
  featureFree: {
    flex: 0.85, textAlign: 'center',
    fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: Colors.onSurfaceVariant,
  },
  featureEssentiel: {
    flex: 0.95, textAlign: 'center',
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: '#9b59b6',
  },
  featurePremium: {
    flex: 1, textAlign: 'center',
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11, color: Colors.secondary,
  },
  featureHeaderCol: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 11 },
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
