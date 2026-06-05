/**
 * Extrait le prénom depuis un nom stocké au format "NOM Prénom" ou "NOM-COMPOSÉ Prénom".
 * Gère les noms composés : "DESCOURVIERES FONTAINE Carine" → "Carine"
 * Fallback : si tout est en majuscules, retourne le dernier mot.
 */
export function extractFirstName(fullName: string): string {
  if (!fullName.trim()) return fullName;
  const parts = fullName.trim().split(/\s+/);
  const firstParts = parts.filter((w) => !(w === w.toUpperCase() && /[A-Z]/.test(w)));
  return firstParts.join(' ') || parts[parts.length - 1] || fullName;
}

/**
 * Extrait le nom de famille depuis un nom stocké au format "NOM Prénom".
 */
export function extractLastName(fullName: string): string {
  if (!fullName.trim()) return fullName;
  const parts = fullName.trim().split(/\s+/);
  const lastParts = parts.filter((w) => w === w.toUpperCase() && /[A-Z]/.test(w));
  return lastParts.join(' ') || parts[0] || fullName;
}
