// ── Signature virale ConfettiCake ─────────────────────────────────────────
// Ajoutée à tous les messages partagés (WhatsApp, SMS, email, copie)
// Les membres Premium peuvent la désactiver dans leurs préférences

const APP_URL = 'https://confettis-cake.app';

const SIGNATURES: Record<string, { main: string; cta: string }> = {
  fr: {
    main: 'Créé avec ConfettiCake · Envoie, toi aussi, des messages uniques aux gens qui comptent pour toi',
    cta: 'Télécharge gratuitement ConfettiCake et parraine tes ami·e·s',
  },
  en: {
    main: 'Created with ConfettiCake · Send unique messages to the people who matter to you',
    cta: 'Download ConfettiCake for free and invite your friends',
  },
  de: {
    main: 'Erstellt mit ConfettiCake · Sende einzigartige Nachrichten an deine Liebsten',
    cta: 'Lade ConfettiCake kostenlos herunter und lade Freunde ein',
  },
  es: {
    main: 'Creado con ConfettiCake · Envía mensajes únicos a las personas que importan',
    cta: 'Descarga ConfettiCake gratis e invita a tus amigos',
  },
  it: {
    main: 'Creato con ConfettiCake · Invia messaggi unici alle persone che contano',
    cta: 'Scarica ConfettiCake gratis e invita i tuoi amici',
  },
  ar: {
    main: 'تم الإنشاء بواسطة ConfettiCake · أرسل رسائل فريدة إلى من يهمّك أمرهم',
    cta: 'حمّل ConfettiCake مجاناً وادعُ أصدقاءك',
  },
  pt: {
    main: 'Criado com ConfettiCake · Envie mensagens únicas para as pessoas que importam',
    cta: 'Baixe ConfettiCake gratuitamente e convide seus amigos',
  },
};

/**
 * Retourne le texte de signature à appendre au message partagé.
 * @param language code langue de l'app (fr, en, de, es, it)
 */
export function buildSignatureText(language = 'fr'): string {
  const sig = SIGNATURES[language] ?? SIGNATURES['fr'];
  return `\n\n— ${sig.main} · ${APP_URL}`;
}

/**
 * Labels de la bannière in-app (pour l'affichage stylé dans la preview).
 */
export function getSignatureLabels(language = 'fr') {
  const sig = SIGNATURES[language] ?? SIGNATURES['fr'];
  return {
    main: `🎁 ${sig.main}`,
    cta: `👉 ${sig.cta}`,
    url: APP_URL,
  };
}
