import React, { useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTabScrollToTop } from '../../src/hooks/useTabScrollToTop';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { BackHeader } from '../../src/components/ui/BackHeader';
import { useContacts } from '../../src/hooks/useContacts';
import { useCreateStore } from '../../src/stores/createStore';
import { getCurrentZodiacSign, getContactsInZodiacSeason, getZodiacPortrait, getZodiacSignI18n, ZODIAC_ELEMENT_SLUG } from '../../src/utils/zodiac';

export default function ZodiacSeasonScreen() {
  const { t } = useTranslation();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const { data: contacts = [] } = useContacts();
  const { reset, setContact, setOccasion } = useCreateStore();
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop('zodiac-season', () => scrollRef.current?.scrollTo({ y: 0, animated: false }));

  const currentSign = getCurrentZodiacSign();
  const signText = useMemo(() => getZodiacSignI18n(currentSign, t), [currentSign, t]);
  const seasonContacts = useMemo(() => getContactsInZodiacSeason(contacts), [contacts]);

  const handleCelebrate = useCallback((contact: typeof contacts[0]) => {
    reset();
    setContact(contact.id, contact.name, contact.relation);
    setOccasion('custom');
    router.push('/(app)/create/' as never);
  }, [reset, setContact, setOccasion, router]);

  const handleContactPress = useCallback((contactId: string) => {
    router.push(`/(app)/contact/${contactId}` as never);
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title={t('zodiac.season.headerTitle')} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Intro ────────────────────────────────── */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{t('zodiac.season.introTitle')}</Text>
          <Text style={styles.introText}>{t('zodiac.season.introText')}</Text>
        </View>

        {/* ── En-tête ──────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>{t('zodiac.season.inSeason')}</Text>
          <View style={styles.headerPortraitRow}>
            <Text style={styles.headerSignEmoji}>{currentSign.emoji}</Text>
            <Text style={styles.headerPortrait}>{getZodiacPortrait(currentSign.name)}</Text>
          </View>
          <Text style={styles.headerSign}>{signText.name}</Text>
          <Text style={styles.headerDates}>{signText.dateRange}</Text>
        </View>

        {/* ── Carte signe ─────────────────────────── */}
        <View style={[styles.signCard, { borderLeftColor: C.primary }]}>
          <View style={styles.signCardTop}>
            <Text style={styles.signBigEmoji}>{currentSign.emoji}</Text>
            <View style={styles.signCardBody}>
              <Text style={styles.signCardName}>{signText.name}</Text>
              <Text style={styles.signCardElement}>
                {currentSign.elementEmoji} {t(`zodiac.elements.${ZODIAC_ELEMENT_SLUG[currentSign.element]}`)} · {signText.dateRange}
              </Text>
            </View>
          </View>
          <Text style={styles.signCardTrait}>{signText.trait}</Text>
          <Text style={styles.signCardDesc}>{signText.description}</Text>

          {/* Mots-clés */}
          <View style={styles.signKeywords}>
            {signText.keywords.map((kw) => (
              <View key={kw} style={[styles.signKeyword, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.signKeywordText, { color: C.primary }]}>{kw}</Text>
              </View>
            ))}
          </View>

          {/* Points forts */}
          <View style={[styles.signBlock, { borderLeftColor: C.primary }]}>
            <Text style={styles.signBlockLabel}>{t('zodiac.season.strengthsLabel')}</Text>
            <Text style={styles.signBlockText}>{signText.strengths}</Text>
          </View>

          {/* En relation */}
          <View style={[styles.signBlock, { borderLeftColor: '#E91E8C' }]}>
            <Text style={styles.signBlockLabel}>{t('zodiac.season.inRelationshipLabel')}</Text>
            <Text style={styles.signBlockText}>{signText.inRelationship}</Text>
          </View>
        </View>

        {/* ── Liste des contacts ───────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {seasonContacts.length > 0
              ? t('zodiac.season.contactsInSeason', { count: seasonContacts.length })
              : t('zodiac.season.noContactsInSeason')}
          </Text>
        </View>

        {seasonContacts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🌌</Text>
            <Text style={styles.emptyText}>{t('zodiac.season.emptyText', { signName: signText.name })}</Text>
          </View>
        ) : (
          <View style={styles.contactList}>
            {seasonContacts.map((contact, i) => {
              const initials = contact.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() ?? '')
                .join('');
              return (
                <View key={contact.id}>
                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={() => handleContactPress(contact.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.avatar, { backgroundColor: C.primary }]}>
                      <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactSign}>{currentSign.emoji} {signText.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.celebrateBtn, { backgroundColor: C.primary }]}
                      onPress={() => handleCelebrate(contact)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.celebrateBtnText}>{t('zodiac.season.celebrateBtn')}</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                  {i < seasonContacts.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingBottom: 80 },

    introCard: {
      marginHorizontal: Spacing[4],
      marginTop: Spacing[4],
      backgroundColor: '#EDE9FE',
      borderRadius: Radii.xl,
      padding: Spacing[4],
      gap: 6,
      borderTopWidth: 1.5,
      borderBottomWidth: 1.5,
      borderLeftWidth: 1.5,
      borderRightWidth: 1.5,
      borderColor: '#A78BFA',
    },
    introTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography.lg,
      color: '#5B21B6',
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: '#4C1D95',
      lineHeight: 22,
    },

    header: {
      paddingHorizontal: Spacing[4],
      paddingTop: Spacing[4],
      paddingBottom: Spacing[3],
      alignItems: 'center',
    },
    headerEyebrow: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.base,
      color: C.primary,
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    headerPortraitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    headerSignEmoji: { fontSize: 42, lineHeight: 52 },
    headerPortrait:  { fontSize: 52, lineHeight: 62 },
    headerSign: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['3xl'],
      color: Colors.onSurface,
      marginBottom: 4,
    },
    headerDates: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurfaceVariant,
    },

    signCard: {
      marginHorizontal: Spacing[4],
      marginTop: Spacing[3],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      borderLeftWidth: 4,
      padding: Spacing[4],
      gap: 12,
      ...Shadows.sm,
    },
    signCardTop: {
      flexDirection: 'row',
      gap: 14,
      alignItems: 'flex-start',
    },
    signBigEmoji: { fontSize: 38, lineHeight: 46 },
    signCardBody: { flex: 1, gap: 3 },
    signCardName: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.lg,
      color: Colors.onSurface,
    },
    signCardElement: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },
    signCardTrait: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.md,
      color: Colors.onSurface,
      fontStyle: 'italic',
    },
    signCardDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurfaceVariant,
      lineHeight: 23,
    },
    signKeywords: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    signKeyword: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: Radii.full,
    },
    signKeywordText: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
    },
    signBlock: {
      borderLeftWidth: 3,
      borderRadius: Radii.sm,
      paddingLeft: 10,
      gap: 4,
    },
    signBlockLabel: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: Colors.onSurface,
    },
    signBlockText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 20,
    },

    sectionHeader: {
      marginHorizontal: Spacing[4],
      marginTop: Spacing[5],
      marginBottom: Spacing[3],
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: Spacing[3],
    },
    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.xl,
      color: Colors.onSurface,
    },

    emptyCard: {
      marginHorizontal: Spacing[4],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      padding: Spacing[5],
      alignItems: 'center',
      gap: 12,
      ...Shadows.sm,
    },
    emptyEmoji: { fontSize: 40 },
    emptyText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 22,
    },

    contactList: {
      marginHorizontal: Spacing[4],
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      overflow: 'hidden',
      ...Shadows.sm,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: Spacing[4],
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.white,
    },
    contactInfo: { flex: 1 },
    contactName: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.md,
      color: Colors.onSurface,
    },
    contactSign: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      marginTop: 2,
    },
    celebrateBtn: {
      borderRadius: Radii.full,
      paddingVertical: 7,
      paddingHorizontal: 13,
      flexShrink: 0,
    },
    celebrateBtnText: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.sm,
      color: Colors.white,
    },
    divider: {
      height: 0.5,
      backgroundColor: Colors.surfaceContainerHighest,
      marginLeft: Spacing[4],
    },
  });
}
