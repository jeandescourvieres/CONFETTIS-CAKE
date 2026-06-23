import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Share, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { useCountry } from '../../src/hooks/useCountry';
import { COUNTRY_LABELS, type Country } from '../../src/constants/publicHolidays';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as SecureStore from '../../src/utils/storage';
import { useAuthStore } from '../../src/stores/authStore';
import {
  useNotifSchedule, CUSTOM_DAY_OPTIONS,
  type NotifPreset,
} from '../../src/hooks/useNotifSchedule';
import { useContacts } from '../../src/hooks/useContacts';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { supabase } from '../../src/services/supabase';
import { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY, setLanguage, type AppLanguageOrSystem } from '../../src/i18n';

const LAST_BACKUP_KEY = 'cc_last_backup_at';
const HOME_MODE_KEY      = 'cc_home_mode';
const FEATURES_INTRO_KEY = 'cc_features_intro_v1_seen';

// ── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const C = useColors();
  return (
    <View style={sectionStyles.card}>
      <Text style={[sectionStyles.title, {
        borderLeftColor: C.primary,        color: C.primary,
      }]}>{title}</Text>
      {children}
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 12,
    ...Shadows.sm,
  },
  title: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    paddingVertical: 4,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
  },
});

// ── Row button ────────────────────────────────────────────────────────────────
function RowBtn({
  emoji, label, sub, onPress, color, disabled,
}: {
  emoji: string; label: string; sub?: string;
  onPress: () => void; color?: string; disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={rowStyles.row}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={rowStyles.emoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[rowStyles.label, color ? { color } : null]}>{label}</Text>
        {sub ? <Text style={rowStyles.sub}>{sub}</Text> : null}
      </View>
      <Text style={[rowStyles.arrow, color ? { color } : null]}>›</Text>
    </TouchableOpacity>
  );
}
const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 8,
  },
  emoji: { fontSize: 20, width: 28, textAlign: 'center' },
  label: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  sub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  arrow: { fontSize: 20, color: Colors.onSurfaceVariant },
});

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <View style={{ height: 0.5, backgroundColor: Colors.surfaceContainerHighest, marginVertical: 2 }} />;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const { user, profile, signOut } = useAuthStore();
  const { data: contacts = [] } = useContacts();
  const { data: messages = [] } = useMessages();

  // Sauvegarde
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(LAST_BACKUP_KEY).then((v) => setLastBackup(v));
  }, []);

  const handleBackupNow = async () => {
    setBackupLoading(true);
    try {
      const exportData = {
        version: 1,
        exported_at: new Date().toISOString(),
        contacts,
        messages,
        profile,
      };
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: t('settings.backup.shareTitle'),
      });
      const now = new Date().toLocaleString('fr-FR');
      await SecureStore.setItemAsync(LAST_BACKUP_KEY, now);
      setLastBackup(now);
    } catch {
      // User cancelled share
    } finally {
      setBackupLoading(false);
    }
  };

  const handleExport = () => {
    Alert.alert(
      t('settings.backup.exportTitle'),
      t('settings.backup.unavailableMessage'),
      [{ text: t('common.ok') }],
    );
  };

  const handleImport = () => {
    Alert.alert(
      t('settings.backup.importTitle'),
      t('settings.backup.unavailableMessage'),
      [{ text: t('common.ok') }],
    );
  };

  // ── Pays ────────────────────────────────────────────────────────────────────
  const { country, setCountry } = useCountry();
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  // ── Langue ──────────────────────────────────────────────────────────────────
  const [currentLang, setCurrentLang] = useState<AppLanguageOrSystem>('system');
  const [langExplainVisible, setLangExplainVisible] = useState(false);
  useEffect(() => {
    SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY).then((v) => {
      if (v) setCurrentLang(v as AppLanguageOrSystem);
    });
  }, []);
  const handleLangSelect = async (choice: AppLanguageOrSystem) => {
    setCurrentLang(choice);
    await setLanguage(choice);
  };

  // ── Suppression du compte ────────────────────────────────────────────────────
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0); // 0=hidden 1=warning 2=confirm
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const emailMatches = deleteEmail.trim().toLowerCase() === (user?.email ?? '').toLowerCase();

  const handleDeleteConfirm = async () => {
    if (!emailMatches) return;
    setDeleteLoading(true);
    try {
      // Delete all user data via Supabase (cascade RLS)
      await supabase.rpc('delete_user_account' as any);
      await signOut();
      router.replace('/(auth)/onboarding' as never);
    } catch {
      Alert.alert(t('common.error'), t('settings.account.deleteAccountError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Notifications ────────────────────────────────────────────────────────────
  const handleNotifications = () => router.push('/(app)/notifications' as never);
  const { preset, customDays, activeDays, save: saveSchedule } = useNotifSchedule();
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [draftPreset, setDraftPreset] = useState<NotifPreset>('max');
  const [draftCustomDays, setDraftCustomDays] = useState<number[]>([7, 0]);

  const openScheduleModal = () => {
    setDraftPreset(preset);
    setDraftCustomDays(customDays);
    setScheduleModalVisible(true);
  };

  const confirmSchedule = async () => {
    await saveSchedule(draftPreset, draftCustomDays);
    setScheduleModalVisible(false);
  };

  const toggleCustomDay = (day: number) => {
    setDraftCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const scheduleSubLabel = preset === 'custom'
    ? activeDays.length === 0 ? t('settings.notifications.noReminder') : activeDays.map((d) => d === 0 ? t('settings.notifications.dayJ') : t('settings.notifications.dayMinus', { count: d })).join(', ')
    : t(`settings.notifPresets.${preset}.sub`);

  const authMethod = user?.app_metadata?.provider === 'google'
    ? 'Google'
    : user?.app_metadata?.provider === 'apple'
    ? 'Apple'
    : 'Email';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Sauvegarde ───────────────────────────────────── */}
        <SectionCard title={t('settings.sections.backup')}>
          <View style={styles.backupInfo}>
            <Text style={styles.backupInfoLabel}>{t('settings.backup.autoLabel')}</Text>
            <Text style={styles.backupInfoValue}>
              {authMethod === 'Google' ? t('settings.backup.googleDrive')
               : authMethod === 'Apple' ? t('settings.backup.icloud')
               : t('settings.backup.serverStorage')}
            </Text>
          </View>
          <Text style={styles.backupExplainText}>{t('settings.backup.explainText')}</Text>
          {lastBackup && (
            <Text style={styles.lastBackupText}>{t('settings.backup.lastBackup', { date: lastBackup })}</Text>
          )}
          <TouchableOpacity
            style={[styles.backupBtn, { backgroundColor: C.primary }, backupLoading && { opacity: 0.6 }]}
            onPress={handleBackupNow}
            disabled={backupLoading}
            activeOpacity={0.85}
          >
            {backupLoading
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <Text style={styles.backupBtnText}>{t('settings.backup.backupNowBtn')}</Text>}
          </TouchableOpacity>
          <Divider />
          <RowBtn emoji="📥" label={t('settings.backup.exportLabel')} sub={t('settings.backup.exportSub')} onPress={handleExport} />
          <Divider />
          <RowBtn emoji="📤" label={t('settings.backup.importLabel')} sub={t('settings.backup.importSub')} onPress={handleImport} />
        </SectionCard>

        {/* ── Notifications ────────────────────────────────── */}
        <SectionCard title={t('settings.sections.notifications')}>
          <RowBtn
            emoji="🔔"
            label={t('settings.notifications.enableLabel')}
            sub={t('settings.notifications.enableSub')}
            onPress={handleNotifications}
          />
          <Divider />
          <RowBtn
            emoji="📅"
            label={t('settings.notifications.frequencyLabel')}
            sub={scheduleSubLabel}
            onPress={openScheduleModal}
          />
          <Divider />
          <RowBtn
            emoji="📱"
            label={t('settings.notifications.checkLabel')}
            sub={t('settings.notifications.checkSub')}
            onPress={() => Linking.openSettings()}
          />
        </SectionCard>

        {/* ── Mon compte ───────────────────────────────────── */}
        <SectionCard title={t('settings.sections.account')}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountEmail}>{user?.email ?? '—'}</Text>
            <Text style={styles.accountProvider}>{t('settings.account.connectedVia', { method: authMethod })}</Text>
          </View>
          <RowBtn
            emoji="👤"
            label={t('settings.account.viewProfile')}
            onPress={() => router.push('/(app)/profile' as never)}
          />
          <Divider />
          <RowBtn
            emoji="🚪"
            label={t('settings.account.signOut')}
            onPress={() => {
              Alert.alert(t('settings.account.signOutTitle'), t('settings.account.signOutMessage'), [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('settings.account.signOut'), style: 'destructive', onPress: signOut },
              ]);
            }}
          />
          <Divider />
          <TouchableOpacity
            style={styles.deleteAccountRow}
            onPress={() => setDeleteStep(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteAccountEmoji}>🗑️</Text>
            <Text style={styles.deleteAccountText}>{t('settings.account.deleteAccount')}</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Mon pays ─────────────────────────────────────── */}
        <SectionCard title={t('settings.sections.country')}>
          <RowBtn
            emoji={COUNTRY_LABELS[country].flag}
            label={COUNTRY_LABELS[country].label}
            sub={t('settings.country.sub')}
            onPress={() => setCountryModalVisible(true)}
          />
        </SectionCard>

        {/* ── Langue ───────────────────────────────────────── */}
        <SectionCard title={t('settings.sections.language')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {/* Bouton Système */}
            <TouchableOpacity
              onPress={() => handleLangSelect('system')}
              style={[langStyles.btn, currentLang === 'system' && langStyles.btnActive]}
            >
              <Text style={[langStyles.btnText, currentLang === 'system' && langStyles.btnTextActive]}>
                {t('settings.language.system')}
              </Text>
            </TouchableOpacity>
            {/* Boutons langues */}
            {SUPPORTED_LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                onPress={() => handleLangSelect(l.code)}
                style={[langStyles.btn, currentLang === l.code && langStyles.btnActive]}
              >
                <Text style={[langStyles.btnText, currentLang === l.code && langStyles.btnTextActive]}>
                  {l.flag} {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setLangExplainVisible((v) => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 13, color: Colors.primary, fontFamily: 'BeVietnamPro_600SemiBold' }}>
              ℹ️ {langExplainVisible ? t('settings.language.hideExplain') : t('settings.language.showExplain')}
            </Text>
          </TouchableOpacity>
          {langExplainVisible && (
            <Text style={{ fontSize: 13, color: Colors.onSurfaceVariant, fontFamily: 'BeVietnamPro_400Regular', lineHeight: 20 }}>
              {t('settings.language.explainText')}
            </Text>
          )}
        </SectionCard>

        {/* ── Mode d'affichage ─────────────────────────────── */}
        <SectionCard title={t('settings.sections.displayMode')}>
          <RowBtn
            emoji="🔄"
            label={t('settings.displayMode.changeLabel')}
            sub={t('settings.displayMode.changeSub')}
            onPress={async () => {
              await SecureStore.deleteItemAsync(HOME_MODE_KEY);
              router.push('/(app)/features-intro' as never);
            }}
          />
        </SectionCard>

        {/* ── Parrainage ───────────────────────────────────── */}
        <SectionCard title={t('settings.sections.referral')}>
          <RowBtn
            emoji="🎁"
            label={t('settings.referral.label')}
            sub={t('settings.referral.sub')}
            onPress={() => router.push('/(app)/referral' as never)}
          />
        </SectionCard>

        {/* ── Premium ──────────────────────────────────────── */}
        <SectionCard title={t('settings.sections.premium')}>
          <RowBtn
            emoji="⭐"
            label={t('settings.premium.label')}
            sub={t('settings.premium.sub')}
            onPress={() => router.push('/(app)/profile/premium' as never)}
            color={C.primary}
          />
        </SectionCard>

        {/* ── Zone développeur (invisible en production) ── */}
        {__DEV__ && (
          <SectionCard title={t('settings.sections.dev')}>
            <RowBtn
              emoji="🔄"
              label={t('settings.dev.simulateLabel')}
              sub={t('settings.dev.simulateSub')}
              onPress={async () => {
                await Promise.all([
                  SecureStore.deleteItemAsync(HOME_MODE_KEY),
                  SecureStore.deleteItemAsync(FEATURES_INTRO_KEY),
                ]);
                router.replace('/welcome' as never);
              }}
            />
          </SectionCard>
        )}

        <SectionCard title={t('settings.sections.legal')}>
          <RowBtn
            emoji="📄"
            label={t('settings.legal.cguLabel')}
            sub={t('settings.legal.cguSub')}
            onPress={() => Linking.openURL('https://confetticake.fr/cgu')}
          />
          <Divider />
          <RowBtn
            emoji="🔒"
            label={t('settings.legal.privacyLabel')}
            sub={t('settings.legal.privacySub')}
            onPress={() => Linking.openURL('https://confetticake.fr/confidentialite')}
          />
        </SectionCard>

        {/* ── Tip : appli qui tourne en rond ── */}
        <TouchableOpacity
          style={styles.tipBox}
          activeOpacity={0.75}
          onPress={() => Alert.alert(
            t('settings.tip.title'),
            t('settings.tip.alertMessage'),
            [{ text: t('common.ok'), style: 'default' }]
          )}
        >
          <Text style={styles.tipTitle}>{t('settings.tip.title')}</Text>
          <Text style={styles.tipText}>{t('settings.tip.cta')}</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal pays ──────────────────────────────────────── */}
      <Modal visible={countryModalVisible} transparent animationType="slide" onRequestClose={() => setCountryModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('settings.country.modalTitle')}</Text>
            <Text style={styles.modalBody}>{t('settings.country.modalBody')}</Text>
            {(Object.keys(COUNTRY_LABELS) as Country[]).map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.countryOption,
                  country === c && { borderColor: C.primary, backgroundColor: C.primaryContainer + '30' },
                ]}
                onPress={async () => { await setCountry(c); setCountryModalVisible(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.countryFlag}>{COUNTRY_LABELS[c].flag}</Text>
                <Text style={[styles.countryLabel, country === c && { color: C.primary }]}>
                  {COUNTRY_LABELS[c].label}
                </Text>
                {country === c && <Text style={{ fontSize: 16, color: C.primary }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel, { marginTop: 4 }]} onPress={() => setCountryModalVisible(false)}>
              <Text style={styles.modalBtnCancelText}>{t('settings.country.closeBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modal fréquence rappels ─────────────────────────── */}
      <Modal visible={scheduleModalVisible} transparent animationType="slide" onRequestClose={() => setScheduleModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('settings.scheduleModal.title')}</Text>
            <Text style={styles.modalBody}>{t('settings.scheduleModal.body')}</Text>

            <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
              {(['max', 'moderate', 'minimal', 'custom'] as NotifPreset[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.countryOption,
                    draftPreset === p && { borderColor: C.primary, backgroundColor: C.primaryContainer + '30' },
                  ]}
                  onPress={() => setDraftPreset(p)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.countryLabel, draftPreset === p && { color: C.primary }]}>
                      {t(`settings.notifPresets.${p}.label`, { defaultValue: 'Personnalisé' })}
                    </Text>
                    {p !== 'custom' && (
                      <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>
                        {t(`settings.notifPresets.${p}.sub`)}
                      </Text>
                    )}
                  </View>
                  {draftPreset === p && <Text style={{ fontSize: 16, color: C.primary }}>✓</Text>}
                </TouchableOpacity>
              ))}

              {draftPreset === 'custom' && (
                <View style={{ gap: 8, marginTop: 4, marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface }}>
                    {t('settings.scheduleModal.selectDays')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {CUSTOM_DAY_OPTIONS.map((day) => {
                      const active = draftCustomDays.includes(day);
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            { paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radii.full, borderWidth: 1.5 },
                            active
                              ? { backgroundColor: C.primary, borderColor: C.primary }
                              : { backgroundColor: Colors.surfaceContainerLow, borderColor: Colors.outlineVariant },
                          ]}
                          onPress={() => toggleCustomDay(day)}
                          activeOpacity={0.8}
                        >
                          <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: active ? Colors.white : Colors.onSurface }}>
                            {day === 0 ? t('settings.notifications.dayJ') : t('settings.notifications.dayMinus', { count: day })}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setScheduleModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: C.primary, flex: 1 }]} onPress={confirmSchedule}>
                <Text style={[styles.modalBtnDangerText, { color: Colors.white }]}>{t('common.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal suppression — Étape 1 : Avertissement ───── */}
      <Modal visible={deleteStep === 1} transparent animationType="slide" onRequestClose={() => setDeleteStep(0)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('settings.deleteModal1.title')}</Text>
            <Text style={styles.modalBody}>{t('settings.deleteModal1.body')}</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setDeleteStep(0)}>
                <Text style={styles.modalBtnCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnDanger]} onPress={() => setDeleteStep(2)}>
                <Text style={styles.modalBtnDangerText}>{t('settings.deleteModal1.confirmBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal suppression — Étape 2 : Confirmation email ── */}
      <Modal visible={deleteStep === 2} transparent animationType="slide" onRequestClose={() => setDeleteStep(0)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('settings.deleteModal2.title')}</Text>
            <Text style={styles.modalBody}>{t('settings.deleteModal2.body')}</Text>
            <TextInput
              style={styles.emailInput}
              value={deleteEmail}
              onChangeText={setDeleteEmail}
              placeholder="ton@email.com"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => { setDeleteStep(0); setDeleteEmail(''); }}
              >
                <Text style={styles.modalBtnCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnDanger, !emailMatches && { opacity: 0.4 }]}
                onPress={handleDeleteConfirm}
                disabled={!emailMatches || deleteLoading}
              >
                {deleteLoading
                  ? <ActivityIndicator size="small" color={Colors.white} />
                  : <Text style={styles.modalBtnDangerText}>{t('settings.deleteModal2.confirmBtn')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], gap: 8,
    },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
    backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
    headerTitle: {
      flex: 1, fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center',
    },
    content: { paddingHorizontal: Spacing[4], gap: 16, paddingTop: Spacing[3] },

    backupInfo: { gap: 2 },
    backupInfoLabel: { fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
    backupInfoValue: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
    backupExplainText: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
      color: Colors.onSurfaceVariant, lineHeight: 20,
    },
    lastBackupText: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    backupBtn: {
      borderRadius: Radii.full, paddingVertical: 13, alignItems: 'center', ...Shadows.sm,
    },
    backupBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

    accountInfo: { gap: 2, marginBottom: 4 },
    accountEmail: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
    accountProvider: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant },

    deleteAccountRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8,
    },
    deleteAccountEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
    deleteAccountText: {
      fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: '#e53935',
    },

    // Modals
    modalOverlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalCard: {
      backgroundColor: Colors.white, borderTopLeftRadius: Radii.xl, borderTopRightRadius: Radii.xl,
      padding: Spacing[6], gap: 16,
    },
    modalTitle: {
      fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg,
      color: Colors.onSurface, textAlign: 'center',
    },
    modalBody: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
      color: Colors.onSurfaceVariant, lineHeight: 22,
    },
    modalBtns: { gap: 10, marginTop: 4 },
    modalBtn: {
      borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center',
    },
    modalBtnCancel: { backgroundColor: Colors.surfaceContainerLow },
    modalBtnCancelText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurface },
    modalBtnDanger: { backgroundColor: '#e53935' },
    modalBtnDangerText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
    emailInput: {
      borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest, borderRadius: Radii.lg,
      paddingHorizontal: Spacing[4], paddingVertical: 12,
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface,
    },
    countryOption: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingVertical: 12, paddingHorizontal: 16,
      borderRadius: Radii.lg, borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      marginBottom: 8,
    },
    countryFlag: { fontSize: 24 },
    countryLabel: {
      flex: 1, fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.base, color: Colors.onSurface,
    },
    tipBox: {
      marginHorizontal: Spacing[4],
      marginTop: Spacing[4],
      backgroundColor: C.primaryContainer,
      borderRadius: Radii.xl,
      borderLeftWidth: 4,
      borderLeftColor: C.primary,
      padding: Spacing[4],
    },
    tipTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: C.primary,
      marginBottom: 8,
    },
    tipText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 20,
    },
  });
}

const langStyles = StyleSheet.create({
  btn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  btnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  btnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  btnTextActive: {
    color: Colors.white,
  },
});
