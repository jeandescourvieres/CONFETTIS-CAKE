// ═══════════════════════════════════════════════════════════════════
//  Confettis & Cake — Guide création de message (mode apprentissage)
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';
import { useCreateStore } from '../../src/stores/createStore';

const MODES = [
  { emoji: '✨', key: 'ia',       color: '#7C3AED', bg: '#F3EFFF', action: 'ia' },
  { emoji: '📝', key: 'template', color: '#0284C7', bg: '#EFF6FF', action: 'template' },
  { emoji: '✏️', key: 'manual',   color: '#D97706', bg: '#FFF7ED', action: 'manual' },
] as const;

export default function MessageGuideScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setFormat } = useCreateStore();

  const go = (action: string) => {
    if (action === 'manual') {
      router.push({ pathname: '/(app)/create', params: { forceManual: '1', fromGuide: '1' } } as never);
    } else {
      router.push({ pathname: '/(app)/create', params: { fromGuide: '1' } } as never);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: Colors.primary }]}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('messageGuide.headerTitle')}</Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Les 3 modes */}
        {MODES.map((m) => (
          <TouchableOpacity
            key={m.action}
            style={[styles.modeCard, { borderColor: m.color + '40', backgroundColor: m.bg }]}
            onPress={() => go(m.action)}
            activeOpacity={0.85}
          >
            <View style={styles.modeHeader}>
              <Text style={styles.modeEmoji}>{m.emoji}</Text>
              <Text style={[styles.modeLabel, { color: m.color }]}>{t(`messageGuide.modes.${m.key}.label`)}</Text>
            </View>
            <Text style={styles.modeSub}>{t(`messageGuide.modes.${m.key}.sub`)}</Text>
            <View style={[styles.modeBtn, { backgroundColor: m.color }]}>
              <Text style={styles.modeBtnText}>{t('messageGuide.chooseMode')}</Text>
            </View>
          </TouchableOpacity>
        ))}
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

  modeCard: {
    borderRadius: Radii.xl,
    padding: Spacing[4],
    borderWidth: 1.5,
    gap: 10,
  },
  modeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeEmoji: { fontSize: 28 },
  modeLabel: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl },
  modeSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, lineHeight: 22 },
  modeBtn: { borderRadius: Radii.full, paddingVertical: 11, alignItems: 'center' },
  modeBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
});
