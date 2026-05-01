// ── Signature virale Confettis & Cake ─────────────────────────────────────────
// Ajoutée à tous les messages partagés (WhatsApp, SMS, email, copie)
// Les membres Premium peuvent la désactiver dans leurs préférences

const APP_URL = 'https://confettis-cake.app';

const SIGNATURES: Record<string, { main: string; cta: string }> = {
  fr: {
    main: 'Créé avec Confettis & Cake · Envoie, toi aussi, des messages uniques aux gens qui comptent pour toi',
    cta: 'Télécharge gratuitement Confettis & Cake et parraine tes ami·e·s',
  },
  en: {
    main: 'Created with Confettis & Cake · Send unique messages to the people who matter to you',
    cta: 'Download Confettis & Cake for free and invite your friends',
  },
  de: {
    main: 'Erstellt mit Confettis & Cake · Sende einzigartige Nachrichten an deine Liebsten',
    cta: 'Lade Confettis & Cake kostenlos herunter und lade Freunde ein',
  },
  es: {
    main: 'Creado con Confettis & Cake · Envía mensajes únicos a las personas que importan',
    cta: 'Descarga Confettis & Cake gratis e invita a tus amigos',
  },
  it: {
    main: 'Creato con Confettis & Cake · Invia messaggi unici alle persone che contano',
    cta: 'Scarica Confettis & Cake gratis e invita i tuoi amici',
  },
  ar: {
    main: 'تم الإنشاء بواسطة Confettis & Cake · أرسل رسائل فريدة إلى من يهمّك أمرهم',
    cta: 'حمّل Confettis & Cake مجاناً وادعُ أصدقاءك',
  },
  pt: {
    main: 'Criado com Confettis & Cake · Envie mensagens únicas para as pessoas que importam',
    cta: 'Baixe Confettis & Cake gratuitamente e convide seus amigos',
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
