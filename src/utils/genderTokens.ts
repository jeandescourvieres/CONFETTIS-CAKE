/**
 * Résout les tokens de genre dans les templates.
 * {E_EXP}  → "e" si l'expéditeur est féminin, "" sinon
 * {E_DEST} → "e" si le destinataire est féminin, "" sinon
 *
 * Utilisé pour éviter les formes épicènes "(e)" dans les messages affichés.
 */
export function resolveGenderTokens(
  text: string,
  senderGender: 'm' | 'f',
  recipientGender: 'm' | 'f',
): string {
  return text
    .replace(/\{E_EXP\}/g, senderGender === 'f' ? 'e' : '')
    .replace(/\{E_DEST\}/g, recipientGender === 'f' ? 'e' : '');
}
