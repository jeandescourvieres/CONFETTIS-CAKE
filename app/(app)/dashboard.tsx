import React, { useMemo, useRef } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { BackHeader } from '../../src/components/ui/BackHeader';

// ── Navigation grid ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { emoji: '✨', key: 'create',         route: '/(app)/create'          },
  { emoji: '📅', key: 'calendar',       route: '/(app)/calendar'        },
  { emoji: '✉️', key: 'messages',       route: '/(app)/creations'       },
  { emoji: '👥', key: 'contacts',       route: '/(app)/contacts'        },
  { emoji: '🎴', key: 'cards',          route: '/(app)/cards'           },
  { emoji: '🔍', key: 'search',         route: '/(app)/search'          },
  { emoji: '🎉', key: 'reactions',      route: '/(app)/reactions'       },
  { emoji: '🔤', key: 'explorePrenoms', route: '/(app)/explore/prenoms' },
  { emoji: '🌍', key: 'exploreNoms',    route: '/(app)/explore/noms'    },
  { emoji: '🎁', key: 'pot',            route: '/(app)/pot'             },
  { emoji: '⬛', key: 'qr',             route: '/(app)/qr'              },
  { emoji: '📒', key: 'guestbook',      route: '/(app)/guestbook'       },
  { emoji: '⏰', key: 'reminders',      route: '/(app)/reminders'       },
  { emoji: '🎟️', key: 'referral',       route: '/(app)/referral'        },
  { emoji: '🔔', key: 'notifications',  route: '/(app)/notifications'   },
  { emoji: '💑', key: 'compat',         route: '/(app)/compat'          },
  { emoji: '🔢', key: 'numerologie',    route: '/(app)/numerologie'     },
  { emoji: '⭐', key: 'zodiac',         route: '/(app)/zodiac-season'   },
  { emoji: '💑', key: 'couple',         route: '/(app)/couple'          },
  { emoji: '🐾', key: 'animaux',        route: '/(app)/animaux'         },
  { emoji: '🗓️', key: 'agenda',         route: '/(app)/agenda'          },
  { emoji: '📖', key: 'help',           route: '/(app)/help'            },
  { emoji: '⚙️', key: 'settings',       route: '/(app)/settings'        },
  { emoji: '👤', key: 'profile',        route: '/(app)/profile'         },
] as const;

export default function DashboardScreen() {
  const { t } = useTranslation();
  const C = useColors();
  const router = useRouter();
  const { profile } = useAuthStore();

  const isPremium = profile?.plan === 'premium';
  const credits = profile?.credits ?? 0;

  const styles = useMemo(() => makeStyles(C), [C]);
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop('dashboard', () => scrollRef.current?.scrollTo({ y: 0, animated: false }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title={t('dashboard.title')} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Credits card ─────────────────────────── */}
        <LinearGradient
          colors={isPremium ? ['#fdd34d', '#c97d10'] : [C.primary, C.primaryContainer]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.creditsCard}
        >
          <View style={styles.creditsRow}>
            <View>
              <Text style={styles.creditsLabel}>
                {isPremium ? t('dashboard.creditsPremiumLabel') : t('dashboard.creditsFreeLabel')}
              </Text>
              <Text style={styles.creditsValue}>
                {isPremium ? t('dashboard.unlimitedCreations') : t('dashboard.creditsRemaining', { count: credits })}
              </Text>
            </View>
            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => router.push('/(app)/profile/premium' as never)}
                activeOpacity={0.85}
              >
                <Text style={styles.upgradeBtnText}>{t('dashboard.upgradeBtn')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isPremium && (
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsInfoText}>{t('dashboard.creditTip1')}</Text>
              <Text style={styles.creditsInfoText}>{t('dashboard.creditTip2')}</Text>
              <Text style={styles.creditsUpsellText}>{t('dashboard.creditsUpsell')}</Text>
            </View>
          )}
        </LinearGradient>

        {/* ── Intro navigation ─────────────────────── */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{t('dashboard.introTitle')}</Text>
          <Text style={styles.introText}>{t('dashboard.introText')}</Text>
        </View>

        {/* ── Guide A-Z ────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/(app)/glossaire' as never)}
          activeOpacity={0.85}
          style={{ marginBottom: 16, backgroundColor: C.primaryContainer, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.primary + '40' }}
        >
          <Text style={{ fontSize: 28 }}>📚</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: C.primary }}>{t('dashboard.guideTitle')}</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#666', marginTop: 2, lineHeight: 17 }}>{t('dashboard.guideSub')}</Text>
          </View>
          <Text style={{ color: C.primary, fontSize: 20 }}>›</Text>
        </TouchableOpacity>

        {/* ── Aide & mode d'emploi ──────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/(app)/help' as never)}
          activeOpacity={0.85}
          style={{ marginBottom: 16, backgroundColor: C.primaryContainer, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.primary + '40' }}
        >
          <Text style={{ fontSize: 28 }}>📖</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: C.primary }}>{t('dashboard.helpTitle')}</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#666', marginTop: 2, lineHeight: 17 }}>{t('dashboard.helpSub')}</Text>
          </View>
          <Text style={{ color: C.primary, fontSize: 20 }}>›</Text>
        </TouchableOpacity>

        {/* ── Navigation grid ──────────────────────── */}
        <Text style={styles.sectionTitle}>{t('dashboard.navSectionTitle')}</Text>
        <View style={styles.grid}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.gridItem}
              onPress={() => router.push({ pathname: item.route as never, params: { backTo: '/(app)/dashboard' } } as never)}
              activeOpacity={0.8}
            >
              <Text style={styles.gridEmoji}>{item.emoji}</Text>
              <Text style={styles.gridLabel}>{t(`dashboard.nav.${item.key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: Spacing[2],
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    letterSpacing: 0.4,
    color: C.primary,
    marginTop: 2,
    textAlign: 'center',
  },

  // Credits
  creditsCard: {
    margin: Spacing[4],
    borderRadius: Radii['2xl'],
    padding: Spacing[5],
    gap: 12,
    ...Shadows.lg,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditsLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  creditsValue: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.white,
  },
  upgradeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  upgradeBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  creditsInfo: {
    gap: 4,
  },
  creditsInfoText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  creditsUpsellText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fff',
    marginTop: 2,
  },

  // Intro
  introCard: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    gap: 8,
  },
  introTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: C.primary,
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },

  // Section title
  sectionTitle: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: 8,
    paddingVertical: 4,    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: C.primary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
    marginHorizontal: Spacing[4],
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[4],
    gap: 12,
  },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...Shadows.sm,
  },
  gridEmoji: { fontSize: 26 },
  gridLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  });
}
