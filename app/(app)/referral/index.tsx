import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, ScrollView } from 'react-native';
import { useReferralHistory } from '../../../src/hooks/useReferrals';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../../src/i18n';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { useColors } from '../../../src/hooks/useColors';
import { getSignatureLabels } from '../../../src/utils/signature';

export default function ReferralScreen() {
  const C = useColors();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const code = profile?.referral_code ?? '—';
  const credits = profile?.credits ?? 0;
  const isPremium = profile?.plan === 'premium';
  const firstName = profile?.full_name?.split(' ').at(-1) ?? '';
  const { data: referralHistory = [] } = useReferralHistory();
  const sigLabels = getSignatureLabels(i18n.language);

  const handleShare = async () => {
    try {
      await Share.share({ message: t('profile.referral.message', { code }) });
    } catch { /* silent */ }
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Parrainage" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Titre personnalisé ────────────────────── */}
        {firstName ? (
          <Text style={styles.personalTitle}>{firstName}, pourquoi parrainer tes proches ?</Text>
        ) : (
          <Text style={styles.personalTitle}>Pourquoi parrainer tes proches ?</Text>
        )}

        {/* ── Accroche ──────────────────────────────── */}
        <View style={styles.catchCard}>
          <Text style={styles.catchText}>
            Tu gagneras des crédits gratuits – et tes filleuls en recevront autant !{'\n'}
            Plus tu inviteras, plus tu enverras de messages sans dépenser un centime. 🤣
          </Text>
          <Text style={styles.catchNote}>(Une bonne raison de partager l'appli avec ceux qui comptent !) 😉</Text>
        </View>

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

        {/* Signature banner */}
        <View style={styles.signatureBanner}>
          <Text style={styles.sigMain}>{sigLabels.main}</Text>
          <Text style={styles.sigCta}>
            {sigLabels.cta}{' '}
            <Text style={styles.sigUrl}>{sigLabels.url}</Text>
          </Text>
        </View>

        {/* Historique parrainages */}
        {referralHistory.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>👥 Tes filleuls</Text>
            {referralHistory.map((r) => {
              const date = new Date(r.created_at);
              const label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
              const email = r.referred_email ?? 'Anonyme';
              const shortEmail = email.length > 22 ? email.slice(0, 20) + '…' : email;
              return (
                <View key={r.id} style={styles.historyRow}>
                  <Text style={styles.historyEmoji}>🎉</Text>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyEmail}>{shortEmail}</Text>
                    <Text style={styles.historyDate}>{label}</Text>
                  </View>
                  <Text style={styles.historyCredits}>+{r.credits_awarded} crédits</Text>
                </View>
              );
            })}
          </View>
        )}

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

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: 80,
    gap: 16,
  },
  personalTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 32,
    width: '100%',
  },
  catchCard: {
    width: '100%',
    backgroundColor: C.primaryContainer + '50',
    borderRadius: Radii.xl,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    padding: Spacing[4],
    gap: 8,
  },
  catchText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  catchNote: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontStyle: 'italic',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  emoji: { fontSize: 36, marginBottom: 0 },
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
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: C.primaryContainer,
    ...Shadows.sm,
  },
  codeLabel: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  code: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
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
  signatureBanner: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 6,
    ...Shadows.sm,
  },
  sigMain: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.white,
    lineHeight: 20,
  },
  sigCta: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  sigUrl: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fdd34d',
  },
  historyCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  historyTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    padding: Spacing[4],
    paddingBottom: Spacing[2],
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerLow,
  },
  historyEmoji: { fontSize: 20 },
  historyInfo: { flex: 1 },
  historyEmail: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  historyDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  historyCredits: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
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
