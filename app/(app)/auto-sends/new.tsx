import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { useTemplates, useCreateScheduledSend, useCreateCustomTemplate } from '../../../src/hooks/useAutoSends';
import { useContacts } from '../../../src/hooks/useContacts';
import type { CardTemplate } from '../../../src/services/autoSends.service';

type Step = 1 | 2 | 3;
type TriggerEvent = 'birthday' | 'nameday';
type Channel = 'sms' | 'email';

const TRIGGER_OPTIONS: { value: TriggerEvent; label: string; emoji: string }[] = [
  { value: 'birthday', label: 'Anniversaire', emoji: '🎁' },
  { value: 'nameday',  label: 'Fête du prénom', emoji: '🌸' },
];

const CHANNEL_OPTIONS: { value: Channel; label: string; emoji: string }[] = [
  { value: 'sms',   label: 'SMS',   emoji: '📱' },
  { value: 'email', label: 'Email', emoji: '📧' },
];

export default function NewAutoSendScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();

  // Data
  const { data: templates = [], isLoading: tplLoading } = useTemplates();
  const { data: contacts = [], isLoading: ctLoading } = useContacts();
  const { mutate: createSend, isPending: saving } = useCreateScheduledSend();
  const { mutate: createTpl, isPending: savingTpl } = useCreateCustomTemplate();

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [trigger, setTrigger] = useState<TriggerEvent>('birthday');
  const [channel, setChannel] = useState<Channel>('sms');

  const [contactSearch, setContactSearch] = useState('');

  const filteredContacts = useMemo(() => {
    const q = contactSearch.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, contactSearch]);

  // Contacts with birthdays / namedays for relevance indicator
  const relevantContacts = useMemo(() => {
    return new Set(
      contacts
        .filter((c) => trigger === 'birthday' ? !!c.birthday : !!c.name_day)
        .map((c) => c.id),
    );
  }, [contacts, trigger]);

  const toggleContact = (id: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const relevant = filteredContacts.filter((c) => relevantContacts.has(c.id));
    if (relevant.length === 0) return;
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      relevant.forEach((c) => next.add(c.id));
      return next;
    });
  };

  const handleConfirm = () => {
    if (customMode) {
      const title = customTitle.trim() || 'Mon modèle';
      const content = customContent.trim();
      if (!content) return;
      createTpl(
        { title, content },
        {
          onSuccess: (tpl) => {
            createSend(
              { template_id: tpl.id, contact_ids: [...selectedContactIds], trigger_event: trigger, channel },
              { onSuccess: () => router.back() },
            );
          },
        },
      );
    } else {
      if (!selectedTemplate) return;
      createSend(
        {
          template_id: selectedTemplate.id,
          contact_ids: [...selectedContactIds],
          trigger_event: trigger,
          channel,
        },
        { onSuccess: () => router.back() },
      );
    }
  };

  const canProceed1 = customMode ? customContent.trim().length > 0 : !!selectedTemplate;
  const canProceed2 = selectedContactIds.size > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => (step > 1 ? setStep((s) => (s - 1) as Step) : router.back())} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>
          {step === 1 ? '1/3 — Modèle de message' : step === 2 ? '2/3 — Contacts' : '3/3 — Déclencheur'}
        </Text>
        <View style={{ minWidth: 70 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── STEP 1 : Template picker ── */}
        {step === 1 && (
          <>
            <Text style={styles.stepHint}>Choisis un modèle ou compose ton propre message ✍️</Text>

            {tplLoading ? (
              <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.tplGrid}>
                {/* Modèles système */}
                {templates.filter((t) => t.is_system).map((tpl) => (
                  <TouchableOpacity
                    key={tpl.id}
                    style={[
                      styles.tplCard,
                      !customMode && selectedTemplate?.id === tpl.id && styles.tplCardSelected,
                    ]}
                    onPress={() => { setSelectedTemplate(tpl); setCustomMode(false); }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.tplTitle}>{tpl.title}</Text>
                    <Text style={styles.tplPreview} numberOfLines={3}>{tpl.content}</Text>
                  </TouchableOpacity>
                ))}

                {/* Mes modèles personnalisés */}
                {templates.filter((t) => !t.is_system).map((tpl) => (
                  <TouchableOpacity
                    key={tpl.id}
                    style={[
                      styles.tplCard,
                      styles.tplCardCustom,
                      !customMode && selectedTemplate?.id === tpl.id && styles.tplCardSelected,
                    ]}
                    onPress={() => { setSelectedTemplate(tpl); setCustomMode(false); }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.tplTitle}>{tpl.title}</Text>
                    <Text style={styles.tplPreview} numberOfLines={3}>{tpl.content}</Text>
                  </TouchableOpacity>
                ))}

                {/* Option : À ma façon */}
                <TouchableOpacity
                  style={[styles.tplCard, styles.tplCardOwn, customMode && styles.tplCardSelected]}
                  onPress={() => { setCustomMode(true); setSelectedTemplate(null); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tplTitle}>✍️ À ma façon</Text>
                  <Text style={styles.tplPreview}>Compose ton propre message personnalisé</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Custom message editor */}
            {customMode && (
              <View style={styles.customEditor}>
                <TextInput
                  style={styles.customTitleInput}
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="Titre du modèle (ex: Mon message chaleureux)"
                  placeholderTextColor={Colors.onSurfaceVariant}
                />
                <TextInput
                  style={styles.customContentInput}
                  value={customContent}
                  onChangeText={setCustomContent}
                  placeholder={"Ton message... utilise {prenom} pour insérer le prénom automatiquement.\n\nEx: Coucou {prenom}, joyeux anniversaire ! 🎉"}
                  placeholderTextColor={Colors.onSurfaceVariant}
                  multiline
                  textAlignVertical="top"
                />
                <Text style={styles.customHint}>
                  💡 Utilise <Text style={{ fontFamily: 'BeVietnamPro_700Bold' }}>{'{prenom}'}</Text> pour insérer le prénom du contact automatiquement.
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── STEP 2 : Contact picker ── */}
        {step === 2 && (
          <>
            <Text style={styles.stepHint}>
              Sélectionne les contacts qui recevront ce message automatiquement.
            </Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                value={contactSearch}
                onChangeText={setContactSearch}
                placeholder="Rechercher un contact…"
                placeholderTextColor={Colors.onSurfaceVariant}
              />
              <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
                <Text style={styles.selectAllText}>Tout sélectionner</Text>
              </TouchableOpacity>
            </View>

            {ctLoading ? (
              <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.contactList}>
                {filteredContacts.map((contact) => {
                  const selected = selectedContactIds.has(contact.id);
                  const hasEvent = relevantContacts.has(contact.id);
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
                        {!hasEvent && (
                          <Text style={styles.contactNoEvent}>
                            {trigger === 'birthday' ? 'Pas de date d\'anniversaire' : 'Pas de fête du prénom'}
                          </Text>
                        )}
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
              <View style={styles.selectionBadge}>
                <Text style={styles.selectionBadgeText}>
                  {selectedContactIds.size} contact{selectedContactIds.size > 1 ? 's' : ''} sélectionné{selectedContactIds.size > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── STEP 3 : Trigger + Channel ── */}
        {step === 3 && (
          <>
            <Text style={styles.stepHint}>Quand et comment envoyer ce message ?</Text>

            <Text style={styles.sectionLabel}>Occasion</Text>
            <View style={styles.optionRow}>
              {TRIGGER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionChip, trigger === opt.value && styles.optionChipSelected]}
                  onPress={() => setTrigger(opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.optionLabel, trigger === opt.value && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Canal d'envoi</Text>
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
              <Text style={styles.summaryTitle}>Récapitulatif</Text>
              <Text style={styles.summaryLine}>
                📝 <Text style={styles.summaryBold}>Modèle :</Text>{' '}
                {customMode ? (customTitle.trim() || 'Mon modèle') : (selectedTemplate?.title ?? '—')}
              </Text>
              <Text style={styles.summaryLine}>
                👥 <Text style={styles.summaryBold}>Contacts :</Text> {selectedContactIds.size} sélectionné{selectedContactIds.size > 1 ? 's' : ''}
              </Text>
              <Text style={styles.summaryLine}>
                {trigger === 'birthday' ? '🎁' : '🌸'} <Text style={styles.summaryBold}>Occasion :</Text>{' '}
                {TRIGGER_OPTIONS.find((o) => o.value === trigger)?.label}
              </Text>
              <Text style={styles.summaryLine}>
                {channel === 'sms' ? '📱' : '📧'} <Text style={styles.summaryBold}>Canal :</Text>{' '}
                {CHANNEL_OPTIONS.find((o) => o.value === channel)?.label}
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        {step < 3 ? (
          <TouchableOpacity
            style={[styles.nextBtn, !canProceed1 && step === 1 && styles.nextBtnDisabled, !canProceed2 && step === 2 && styles.nextBtnDisabled]}
            onPress={() => {
              if (step === 1 && !canProceed1) return;
              if (step === 2 && !canProceed2) return;
              setStep((s) => (s + 1) as Step);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Continuer →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, (saving || savingTpl) && styles.nextBtnDisabled]}
            onPress={handleConfirm}
            disabled={saving || savingTpl}
            activeOpacity={0.85}
          >
            {(saving || savingTpl) ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.nextBtnText}>✅ Programmer l'envoi</Text>
            )}
          </TouchableOpacity>
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
    tplCardCustom: { borderLeftWidth: 3, borderLeftColor: Colors.secondary },
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

    // ── Custom editor
    customEditor: {
      marginTop: Spacing[4],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: Spacing[3],
      ...Shadows.sm,
    },
    customTitleInput: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.md,
      color: Colors.onSurface,
      borderBottomWidth: 1,
      borderBottomColor: Colors.surfaceContainerHighest,
      paddingVertical: 8,
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
    contactNoEvent: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.outlineVariant, marginTop: 2 },
    checkbox: {
      width: 24, height: 24, borderRadius: 12,
      borderWidth: 2, borderColor: Colors.outlineVariant,
      alignItems: 'center', justifyContent: 'center',
    },
    checkboxSelected: { backgroundColor: C.primary, borderColor: C.primary },
    checkmark: { fontSize: 13, color: Colors.white, lineHeight: 16 },

    selectionBadge: {
      marginTop: Spacing[4],
      alignSelf: 'center',
      backgroundColor: C.primary,
      borderRadius: Radii.full,
      paddingVertical: 6,
      paddingHorizontal: 20,
    },
    selectionBadgeText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.sm,
      color: Colors.white,
    },

    // ── Step 3
    sectionLabel: {
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: 8,
      paddingVertical: 4,      fontFamily: 'BeVietnamPro_700Bold',
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
    nextBtn: {
      backgroundColor: C.primary,
      borderRadius: Radii.full,
      paddingVertical: 16,
      alignItems: 'center',
      ...Shadows.md,
    },
    nextBtnDisabled: { opacity: 0.45 },
    nextBtnText: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.md,
      color: Colors.white,
    },
  });
}
