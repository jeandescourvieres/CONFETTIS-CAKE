// ═══════════════════════════════════════════════════════════════
//  Confettis & Cake — Notifications
// ═══════════════════════════════════════════════════════════════

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { useUpcomingEvents } from '../../../src/hooks/useContacts';
import { useUpcomingCustomEvents } from '../../../src/hooks/useCustomEvents';
import { getUpcomingHolidays } from '../../../src/utils/generalHolidays';
import { useAppNotifications, useMarkAllNotificationsRead } from '../../../src/hooks/useNotifications';
import type { AppNotification } from '../../../src/types/models';

// ── Onglets ───────────────────────────────────────────────────────────────────
type Tab = 'upcoming' | 'history';

// ── Helpers ───────────────────────────────────────────────────────────────────

function notifTypeLabel(type: string): string {
  switch (type) {
    case 'birthday_reminder': return '🎂 Anniversaire';
    case 'name_day_reminder': return '🌸 Fête du prénom';
    case 'pot_update':        return '🎁 Cagnotte';
    case 'system':            return '📢 Système';
    default:                  return '🔔 Notification';
  }
}

function formatRelative(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Demain';
  if (diffDays === -1) return 'Hier';
  if (diffDays > 0)  return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [tab, setTab] = useState<Tab>('upcoming');

  // Données "À venir"
  const upcomingEvents = useUpcomingEvents(30);
  const customEvents   = useUpcomingCustomEvents(30);
  const loadingEvents  = false; // useUpcomingEvents returns data synchronously from cache
  const holidays = useMemo(() => getUpcomingHolidays(30), []);

  // Notifications en base (historique)
  const { data: notifications = [], isLoading: loadingNotifs } = useAppNotifications();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // ── Onglet À venir ────────────────────────────────────────────────────────────
  const upcomingItems = useMemo(() => {
    type UpcomingItem = {
      key: string;
      type: 'birthday' | 'nameday' | 'holiday' | 'custom';
      label: string;
      subLabel: string;
      daysUntil: number;
      contactId?: string;
      contactName?: string;
      scheduledDates: number[]; // jours de rappel : [7, 3, 1, 0]
    };

    const items: UpcomingItem[] = [];

    (upcomingEvents as import('../../../src/types/models').UpcomingEvent[]).forEach((ev) => {
      items.push({
        key: `${ev.eventType}-${ev.contact.id}`,
        type: ev.eventType === 'birthday' ? 'birthday' : 'nameday',
        label: ev.eventType === 'birthday' ? `🎂 ${ev.contact.name}` : `🌸 Fête de ${ev.contact.name.split(' ')[0]}`,
        subLabel: ev.eventType === 'birthday'
          ? ev.daysUntil === 0 ? "C'est aujourd'hui !" : formatRelative(ev.date.toISOString())
          : formatRelative(ev.date.toISOString()),
        daysUntil: ev.daysUntil,
        contactId: ev.contact.id,
        contactName: ev.contact.name,
        scheduledDates: [7, 3, 1, 0].filter((d) => d <= ev.daysUntil),
      });
    });

    holidays.forEach((h, i) => {
      items.push({
        key: `holiday-${i}`,
        type: 'holiday',
        label: `🎊 ${h.name}`,
        subLabel: formatRelative(h.date.toISOString()),
        daysUntil: h.daysUntil,
        scheduledDates: [],
      });
    });

    customEvents.forEach((ev: { id: string; title: string; event_date: string }) => {
      const d = new Date(ev.event_date);
      const now = new Date();
      const diff = Math.round((d.getTime() - now.getTime()) / 86400000);
      if (diff < 0) return;
      items.push({
        key: `custom-${ev.id}`,
        type: 'custom',
        label: `📋 ${ev.title}`,
        subLabel: formatRelative(ev.event_date),
        daysUntil: diff,
        scheduledDates: [],
      });
    });

    return items.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [upcomingEvents, holidays, customEvents]);

  // ── Rendu ─────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="🔔 Notifications" />

      {/* Onglets */}
      <View style={styles.tabs}>
        {([
          { key: 'upcoming', label: 'À venir' },
          { key: 'history',  label: `Historique${unreadCount > 0 ? ` · ${unreadCount}` : ''}` },
        ] as { key: Tab; label: string }[]).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && { color: C.primary }]}>{t.label}</Text>
            {tab === t.key && <View style={[styles.tabUnderline, { backgroundColor: C.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Onglet À venir ── */}
      {tab === 'upcoming' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {loadingEvents && (
            <View style={styles.center}><ActivityIndicator color={C.primary} /></View>
          )}

          {!loadingEvents && upcomingItems.length === 0 && (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyTitle}>Aucun événement à venir</Text>
              <Text style={styles.emptySub}>
                Ajoute des contacts avec leur date de naissance pour voir tes prochains rappels 💛
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: C.primary }]}
                onPress={() => router.push('/(app)/contacts/new' as never)}
              >
                <Text style={styles.emptyBtnText}>+ Ajouter un contact</Text>
              </TouchableOpacity>
            </View>
          )}

          {upcomingItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.itemCard,
                item.daysUntil === 0 && styles.itemCardToday,
                item.daysUntil <= 3 && item.daysUntil > 0 && styles.itemCardUrgent,
              ]}
              onPress={() => {
                if (item.contactId) router.push(`/(app)/contact/${item.contactId}` as never);
              }}
              activeOpacity={item.contactId ? 0.75 : 1}
            >
              <View style={styles.itemLeft}>
                <View style={[
                  styles.itemDot,
                  { backgroundColor: item.daysUntil === 0 ? '#2E7D32' : item.daysUntil <= 3 ? Colors.error : C.primary },
                ]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={[
                    styles.itemSubLabel,
                    item.daysUntil === 0 && { color: '#2E7D32', fontFamily: 'BeVietnamPro_700Bold' },
                    item.daysUntil <= 3 && item.daysUntil > 0 && { color: Colors.error },
                  ]}>{item.subLabel}</Text>

                  {/* Rappels programmés */}
                  {item.scheduledDates.length > 0 && (
                    <View style={styles.scheduledDates}>
                      <Text style={styles.scheduledLabel}>Rappels : </Text>
                      {item.scheduledDates.map((d) => (
                        <View key={d} style={[styles.reminderChip, { backgroundColor: C.primaryContainer }]}>
                          <Text style={[styles.reminderChipText, { color: C.primary }]}>
                            {d === 0 ? 'Jour J' : `J-${d}`}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              {item.contactId && (
                <Text style={[styles.itemArrow, { color: C.primary }]}>›</Text>
              )}
            </TouchableOpacity>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ── Onglet Historique ── */}
      {tab === 'history' && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {loadingNotifs && (
            <View style={styles.center}><ActivityIndicator color={C.primary} /></View>
          )}

          {!loadingNotifs && notifications.length > 0 && unreadCount > 0 && (
            <TouchableOpacity
              style={[styles.markAllBtn, { borderColor: C.primary }]}
              onPress={() => markAllRead()}
              disabled={isMarkingAll}
            >
              <Text style={[styles.markAllText, { color: C.primary }]}>
                {isMarkingAll ? 'En cours...' : `✓ Tout marquer comme lu (${unreadCount})`}
              </Text>
            </TouchableOpacity>
          )}

          {!loadingNotifs && notifications.length === 0 && (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>Aucune notification</Text>
              <Text style={styles.emptySub}>
                Tes futures notifications d'anniversaires et fêtes apparaîtront ici 💛
              </Text>
            </View>
          )}

          {notifications.map((notif) => (
            <NotifRow key={notif.id} notif={notif} C={C} styles={styles} router={router} />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── Ligne notification ────────────────────────────────────────────────────────
function NotifRow({
  notif, C, styles, router,
}: {
  notif: AppNotification;
  C: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
  router: ReturnType<typeof useRouter>;
}) {
  const isUnread = !notif.read_at;

  return (
    <TouchableOpacity
      style={[styles.notifCard, isUnread && styles.notifCardUnread]}
      onPress={() => {
        if (notif.contact_id) router.push(`/(app)/contact/${notif.contact_id}` as never);
      }}
      activeOpacity={notif.contact_id ? 0.75 : 1}
    >
      <View style={styles.notifLeft}>
        {isUnread && <View style={[styles.unreadDot, { backgroundColor: C.primary }]} />}
        <View style={{ flex: 1 }}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifType, { color: C.primary }]}>{notifTypeLabel(notif.type)}</Text>
            <Text style={styles.notifDate}>
              {new Date(notif.scheduled_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <Text style={styles.notifContent}>{notif.content}</Text>
          {notif.sent_at && (
            <Text style={styles.notifSent}>Envoyé · {formatDate(notif.sent_at)}</Text>
          )}
        </View>
      </View>
      {notif.contact_id && (
        <Text style={[styles.itemArrow, { color: C.primary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    tabs: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.surfaceContainerHighest,
      paddingHorizontal: Spacing[4],
      backgroundColor: Colors.white,
    },
    tab:       { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4 },
    tabActive: {},
    tabText:   { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
    tabUnderline: { height: 2, width: '60%', borderRadius: 1 },

    content: { padding: Spacing[4], gap: 10 },
    center:  { alignItems: 'center', paddingVertical: 32 },

    emptyWrap: { alignItems: 'center', paddingTop: 48, gap: 12 },
    emptyEmoji: { fontSize: 52 },
    emptyTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
    emptySub:   {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base,
      color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22,
      paddingHorizontal: 20,
    },
    emptyBtn: {
      marginTop: 8, borderRadius: Radii.full,
      paddingVertical: 12, paddingHorizontal: 24,
    },
    emptyBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

    itemCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: Colors.white, borderRadius: Radii.xl,
      padding: Spacing[4], ...Shadows.sm,
      borderWidth: 0.5, borderColor: Colors.surfaceContainerHighest,
    },
    itemCardToday:  { borderColor: '#C8E6C9', backgroundColor: '#F1F8E9' },
    itemCardUrgent: { borderColor: '#FFCDD2', backgroundColor: '#FFF3F3' },
    itemLeft: { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    itemDot:  { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
    itemLabel:    { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
    itemSubLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2 },
    itemArrow:    { fontSize: 22, lineHeight: 26 },

    scheduledDates: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6, alignItems: 'center' },
    scheduledLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    reminderChip:   { borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 2 },
    reminderChipText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },

    markAllBtn: {
      borderWidth: 1.5, borderRadius: Radii.full,
      paddingVertical: 10, alignItems: 'center',
    },
    markAllText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

    notifCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: Colors.white, borderRadius: Radii.xl,
      padding: Spacing[4], ...Shadows.sm,
      borderWidth: 0.5, borderColor: Colors.surfaceContainerHighest, gap: 8,
    },
    notifCardUnread: { borderColor: C.primaryContainer, backgroundColor: C.primaryContainer + '18' },
    notifLeft:  { flex: 1, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    unreadDot:  { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
    notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    notifType:  { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs },
    notifDate:  { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
    notifContent: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 20 },
    notifSent:  { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 4, fontStyle: 'italic' },
  });
}
