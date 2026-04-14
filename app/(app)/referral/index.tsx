import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { useColors } from '../../../src/hooks/useColors';

export default function ReferralScreen() {
  const C = useColors();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const code = profile?.referral_code ?? '—';
  const credits = profile?.credits ?? 0;
  const isPremium = profile?.plan === 'premium';

  const handleShare = async () => {
    try {
      await Share.share({ message: t('profile.referral.message', { code }) });
    } catch { /* silent */ }
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Parrainage" />
      <View style={styles.content}>

        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.title}>{t('profile.referral.title')}</Text>
        <Text style={styles.sub}>
          {isPremium
            ? 'Partagez votre code et offrez des crédits gratuits à vos amis !'
            : t('profile.referral.sub')}
        </Text>

        {/* Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Ton code</Text>
          <Text style={styles.code}>{code}</Text>
        </View>

        {/* Crédits — uniquement pour les utilisateurs free */}
        {!isPremium && (
          <View style={styles.creditsRow}>
            <Text style={styles.creditsEmoji}>💜</Text>
            <Text style={styles.creditsText}>
              Tes crédits IA : <Text style={styles.creditsValue}>{credits} disponible{credits > 1 ? 's' : ''}</Text>
            </Text>
          </View>
        )}
        {isPremium && (
          <View style={[styles.creditsRow, styles.creditsRowPremium]}>
            <Text style={styles.creditsEmoji}>⭐</Text>
            <Text style={styles.creditsText}>Tu es Premium — créations illimitées !</Text>
          </View>
        )}

        {/* Bouton partager */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>🎁 {t('profile.referral.share')}</Text>
        </TouchableOpacity>

        {/* Explication */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>🎁</Text>
            <Text style={styles.infoText}>Partagez votre code à un ami</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>✅</Text>
            <Text style={styles.infoText}>Il s'inscrit avec votre code</Text>
          </View>
          <View style={styles.infoDivider} />
          {isPremium ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>💜</Text>
              <Text style={styles.infoText}>
                Votre ami reçoit <Text style={styles.infoHighlight}>5 crédits IA</Text> offerts pour démarrer
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoEmoji}>💜</Text>
                <Text style={styles.infoText}>
                  Vous gagnez <Text style={styles.infoHighlight}>5 crédits IA</Text> chacun
                </Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoEmoji}>✨</Text>
                <Text style={styles.infoText}>
                  <Text style={styles.infoHighlight}>1 crédit</Text> = 1 nouvelle création · Régénère gratuitement autant que tu veux
                </Text>
              </View>
            </>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    gap: 16,
  },
  emoji: { fontSize: 64, marginBottom: 4 },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  codeCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: Spacing[5],
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: C.primaryContainer,
    ...Shadows.sm,
  },
  codeLabel: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  code: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 36,
    color: C.primary,
    letterSpacing: 4,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: 10,
    paddingHorizontal: Spacing[5],
  },
  creditsEmoji: { fontSize: 18 },
  creditsText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  creditsValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: C.primary,
  },
  creditsRowPremium: {
    backgroundColor: '#fef9e7',
    borderWidth: 1,
    borderColor: '#fdd34d',
  },
  shareBtn: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadows.md,
  },
  shareBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
  },
  infoEmoji: { fontSize: 20 },
  infoText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  infoHighlight: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: C.primary,
  },
  infoDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainerLow,
    marginLeft: Spacing[4] + 20 + 12,
  },
  });
}
