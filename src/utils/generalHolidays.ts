// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Fêtes & Journées généralistes
// ═══════════════════════════════════════════════════════════

import type { Occasion } from '../stores/createStore';

export interface GeneralHoliday {
  id: string;
  name: string;
  emoji: string;
  description: string;
  hasMessageCta: boolean;
  occasion?: Occasion;       // occasion pré-remplie dans le générateur
  ctaLabel?: string;         // libellé du bouton CTA
  notifyDaysBefore: number;  // combien de jours avant on notifie
  getDate: (year: number) => Date;
}

export interface HolidayWithDate extends GeneralHoliday {
  date: Date;
  daysUntil: number;
}

// ── Helpers de calcul de date ─────────────────────────────

/** N-ème occurrence d'un jour de la semaine dans un mois.
 *  weekday : 0=dim, 1=lun, …, 6=sam  |  n : 1=premier, 2=deuxième… */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month - 1, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, month - 1, day);
}

/** Dernière occurrence d'un jour de la semaine dans un mois. */
function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const last = new Date(year, month, 0);
  const diff = (last.getDay() - weekday + 7) % 7;
  return new Date(year, month - 1, last.getDate() - diff);
}

// ── Liste des fêtes ───────────────────────────────────────

export const GENERAL_HOLIDAYS: GeneralHoliday[] = [
  {
    id: 'new_year',
    name: "Nouvel An — Bonne année !",
    emoji: '🎆',
    description: 'Le 1er janvier, envoie tes vœux à ceux qui comptent pour toi.',
    hasMessageCta: true,
    occasion: 'newyear',
    ctaLabel: '🎆 Envoyer mes vœux',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 0, 1),
  },
  {
    id: 'saint_patrick',
    name: 'Saint Patrick',
    emoji: '🍀',
    description: 'Le 17 mars, la fête irlandaise de la chance et du trèfle à quatre feuilles !',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🍀 Message irlandais',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 2, 17),
  },
  {
    id: 'world_hugs_day',
    name: 'Journée mondiale des câlins',
    emoji: '🤗',
    description: 'Le 21 janvier, une journée pour célébrer la chaleur humaine.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🤗 Envoyer un câlin virtuel',
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 0, 21),
  },
  {
    id: 'world_pizza_day',
    name: 'Journée mondiale de la pizza',
    emoji: '🍕',
    description: 'Le 9 février, honore la reine des plats du monde entier !',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🍕 Message pizzaiolo',
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 1, 9),
  },
  {
    id: 'valentines',
    name: 'Saint-Valentin',
    emoji: '❤️',
    description: 'La fête des amoureux, le 14 février.',
    hasMessageCta: true,
    occasion: 'valentines',
    ctaLabel: '❤️ Message d\'amour',
    notifyDaysBefore: 7,
    getDate: (y) => new Date(y, 1, 14),
  },
  {
    id: 'grandmothers_day',
    name: 'Fête des grand-mères',
    emoji: '👵',
    description: 'Le 1er dimanche de mars, célèbre ta grand-mère.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '💐 Message pour mamie',
    notifyDaysBefore: 7,
    getDate: (y) => nthWeekdayOfMonth(y, 3, 0, 1),
  },
  {
    id: 'womens_day',
    name: 'Journée de la femme',
    emoji: '💜',
    description: 'Le 8 mars, Journée internationale des droits de la femme.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '💜 Envoyer un message',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 2, 8),
  },
  {
    id: 'april_fools',
    name: 'Poisson d\'avril',
    emoji: '🐟',
    description: 'Le 1er avril, journée des farces et blagues traditionnelles !',
    hasMessageCta: false,
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 3, 1),
  },
  {
    id: 'secretaries_day',
    name: 'Fête des secrétaires',
    emoji: '🌹',
    description: 'Le dernier mercredi d\'avril, hommage aux assistantes et secrétaires.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🌹 Créer un message',
    notifyDaysBefore: 3,
    getDate: (y) => lastWeekdayOfMonth(y, 4, 3),
  },
  {
    id: 'labour_day',
    name: 'Fête du travail',
    emoji: '🌹',
    description: 'Le 1er mai, journée internationale des travailleurs.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🌹 Message de solidarité',
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 4, 1),
  },
  {
    id: 'mothers_day',
    name: 'Fête des mères',
    emoji: '💐',
    description: 'Le dernier dimanche de mai, célèbre ta maman.',
    hasMessageCta: true,
    occasion: 'mothersday',
    ctaLabel: '💐 Message pour maman',
    notifyDaysBefore: 7,
    getDate: (y) => lastWeekdayOfMonth(y, 5, 0),
  },
  {
    id: 'neighbours_day',
    name: 'Fête des voisins',
    emoji: '🏘️',
    description: 'Le dernier vendredi de mai — l\'occasion parfaite de tisser du lien avec ceux qui habitent près de chez toi.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🏘️ Message pour mes voisins',
    notifyDaysBefore: 7,
    getDate: (y) => lastWeekdayOfMonth(y, 5, 5),
  },
  {
    id: 'music_day',
    name: 'Fête de la musique',
    emoji: '🎵',
    description: 'Le 21 juin, la musique envahit les rues pour le solstice d\'été.',
    hasMessageCta: false,
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 5, 21),
  },
  {
    id: 'saint_jean',
    name: 'Fête de la Saint-Jean',
    emoji: '🔥',
    description: 'Le 23 juin, fête du solstice d\'été avec feux de joie.',
    hasMessageCta: false,
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 5, 23),
  },
  {
    id: 'fathers_day',
    name: 'Fête des pères',
    emoji: '👨',
    description: 'Le 3ème dimanche de juin, célèbre ton papa.',
    hasMessageCta: true,
    occasion: 'fathersday',
    ctaLabel: '👨 Message pour papa',
    notifyDaysBefore: 7,
    getDate: (y) => nthWeekdayOfMonth(y, 6, 0, 3),
  },
  {
    id: 'bastille_day',
    name: 'Fête nationale française',
    emoji: '🇫🇷',
    description: 'Le 14 juillet, célébration de la prise de la Bastille en 1789.',
    hasMessageCta: false,
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 6, 14),
  },
  {
    id: 'world_chocolate_day',
    name: 'Journée mondiale du chocolat',
    emoji: '🍫',
    description: 'Le 11 juillet, la plus gourmande des journées mondiales !',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🍫 Message chocolaté',
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 6, 11),
  },
  {
    id: 'friendship_day',
    name: "Journée mondiale de l'amitié",
    emoji: '🤝',
    description: 'Le 30 juillet, célèbre tes amis et les liens qui comptent.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🤝 Message à un ami',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 6, 30),
  },
  {
    id: 'world_cat_day',
    name: 'Journée mondiale du chat',
    emoji: '🐱',
    description: 'Le 8 août, honore les félins et leurs heureux propriétaires.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🐱 Message pour un proprio de chat',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 7, 8),
  },
  {
    id: 'world_dog_day',
    name: 'Journée mondiale du chien',
    emoji: '🐶',
    description: 'Le 26 août, célèbre les chiens et leurs maîtres fidèles.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🐶 Message pour un proprio de chien',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 7, 26),
  },
  {
    id: 'world_smile_day',
    name: 'Journée mondiale du sourire',
    emoji: '😊',
    description: 'Le 1er vendredi d\'octobre, la journée pour faire sourire le monde entier.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '😊 Message qui fait sourire',
    notifyDaysBefore: 1,
    getDate: (y) => nthWeekdayOfMonth(y, 10, 5, 1),
  },
  {
    id: 'grandfathers_day',
    name: 'Fête des grands-pères',
    emoji: '👴',
    description: 'Le 2ème dimanche d\'octobre, célèbre ton grand-père.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '👴 Message pour papi',
    notifyDaysBefore: 7,
    getDate: (y) => nthWeekdayOfMonth(y, 10, 0, 2),
  },
  {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    description: 'Le 31 octobre, nuit des fantômes, sorcières et friandises.',
    hasMessageCta: true,
    occasion: 'halloween',
    ctaLabel: '🎃 Message d\'Halloween',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 9, 31),
  },
  {
    id: 'beaujolais_nouveau',
    name: 'Beaujolais Nouveau',
    emoji: '🍷',
    description: 'Le 3ème jeudi de novembre — "Le Beaujolais Nouveau est arrivé !" Une tradition bien française.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '🍷 Message de dégustation',
    notifyDaysBefore: 3,
    getDate: (y) => nthWeekdayOfMonth(y, 11, 4, 3),
  },
  {
    id: 'armistice',
    name: 'Armistice',
    emoji: '🕊️',
    description: 'Le 11 novembre, commémoration de la fin de la Première Guerre mondiale.',
    hasMessageCta: false,
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 10, 11),
  },
  {
    id: 'world_kindness_day',
    name: 'Journée mondiale de la gentillesse',
    emoji: '💛',
    description: 'Le 13 novembre, une journée pour propager la bienveillance.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '💛 Message bienveillant',
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 10, 13),
  },
  {
    id: 'world_children_day',
    name: 'Journée mondiale des enfants',
    emoji: '👧',
    description: 'Le 20 novembre, journée internationale des droits de l\'enfant.',
    hasMessageCta: true,
    occasion: 'custom',
    ctaLabel: '👧 Message pour les enfants',
    notifyDaysBefore: 3,
    getDate: (y) => new Date(y, 10, 20),
  },
  {
    id: 'sainte_catherine',
    name: 'Sainte-Catherine',
    emoji: '👒',
    description: 'Le 25 novembre, tradition pour les célibataires de 25 ans.',
    hasMessageCta: false,
    notifyDaysBefore: 1,
    getDate: (y) => new Date(y, 10, 25),
  },
  {
    id: 'christmas',
    name: 'Noël',
    emoji: '🎄',
    description: 'Le 25 décembre, fête en famille avec cadeaux et bûche.',
    hasMessageCta: true,
    occasion: 'christmas',
    ctaLabel: '🎄 Message de Noël',
    notifyDaysBefore: 7,
    getDate: (y) => new Date(y, 11, 25),
  },
];

// ── Fonctions utilitaires ─────────────────────────────────

/**
 * Retourne les fêtes à venir dans les N prochains jours (triées par daysUntil).
 * Passe automatiquement à l'année suivante si la fête est déjà passée.
 */
export function getUpcomingHolidays(days: number, from: Date = new Date()): HolidayWithDate[] {
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  const result: HolidayWithDate[] = [];

  for (const holiday of GENERAL_HOLIDAYS) {
    let date = holiday.getDate(today.getFullYear());
    date.setHours(0, 0, 0, 0);
    let daysUntil = Math.round((date.getTime() - today.getTime()) / 86400000);

    // Fête déjà passée cette année → on prend l'année suivante
    if (daysUntil < 0) {
      date = holiday.getDate(today.getFullYear() + 1);
      date.setHours(0, 0, 0, 0);
      daysUntil = Math.round((date.getTime() - today.getTime()) / 86400000);
    }

    if (daysUntil >= 0 && daysUntil <= days) {
      result.push({ ...holiday, date, daysUntil });
    }
  }

  return result.sort((a, b) => a.daysUntil - b.daysUntil);
}

/**
 * Retourne les fêtes du mois indiqué, triées par jour.
 */
export function getHolidaysForMonth(year: number, month: number): Array<GeneralHoliday & { date: Date }> {
  return GENERAL_HOLIDAYS
    .map((h) => ({ ...h, date: h.getDate(year) }))
    .filter((h) => h.date.getMonth() + 1 === month)
    .sort((a, b) => a.date.getDate() - b.date.getDate());
}

/** Label court pour le nombre de jours jusqu'à la fête. */
export function holidayDaysLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Aujourd'hui !";
  if (daysUntil === 1) return 'Demain';
  return `Dans ${daysUntil} jours`;
}
