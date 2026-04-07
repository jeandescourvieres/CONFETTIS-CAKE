import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useUpcomingEvents } from '../../src/hooks/useContacts';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { useUpcomingCustomEvents, useDeleteCustomEvent } from '../../src/hooks/useCustomEvents';
import { humanDaysUntil, isUrgent, formatDate } from '../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import type { UpcomingEvent } from '../../src/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Confetti décoratif ────────────────────────────────────────────────────────
const CONFETTI = ['💜', '🎉', '✨', '🎂', '💛', '🌸', '⭐', '🎁'];

function ConfettiBar() {
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
            ? `Né·e le ${formatDate(event.contact.birthday, 'd MMMM yyyy')}`
            : humanDaysUntil(event.daysUntil)}
        </Text>
      </View>

      {urgent && onCreate ? (
        <TouchableOpacity
          style={styles.createBtn}
          onPress={(e) => { e.stopPropagation(); onCreate(); }}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>✦ Créer</Text>
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
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const events = useUpcomingEvents(90);
  const { data: messages = [] } = useMessages();
  const customEvents = useUpcomingCustomEvents(365);
  const deleteCustomEvent = useDeleteCustomEvent();

  const birthdayEvents = events.filter((e) => e.eventType === 'birthday');
  const nameDayEvents = events.filter((e) => e.eventType === 'name_day');
  const urgentCount = events.filter((e) => isUrgent(e.daysUntil)).length;
  const recentMessages = messages.slice(0, 3);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'toi';
  const greeting = getGreeting(firstName, t);

  const handleEventPress = useCallback(
    (event: UpcomingEvent) => router.push(`/(app)/contact/${event.contact.id}` as never),
    [router],
  );

  const handleCreate = useCallback(
    (event: UpcomingEvent) => {
      router.push({
        pathname: '/(app)/create/index',
        params: { contactId: event.contact.id },
      } as never);
    },
    [router],
  );

  const handleDeleteCustomEvent = useCallback(
    (id: string, title: string) => {
      Alert.alert(
        'Supprimer l\'événement',
        `Êtes-vous sûr de vouloir supprimer "${title}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => deleteCustomEvent.mutate(id),
          },
        ],
      );
    },
    [deleteCustomEvent],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero ──────────────────────────────────────── */}
        <LinearGradient
          colors={['#9b6bb5', '#7a4d99', '#5e2d80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <ConfettiBar />
          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>{greeting}</Text>
            <Text style={styles.heroTagline}>
              {urgentCount > 0
                ? t('home.taglineEvents', { count: urgentCount })
                : t('home.taglineCalm')}
            </Text>
          </View>
        </LinearGradient>

        {/* ── Anniversaires ─────────────────────────────── */}
        <SectionHeader
          title={t('home.birthdays')}
          action={birthdayEvents.length > 0 ? t('common.seeAll') : undefined}
          onAction={() => router.push('/(app)/calendar' as never)}
        />
        {birthdayEvents.length === 0 ? (
          <EmptySection
            emoji="🎂"
            text={t('home.emptyBirthdays')}
            btnLabel={t('home.addContact')}
            onPress={() => router.push('/(app)/contacts/' as never)}
          />
        ) : (
          <View style={styles.eventsList}>
            {birthdayEvents.slice(0, 6).map((event) => (
              <EventRow
                key={`${event.contact.id}-birthday`}
                event={event}
                onPress={() => handleEventPress(event)}
                onCreate={() => handleCreate(event)}
              />
            ))}
          </View>
        )}

        {/* ── Fêtes du prénom ───────────────────────────── */}
        {nameDayEvents.length > 0 && (
          <>
            <SectionHeader
              title={t('home.nameDays')}
              action={t('common.seeAll')}
              onAction={() => router.push({ pathname: '/(app)/calendar', params: { type: 'name_day' } } as never)}
            />
            <View style={styles.eventsList}>
              {nameDayEvents.slice(0, 4).map((event) => (
                <EventRow
                  key={`${event.contact.id}-nameday`}
                  event={event}
                  onPress={() => handleEventPress(event)}
                  onCreate={() => handleCreate(event)}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Autres événements ─────────────────────────── */}
        <SectionHeader
          title={t('home.otherEvents')}
          action={t('home.addEvent')}
          onAction={() => router.push('/(app)/calendar/new-event' as never)}
        />
        {customEvents.length === 0 ? (
          <Text style={styles.customEventsEmpty}>{t('home.emptyCustomEvents')}</Text>
        ) : (
          <View style={styles.eventsList}>
            {customEvents.map((e) => {
              const [ey, emo, ed] = e.event_date.split('-').map(Number);
              const eventLocal = new Date(ey, emo - 1, ed);
              const todayLocal = new Date();
              todayLocal.setHours(0, 0, 0, 0);
              const daysUntil = Math.ceil(
                (eventLocal.getTime() - todayLocal.getTime()) / 86400000,
              );
              return (
                <TouchableOpacity
                  key={e.id}
                  style={styles.customEventRow}
                  activeOpacity={0.75}
                  onPress={() =>
                    router.push({
                      pathname: '/(app)/calendar/new-event',
                      params: {
                        editId: e.id,
                        editTitle: e.title,
                        editDate: e.event_date,
                        editDescription: e.description ?? '',
                        editRemind: String(e.remind_before),
                      },
                    } as never)
                  }
                >
                  <View style={styles.customEventIcon}>
                    <Text style={{ fontSize: 18 }}>📅</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customEventTitle}>{e.title}</Text>
                    <Text style={styles.customEventDate}>
                      {eventLocal.toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.customEventDays}>
                    {daysUntil === 0 ? t('common.today')
                      : daysUntil === 1 ? t('common.tomorrow')
                      : t('common.inDays', { count: daysUntil })}
                  </Text>
                  <TouchableOpacity
                    style={styles.customEventDeleteBtn}
                    onPress={() => handleDeleteCustomEvent(e.id, e.title)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.customEventDeleteText}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
            label="Cartes Animées"
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

function getGreeting(name: string, t: (key: string, opts?: object) => string): string {
  const hour = new Date().getHours();
  if (hour < 6)  return t('greeting.night',     { name });
  if (hour < 12) return t('greeting.morning',   { name });
  if (hour < 18) return t('greeting.afternoon', { name });
  return             t('greeting.evening',   { name });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 80 },

  // Hero
  hero: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
    overflow: 'hidden',
  },
  confettiBar: { position: 'absolute', top: 0, left: 20, right: 20, height: 50 },
  confettiItem: { position: 'absolute', fontSize: 16, opacity: 0.5 },
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
    color: Colors.primary,
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
    backgroundColor: Colors.primaryContainer,
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
  eventAvatarUrgent: { backgroundColor: Colors.primary },
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
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  eventDaysUrgent: { color: Colors.primary, fontFamily: 'BeVietnamPro_600SemiBold' },
  eventChevron: { fontSize: 20, color: Colors.outlineVariant },
  createBtn: {
    backgroundColor: Colors.primary,
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
    borderColor: Colors.primaryContainer,
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
    backgroundColor: Colors.primary,
  },
  emptySectionBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.white,
  },

  // Custom events
  customEventsEmpty: {
    marginHorizontal: Spacing[5],
    marginTop: 4,
    marginBottom: Spacing[2],
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  customEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  customEventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  customEventTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  customEventDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  customEventDays: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.primary,
  },
  customEventDeleteBtn: {
    marginLeft: Spacing[2],
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customEventDeleteText: {
    fontSize: 12,
    color: Colors.error,
    fontFamily: 'BeVietnamPro_700Bold',
  },

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
  quickActionAccent: { backgroundColor: Colors.primary },
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
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  recentArrow: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 22,
    color: Colors.outlineVariant,
  },
});
