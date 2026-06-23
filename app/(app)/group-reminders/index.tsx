import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { useGroupReminders, useToggleGroupReminder, useDeleteGroupReminder } from '../../../src/hooks/useGroupReminders';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

function getTriggerLabel(t: TFunction): Record<string, string> {
  return {
    birthday: t('groupReminders.trigger.birthday'),
    nameday: t('groupReminders.trigger.nameday'),
  };
}
function getChannelLabel(t: TFunction): Record<string, string> {
  return {
    sms: t('autoSends.channelLabel.sms'),
    email: t('autoSends.channelLabel.email'),
  };
}

export default function GroupRemindersScreen() {
  const { t } = useTranslation();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const { data: reminders = [], isLoading } = useGroupReminders();
  const { mutate: toggle } = useToggleGroupReminder();
  const { mutate: remove } = useDeleteGroupReminder();

  const TRIGGER_LABEL = useMemo(() => getTriggerLabel(t), [t]);
  const CHANNEL_LABEL = useMemo(() => getChannelLabel(t), [t]);
  const MODE_EMPLOI_LINES = useMemo(
    () => Array.from({ length: 10 }, (_, i) => t(`groupReminders.modeEmploi.${i}`)),
    [t],
  );

  const handleDelete = (id: string, contactName: string) => {
    Alert.alert(
      t('groupReminders.deleteConfirmTitle'),
      t('groupReminders.deleteConfirmMsg', { name: contactName }),
      [
        { text: t('groupReminders.cancel'), style: 'cancel' },
        { text: t('groupReminders.delete'), style: 'destructive', onPress: () => remove(id) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>{t('groupReminders.headerTitle')}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/group-reminders/new' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <FeatureIntroCard
            introText={t('groupReminders.introText')}
            modeEmploiLines={MODE_EMPLOI_LINES}
            containerStyle={{ marginBottom: Spacing[4] }}
          />

          {reminders.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>{t('groupReminders.emptyTitle')}</Text>
              <Text style={styles.emptySub}>
                {t('groupReminders.emptySub')}
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(app)/group-reminders/new' as never)}
                activeOpacity={0.85}
              >
                <Text style={styles.emptyBtnText}>{t('groupReminders.createBtn')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{t('groupReminders.countReminders', { count: reminders.length })}</Text>
              <View style={styles.list}>
                {reminders.map((reminder) => (
                  <View key={reminder.id} style={[styles.card, !reminder.is_active && styles.cardInactive]}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.avatar, { backgroundColor: reminder.is_active ? C.primary : Colors.outlineVariant }]}>
                        <Text style={styles.avatarText}>
                          {(reminder.contact?.name ?? '?')[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardName}>{reminder.contact?.name ?? '—'}</Text>
                        <View style={styles.cardMeta}>
                          <Text style={styles.cardMetaText}>{TRIGGER_LABEL[reminder.trigger_event]}</Text>
                          <Text style={styles.cardMetaDot}>·</Text>
                          <Text style={styles.cardMetaText}>{t('groupReminders.daysBefore', { count: reminder.days_before })}</Text>
                          <Text style={styles.cardMetaDot}>·</Text>
                          <Text style={styles.cardMetaText}>{CHANNEL_LABEL[reminder.channel]}</Text>
                        </View>
                      </View>
                      <Switch
                        value={reminder.is_active}
                        onValueChange={(v) => toggle({ id: reminder.id, is_active: v })}
                        trackColor={{ false: Colors.surfaceContainerHighest, true: C.primaryContainer }}
                        thumbColor={reminder.is_active ? C.primary : Colors.outlineVariant}
                      />
                    </View>

                    <View style={styles.previewBox}>
                      <Text style={styles.previewLabel}>
                        {reminder.content ? t('groupReminders.customMessageLabel') : t('groupReminders.autoMessageLabel')}
                      </Text>
                      <Text style={styles.previewText} numberOfLines={2}>
                        {t('groupReminders.recipientsCount', { count: reminder.recipient_contact_ids.length })}
                      </Text>
                    </View>

                    <View style={styles.cardActions}>
                      {reminder.last_sent_at && (
                        <Text style={styles.lastSent}>
                          {t('groupReminders.lastSent', { date: new Date(reminder.last_sent_at).toLocaleDateString() })}
                        </Text>
                      )}
                      <TouchableOpacity
                        onPress={() => handleDelete(reminder.id, reminder.contact?.name ?? '')}
                        style={styles.deleteBtn}
                      >
                        <Text style={styles.deleteBtnText}>{t('groupReminders.deleteBtnLabel')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
    backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
    topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
    addBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    },
    addBtnText: { fontSize: 22, color: Colors.white, lineHeight: 28 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    content: { padding: Spacing[4], paddingBottom: 80 },

    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.xl,
      color: Colors.onSurface,
      marginBottom: Spacing[3],
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: Spacing[3],
    },
    list: { gap: Spacing[3] },

    card: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      overflow: 'hidden',
      ...Shadows.sm,
    },
    cardInactive: { opacity: 0.55 },
    cardHeader: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      padding: Spacing[4],
      borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
    },
    avatar: {
      width: 44, height: 44, borderRadius: 22,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    avatarText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.white },
    cardInfo: { flex: 1 },
    cardName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' },
    cardMetaText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    cardMetaDot: { fontSize: Typography.xs, color: Colors.outlineVariant },

    previewBox: {
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[3],
      backgroundColor: Colors.surfaceContainerLow,
    },
    previewLabel: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      color: C.primary,
      marginBottom: 4,
    },
    previewText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 18,
    },

    cardActions: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: Spacing[4], paddingVertical: 10,
    },
    lastSent: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    deleteBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    deleteBtnText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: Colors.error,
    },

    emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyEmoji: { fontSize: 56 },
    emptyTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
    emptySub: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md,
      color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22,
      paddingHorizontal: Spacing[6],
    },
    emptyBtn: {
      marginTop: Spacing[2], backgroundColor: C.primary,
      borderRadius: Radii.full, paddingVertical: 13, paddingHorizontal: 28,
    },
    emptyBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.md, color: Colors.white },
  });
}
