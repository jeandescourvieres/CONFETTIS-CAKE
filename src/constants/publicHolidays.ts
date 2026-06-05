// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Jours fériés nationaux
// ═══════════════════════════════════════════════════════════

export type Country = 'fr' | 'ch' | 'be' | 'ca';

export const COUNTRY_LABELS: Record<Country, { label: string; flag: string }> = {
  fr: { label: 'France',   flag: '🇫🇷' },
  ch: { label: 'Suisse',   flag: '🇨🇭' },
  be: { label: 'Belgique', flag: '🇧🇪' },
  ca: { label: 'Canada',   flag: '🇨🇦' },
};

export interface PublicHoliday {
  id: string;
  name: string;
  emoji: string;
  getDate: (year: number) => Date;
}

// ── Calcul de Pâques (algorithme grégorien) ───────────────
function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month - 1, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month - 1, 1 + offset + (n - 1) * 7);
}

// ── 🇫🇷 France — 11 jours fériés ─────────────────────────
const HOLIDAYS_FR: PublicHoliday[] = [
  { id: 'fr_nouvel_an',   name: "Jour de l'An",        emoji: '🎆', getDate: (y) => new Date(y, 0, 1) },
  { id: 'fr_paques',      name: 'Lundi de Pâques',     emoji: '🐣', getDate: (y) => addDays(easter(y), 1) },
  { id: 'fr_travail',     name: 'Fête du Travail',      emoji: '🌹', getDate: (y) => new Date(y, 4, 1) },
  { id: 'fr_victoire',    name: 'Victoire 1945',        emoji: '🕊️', getDate: (y) => new Date(y, 4, 8) },
  { id: 'fr_ascension',   name: 'Ascension',            emoji: '✨', getDate: (y) => addDays(easter(y), 39) },
  { id: 'fr_pentecote',   name: 'Lundi de Pentecôte',  emoji: '🕊️', getDate: (y) => addDays(easter(y), 50) },
  { id: 'fr_nationale',   name: 'Fête Nationale',       emoji: '🇫🇷', getDate: (y) => new Date(y, 6, 14) },
  { id: 'fr_assomption',  name: 'Assomption',           emoji: '✨', getDate: (y) => new Date(y, 7, 15) },
  { id: 'fr_toussaint',   name: 'Toussaint',            emoji: '🕯️', getDate: (y) => new Date(y, 10, 1) },
  { id: 'fr_armistice',   name: 'Armistice',            emoji: '🕊️', getDate: (y) => new Date(y, 10, 11) },
  { id: 'fr_noel',        name: 'Noël',                 emoji: '🎄', getDate: (y) => new Date(y, 11, 25) },
];

// ── 🇨🇭 Suisse — Jours fériés fédéraux ───────────────────
const HOLIDAYS_CH: PublicHoliday[] = [
  { id: 'ch_nouvel_an',     name: "Jour de l'An",            emoji: '🎆', getDate: (y) => new Date(y, 0, 1) },
  { id: 'ch_vendredi_saint',name: 'Vendredi Saint',          emoji: '✨', getDate: (y) => addDays(easter(y), -2) },
  { id: 'ch_paques',        name: 'Lundi de Pâques',         emoji: '🐣', getDate: (y) => addDays(easter(y), 1) },
  { id: 'ch_ascension',     name: 'Ascension',               emoji: '✨', getDate: (y) => addDays(easter(y), 39) },
  { id: 'ch_pentecote',     name: 'Lundi de Pentecôte',      emoji: '🕊️', getDate: (y) => addDays(easter(y), 50) },
  { id: 'ch_nationale',     name: 'Fête nationale suisse',   emoji: '🇨🇭', getDate: (y) => new Date(y, 7, 1) },
  { id: 'ch_noel',          name: 'Noël',                    emoji: '🎄', getDate: (y) => new Date(y, 11, 25) },
  { id: 'ch_saint_etienne', name: 'Saint-Étienne',           emoji: '✨', getDate: (y) => new Date(y, 11, 26) },
];

// ── 🇧🇪 Belgique — 10 jours fériés ───────────────────────
const HOLIDAYS_BE: PublicHoliday[] = [
  { id: 'be_nouvel_an',  name: "Jour de l'An",          emoji: '🎆', getDate: (y) => new Date(y, 0, 1) },
  { id: 'be_paques',     name: 'Lundi de Pâques',       emoji: '🐣', getDate: (y) => addDays(easter(y), 1) },
  { id: 'be_travail',    name: 'Fête du Travail',        emoji: '🌹', getDate: (y) => new Date(y, 4, 1) },
  { id: 'be_ascension',  name: 'Ascension',              emoji: '✨', getDate: (y) => addDays(easter(y), 39) },
  { id: 'be_pentecote',  name: 'Lundi de Pentecôte',    emoji: '🕊️', getDate: (y) => addDays(easter(y), 50) },
  { id: 'be_nationale',  name: 'Fête nationale belge',  emoji: '🇧🇪', getDate: (y) => new Date(y, 6, 21) },
  { id: 'be_assomption', name: 'Assomption',             emoji: '✨', getDate: (y) => new Date(y, 7, 15) },
  { id: 'be_toussaint',  name: 'Toussaint',              emoji: '🕯️', getDate: (y) => new Date(y, 10, 1) },
  { id: 'be_armistice',  name: 'Armistice',              emoji: '🕊️', getDate: (y) => new Date(y, 10, 11) },
  { id: 'be_noel',       name: 'Noël',                   emoji: '🎄', getDate: (y) => new Date(y, 11, 25) },
];

// ── 🇨🇦 Canada — Jours fériés fédéraux ───────────────────
const HOLIDAYS_CA: PublicHoliday[] = [
  { id: 'ca_nouvel_an',  name: "Jour de l'An",         emoji: '🎆', getDate: (y) => new Date(y, 0, 1) },
  { id: 'ca_vendredi',   name: 'Vendredi Saint',        emoji: '✨', getDate: (y) => addDays(easter(y), -2) },
  { id: 'ca_victoria',   name: 'Journée Victoria',      emoji: '👑', getDate: (y) => {
    const may25 = new Date(y, 4, 25);
    const daysBack = (may25.getDay() - 1 + 7) % 7;
    return new Date(y, 4, 25 - daysBack);
  }},
  { id: 'ca_nationale',  name: 'Fête du Canada',        emoji: '🇨🇦', getDate: (y) => new Date(y, 6, 1) },
  { id: 'ca_labour',     name: 'Fête du Travail',       emoji: '🌹', getDate: (y) => nthWeekday(y, 9, 1, 1) },
  { id: 'ca_thanks',     name: "Action de grâce",       emoji: '🦃', getDate: (y) => nthWeekday(y, 10, 1, 2) },
  { id: 'ca_souvenir',   name: 'Jour du Souvenir',      emoji: '🌺', getDate: (y) => new Date(y, 10, 11) },
  { id: 'ca_noel',       name: 'Noël',                  emoji: '🎄', getDate: (y) => new Date(y, 11, 25) },
  { id: 'ca_boxing',     name: 'Lendemain de Noël',     emoji: '🎁', getDate: (y) => new Date(y, 11, 26) },
];

// ── Table principale ──────────────────────────────────────
export const PUBLIC_HOLIDAYS: Record<Country, PublicHoliday[]> = {
  fr: HOLIDAYS_FR,
  ch: HOLIDAYS_CH,
  be: HOLIDAYS_BE,
  ca: HOLIDAYS_CA,
};

// ── Utilitaires ───────────────────────────────────────────

/** Ensemble des jours du mois qui sont fériés. */
export function getPublicHolidayDays(country: Country, year: number, month: number): Set<number> {
  const days = new Set<number>();
  for (const h of PUBLIC_HOLIDAYS[country]) {
    const d = h.getDate(year);
    if (d.getMonth() + 1 === month) days.add(d.getDate());
  }
  return days;
}

/** Liste des jours fériés d'un mois donné, triés par jour. */
export function getPublicHolidaysForMonth(
  country: Country,
  year: number,
  month: number,
): Array<PublicHoliday & { date: Date }> {
  return PUBLIC_HOLIDAYS[country]
    .map((h) => ({ ...h, date: h.getDate(year) }))
    .filter((h) => h.date.getMonth() + 1 === month)
    .sort((a, b) => a.date.getDate() - b.date.getDate());
}
