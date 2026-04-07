import { format, differenceInDays, differenceInYears, parseISO, setYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Contact, UpcomingEvent } from '../types/models';
import { getNameDayForName } from './namedays';

// ── Formatage ─────────────────────────────────

export function formatDate(date: Date | string, pattern = 'd MMMM'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: fr });
}

export function formatShortDate(mmdd: string): string {
  const [month, day] = mmdd.split('-').map(Number);
  const d = new Date(2000, month - 1, day);
  return format(d, 'd MMMM', { locale: fr });
}

// ── Calculs ────────────────────────────────────

/**
 * Calcule combien de jours jusqu'à la prochaine occurrence d'une date anniversaire.
 * Gère le passage d'année.
 */
export function daysUntilNextOccurrence(mmdd: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [month, day] = mmdd.split('-').map(Number);

  let next = new Date(today.getFullYear(), month - 1, day);
  next.setHours(0, 0, 0, 0);

  if (next < today) {
    next = new Date(today.getFullYear() + 1, month - 1, day);
  }

  return differenceInDays(next, today);
}

/**
 * Retourne le nombre de jours jusqu'à la prochaine occurrence d'un anniversaire ISO.
 */
export function daysUntilBirthday(birthdayISO: string): number {
  const mmdd = birthdayISO.slice(5); // "YYYY-MM-DD" → "MM-DD"
  return daysUntilNextOccurrence(mmdd);
}

/**
 * Calcule l'âge actuel (défaut) ou l'âge à la prochaine fête d'anniversaire.
 * atNextBirthday = false → âge aujourd'hui  (usage : fiche contact, badges)
 * atNextBirthday = true  → âge au prochain anniversaire (usage : "Fête ses X ans")
 */
export function getAge(birthdayISO: string, atNextBirthday = false): number {
  const today = new Date();
  const bday = parseISO(birthdayISO);
  const age = differenceInYears(today, bday);
  return atNextBirthday ? age + 1 : age;
}

/**
 * Libellé humain du délai : "Aujourd'hui", "Demain", "Dans X jours", etc.
 */
export function humanDaysUntil(days: number): string {
  if (days === 0) return "Aujourd'hui 🎉";
  if (days === 1) return 'Demain 🔥';
  if (days <= 7) return `Dans ${days} jours`;
  return `Dans ${days} jours`;
}

/**
 * Retourne "urgent" si l'événement est dans les 7 prochains jours.
 */
export function isUrgent(daysUntil: number): boolean {
  return daysUntil <= 7;
}

// ── Événements à venir ─────────────────────────

/**
 * Calcule tous les événements à venir pour une liste de contacts.
 * Inclut anniversaires + fêtes des prénoms.
 */
export function getUpcomingEvents(contacts: Contact[], limitDays = 365): UpcomingEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const events: UpcomingEvent[] = [];

  for (const contact of contacts) {
    // Anniversaire
    if (contact.birthday) {
      const days = daysUntilBirthday(contact.birthday);
      if (days <= limitDays) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + days);
        events.push({
          contact,
          eventType: 'birthday',
          date: nextDate,
          daysUntil: days,
          age: getAge(contact.birthday, true), // âge qu'ils auront à leur prochain anniversaire
        });
      }
    }

    // Fête du prénom (auto-détectée si non définie)
    const nameDayMmdd = contact.name_day ?? getNameDayForName(contact.name.split(' ')[0]);
    if (nameDayMmdd) {
      const days = daysUntilNextOccurrence(nameDayMmdd);
      if (days <= limitDays) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + days);
        events.push({
          contact,
          eventType: 'name_day',
          date: nextDate,
          daysUntil: days,
        });
      }
    }
  }

  // Trier par proximité
  return events.sort((a, b) => a.daysUntil - b.daysUntil);
}

/**
 * Groupe les événements par mois (ex: "Avril 2025" → [...])
 */
export function groupEventsByMonth(events: UpcomingEvent[]): Record<string, UpcomingEvent[]> {
  const groups: Record<string, UpcomingEvent[]> = {};
  for (const event of events) {
    const key = format(event.date, 'MMMM yyyy', { locale: fr });
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
  }
  return groups;
}

/**
 * Retourne le "MM-DD" de la date d'aujourd'hui.
 */
export function todayMmdd(): string {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}
