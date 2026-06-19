import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

export default function ExploreIndex() {
  const { t } = useTranslation();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>{t('explore.title')}</Text>
      <Text style={styles.subtitle}>{t('explore.subtitle')}</Text>

      <View style={styles.cards}>
        <TouchableOpacity
          style={[styles.card, { borderColor: C.primary }]}
          onPress={() => router.push('/(app)/explore/prenoms' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.cardEmoji}>🔤</Text>
          <Text style={[styles.cardTitle, { color: C.primary }]}>{t('explore.firstNamesTitle')}</Text>
          <Text style={styles.cardDesc}>{t('explore.firstNamesDesc')}</Text>
          <Text style={[styles.cardCta, { color: C.primary }]}>{t('explore.discover')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderColor: C.primary }]}
          onPress={() => router.push('/(app)/explore/noms' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.cardEmoji}>🌍</Text>
          <Text style={[styles.cardTitle, { color: C.primary }]}>{t('explore.lastNamesTitle')}</Text>
          <Text style={styles.cardDesc}>{t('explore.lastNamesDesc')}</Text>
          <Text style={[styles.cardCta, { color: C.primary }]}>{t('explore.discover')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },
    title: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.lg,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 26,
      marginBottom: Spacing[6],
    },
    cards: { gap: 12 },
    card: {
      backgroundColor: Colors.white,
      borderRadius: Radii.lg,
      borderWidth: 1.5,
      paddingVertical: Spacing[3],
      paddingHorizontal: Spacing[4],
      gap: 4,
      ...Shadows.sm,
    },
    cardEmoji: { fontSize: 24, textAlign: 'center' },
    cardTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.base,
      textAlign: 'center',
    },
    cardDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 18,
    },
    cardCta: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      textAlign: 'center',
      marginTop: 2,
    },
  });
}
