import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { Button3D } from '../../../src/components/ui/Button3D';
import { useContacts } from '../../../src/hooks/useContacts';
import { useCreateGroupReminder } from '../../../src/hooks/useGroupReminders';

type Step = 1 | 2 | 3;
type TriggerEvent = 'birthday' | 'nameday';
type Channel = 'sms' | 'email';

const DAYS_BEFORE_OPTIONS = [1, 3, 7, 14];

function getChannelOptions(t: TFunction): { value: Channel; label: string; emoji: string }[] {
  return [
    { value: 'sms',   label: t('groupReminders.channelSms'),   emoji: '📱' },
    { value: 'email', label: t('groupReminders.channelEmail'), emoji: '📧' },
  ];
}

function formatMmdd(mmdd: string, locale: string): string {
  const [m, d] = mmdd.split('-').map(Number);
  const date = new Date(2001, m - 1, d);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
}

function extractFirstName(name: string): string {
  return name.split(' ').slice(1).join(' ') || name.split(' ')[0];
}

export default function NewGroupReminderScreen() {
  const { t, i18n } = useTranslation();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();

  const CHANNEL_OPTIONS = useMemo(() => getChannelOptions(t), [t]);

  const { data: contacts = [] } = useContacts();
  const { mutate: createReminder, isPending: saving } = useCreateGroupReminder();

  const [step, setStep] = useState<Step>(1);
  const [contactSearch, setContactSearch] = useState('');
  const [contactId, setContactId] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<TriggerEvent | null>(null);
  const [daysBefore, setDaysBefore] = useState<number>(3);
  const [customMode, setCustomMode] = useState(false);
  const [customContent, setCustomContent] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [recipientIds, setRecipientIds] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<Channel>('sms');

  const selectedContact = contacts.find((c) => c.id === contactId) ?? null;

  const filteredContacts = useMemo(() => {
    const q = contactSearch.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, contactSearch]);

  const availableTriggers = useMemo(() => {
    if (!selectedContact) return [];
    const opts: { value: TriggerEvent; label: string; emoji: string }[] = [];
    if (selectedContact.birthday) opts.push({ value: 'birthday', label: t('groupReminders.occasionBirthday'), emoji: '🎁' });
    if (selectedContact.name_day) opts.push({ value: 'nameday', label: t('groupReminders.occasionNameday'), emoji: '🌸' });
    return opts;
  }, [selectedContact, t]);

  const eventMmdd = useMemo(() => {
    if (!selectedContact || !trigger) return null;
    if (trigger === 'birthday' && selectedContact.birthday) {
      const parts = selectedContact.birthday.split('-');
      return `${parts[1]}-${parts[2]}`;
    }
    if (trigger === 'nameday' && selectedContact.name_day) return selectedContact.name_day;
    return null;
  }, [selectedContact, trigger]);

  const autoMessage = useMemo(() => {
    if (!selectedContact || !trigger || !eventMmdd) return '';
    const occasionWord = t(trigger === 'birthday' ? 'groupReminders.occasionBirthdayLower' : 'groupReminders.occasionNamedayLower');
    return t('groupReminders.autoReminderText', {
      occasion: occasionWord,
      name: extractFirstName(selectedContact.name),
      date: formatMmdd(eventMmdd, i18n.language),
    });
  }, [selectedContact, trigger, eventMmdd, t, i18n.language]);

  const recipientCandidates = useMemo(() => {
    const q = recipientSearch.toLowerCase();
    return contacts.filter((c) => c.id !== contactId && c.name.toLowerCase().includes(q));
  }, [contacts, contactId, recipientSearch]);

  const toggleRecipient = (id: string) => {
    setRecipientIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    if (!contactId || !trigger) return;
    const content = customMode ? customContent.trim() : null;
    createReminder(
      {
        contact_id: contactId,
        trigger_event: trigger,
        days_before: daysBefore,
        content,
        channel,
        recipient_contact_ids: [...recipientIds],
      },
      {
        onSuccess: () => router.back(),
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : t('errors.generic');
          Alert.alert(t('common.error'), msg);
        },
      },
    );
  };

  const canProceed1 = !!contactId && !!trigger;
  const canProceed2 = customMode ? customContent.trim().length > 0 : true;
  const canProceed3 = recipientIds.size > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep((s) => (s - 1) as Step) : router.back())}
          style={styles.backLink}
        >
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>
          {step === 1 ? t('groupReminders.topbarStep1') : step === 2 ? t('groupReminders.topbarStep2') : t('groupReminders.topbarStep3')}
        </Text>
        <View style={{ minWidth: 70 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── STEP 1 : Contact concerné + occasion + délai ── */}
        {step === 1 && (
          <>
            <Text style={styles.stepHint}>{t('groupReminders.step1Hint')}</Text>

            <TextInput
              style={styles.searchInput}
              value={contactSearch}
              onChangeText={setContactSearch}
              placeholder={t('groupReminders.searchPlaceholder')}
              placeholderTextColor={Colors.onSurfaceVariant}
            />

            <View style={styles.contactList}>
              {filteredContacts.map((contact) => {
                const selected = contactId === contact.id;
                return (
                  <TouchableOpacity
                    key={contact.id}
                    style={[styles.contactRow, selected && styles.contactRowSelected]}
                    onPress={() => { setContactId(contact.id); setTrigger(null); }}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.contactAvatar, { backgroundColor: selected ? C.primary : Colors.outlineVariant }]}>
                      <Text style={styles.contactAvatarText}>{contact.name[0].toUpperCase()}</Text>
                    </View>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedContact && (
              <>
                <Text style={styles.sectionLabel}>{t('groupReminders.occasionLabel')}</Text>
                {availableTriggers.length === 0 ? (
                  <Text style={styles.warningText}>
                    {t('groupReminders.noDateWarning', { name: extractFirstName(selectedContact.name) })}
                  </Text>
                ) : (
                  <View style={styles.optionRow}>
                    {availableTriggers.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.optionChip, trigger === opt.value && styles.optionChipSelected]}
                        onPress={() => setTrigger(opt.value)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                        <Text style={[styles.optionLabel, trigger === opt.value && styles.optionLabelSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}

            {trigger && (
              <>
                <Text style={styles.sectionLabel}>{t('groupReminders.daysBeforeLabel')}</Text>
                <View style={styles.daysRow}>
                  {DAYS_BEFORE_OPTIONS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dayChip, daysBefore === d && styles.optionChipSelected]}
                      onPress={() => setDaysBefore(d)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionLabel, daysBefore === d && styles.optionLabelSelected]}>{t('groupReminders.daysUnit', { count: d })}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {/* ── STEP 2 : Message ── */}
        {step === 2 && (
          <>
            <Text style={styles.stepHint}>{t('groupReminders.step2Hint')}</Text>

            <TouchableOpacity
              style={[styles.tplCard, !customMode && styles.tplCardSelected]}
              onPress={() => setCustomMode(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.tplTitle}>{t('groupReminders.autoGeneratedTitle')}</Text>
              <Text style={styles.tplPreview}>{autoMessage}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tplCard, styles.tplCardOwn, customMode && styles.tplCardSelected]}
              onPress={() => setCustomMode(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.tplTitle}>{t('groupReminders.ownWayTitle')}</Text>
              <Text style={styles.tplPreview}>{t('groupReminders.ownWayDesc')}</Text>
            </TouchableOpacity>

            {customMode && (
              <View style={styles.customEditor}>
                <TextInput
                  style={styles.customContentInput}
                  value={customContent}
                  onChangeText={setCustomContent}
                  placeholder={t('groupReminders.customContentPlaceholder', { name: selectedContact ? extractFirstName(selectedContact.name) : 'Mamie' })}
                  placeholderTextColor={Colors.onSurfaceVariant}
                  multiline
                  textAlignVertical="top"
                />
                <Text style={styles.customHint}>{t('groupReminders.customHint')}</Text>
              </View>
            )}
          </>
        )}

        {/* ── STEP 3 : Destinataires + canal ── */}
        {step === 3 && (
          <>
            <Text style={styles.stepHint}>{t('groupReminders.step3Hint')}</Text>

            <TextInput
              style={styles.searchInput}
              value={recipientSearch}
              onChangeText={setRecipientSearch}
              placeholder={t('groupReminders.searchPlaceholder')}
              placeholderTextColor={Colors.onSurfaceVariant}
            />

            <View style={styles.contactList}>
              {recipientCandidates.map((contact) => {
                const selected = recipientIds.has(contact.id);
                return (
                  <TouchableOpacity
                    key={contact.id}
                    style={[styles.contactRow, selected && styles.contactRowSelected]}
                    onPress={() => toggleRecipient(contact.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.contactAvatar, { backgroundColor: selected ? C.primary : Colors.outlineVariant }]}>
                      <Text style={styles.contactAvatarText}>{contact.name[0].toUpperCase()}</Text>
                    </View>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {recipientIds.size > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t('groupReminders.summaryChannel')}</Text>
                <View style={styles.optionRow}>
                  {CHANNEL_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.optionChip, channel === opt.value && styles.optionChipSelected]}
                      onPress={() => setChannel(opt.value)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                      <Text style={[styles.optionLabel, channel === opt.value && styles.optionLabelSelected]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.summary}>
                  <Text style={styles.summaryTitle}>{t('groupReminders.summaryTitle')}</Text>
                  <Text style={styles.summaryLine}>
                    🎯 <Text style={styles.summaryBold}>{t('groupReminders.summaryConcerned')}</Text> {selectedContact?.name}
                  </Text>
                  <Text style={styles.summaryLine}>
                    ⏰ <Text style={styles.summaryBold}>{t('groupReminders.summaryWhen')}</Text>{' '}
                    {t('groupReminders.summaryWhenValue', {
                      count: daysBefore,
                      occasion: t(trigger === 'birthday' ? 'groupReminders.occasionBirthdayLower' : 'groupReminders.occasionNamedayLower'),
                    })}
                  </Text>
                  <Text style={styles.summaryLine}>
                    👥 <Text style={styles.summaryBold}>{t('groupReminders.summaryRecipients')}</Text>{' '}
                    {t('groupReminders.summaryRecipientsCount', { count: recipientIds.size })}
                  </Text>
                  <Text style={styles.summaryLine}>
                    {channel === 'sms' ? '📱' : '📧'} <Text style={styles.summaryBold}>{t('groupReminders.summaryChannel')}</Text>{' '}
                    {CHANNEL_OPTIONS.find((o) => o.value === channel)?.label}
                  </Text>
                </View>
              </>
            )}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        {step < 3 ? (
          <Button3D
            label={t('groupReminders.continueBtn')}
            onPress={() => {
              if (step === 1 && !canProceed1) return;
              if (step === 2 && !canProceed2) return;
              setStep((s) => (s + 1) as Step);
            }}
            fullWidth
            size="lg"
            disabled={(step === 1 && !canProceed1) || (step === 2 && !canProceed2)}
          />
        ) : (
          <Button3D
            label={saving ? t('groupReminders.savingBtn') : t('groupReminders.confirmBtn')}
            onPress={handleConfirm}
            fullWidth
            size="lg"
            disabled={saving || !canProceed3}
          />
        )}
      </View>
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
    topbarTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.onSurface, flex: 1, textAlign: 'center' },

    progressBar: { height: 3, backgroundColor: Colors.surfaceContainerHighest },
    progressFill: { height: 3, backgroundColor: C.primary },

    content: { padding: Spacing[4], paddingBottom: 40 },
    stepHint: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      marginBottom: Spacing[4],
      lineHeight: 20,
    },

    searchInput: {
      backgroundColor: Colors.white,
      borderRadius: Radii.lg,
      paddingHorizontal: Spacing[3],
      paddingVertical: 10,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      marginBottom: Spacing[3],
      ...Shadows.sm,
    },
    contactList: { gap: Spacing[2] },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[3],
      borderWidth: 2,
      borderColor: 'transparent',
      ...Shadows.sm,
    },
    contactRowSelected: { borderColor: C.primary },
    contactAvatar: {
      width: 40, height: 40, borderRadius: 20,
      alignItems: 'center', justifyContent: 'center',
    },
    contactAvatarText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.sm, color: Colors.white },
    contactName: { flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface },
    checkbox: {
      width: 24, height: 24, borderRadius: 12,
      borderWidth: 2, borderColor: Colors.outlineVariant,
      alignItems: 'center', justifyContent: 'center',
    },
    checkboxSelected: { backgroundColor: C.primary, borderColor: C.primary },
    checkmark: { fontSize: 13, color: Colors.white, lineHeight: 16 },

    sectionLabel: {
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: 8,
      paddingVertical: 4,
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: C.primary,
      marginTop: Spacing[4],
      marginBottom: Spacing[2],
    },
    warningText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.error,
      lineHeight: 20,
      backgroundColor: Colors.error + '15',
      borderRadius: Radii.lg,
      padding: Spacing[3],
    },
    optionRow: { flexDirection: 'row', gap: Spacing[3] },
    optionChip: {
      flex: 1,
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      alignItems: 'center',
      gap: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      ...Shadows.sm,
    },
    optionChipSelected: { borderColor: C.primary, backgroundColor: C.primaryContainer },
    optionEmoji: { fontSize: 28 },
    optionLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      textAlign: 'center',
    },
    optionLabelSelected: { color: C.primary },

    daysRow: { flexDirection: 'row', gap: Spacing[2] },
    dayChip: {
      flex: 1,
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      paddingVertical: Spacing[3],
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      ...Shadows.sm,
    },

    tplCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      borderWidth: 2,
      borderColor: 'transparent',
      marginBottom: Spacing[3],
      ...Shadows.sm,
    },
    tplCardSelected: { borderColor: C.primary, backgroundColor: C.primaryContainer },
    tplCardOwn: { borderStyle: 'dashed', borderWidth: 2, borderColor: Colors.outlineVariant },
    tplTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      marginBottom: 6,
    },
    tplPreview: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      lineHeight: 16,
      fontStyle: 'italic',
    },

    customEditor: {
      marginTop: Spacing[2],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: Spacing[3],
      ...Shadows.sm,
    },
    customContentInput: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      minHeight: 100,
      lineHeight: 22,
    },
    customHint: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      lineHeight: 16,
    },

    summary: {
      marginTop: Spacing[4],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: Spacing[2],
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      ...Shadows.sm,
    },
    summaryTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
      marginBottom: Spacing[1],
    },
    summaryLine: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      lineHeight: 22,
    },
    summaryBold: { fontFamily: 'BeVietnamPro_700Bold' },

    bottomBar: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: Spacing[4],
      paddingBottom: 28,
      backgroundColor: Colors.background,
      borderTopWidth: 0.5,
      borderTopColor: Colors.surfaceContainerHighest,
    },
  });
}
