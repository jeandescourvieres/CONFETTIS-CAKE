import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useContacts, useUpcomingEvents } from '../../src/hooks/useContacts';
import { scheduleAllReminders } from '../../src/services/notifications.service';
import { Avatar } from '../../src/components/ui/Avatar';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';
import { humanDaysUntil, isUrgent, formatDate } from '../../src/utils/dateHelpers';
import type { UpcomingEvent } from '../../src/types/models';

export default function CalendarScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const eventType = type === 'name_day' ? 'name_day' : 'birthday';
  const { isLoading } = useContacts();
  const allEvents = useUpcomingEvents(365);
  const [viewDate, setViewDate] = useState(new Date());

  // Filtrer les événements par type (anniversaires OU fêtes, jamais mélangés)
  const filteredEvents = useMemo(
    () => allEvents.filter((e) => e.eventType === eventType),
    [allEvents, eventType],
  );

  // Planifier les rappels dès que les contacts sont chargés
  useEffect(() => {
    if (allEvents.length > 0) {
      scheduleAllReminders(allEvents).catch(() => {});
    }
  }, [allEvents.length]);

  // Événements du mois affiché (type filtré)
  const eventsThisMonth = useMemo(() => {
    const m = viewDate.getMonth();
    const y = viewDate.getFullYear();
    return filteredEvents.filter((e) => {
      const d = e.date;
      return d.getMonth() === m && d.getFullYear() === y;
    });
  }, [filteredEvents, viewDate]);

  // Jours du calendrier avec événements
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = startOfMonth(viewDate);
    // lundi=0, dimanche=6 (format FR)
    let startOffset = getDay(firstDay) - 1;
    if (startOffset < 0) startOffset = 6;

    const days: Array<{ day: number | null; events: UpcomingEvent[] }> = [];
    for (let i = 0; i < startOffset; i++) days.push({ day: null, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = eventsThisMonth.filter((e) => e.date.getDate() === d);
      days.push({ day: d, events: dayEvents });
    }
    return days;
  }, [viewDate, eventsThisMonth]);

  const monthLabel = format(viewDate, 'MMMM yyyy', { locale: fr });
  const monthLabelCapitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Header du mois */}
        <View style={styles.monthHeader}>
          <View style={styles.monthInfo}>
            <Text style={styles.monthTitle}>{monthLabelCapitalized}</Text>
            <Text style={styles.monthSub}>
              {eventsThisMonth.length > 0
                ? eventType === 'birthday'
                  ? `${eventsThisMonth.length} anniversaire${eventsThisMonth.length > 1 ? 's' : ''} ce mois 🥳`
                  : `${eventsThisMonth.length} fête${eventsThisMonth.length > 1 ? 's' : ''} des prénoms ce mois 🌸`
                : 'Aucun événement ce mois'}
            </Text>
          </View>
          <View style={styles.monthNavBtns}>
            <TouchableOpacity onPress={() => setViewDate((d) => subMonths(d, 1))} style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewDate(new Date())} style={styles.todayBtn}>
              <Text style={styles.todayBtnText}>Auj.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewDate((d) => addMonths(d, 1))} style={styles.navBtn}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grille calendrier */}
        <View style={styles.calCard}>
          {/* Entêtes jours */}
          <View style={styles.dayHeaders}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <View key={i} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Jours */}
          <View style={styles.calGrid}>
            {calendarDays.map((cell, i) => {
              const isToday =
                cell.day !== null &&
                cell.day === new Date().getDate() &&
                viewDate.getMonth() === new Date().getMonth() &&
                viewDate.getFullYear() === new Date().getFullYear();
              const hasEvent = cell.events.length > 0;
              const hasUrgent = cell.events.some((e) => isUrgent(e.daysUntil));

              return (
                <View key={i} style={styles.calCell}>
                  {cell.day !== null && (
                    <View
                      style={[
                        styles.calDayWrap,
                        isToday && styles.calDayToday,
                        hasUrgent && styles.calDayUrgent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calDayText,
                          isToday && styles.calDayTextToday,
                          hasUrgent && styles.calDayTextUrgent,
                        ]}
                      >
                        {cell.day}
                      </Text>
                      {hasEvent && !hasUrgent && (
                        <View style={styles.calDot} />
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Liste des événements */}
        {eventsThisMonth.length > 0 && (
          <>
            <Text style={styles.listTitle}>
              {eventType === 'birthday' ? 'Anniversaires ce mois' : 'Fêtes des prénoms de ce mois'}
            </Text>
            <View style={styles.eventsList}>
              {eventsThisMonth
                .sort((a, b) => a.daysUntil - b.daysUntil)
                .map((event) => (
                  <EventCard
                    key={`${event.contact.id}-${event.eventType}`}
                    event={event}
                    onCreateMessage={() =>
                      router.push({
                        pathname: '/(app)/create/index',
                        params: { contactId: event.contact.id },
                      } as never)
                    }
                    onPress={() =>
                      router.push(`/(app)/contact/${event.contact.id}` as never)
                    }
                  />
                ))}
            </View>
          </>
        )}

        {/* Prochainement (hors mois affiché) */}
        {filteredEvents.filter((e) => {
          const m = viewDate.getMonth();
          const y = viewDate.getFullYear();
          return !(e.date.getMonth() === m && e.date.getFullYear() === y);
        }).length > 0 && (
          <>
            <Text style={[styles.listTitle, { marginTop: Spacing[5] }]}>
              Prochainement
            </Text>
            <View style={styles.eventsList}>
              {filteredEvents
                .filter((e) => {
                  const m = viewDate.getMonth();
                  const y = viewDate.getFullYear();
                  return !(e.date.getMonth() === m && e.date.getFullYear() === y);
                })
                .slice(0, 5)
                .map((event) => (
                  <EventCard
                    key={`next-${event.contact.id}-${event.eventType}`}
                    event={event}
                    onCreateMessage={() =>
                      router.push({
                        pathname: '/(app)/create/index',
                        params: { contactId: event.contact.id },
                      } as never)
                    }
                    onPress={() =>
                      router.push(`/(app)/contact/${event.contact.id}` as never)
                    }
                  />
                ))}
            </View>
          </>
        )}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>Aucun anniversaire</Text>
            <Text style={styles.emptySub}>
              Ajoutez des contacts avec leur date de naissance pour voir apparaître leurs anniversaires ici.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(app)/contacts/new' as never)}
            >
              <Text style={styles.emptyBtnText}>+ Ajouter un contact</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Ajouter un événement personnalisé ─── */}
        <TouchableOpacity
          style={styles.addEventBtn}
          onPress={() => router.push('/(app)/calendar/new-event' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.addEventIcon}>＋</Text>
          <Text style={styles.addEventText}>Ajouter un événement</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function EventCard({
  event,
  onCreateMessage,
  onPress,
}: {
  event: UpcomingEvent;
  onCreateMessage: () => void;
  onPress: () => void;
}) {
  const urgent = isUrgent(event.daysUntil);
  const isBirthday = event.eventType === 'birthday';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.eventCard, urgent && styles.eventCardUrgent]}
    >
      <Avatar
        uri={event.contact.avatar_url}
        name={event.contact.name}
        size="md"
        badge={isBirthday ? '🎂' : '🌸'}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event.contact.name}</Text>
        <Text style={styles.eventSub}>
          {isBirthday && event.contact.birthday
            ? `Né·e le ${formatDate(event.contact.birthday, 'd MMMM yyyy')}`
            : 'Fête du prénom'}
        </Text>
      </View>
      <View style={styles.eventRight}>
        <Text style={[styles.eventDays, urgent && { color: Colors.primary }]}>
          {humanDaysUntil(event.daysUntil)}
        </Text>
        <TouchableOpacity
          style={[styles.createBtn, !urgent && styles.createBtnLight]}
          onPress={(e) => { e.stopPropagation(); onCreateMessage(); }}
        >
          <Text style={[styles.createBtnText, !urgent && { color: Colors.primary }]}>
            {isBirthday ? '✦ Créer' : '🌸 Fête'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing[5], paddingBottom: 100 },

  // Header
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(155,107,181,0.07)',
    borderRadius: Radii.lg,
    padding: Spacing[5],
    marginBottom: Spacing[5],
    borderWidth: 0.5,
    borderColor: 'rgba(155,107,181,0.15)',
  },
  monthInfo: { flex: 1 },
  monthTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['4xl'],
    color: Colors.onSurface,
    marginBottom: 2,
  },
  monthSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  monthNavBtns: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
  },
  navBtnText: { fontSize: 20, color: Colors.primary, lineHeight: 24 },
  todayBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  todayBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },

  // Calendrier
  calCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing[4],
    marginBottom: Spacing[5],
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.onSurfaceVariant,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  calDayWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayToday: {
    backgroundColor: Colors.surfaceContainer,
  },
  calDayUrgent: {
    backgroundColor: Colors.primary,
  },
  calDayText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  calDayTextToday: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.primary,
  },
  calDayTextUrgent: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.white,
  },
  calDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },

  // Liste
  listTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    marginBottom: Spacing[3],
  },
  eventsList: { gap: Spacing[3] },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: Colors.surfaceContainerHighest,
  },
  eventCardUrgent: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  eventInfo: { flex: 1 },
  eventName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  eventSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  eventRight: { alignItems: 'flex-end', gap: 4 },
  eventDays: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  createBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  createBtnLight: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
  },
  createBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xs,
    color: Colors.white,
  },

  // Vide
  emptyWrap: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing[3] },
  emptyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
    marginBottom: Spacing[2],
  },
  emptySub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing[5],
  },
  emptyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  emptyBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    margin: Spacing[4],
    marginTop: Spacing[6],
    paddingVertical: 15,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  addEventIcon: {
    fontSize: 20,
    color: Colors.white,
    lineHeight: 24,
  },
  addEventText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
});
