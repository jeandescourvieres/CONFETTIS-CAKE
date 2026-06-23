import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { Button3D } from '../../../src/components/ui/Button3D';
import { useBroadcastTemplates, useSendBroadcast } from '../../../src/hooks/useBroadcast';
import { useContacts } from '../../../src/hooks/useContacts';
import type { CardTemplate } from '../../../src/services/autoSends.service';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

type Step = 1 | 2 | 3;
type TplSubStep = 'occasion' | 'ton' | 'longueur' | 'list';
type Occasion = 'newyear' | 'christmas' | 'easter' | 'greetings' | 'valentines' | 'mothersday' | 'fathersday' | 'halloween';
type Channel = 'sms' | 'email';
type Ton = 'tu' | 'vous';
type Longueur = 'court' | 'moyen' | 'long';

function getOccasionOptions(t: TFunction): { value: Occasion; label: string; emoji: string }[] {
  return [
    { value: 'newyear',    label: t('broadcast.occasionNewyear'),    emoji: '🎆' },
    { value: 'christmas',  label: t('broadcast.occasionChristmas'),  emoji: '🎄' },
    { value: 'easter',     label: t('broadcast.occasionEaster'),     emoji: '🐣' },
    { value: 'greetings',  label: t('broadcast.occasionGreetings'),  emoji: '👋' },
    { value: 'valentines', label: t('broadcast.occasionValentines'), emoji: '💝' },
    { value: 'mothersday', label: t('broadcast.occasionMothersday'), emoji: '👩' },
    { value: 'fathersday', label: t('broadcast.occasionFathersday'), emoji: '👨' },
    { value: 'halloween',  label: t('broadcast.occasionHalloween'),  emoji: '🎃' },
  ];
}

function getChannelOptions(t: TFunction): { value: Channel; label: string; emoji: string }[] {
  return [
    { value: 'sms',   label: t('broadcast.channelSms'),   emoji: '📱' },
    { value: 'email', label: t('broadcast.channelEmail'), emoji: '📧' },
  ];
}

function getTonOptions(t: TFunction): { value: Ton; label: string; emoji: string }[] {
  return [
    { value: 'tu',   label: t('autoSends.tonTu'),   emoji: '😊' },
    { value: 'vous', label: t('autoSends.tonVous'), emoji: '🤝' },
  ];
}

function getLongueurOptions(t: TFunction): { value: Longueur; label: string; emoji: string }[] {
  return [
    { value: 'court', label: t('broadcast.longueurCourt'), emoji: '⚡' },
    { value: 'moyen', label: t('broadcast.longueurMoyen'), emoji: '📝' },
    { value: 'long',  label: t('broadcast.longueurLong'),  emoji: '📜' },
  ];
}

export default function NewBroadcastScreen() {
  const { t } = useTranslation();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();

  const OCCASION_OPTIONS = useMemo(() => getOccasionOptions(t), [t]);
  const CHANNEL_OPTIONS = useMemo(() => getChannelOptions(t), [t]);
  const TON_OPTIONS = useMemo(() => getTonOptions(t), [t]);
  const LONGUEUR_OPTIONS = useMemo(() => getLongueurOptions(t), [t]);
  const MODE_EMPLOI_LINES = useMemo(
    () => Array.from({ length: 10 }, (_, i) => t(`broadcast.modeEmploi.${i}`)),
    [t],
  );

  // Data
  const { data: templates = [], isLoading: tplLoading } = useBroadcastTemplates();
  const { data: contacts = [], isLoading: ctLoading } = useContacts();
  const { mutate: sendBroadcast, isPending: sending } = useSendBroadcast();

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [tplSubStep, setTplSubStep] = useState<TplSubStep>('occasion');
  const [occasion, setOccasion] = useState<Occasion>('newyear');
  const [ton, setTon] = useState<Ton | null>(null);
  const [longueur, setLongueur] = useState<Longueur | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customContent, setCustomContent] = useState('');
  const [expandedTplId, setExpandedTplId] = useState<string | null>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<Channel>('sms');

  const [contactSearch, setContactSearch] = useState('');
  const filteredContacts = useMemo(() => {
    const q = contactSearch.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, contactSearch]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => t.is_system && t.occasion === occasion && t.ton === ton && t.longueur === longueur);
  }, [templates, occasion, ton, longueur]);

  const goToTplSubStep = (next: TplSubStep) => {
    setSelectedTemplate(null);
    setTplSubStep(next);
  };

  const tplBackStep = (): TplSubStep | null => {
    switch (tplSubStep) {
      case 'ton': return 'occasion';
      case 'longueur': return 'ton';
      case 'list': return 'longueur';
      default: return null;
    }
  };

  const toggleContact = (id: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (filteredContacts.length === 0) return;
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      filteredContacts.forEach((c) => next.add(c.id));
      return next;
    });
  };

  const handleConfirm = () => {
    const content = customMode ? customContent.trim() : selectedTemplate?.content;
    if (!content) return;
    sendBroadcast(
      { contact_ids: [...selectedContactIds], content, occasion, channel },
      {
        onSuccess: (result) => {
          const skippedText = result.skipped > 0
            ? t(channel === 'sms' ? 'broadcast.resultSkippedPhone' : 'broadcast.resultSkippedEmail', { count: result.skipped })
            : '';
          Alert.alert(
            t('broadcast.resultTitle'),
            t('broadcast.resultSent', { count: result.sent }) + skippedText,
            [{ text: t('broadcast.ok'), onPress: () => router.back() }],
          );
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : t('errors.generic');
          Alert.alert(t('broadcast.errorTitle'), msg);
        },
      },
    );
  };

  const canProceed1 = customMode ? customContent.trim().length > 0 : !!selectedTemplate;
  const canProceed2 = selectedContactIds.size > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.topbar}>
        <TouchableOpacity
          onPress={() => {
            if (step === 1) {
              const prev = tplBackStep();
              if (prev) { setTplSubStep(prev); return; }
            }
            if (step > 1) { setStep((s) => (s - 1) as Step); return; }
            router.back();
          }}
          style={styles.backLink}
        >
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>
          {step === 1 ? t('broadcast.topbarStep1') : step === 2 ? t('broadcast.topbarStep2') : t('broadcast.topbarStep3')}
        </Text>
        <View style={{ minWidth: 70 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── STEP 1 : Message (entonnoir occasion → ton → longueur → liste) ── */}
        {step === 1 && (
          <>
            {tplSubStep === 'occasion' && (
              <>
                <FeatureIntroCard
                  introText={t('broadcast.introText')}
                  modeEmploiLines={MODE_EMPLOI_LINES}
                  containerStyle={{ marginBottom: Spacing[4] }}
                />
                <Text style={styles.stepHint}>{t('broadcast.occasionHint')}</Text>
                <View style={styles.styleGrid}>
                  {OCCASION_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.styleChip}
                      onPress={() => { setOccasion(opt.value); goToTplSubStep('ton'); }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                      <Text style={styles.optionLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {tplSubStep === 'ton' && (
              <>
                <Text style={styles.stepHint}>{t('broadcast.tonHint')}</Text>
                <View style={styles.optionRow}>
                  {TON_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.optionChip}
                      onPress={() => { setTon(opt.value); goToTplSubStep('longueur'); }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                      <Text style={styles.optionLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {tplSubStep === 'longueur' && (
              <>
                <Text style={styles.stepHint}>{t('broadcast.longueurHint')}</Text>
                <View style={styles.optionRow}>
                  {LONGUEUR_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.optionChip}
                      onPress={() => { setLongueur(opt.value); goToTplSubStep('list'); }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                      <Text style={styles.optionLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {tplSubStep === 'list' && (
              <>
                <Text style={styles.stepHint}>{t('broadcast.listHint')}</Text>

                {tplLoading ? (
                  <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
                ) : (
                  <View style={styles.tplGrid}>
                    {filteredTemplates.map((tpl) => {
                      const expanded = expandedTplId === tpl.id;
                      const isSelected = !customMode && selectedTemplate?.id === tpl.id;
                      return (
                        <TouchableOpacity
                          key={tpl.id}
                          style={[styles.tplCard, isSelected && styles.tplCardSelected]}
                          onPress={() => {
                            setSelectedTemplate(tpl);
                            setCustomMode(false);
                            setExpandedTplId((cur) => (cur === tpl.id ? null : tpl.id));
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.tplTitle}>{tpl.title}</Text>
                          <Text style={styles.tplPreview} numberOfLines={expanded ? undefined : 3}>{tpl.content}</Text>
                          <Text style={styles.tplExpandHint}>{expanded ? t('broadcast.expandLess') : t('broadcast.expandMore')}</Text>
                          {isSelected && (
                            <TouchableOpacity style={styles.tplConfirmBtn} onPress={() => setStep(2)} activeOpacity={0.85}>
                              <Text style={styles.tplConfirmBtnText}>{t('broadcast.useTemplateBtn')}</Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      );
                    })}

                    {/* Option : À ma façon */}
                    <TouchableOpacity
                      style={[styles.tplCard, styles.tplCardOwn, customMode && styles.tplCardSelected]}
                      onPress={() => { setCustomMode(true); setSelectedTemplate(null); }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.tplTitle}>{t('broadcast.ownWayTitle')}</Text>
                      <Text style={styles.tplPreview}>{t('broadcast.ownWayDesc')}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Custom message editor */}
                {customMode && (
                  <View style={styles.customEditor}>
                    <TextInput
                      style={styles.customContentInput}
                      value={customContent}
                      onChangeText={setCustomContent}
                      placeholder={t('broadcast.customContentPlaceholder')}
                      placeholderTextColor={Colors.onSurfaceVariant}
                      multiline
                      textAlignVertical="top"
                    />
                    <Text style={styles.customHint}>{t('broadcast.customHint')}</Text>
                    {customContent.trim().length > 0 && (
                      <TouchableOpacity style={styles.tplConfirmBtn} onPress={() => setStep(2)} activeOpacity={0.85}>
                        <Text style={styles.tplConfirmBtnText}>{t('broadcast.useCustomBtn')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            )}
          </>
        )}

        {/* ── STEP 2 : Contact picker ── */}
        {step === 2 && (
          <>
            <Text style={styles.stepHint}>
              {t('broadcast.contactsHint')}
            </Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                value={contactSearch}
                onChangeText={setContactSearch}
                placeholder={t('broadcast.searchPlaceholder')}
                placeholderTextColor={Colors.onSurfaceVariant}
              />
              <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
                <Text style={styles.selectAllText}>{t('broadcast.selectAllBtn')}</Text>
              </TouchableOpacity>
            </View>

            {ctLoading ? (
              <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.contactList}>
                {filteredContacts.map((contact) => {
                  const selected = selectedContactIds.has(contact.id);
                  return (
                    <TouchableOpacity
                      key={contact.id}
                      style={[styles.contactRow, selected && styles.contactRowSelected]}
                      onPress={() => toggleContact(contact.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.contactAvatar, { backgroundColor: selected ? C.primary : Colors.outlineVariant }]}>
                        <Text style={styles.contactAvatarText}>{contact.name[0].toUpperCase()}</Text>
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{contact.name}</Text>
                      </View>
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                        {selected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {selectedContactIds.size > 0 && (
              <View style={[styles.tplConfirmBtn, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.tplConfirmBtnText, { color: C.primary }]}>
                  {t('broadcast.selectedCount', { count: selectedContactIds.size })}
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── STEP 3 : Canal + envoi ── */}
        {step === 3 && (
          <>
            <Text style={styles.stepHint}>{t('broadcast.channelHint')}</Text>

            <Text style={styles.sectionLabel}>{t('broadcast.channelSectionLabel')}</Text>
            <View style={styles.optionRow}>
              {CHANNEL_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionChip, channel === opt.value && styles.optionChipSelected]}
                  onPress={() => setChannel(opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.optionLabel, channel === opt.value && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>{t('broadcast.summaryTitle')}</Text>
              <Text style={styles.summaryLine}>
                {OCCASION_OPTIONS.find((o) => o.value === occasion)?.emoji} <Text style={styles.summaryBold}>{t('broadcast.summaryOccasion')}</Text>{' '}
                {OCCASION_OPTIONS.find((o) => o.value === occasion)?.label}
              </Text>
              <Text style={styles.summaryLine}>
                📝 <Text style={styles.summaryBold}>{t('broadcast.summaryMessage')}</Text>{' '}
                {customMode ? t('broadcast.summaryCustomMessage') : (selectedTemplate?.title ?? '—')}
              </Text>
              <Text style={styles.summaryLine}>
                👥 <Text style={styles.summaryBold}>{t('broadcast.summaryContacts')}</Text>{' '}
                {t('broadcast.summarySelectedCount', { count: selectedContactIds.size })}
              </Text>
              <Text style={styles.summaryLine}>
                {channel === 'sms' ? '📱' : '📧'} <Text style={styles.summaryBold}>{t('broadcast.summaryChannel')}</Text>{' '}
                {CHANNEL_OPTIONS.find((o) => o.value === channel)?.label}
              </Text>
              <Text style={styles.summaryLine}>{t('broadcast.summaryNote')}</Text>
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA — masquée pendant les sous-étapes de filtre (occasion/ton/longueur) */}
      {(step !== 1 || tplSubStep === 'list') && (
        <View style={styles.bottomBar}>
          {step < 3 ? (
            <Button3D
              label={step === 2 && selectedContactIds.size > 0
                ? t('broadcast.continueWithCount', { count: selectedContactIds.size })
                : t('broadcast.continueBtn')}
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
              label={sending ? t('broadcast.sendingBtn') : t('broadcast.sendNowBtn')}
              onPress={handleConfirm}
              fullWidth
              size="lg"
              disabled={sending}
            />
          )}
        </View>
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

    // ── Template grid
    tplGrid: { gap: Spacing[3] },
    tplCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      borderWidth: 2,
      borderColor: 'transparent',
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
    tplExpandHint: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: C.primary,
      marginTop: 6,
    },
    tplConfirmBtn: {
      marginTop: 10,
      backgroundColor: C.primary,
      borderRadius: Radii.full,
      paddingVertical: 10,
      alignItems: 'center',
    },
    tplConfirmBtnText: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.sm,
      color: Colors.white,
    },

    // ── Custom editor
    customEditor: {
      marginTop: Spacing[4],
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
      minHeight: 120,
      lineHeight: 22,
    },
    customHint: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      lineHeight: 16,
    },

    // ── Contact picker
    searchRow: { flexDirection: 'row', gap: Spacing[2], marginBottom: Spacing[3], alignItems: 'center' },
    searchInput: {
      flex: 1,
      backgroundColor: Colors.white,
      borderRadius: Radii.lg,
      paddingHorizontal: Spacing[3],
      paddingVertical: 10,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      ...Shadows.sm,
    },
    selectAllBtn: {
      paddingHorizontal: Spacing[3],
      paddingVertical: 10,
      backgroundColor: C.primaryContainer,
      borderRadius: Radii.lg,
    },
    selectAllText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      color: C.primary,
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
    contactInfo: { flex: 1 },
    contactName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface },
    checkbox: {
      width: 24, height: 24, borderRadius: 12,
      borderWidth: 2, borderColor: Colors.outlineVariant,
      alignItems: 'center', justifyContent: 'center',
    },
    checkboxSelected: { backgroundColor: C.primary, borderColor: C.primary },
    checkmark: { fontSize: 13, color: Colors.white, lineHeight: 16 },

    // ── Step 3
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

    styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3] },
    styleChip: {
      flexBasis: '47%',
      flexGrow: 1,
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      alignItems: 'center',
      gap: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      ...Shadows.sm,
    },

    summary: {
      marginTop: Spacing[5],
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

    // ── Bottom bar
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
