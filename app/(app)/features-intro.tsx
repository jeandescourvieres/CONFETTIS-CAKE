// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Sélection du mode à la première connexion
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as SecureStore from '../../src/utils/storage';
import { useAuthStore } from '../../src/stores/authStore';
import { PremiumGateModal } from '../../src/components/ui/PremiumGateModal';

const HOME_MODE_KEY       = 'cc_home_mode';
const FEATURES_INTRO_KEY  = 'cc_features_intro_v1_seen';

const APPRENTISSAGE_COLOR = '#7C3AED';
const COMPLET_COLOR       = '#F97316';

function CheckItem({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.checkRow}>
      <View style={[styles.checkCircle, { backgroundColor: color + '20', borderColor: color }]}>
        <Text style={[styles.checkIcon, { color }]}>✓</Text>
      </View>
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

export default function FeaturesIntroScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [premiumGateVisible, setPremiumGateVisible] = useState(false);

  useEffect(() => {
    // Si le mode est déjà choisi, passe directement à l'app
    SecureStore.getItemAsync(HOME_MODE_KEY).then(async (val) => {
      if (val === 'simple' || val === 'advanced') {
        await SecureStore.setItemAsync(FEATURES_INTRO_KEY, 'seen');
        router.replace('/(app)' as never);
      }
    });
  }, []);

  const choose = async (mode: 'simple' | 'advanced') => {
    if (mode === 'advanced' && profile?.plan !== 'premium') {
      setPremiumGateVisible(true);
      return;
    }
    await Promise.all([
      SecureStore.setItemAsync(HOME_MODE_KEY, mode),
      SecureStore.setItemAsync(FEATURES_INTRO_KEY, 'seen'),
    ]);
    router.replace('/(app)' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <Text style={styles.title}>{t('featuresIntro.title')}</Text>
        <Text style={styles.subtitle}>{t('featuresIntro.subtitle')}</Text>

        {/* ── Carte Mode Apprentissage ── */}
        <View style={[styles.card, styles.cardAppr]}>
          <Text style={styles.cardEmoji}>🍬</Text>
          <Text style={styles.cardMode}>{t('featuresIntro.modeLabel')}</Text>
          <Text style={[styles.cardTitle, { color: APPRENTISSAGE_COLOR }]}>{t('featuresIntro.learning.title')}</Text>
          <Text style={[styles.cardTagline, { color: APPRENTISSAGE_COLOR + 'BB' }]}>{t('featuresIntro.learning.tagline')}</Text>
          <Text style={styles.cardDesc}>{t('featuresIntro.learning.desc')}</Text>
          <View style={styles.checks}>
            <CheckItem text={t('featuresIntro.learning.check1')} color={APPRENTISSAGE_COLOR} />
            <CheckItem text={t('featuresIntro.learning.check2')} color={APPRENTISSAGE_COLOR} />
            <CheckItem text={t('featuresIntro.learning.check3')} color={APPRENTISSAGE_COLOR} />
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: APPRENTISSAGE_COLOR }]}
            onPress={() => choose('simple')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{t('featuresIntro.chooseBtn')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Carte Mode Complet ── */}
        <View style={[styles.card, styles.cardComplet]}>
          <Text style={styles.cardEmoji}>🎉</Text>
          <Text style={styles.cardMode}>{t('featuresIntro.modeLabel')}</Text>
          <Text style={[styles.cardTitle, { color: COMPLET_COLOR }]}>{t('featuresIntro.full.title')}</Text>
          <Text style={[styles.cardTagline, { color: COMPLET_COLOR + 'BB' }]}>{t('featuresIntro.full.tagline')}</Text>
          <Text style={styles.cardDesc}>{t('featuresIntro.full.desc')}</Text>
          <View style={styles.checks}>
            <CheckItem text={t('featuresIntro.full.check1')} color={COMPLET_COLOR} />
            <CheckItem text={t('featuresIntro.full.check2')} color={COMPLET_COLOR} />
            <CheckItem text={t('featuresIntro.full.check3')} color={COMPLET_COLOR} />
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: COMPLET_COLOR }]}
            onPress={() => choose('advanced')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{t('featuresIntro.chooseBtn')}</Text>
          </TouchableOpacity>
        </View>

        {/* Note de bas de page */}
        <View style={styles.footer}>
          <Text style={styles.footerIcon}>🔄</Text>
          <Text style={styles.footerText}>{t('featuresIntro.footerText')}</Text>
        </View>
      </ScrollView>

      <PremiumGateModal
        visible={premiumGateVisible}
        onClose={() => setPremiumGateVisible(false)}
        emoji="🍭"
        title={t('featuresIntro.gateTitle')}
        description={t('featuresIntro.gateDesc')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6FF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16 },

  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 26,
    color: '#1A0A3C',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },

  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardAppr:    { backgroundColor: '#F3EFFF' },
  cardComplet: { backgroundColor: '#FFF7ED' },

  cardEmoji: { fontSize: 38, marginBottom: 6 },
  cardMode: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    marginBottom: 3,
  },
  cardTagline: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 13,
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 10,
  },
  checks: { width: '100%', gap: 7, marginBottom: 14 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  checkIcon: { fontSize: 11, fontFamily: 'BeVietnamPro_700Bold' },
  checkText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },

  btn: {
    width: '100%',
    paddingVertical: 11,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  btnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: '#fff',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  footerIcon: { fontSize: 16 },
  footerText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    color: '#6B21A8',
    lineHeight: 19,
    flex: 1,
  },
});
