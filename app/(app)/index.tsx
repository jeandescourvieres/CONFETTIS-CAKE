import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useUpcomingEvents } from '../../src/hooks/useContacts';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { useUpcomingCustomEvents } from '../../src/hooks/useCustomEvents';
import { useCreateStore } from '../../src/hooks/../stores/createStore';
import { humanDaysUntil, isUrgent, formatDate } from '../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useThemeStore } from '../../src/stores/themeStore';
import { useColors } from '../../src/hooks/useColors';
import type { UpcomingEvent } from '../../src/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Confetti décoratif ────────────────────────────────────────────────────────
const CONFETTI = ['💜', '🎉', '✨', '🎂', '💛', '🌸', '⭐', '🎁'];

function ConfettiBar() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.confettiBar} pointerEvents="none">
      {CONFETTI.map((c, i) => (
        <Text
          key={i}
          style={[
            styles.confettiItem,
            { top: Math.sin(i * 1.3) * 18 + 10, left: (i / CONFETTI.length) * (SCREEN_WIDTH - 40) },
          ]}
        >
          {c}
        </Text>
      ))}
    </View>
  );
}

// ── Ligne événement (liste verticale) ─────────────────────────────────────────
function EventRow({ event, onPress, onCreate }: {
  event: UpcomingEvent;
  onPress: () => void;
  onCreate?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const urgent = isUrgent(event.daysUntil);
  const initials = event.contact.name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');
  const isBirthday = event.eventType === 'birthday';

  return (
    <TouchableOpacity
      style={[styles.eventRow, urgent && styles.eventRowUrgent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.eventAvatar, urgent && styles.eventAvatarUrgent]}>
        <Text style={styles.eventAvatarText}>{initials}</Text>
        {urgent && (
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventName} numberOfLines={1}>{event.contact.name}</Text>
        <Text style={[styles.eventDays, urgent && styles.eventDaysUrgent]}>
          {isBirthday && event.contact.birthday
            ? `Né·e le ${formatDate(event.contact.birthday, 'd MMMM yyyy')} · ${humanDaysUntil(event.daysUntil)}`
            : humanDaysUntil(event.daysUntil)}
        </Text>
      </View>

      {urgent && onCreate ? (
        <TouchableOpacity
          style={styles.createBtn}
          onPress={(e) => { e.stopPropagation(); onCreate(); }}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>✦ Créer un message avec l'IA</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.eventChevron}>›</Text>
      )}
    </TouchableOpacity>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ title, action, onAction }: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.seeAll}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Quick action button ────────────────────────────────────────────────────────
function QuickAction({ emoji, label, onPress, accent }: {
  emoji: string;
  label: string;
  onPress: () => void;
  accent?: boolean;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity
      style={[styles.quickAction, accent && styles.quickActionAccent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.quickActionEmoji}>{emoji}</Text>
      <Text style={[styles.quickActionLabel, accent && styles.quickActionLabelAccent]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Carte message récent ───────────────────────────────────────────────────────
function RecentMessageCard({ contactName, format, status, onPress }: {
  contactName: string;
  format: string;
  status: string;
  onPress: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const formatEmoji: Record<string, string> = { song: '🎵', poem: '✍️', message: '💬', joke: '✨' };
  const statusLabel: Record<string, string> = { draft: 'Brouillon', sent: 'Envoyé' };
  return (
    <TouchableOpacity style={styles.recentCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.recentEmoji}>{formatEmoji[format] ?? '💬'}</Text>
      <View style={styles.recentInfo}>
        <Text style={styles.recentName}>{contactName}</Text>
        <Text style={styles.recentStatus}>{statusLabel[status] ?? status}</Text>
      </View>
      <Text style={styles.recentArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ── Empty section placeholder ──────────────────────────────────────────────────
function EmptySection({ emoji, text, btnLabel, onPress }: {
  emoji: string;
  text: string;
  btnLabel?: string;
  onPress?: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.emptySection}>
      <Text style={styles.emptySectionEmoji}>{emoji}</Text>
      <Text style={styles.emptySectionText}>{text}</Text>
      {btnLabel && onPress && (
        <TouchableOpacity style={styles.emptySectionBtn} onPress={onPress}>
          <Text style={styles.emptySectionBtnText}>{btnLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const appTheme = useThemeStore((s) => s.theme);
  const events = useUpcomingEvents(30);
  const { data: messages = [] } = useMessages();
  const customEvents = useUpcomingCustomEvents(365);
  const { reset, setContact, setOccasion } = useCreateStore();

  const birthdayEvents = events.filter((e) => e.eventType === 'birthday');
  const nameDayEvents = events.filter((e) => e.eventType === 'name_day');
  const urgentBirthdays = birthdayEvents.filter((e) => isUrgent(e.daysUntil)).length;
  const urgentNameDays  = nameDayEvents.filter((e) => isUrgent(e.daysUntil)).length;
  const recentMessages = messages.slice(0, 3);

  // Événements aujourd'hui ou demain
  const imminentEvents = events.filter((e) => e.daysUntil <= 1);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'toi';
  const greeting = getGreeting(firstName, t);

  const tagline = buildTagline(urgentBirthdays, urgentNameDays);

  const handleEventPress = useCallback(
    (event: UpcomingEvent) => router.push(`/(app)/contact/${event.contact.id}` as never),
    [router],
  );

  const handleCreate = useCallback(
    (event: UpcomingEvent) => {
      router.push({
        pathname: '/(app)/create/',
        params: { contactId: event.contact.id },
      } as never);
    },
    [router],
  );

  // Lance la génération automatique depuis l'accueil
  const handleQuickSend = useCallback(
    (event: UpcomingEvent) => {
      reset();
      setContact(event.contact.id, event.contact.name, event.contact.relation);
      setOccasion(event.eventType === 'birthday' ? 'birthday' : 'nameday');
      router.push({
        pathname: '/(app)/create/preview',
        params: { autoGen: '1' },
      } as never);
    },
    [reset, setContact, setOccasion, router],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero ──────────────────────────────────────── */}
        <LinearGradient
          colors={appTheme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <ConfettiBar />
          <TouchableOpacity
            style={styles.cakeBtn}
            onPress={() => router.push('/welcome' as never)}
            activeOpacity={0.75}
          >
            <Text style={styles.cakeBtnText}>Accueil</Text>
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>{greeting}</Text>
            <Text style={styles.heroTagline}>{tagline}</Text>
          </View>
        </LinearGradient>

        {/* ── Aujourd'hui & Demain ──────────────────────── */}
        <View style={styles.imminentSection}>
          <Text style={styles.imminentTitle}>Dans ton agenda, pour aujourd'hui et demain :</Text>
          {imminentEvents.length > 0 ? imminentEvents.map((event) => {
            const dayLabel = event.daysUntil === 0 ? "Aujourd'hui" : 'Demain';
            const eventEmoji = event.eventType === 'birthday' ? '🎂' : '🌸';
            return (
              <View key={`${event.contact.id}-${event.eventType}`} style={styles.imminentCard}>
                <View style={styles.imminentLeft}>
                  <Text style={styles.imminentEmoji}>{eventEmoji}</Text>
                  <View>
                    <Text style={styles.imminentName}>{event.contact.name}</Text>
                    <Text style={styles.imminentDay}>{dayLabel} · {event.eventType === 'birthday' ? 'Anniversaire' : 'Fête'}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.imminentBtn}
                  activeOpacity={0.8}
                  onPress={() => handleQuickSend(event)}
                >
                  <Text style={styles.imminentBtnText}>✨ Envoyer</Text>
                </TouchableOpacity>
              </View>
            );
          }) : (
            <View style={styles.imminentEmpty}>
              <Text style={styles.imminentEmptyText}>😌 Rien en vue, tout est calme ✨</Text>
            </View>
          )}
        </View>

        {/* ── Événements à venir (résumé cliquable) ─────── */}
        <Text style={[styles.imminentTitle, { paddingHorizontal: Spacing[4], marginTop: Spacing[5] }]}>Pour les jours suivants :</Text>
        <View style={styles.eventSummaryList}>
          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push('/(app)/calendar' as never)}
          >
            <Text style={styles.eventSummaryEmoji}>🎂</Text>
            <Text style={styles.eventSummaryLabel}>{t('home.birthdays')}</Text>
            {birthdayEvents.length > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{birthdayEvents.length}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push({ pathname: '/(app)/calendar', params: { type: 'name_day' } } as never)}
          >
            <Text style={styles.eventSummaryEmoji}>🌸</Text>
            <Text style={styles.eventSummaryLabel}>{t('home.nameDays')}</Text>
            {nameDayEvents.length > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{nameDayEvents.length}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eventSummaryRow}
            activeOpacity={0.75}
            onPress={() => router.push({ pathname: '/(app)/calendar', params: { type: 'custom' } } as never)}
          >
            <Text style={styles.eventSummaryEmoji}>📅</Text>
            <Text style={styles.eventSummaryLabel}>{t('home.otherEvents')}</Text>
            {customEvents.length > 0 && (
              <View style={styles.eventSummaryBadge}>
                <Text style={styles.eventSummaryBadgeText}>{customEvents.length}</Text>
              </View>
            )}
            <Text style={styles.eventSummaryChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Accès rapide ──────────────────────────────── */}
        <SectionHeader title={t('home.quickAccess')} />
        <View style={styles.quickGrid}>
          <QuickAction
            emoji="✨"
            label={t('home.quickNewMessage')}
            onPress={() => router.push('/(app)/create/' as never)}
            accent
          />
          <QuickAction
            emoji="🎴"
            label="Découvrez vos cartes animées"
            onPress={() => router.push('/(app)/cards/' as never)}
          />
          <QuickAction
            emoji="👥"
            label={t('home.quickContacts')}
            onPress={() => router.push('/(app)/contacts/' as never)}
          />
          <QuickAction
            emoji="🎁"
            label={t('home.quickPot')}
            onPress={() => router.push('/(app)/pot/new' as never)}
          />
          <QuickAction
            emoji="🌟"
            label={t('home.quickReferral')}
            onPress={() => router.push('/(app)/referral/' as never)}
          />
        </View>

        {/* ── Messages récents ──────────────────────────── */}
        {recentMessages.length > 0 && (
          <>
            <SectionHeader
              title={t('home.recentMessages')}
              action={t('common.seeAll')}
              onAction={() => router.push('/(app)/creations' as never)}
            />
            <View style={styles.recentList}>
              {recentMessages.map((msg) => (
                <RecentMessageCard
                  key={msg.id}
                  contactName={msg.contact_name}
                  format={msg.format}
                  status={msg.status}
                  onPress={() => router.push('/(app)/creations' as never)}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function buildTagline(birthdays: number, nameDays: number): string {
  if (birthdays === 0 && nameDays === 0) return "Tout est calme pour l'instant ✨";
  const parts: string[] = [];
  if (birthdays > 0) parts.push(`${birthdays} anniversaire${birthdays > 1 ? 's' : ''} 🎂`);
  if (nameDays > 0)  parts.push(`${nameDays} fête${nameDays > 1 ? 's' : ''} 🌸`);
  return `${parts.join(' et ')} à venir bientôt`;
}

function getGreeting(name: string, t: (key: string, opts?: object) => string): string {
  const hour = new Date().getHours();
  if (hour >= 21) return t('greeting.night',     { name }); // 21h → Bonne nuit
  if (hour >= 18) return t('greeting.evening',   { name }); // 18h → Bonsoir
  if (hour >= 13) return t('greeting.afternoon', { name }); // 13h → Bon après-midi
  if (hour >= 6)  return t('greeting.morning',   { name }); // 6h  → Bonjour
  return                 t('greeting.night',     { name }); // 0h-6h → Bonne nuit
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 80 },

  // Hero
  hero: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
    overflow: 'hidden',
    borderRadius: 24,
    minHeight: 180,
  },
  confettiBar: { position: 'absolute', top: 0, left: 20, right: 20, height: 50 },
  confettiItem: { position: 'absolute', fontSize: 16, opacity: 0.5 },
  cakeBtn: {
    position: 'absolute',
    top: Spacing[3],
    right: Spacing[4],
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  cakeBtnText: {
    fontSize: 13,
    fontFamily: 'BeVietnamPro_700Bold',
    color: '#FF6B9D',
  },
  heroContent: { marginTop: Spacing[6] },
  heroGreeting: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['5xl'],
    color: Colors.white,
    marginBottom: 6,
  },
  heroTagline: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.lg,
    color: 'rgba(255,255,255,0.85)',
  },

  // Section headers
  // Aujourd'hui & Demain
  imminentSection: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[5],
    gap: 10,
  },
  imminentTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  imminentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.xl,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  imminentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  imminentEmoji: { fontSize: 26 },
  imminentName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  imminentDay: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  imminentEmpty: {
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    alignItems: 'center',
  },
  imminentEmptyText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  imminentBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  imminentBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[6],
    marginBottom: Spacing[2],
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  seeAll: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: C.primary,
  },

  // Events list (vertical)
  eventsList: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  eventRowUrgent: {
    backgroundColor: C.primaryContainer,
  },
  eventAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventAvatarUrgent: { backgroundColor: C.primary },
  eventAvatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  eventBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBadgeText: { fontSize: 10 },
  eventInfo: { flex: 1 },
  eventName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  eventDays: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  eventDaysUrgent: { color: C.primary, fontFamily: 'BeVietnamPro_600SemiBold' },
  eventChevron: { fontSize: 20, color: Colors.outlineVariant },
  createBtn: {
    backgroundColor: C.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  createBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },

  // Empty section
  emptySection: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderStyle: 'dashed',
    padding: Spacing[5],
    alignItems: 'center',
    gap: 8,
  },
  emptySectionEmoji: { fontSize: 32 },
  emptySectionText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  emptySectionBtn: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
  },
  emptySectionBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  // Event summary rows
  eventSummaryList: {
    marginHorizontal: Spacing[4],
    marginTop: Spacing[5],
    gap: 10,
  },
  eventSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    ...Shadows.sm,
  },
  eventSummaryEmoji: { fontSize: 22 },
  eventSummaryLabel: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  eventSummaryBadge: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventSummaryBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },
  eventSummaryChevron: { fontSize: 20, color: Colors.outlineVariant },

  // Quick actions
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[4],
    gap: 12,
  },
  quickAction: {
    width: (SCREEN_WIDTH - Spacing[4] * 2 - 12) / 2,
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    alignItems: 'flex-start',
    gap: 8,
    ...Shadows.sm,
  },
  quickActionAccent: { backgroundColor: C.primary },
  quickActionEmoji: { fontSize: 28 },
  quickActionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  quickActionLabelAccent: { color: Colors.white },

  // Recent messages
  recentList: { marginHorizontal: Spacing[4], gap: 10 },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing[3],
    gap: 12,
    ...Shadows.sm,
  },
  recentEmoji: { fontSize: 28 },
  recentInfo: { flex: 1 },
  recentName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  recentStatus: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  recentArrow: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 22,
    color: Colors.outlineVariant,
  },
  });
}
