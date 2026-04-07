import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Share,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { useContacts } from '../../src/hooks/useContacts';
import { useMyPots } from '../../src/hooks/usePot';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '../../src/i18n';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, emoji }: { value: number; label: string; emoji: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({
  emoji,
  label,
  onPress,
  value,
  isToggle,
  toggled,
  onToggle,
  destructive,
}: {
  emoji: string;
  label: string;
  onPress?: () => void;
  value?: string;
  isToggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={!isToggle ? onPress : undefined}
      activeOpacity={isToggle ? 1 : 0.7}
    >
      <Text style={styles.settingEmoji}>{emoji}</Text>
      <Text style={[styles.settingLabel, destructive && { color: Colors.error }]}>{label}</Text>
      <View style={styles.settingRight}>
        {isToggle ? (
          <Switch
            value={toggled}
            onValueChange={onToggle}
            trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
            thumbColor={toggled ? Colors.primary : Colors.outlineVariant}
          />
        ) : value ? (
          <Text style={styles.settingValue}>{value}</Text>
        ) : (
          <Text style={styles.settingChevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { profile, signOut, updateProfile } = useAuthStore();
  const { data: messages = [] } = useMessages();
  const { data: contacts = [] } = useContacts();
  const { data: pots = [] } = useMyPots();

  const [notifsBirthday, setNotifsBirthday] = useState(true);
  const [notifsNameday, setNotifsNameday] = useState(true);
  const [notifsPot, setNotifsPot] = useState(true);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showSignature, setShowSignature] = useState(profile?.show_signature !== false);

  const handleToggleSignature = async (val: boolean) => {
    setShowSignature(val);
    await updateProfile({ show_signature: val });
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)
    ?? SUPPORTED_LANGUAGES[0];

  const isPremium = profile?.plan === 'premium';
  const initials = profile?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') ?? '?';

  const sentMessages = messages.filter((m) => m.status === 'sent').length;
  const activePots = pots.filter((p) => p.status !== 'closed').length;

  const handleSignOut = () => {
    Alert.alert(t('profile.signOutTitle'), t('profile.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.signOutBtn'), style: 'destructive', onPress: signOut },
    ]);
  };

  const handleShareReferral = () => {
    if (!profile?.referral_code) return;
    Share.share({
      message: t('profile.referral.message', { code: profile.referral_code })
        + `\nhttps://confettis-cake.app/invite/${profile.referral_code}`,
    });
  };

  const handleSelectLanguage = async (code: AppLanguage) => {
    await i18n.changeLanguage(code);
    await updateProfile({ language: code });
    setShowLangPicker(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero profil ───────────────────────────── */}
        <LinearGradient
          colors={isPremium ? ['#fdd34d', '#c97d10'] : ['#9b6bb5', '#7a4d99']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.heroName}>{profile?.full_name ?? t('profile.user')}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>
              {isPremium ? t('profile.premium') : t('profile.free')}
            </Text>
          </View>
          {profile?.credits != null && profile.credits > 0 && (
            <Text style={styles.heroCredits}>{t('profile.credits', { count: profile.credits })}</Text>
          )}
        </LinearGradient>

        {/* ── Stats ────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard value={messages.length} label={t('profile.stats.messages')} emoji="💬" />
          <StatCard value={sentMessages} label={t('profile.stats.sent')} emoji="📤" />
          <StatCard value={contacts.length} label={t('profile.stats.contacts')} emoji="👥" />
          <StatCard value={activePots} label={t('profile.stats.pots')} emoji="🎁" />
        </View>

        {/* ── Upgrade banner (si free) ─────────────── */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/profile/premium' as never)}
            activeOpacity={0.85}
          >
            <View style={styles.upgradeBannerLeft}>
              <Text style={styles.upgradeBannerTitle}>{t('profile.upgrade.title')}</Text>
              <Text style={styles.upgradeBannerSub}>{t('profile.upgrade.sub')}</Text>
            </View>
            <Text style={styles.upgradeBannerArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* ── Parrainage ───────────────────────────── */}
        {profile?.referral_code && (
          <View style={styles.referralCard}>
            <View style={styles.referralLeft}>
              <Text style={styles.referralTitle}>{t('profile.referral.title')}</Text>
              <Text style={styles.referralCode}>{profile.referral_code}</Text>
              <Text style={styles.referralSub}>{t('profile.referral.sub')}</Text>
            </View>
            <TouchableOpacity style={styles.referralShareBtn} onPress={handleShareReferral}>
              <Text style={styles.referralShareBtnText}>{t('profile.referral.share')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Langue ───────────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('profile.sections.language')}</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.langRow} onPress={() => setShowLangPicker(true)} activeOpacity={0.7}>
            <Text style={styles.langFlag}>{currentLang.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.langLabel}>{currentLang.label}</Text>
              <Text style={styles.langSub}>{t('profile.language.subtitle')}</Text>
            </View>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Notifications ────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('profile.sections.notifications')}</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            emoji="🎂" label={t('profile.notifications.birthdays')}
            isToggle toggled={notifsBirthday} onToggle={setNotifsBirthday}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="🌸" label={t('profile.notifications.nameDays')}
            isToggle toggled={notifsNameday} onToggle={setNotifsNameday}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="🎁" label={t('profile.notifications.pots')}
            isToggle toggled={notifsPot} onToggle={setNotifsPot}
          />
        </View>

        {/* ── Mon compte ───────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('profile.sections.account')}</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            emoji="✏️" label={t('profile.account.editProfile')}
            onPress={() => {}} value=""
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="🎁" label={t('profile.account.myPots')}
            onPress={() => router.push('/(app)/pot/' as never)}
          />
          <View style={styles.rowDivider} />
          {isPremium && (
            <>
              <SettingRow
                emoji="⭐" label={t('profile.account.manageSubscription')}
                onPress={() => router.push('/(app)/profile/premium' as never)}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="✍️"
                label="Signature Confettis & Cake"
                isToggle
                toggled={showSignature}
                onToggle={handleToggleSignature}
              />
              <View style={styles.rowDivider} />
            </>
          )}
          <SettingRow
            emoji="🔒" label={t('profile.account.privacy')}
            onPress={() => {}}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="❓" label={t('profile.account.help')}
            onPress={() => {}}
          />
        </View>

        {/* ── Déconnexion ──────────────────────────── */}
        <View style={styles.settingsCard}>
          <SettingRow
            emoji="🚪" label={t('profile.signOut')}
            onPress={handleSignOut}
            destructive
          />
        </View>

        <Text style={styles.version}>{t('profile.version')}</Text>

        {/* ── Modal sélecteur de langue ────────────── */}
        <Modal
          visible={showLangPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLangPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLangPicker(false)}
          >
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('profile.language.title')}</Text>
              <Text style={styles.modalSub}>{t('profile.language.subtitle')}</Text>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = lang.code === i18n.language;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.langOption, isActive && styles.langOptionActive]}
                    onPress={() => handleSelectLanguage(lang.code)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.langOptionFlag}>{lang.flag}</Text>
                    <Text style={[styles.langOptionLabel, isActive && styles.langOptionLabelActive]}>
                      {lang.label}
                    </Text>
                    {isActive && <Text style={styles.langOptionCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 80 },

  hero: {
    padding: Spacing[6],
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['4xl'], color: Colors.white },
  heroName: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.white },
  planBadge: {
    paddingVertical: 4, paddingHorizontal: 14,
    borderRadius: Radii.full, backgroundColor: 'rgba(255,255,255,0.25)',
  },
  planBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
  heroCredits: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radii.xl,
    paddingVertical: Spacing[3], alignItems: 'center', gap: 2, ...Shadows.sm,
  },
  statEmoji: { fontSize: 18 },
  statValue: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: Colors.primary },
  statLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  // Upgrade banner
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing[4], marginBottom: Spacing[2],
    padding: Spacing[4], borderRadius: Radii.xl,
    backgroundColor: Colors.primary, ...Shadows.md,
  },
  upgradeBannerLeft: { flex: 1 },
  upgradeBannerTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.white },
  upgradeBannerSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  upgradeBannerArrow: { fontSize: 26, color: Colors.white },

  // Referral
  referralCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing[4], marginBottom: Spacing[2],
    padding: Spacing[4], borderRadius: Radii.xl,
    backgroundColor: Colors.secondaryContainer,
    borderWidth: 1, borderColor: Colors.secondaryFixed,
  },
  referralLeft: { flex: 1, gap: 2 },
  referralTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSecondaryContainer },
  referralCode: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.secondary, letterSpacing: 2 },
  referralSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSecondaryContainer },
  referralShareBtn: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radii.full,
    backgroundColor: Colors.secondary,
  },
  referralShareBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  // Sections
  sectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs,
    textTransform: 'uppercase', letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
    marginTop: Spacing[4], marginBottom: Spacing[2],
    paddingHorizontal: Spacing[4],
  },
  settingsCard: {
    marginHorizontal: Spacing[4], marginBottom: Spacing[3],
    backgroundColor: Colors.white, borderRadius: Radii.xl, ...Shadows.sm,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: Spacing[4], gap: 14,
  },
  settingEmoji: { fontSize: 20, width: 28 },
  settingLabel: {
    flex: 1, fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md, color: Colors.onSurface,
  },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  settingChevron: { fontSize: 22, color: Colors.outlineVariant },
  rowDivider: { height: 0.5, backgroundColor: Colors.surfaceContainer, marginLeft: 56 },

  version: {
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.outlineVariant,
    marginTop: Spacing[4],
  },

  // Language selector
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    gap: 14,
  },
  langFlag: { fontSize: 24, width: 28 },
  langLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  langSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: 40,
    gap: 6,
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    borderRadius: Radii.xl,
    backgroundColor: Colors.background,
    marginBottom: 4,
  },
  langOptionActive: {
    backgroundColor: Colors.primaryContainer,
  },
  langOptionFlag: { fontSize: 24 },
  langOptionLabel: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  langOptionLabelActive: { color: Colors.primary },
  langOptionCheck: {
    fontSize: Typography.lg,
    color: Colors.primary,
    fontFamily: 'BeVietnamPro_700Bold',
  },
});
