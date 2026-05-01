import React, { useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { BackHeader } from '../../src/components/ui/BackHeader';
import { useContacts } from '../../src/hooks/useContacts';
import { useCreateStore } from '../../src/stores/createStore';
import { getCurrentZodiacSign, getContactsInZodiacSeason } from '../../src/utils/zodiac';

export default function ZodiacSeasonScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const { data: contacts = [] } = useContacts();
  const { reset, setContact, setOccasion } = useCreateStore();
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const currentSign = getCurrentZodiacSign();
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
      <BackHeader title="" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── En-tête ──────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>En saison ✨</Text>
          <Text style={styles.headerSign}>{currentSign.emoji}  {currentSign.name}</Text>
          <Text style={styles.headerDates}>{currentSign.dateRange}</Text>
        </View>

        {/* ── Carte signe ─────────────────────────── */}
        <View style={[styles.signCard, { borderLeftColor: C.primary }]}>
          <View style={styles.signCardTop}>
            <Text style={styles.signBigEmoji}>{currentSign.emoji}</Text>
            <View style={styles.signCardBody}>
              <Text style={styles.signCardName}>{currentSign.name}</Text>
              <Text style={styles.signCardElement}>
                {currentSign.elementEmoji} {currentSign.element} · {currentSign.dateRange}
              </Text>
            </View>
          </View>
          <Text style={styles.signCardTrait}>{currentSign.trait}</Text>
          <Text style={styles.signCardDesc}>{currentSign.description}</Text>

          {/* Mots-clés */}
          <View style={styles.signKeywords}>
            {currentSign.keywords.map((kw) => (
              <View key={kw} style={[styles.signKeyword, { backgroundColor: C.primaryContainer }]}>
                <Text style={[styles.signKeywordText, { color: C.primary }]}>{kw}</Text>
              </View>
            ))}
          </View>

          {/* Points forts */}
          <View style={[styles.signBlock, { borderLeftColor: C.primary }]}>
            <Text style={styles.signBlockLabel}>💪 Points forts</Text>
            <Text style={styles.signBlockText}>{currentSign.strengths}</Text>
          </View>

          {/* En relation */}
          <View style={[styles.signBlock, { borderLeftColor: '#E91E8C' }]}>
            <Text style={styles.signBlockLabel}>💛 En relation</Text>
            <Text style={styles.signBlockText}>{currentSign.inRelationship}</Text>
          </View>
        </View>

        {/* ── Liste des contacts ───────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {seasonContacts.length > 0
              ? `${seasonContacts.length} contact${seasonContacts.length > 1 ? 's' : ''} en saison`
              : 'Aucun contact en saison'}
          </Text>
        </View>

        {seasonContacts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🌌</Text>
            <Text style={styles.emptyText}>
              Aucun de tes contacts n'est {currentSign.name} pour le moment.{'\n'}
              Ajoute des contacts avec leur date de naissance pour les voir apparaître ici !
            </Text>
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
                      <Text style={styles.contactSign}>{currentSign.emoji} {currentSign.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.celebrateBtn, { backgroundColor: C.primary }]}
                      onPress={() => handleCelebrate(contact)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.celebrateBtnText}>🌟 Célébrer</Text>
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
      marginBottom: 4,
    },
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
