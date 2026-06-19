import React, { useMemo, useState } from 'react';
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
import { useUpcomingEvents } from '../../src/hooks/useContacts';
import { useUpcomingCustomEvents } from '../../src/hooks/useCustomEvents';
import { getUpcomingHolidays } from '../../src/utils/generalHolidays';
import { humanDaysUntil, isUrgent } from '../../src/utils/dateHelpers';
import { useCreateStore } from '../../src/stores/createStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import type { Occasion } from '../../src/stores/createStore';

// ── Types ────────────────────────────────────────────────────────────────────
type FilterType = 'all' | 'birthday' | 'nameday' | 'holiday' | 'custom';

interface AgendaItem {
  id: string;
  type: FilterType;
  title: string;
  subtitle?: string;
  daysUntil: number;
  date: Date;
  contactId?: string;
  contactName?: string;
  contactRelation?: string;
  holidayOccasion?: Occasion;
}

// ── Filtre ───────────────────────────────────────────────────────────────────
const FILTERS: FilterType[] = ['all', 'birthday', 'nameday', 'holiday', 'custom'];
const FILTER_EMOJI: Record<FilterType, string> = {
  all: '📋', birthday: '🎂', nameday: '🌸', holiday: '🎊', custom: '📅',
};

export default function AgendaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [filter, setFilter] = useState<FilterType>('all');

  const upcomingEvents   = useUpcomingEvents(365);
  const customEvents     = useUpcomingCustomEvents(365);
  const holidays         = useMemo(() => getUpcomingHolidays(365), []);

  const setContact  = useCreateStore((s) => s.setContact);
  const setOccasion = useCreateStore((s) => s.setOccasion);

  // ── Merge & normalize all events ────────────────────────────────────────────
  const allItems: AgendaItem[] = useMemo(() => {
    const items: AgendaItem[] = [];

    // Birthdays & namedays from contacts
    for (const ev of upcomingEvents) {
      items.push({
        id: `${ev.eventType}_${ev.contact.id}`,
        type: ev.eventType === 'birthday' ? 'birthday' : 'nameday',
        title: ev.contact.name,
        subtitle: ev.eventType === 'birthday'
          ? (ev.age ? t('agenda.yearsOld', { count: ev.age }) : t('agenda.birthday'))
          : t('agenda.namedaySub'),
        daysUntil: ev.daysUntil,
        date: ev.date,
        contactId: ev.contact.id,
        contactName: ev.contact.name,
        contactRelation: ev.contact.relation,
        holidayOccasion: ev.eventType === 'birthday' ? 'birthday' : 'nameday',
      });
    }

    // Holidays
    for (const h of holidays) {
      items.push({
        id: `holiday_${h.id}`,
        type: 'holiday',
        title: `${h.emoji} ${h.name}`,
        subtitle: h.description,
        daysUntil: h.daysUntil,
        date: h.date,
        holidayOccasion: h.occasion,
      });
    }

    // Custom events
    for (const ce of customEvents) {
      const [y, mo, d] = ce.event_date.split('-').map(Number);
      const eventDate = new Date(y, mo - 1, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = Math.ceil((eventDate.getTime() - today.getTime()) / 86400000);
      items.push({
        id: `custom_${ce.id}`,
        type: 'custom',
        title: ce.title,
        subtitle: ce.description ?? undefined,
        daysUntil: diff,
        date: eventDate,
      });
    }

    // Sort chronologically
    return items.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [upcomingEvents, holidays, customEvents]);

  const displayed = filter === 'all' ? allItems : allItems.filter((i) => i.type === filter);

  const handleSend = (item: AgendaItem) => {
    if (item.contactId && item.contactName) {
      setContact(item.contactId, item.contactName, (item.contactRelation ?? 'friend') as any);
      if (item.holidayOccasion) setOccasion(item.holidayOccasion);
      router.push('/(app)/create' as never);
    }
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('agenda.headerTitle')}</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/calendar' as never)}
          style={styles.calBtn}
        >
          <Text style={styles.calBtnText}>📆</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres — 2 lignes */}
      <View style={styles.filterGrid}>
        <View style={styles.filterRow}>
          {FILTERS.slice(0, 3).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={styles.filterEmoji}>{FILTER_EMOJI[f]}</Text>
              <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
                {t(`agenda.filters.${f}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          {FILTERS.slice(3).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, styles.filterChipWide, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={styles.filterEmoji}>{FILTER_EMOJI[f]}</Text>
              <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
                {t(`agenda.filters.${f}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Intro */}
      <View style={styles.introBar}>
        <Text style={styles.introText}>{t('agenda.introText')}</Text>
      </View>

      {/* Liste */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {displayed.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>{t('agenda.emptyText')}</Text>
          </View>
        ) : (
          displayed.map((item) => {
            const urgent = isUrgent(item.daysUntil);
            const typeEmoji = item.type === 'birthday' ? '🎂'
              : item.type === 'nameday' ? '🌸'
              : item.type === 'holiday' ? '🎊'
              : '📋';

            return (
              <View
                key={item.id}
                style={[styles.card, urgent && styles.cardUrgent]}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardEmoji}>{typeEmoji}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  {item.subtitle ? (
                    <Text style={styles.cardSub} numberOfLines={1}>{item.subtitle}</Text>
                  ) : null}
                  <Text style={[styles.cardDate, urgent && styles.cardDateUrgent]}>
                    {formatDate(item.date)} · {humanDaysUntil(item.daysUntil, t)}
                  </Text>
                </View>
                {(item.contactId || item.holidayOccasion) && (
                  <TouchableOpacity
                    style={[styles.sendBtn, { backgroundColor: C.primary }]}
                    onPress={() => handleSend(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.sendBtnText}>💌</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[3],
      gap: 8,
    },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
    backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
    headerTitle: {
      flex: 1,
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      textAlign: 'center',
    },
    calBtn: { padding: 4 },
    calBtnText: { fontSize: 22 },

    filterGrid: {
      paddingHorizontal: Spacing[4],
      paddingBottom: Spacing[3],
      gap: 8,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: Radii.lg,
      borderWidth: 1.5,
      borderColor: Colors.surfaceContainerHighest,
      backgroundColor: Colors.white,
    },
    filterChipWide: { flex: 1 },
    filterChipActive: { backgroundColor: C.primaryContainer, borderColor: C.primary },
    filterEmoji: { fontSize: 14 },
    filterLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },
    filterLabelActive: { color: C.primary },

    introBar: {
      marginHorizontal: Spacing[4],
      marginBottom: Spacing[3],
      backgroundColor: C.primaryContainer,
      borderRadius: Radii.xl,
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: C.primary,
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      color: Colors.onSurface,
      lineHeight: 22,
    },

    list: { flex: 1 },
    listContent: { paddingHorizontal: Spacing[4], gap: 10, paddingTop: 4 },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white,
      borderRadius: Radii.lg,
      padding: Spacing[3],
      gap: 10,
      ...Shadows.sm,
    },
    cardUrgent: { borderLeftWidth: 3, borderLeftColor: '#f59e0b', backgroundColor: '#FFFBEB' },
    cardLeft: {
      width: 40,
      height: 40,
      borderRadius: Radii.full,
      backgroundColor: Colors.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardEmoji: { fontSize: 20 },
    cardBody: { flex: 1, gap: 2 },
    cardTitle: {
      fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.base,
      color: Colors.onSurface,
    },
    cardSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },
    cardDate: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    cardDateUrgent: { color: '#d97706', fontFamily: 'BeVietnamPro_600SemiBold' },

    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: Radii.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnText: { fontSize: 16 },

    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyEmoji: { fontSize: 48 },
    emptyText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.base,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
  });
}
