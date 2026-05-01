import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr';
import en from './locales/en';
import de from './locales/de';
import es from './locales/es';
import it from './locales/it';
import pt from './locales/pt';

export type AppLanguage = 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt';

export const SUPPORTED_LANGUAGES: {
  code: AppLanguage;
  label: string;
  flag: string;
}[] = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

i18n
  .use(initReactI18next)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      it: { translation: it },
      pt: { translation: pt },
    },
    lng: 'fr',          // langue par défaut
    fallbackLng: 'fr',  // toujours fallback français
    interpolation: {
      escapeValue: false, // React gère déjà le XSS
    },
    compatibilityJSON: 'v4',
  } as any);

export default i18n;
