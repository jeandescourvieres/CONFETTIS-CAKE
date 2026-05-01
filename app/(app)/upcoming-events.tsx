import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUpcomingEvents } from '../../src/hooks/useContacts';
import { useUpcomingCustomEvents } from '../../src/hooks/useCustomEvents';
import { useCreateStore } from '../../src/stores/createStore';
import { humanDaysUntil, isUrgent, formatDate } from '../../src/utils/dateHelpers';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { BackHeader } from '../../src/components/ui/BackHeader';
import type { UpcomingEvent } from '../../src/types/models';

// ── Ligne événement ────────────────────────────────────────────────────────────
function EventRow({ event, onPress, onCreate }: {
  event: UpcomingEvent;
  onPress: () => void;
  onCreate: () => void;
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
      style={[styles.row, urgent && styles.rowUrgent]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.avatar, urgent && styles.avatarUrgent]}>
        <Text style={styles.avatarText}>{initials}</Text>
        {urgent && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{event.contact.name}</Text>
        <Text style={[styles.days, urgent && styles.daysUrgent]}>
          {isBirthday && event.contact.birthday
            ? `Né·e le ${formatDate(event.contact.birthday, 'd MMMM yyyy')} · ${humanDaysUntil(event.daysUntil)}`
            : humanDaysUntil(event.daysUntil)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={(e) => { e.stopPropagation(); onCreate(); }}
        activeOpacity={0.85}
      >
        <Text style={styles.createBtnText}>✦ Créer</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionTitle({ label }: { label: string }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function UpcomingEventsScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  const events = useUpcomingEvents(30);
  const customEvents = useUpcomingCustomEvents(30);
  const { reset, setContact, setOccasion } = useCreateStore();

  const birthdayEvents = useMemo(
    () => events.filter((e) => e.eventType === 'birthday'),
    [events],
  );
  const nameDayEvents = useMemo(
    () => events.filter((e) => e.eventType === 'name_day'),
    [events],
  );

  // Tri des événements custom par date croissante
  const sortedCustomEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...customEvents]
      .map((e) => {
        const [y, mo, d] = e.event_date.split('-').map(Number);
        const diff = Math.round((new Date(y, mo - 1, d).getTime() - today.getTime()) / 86400000);
        return { ...e, daysUntil: diff };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [customEvents]);

  const handleContactPress = useCallback(
    (event: UpcomingEvent) => router.push(`/(app)/contact/${event.contact.id}` as never),
    [router],
  );

  const handleCreate = useCallback(
    (event: UpcomingEvent) => {
      reset();
      setContact(event.contact.id, event.contact.name, event.contact.relation);
      setOccasion(event.eventType === 'birthday' ? 'birthday' : 'nameday');
      router.push({
        pathname: '/(app)/create/index',
        params: { contactId: event.contact.id },
      } as never);
    },
    [reset, setContact, setOccasion, router],
  );

  const isEmpty = birthdayEvents.length === 0 && nameDayEvents.length === 0 && sortedCustomEvents.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Événements à venir" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {isEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>😌</Text>
            <Text style={styles.emptyTitle}>Tout est calme !</Text>
            <Text style={styles.emptyDesc}>Aucun événement dans les 30 prochains jours.</Text>
          </View>
        ) : (
          <>
            {birthdayEvents.length > 0 && (
              <>
                <SectionTitle label="🎁 Anniversaires à venir" />
                <View style={styles.list}>
                  {birthdayEvents.map((event, i) => (
                    <View key={`${event.contact.id}-birthday`}>
                      <EventRow
                        event={event}
                        onPress={() => handleContactPress(event)}
                        onCreate={() => handleCreate(event)}
                      />
                      {i < birthdayEvents.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              </>
            )}

            {nameDayEvents.length > 0 && (
              <>
                <SectionTitle label="🌸 Fêtes des prénoms à venir" />
                <View style={styles.list}>
                  {nameDayEvents.map((event, i) => (
                    <View key={`${event.contact.id}-name_day`}>
                      <EventRow
                        event={event}
                        onPress={() => handleContactPress(event)}
                        onCreate={() => handleCreate(event)}
                      />
                      {i < nameDayEvents.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              </>
            )}

            {sortedCustomEvents.length > 0 && (
              <>
                <SectionTitle label="📅 Autres événements à venir" />
                <View style={styles.list}>
                  {sortedCustomEvents.map((event, i) => {
                    const urgent = event.daysUntil <= 15;
                    const daysLabel =
                      event.daysUntil === 0 ? "Aujourd'hui 🎉"
                      : event.daysUntil === 1 ? 'Demain 🔥'
                      : `Dans ${event.daysUntil} jour${event.daysUntil > 1 ? 's' : ''}`;
                    return (
                      <View key={event.id}>
                        <View style={[styles.row, urgent && styles.rowUrgent]}>
                          <View style={[styles.avatar, urgent && styles.avatarUrgent]}>
                            <Text style={styles.avatarText}>📅</Text>
                          </View>
                          <View style={styles.info}>
                            <Text style={styles.name} numberOfLines={1}>{event.title}</Text>
                            <Text style={[styles.days, urgent && styles.daysUrgent]}>{daysLabel}</Text>
                          </View>
                        </View>
                        {i < sortedCustomEvents.length - 1 && <View style={styles.divider} />}
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { paddingBottom: 80, paddingHorizontal: Spacing[4] },

    sectionTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.xl,
      color: Colors.onSurface,
      marginTop: Spacing[5],
      marginBottom: Spacing[3],
      borderLeftWidth: 3,
      borderLeftColor: C.primary,
      paddingLeft: Spacing[3],
    },

    list: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      overflow: 'hidden',
      ...Shadows.sm,
    },
    divider: {
      height: 0.5,
      backgroundColor: Colors.surfaceContainerHighest,
      marginLeft: 72,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: Spacing[4],
    },
    rowUrgent: {
      backgroundColor: C.primaryContainer,
    },

    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: Colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarUrgent: { backgroundColor: C.primary },
    avatarText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.white,
    },
    badge: {
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
    badgeText: { fontSize: 10 },

    info: { flex: 1 },
    name: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.md,
      color: Colors.onSurface,
    },
    days: {
      fontFamily: 'BeVietnamPro_500Medium',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      marginTop: 2,
    },
    daysUrgent: { color: C.primary, fontFamily: 'BeVietnamPro_600SemiBold' },

    createBtn: {
      backgroundColor: C.primary,
      paddingVertical: 7,
      paddingHorizontal: 13,
      borderRadius: Radii.full,
      flexShrink: 0,
    },
    createBtnText: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xs,
      color: Colors.white,
    },

    emptyState: {
      marginTop: 80,
      alignItems: 'center',
      paddingHorizontal: Spacing[6],
      gap: 12,
    },
    emptyEmoji: { fontSize: 52 },
    emptyTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
    },
    emptyDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
}
