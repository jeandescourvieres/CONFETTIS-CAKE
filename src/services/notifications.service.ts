import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Contact, UpcomingEvent } from '../types/models';
import { Config } from '../constants/config';

// Configure le handler global (affichage même en foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Permissions ────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('birthdays', {
      name: 'Anniversaires',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ── Planification ──────────────────────────────

/**
 * Planifie un rappel pour un événement donné (anniversaire ou fête).
 * Le rappel est envoyé X jours avant l'événement à 9h00.
 */
export async function scheduleEventReminder(
  event: UpcomingEvent,
  daysBefore = Config.defaultReminderDaysBefore,
): Promise<string | null> {
  const triggerDays = event.daysUntil - daysBefore;
  if (triggerDays < 0) return null; // trop tard

  const triggerDate = new Date();
  triggerDate.setDate(triggerDate.getDate() + triggerDays);
  triggerDate.setHours(9, 0, 0, 0);

  const isToday = triggerDays === 0;
  const name = event.contact.name;
  const eventLabel = event.eventType === 'birthday' ? 'anniversaire' : 'fête du prénom';

  const title = isToday
    ? `🎂 C'est l'${eventLabel} de ${name} !`
    : `🎉 ${eventLabel === 'anniversaire' ? 'Anniversaire' : 'Fête'} de ${name} dans ${event.daysUntil} jours`;

  const body = isToday
    ? `N'oubliez pas d'envoyer un message à ${name} !`
    : `Préparez votre message pour ${name} à l'avance ✨`;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { contactId: event.contact.id, eventType: event.eventType },
      sound: 'default',
    },
    trigger: isToday
      ? null // notification immédiate si c'est aujourd'hui
      : { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });

  return id;
}

/**
 * Planifie des rappels pour tous les événements à venir d'une liste.
 * Annule d'abord tous les rappels existants.
 */
export async function scheduleAllReminders(
  events: UpcomingEvent[],
  daysBefore = Config.defaultReminderDaysBefore,
): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Annuler les rappels précédents
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Planifier les nouveaux
  const promises = events
    .filter((e) => e.daysUntil <= 30) // rappels pour les 30 prochains jours
    .map((e) => scheduleEventReminder(e, daysBefore));

  await Promise.allSettled(promises);
}

/**
 * Planifie des rappels quotidiens pour un événement personnalisé.
 *
 * remindBefore=0 → 1 notif le jour J
 * remindBefore=3 → notifs J-3, J-2, J-1 et J (4 notifs)
 * remindBefore=7 → notifs J-7 … J (8 notifs)
 *
 * Chaque notif est envoyée à `remindHour:00` (9h par défaut).
 * Retourne les identifiants des notifications planifiées.
 */
export async function scheduleCustomEventReminders(
  title: string,
  eventDateISO: string, // "YYYY-MM-DD"
  remindBefore: number,
  remindHour = Config.reminderHour,
): Promise<string[]> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return [];

  // Reconstruire la date de l'événement en heure locale (évite le décalage UTC)
  const [y, mo, d] = eventDateISO.split('-').map(Number);
  const eventDate = new Date(y, mo - 1, d);
  eventDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntilEvent = Math.round((eventDate.getTime() - today.getTime()) / 86400000);
  if (daysUntilEvent < 0) return []; // événement passé

  const ids: string[] = [];
  const startOffset = Math.min(remindBefore, daysUntilEvent);

  // daysLeft va de startOffset (J-N) à 0 (J)
  for (let daysLeft = startOffset; daysLeft >= 0; daysLeft--) {
    const daysFromNow = daysUntilEvent - daysLeft;

    const trigger = new Date();
    trigger.setDate(trigger.getDate() + daysFromNow);
    trigger.setHours(remindHour, 0, 0, 0);

    if (trigger <= new Date()) continue; // heure déjà passée

    const notifTitle =
      daysLeft === 0 ? `🎉 ${title} — c'est aujourd'hui !`
      : daysLeft === 1 ? `🔥 ${title} — c'est demain !`
      : `📅 ${title} — dans ${daysLeft} jours`;

    const body =
      daysLeft === 0
        ? "C'est le grand jour ! 🎉"
        : `Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} avant votre événement.`;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: notifTitle,
        body,
        data: { customEvent: true, eventTitle: title },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledRemindersCount(): Promise<number> {
  const notifs = await Notifications.getAllScheduledNotificationsAsync();
  return notifs.length;
}
