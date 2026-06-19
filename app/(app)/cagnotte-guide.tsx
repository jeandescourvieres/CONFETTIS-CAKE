// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Guide cagnottes (mode apprentissage)
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';

const STEP_EMOJIS = ['1️⃣', '2️⃣', '3️⃣'] as const;

export default function CagnotteGuideScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: Colors.primary }]}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cagnotteGuide.headerTitle')}</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Carte intro */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{t('cagnotteGuide.introTitle')}</Text>
          <Text style={styles.introText}>{t('cagnotteGuide.introText')}</Text>
        </View>

        {/* Comment ça marche */}
        <Text style={styles.sectionTitle}>{t('cagnotteGuide.sectionTitle')}</Text>
        <View style={styles.stepsCard}>
          {STEP_EMOJIS.map((emoji, i) => (
            <View key={i} style={[styles.stepRow, i < STEP_EMOJIS.length - 1 && styles.stepBorder]}>
              <Text style={styles.stepEmoji}>{emoji}</Text>
              <Text style={styles.stepText}>{t(`cagnotteGuide.steps.${i}`)}</Text>
            </View>
          ))}
        </View>

        {/* Boutons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(app)/pot/new' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>{t('cagnotteGuide.primaryBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(app)/pot' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>{t('cagnotteGuide.secondaryBtn')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  headerTitle: { flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center' },

  scroll: { padding: Spacing[4], gap: 16, paddingBottom: 40 },

  introCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
    ...Shadows.sm,
    gap: 10,
  },
  introTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: '#C2410C',
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },

  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    marginBottom: -4,
  },
  stepsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: Spacing[4],
  },
  stepBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest },
  stepEmoji: { fontSize: 22 },
  stepText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface, flex: 1, lineHeight: 22 },

  primaryBtn: {
    backgroundColor: '#F97316',
    borderRadius: Radii.full,
    paddingVertical: 15,
    alignItems: 'center',
    ...Shadows.sm,
  },
  primaryBtnText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.white },

  secondaryBtn: {
    borderRadius: Radii.full,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  secondaryBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
});
