import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr';
import en from './locales/en';
import de from './locales/de';
import es from './locales/es';
import it from './locales/it';
import ar from './locales/ar';
import pt from './locales/pt';

export type AppLanguage = 'fr' | 'en' | 'de' | 'es' | 'it' | 'ar' | 'pt';

export const SUPPORTED_LANGUAGES: {
  code: AppLanguage;
  label: string;
  flag: string;
  rtl?: boolean;
}[] = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
  { code: 'ar', label: 'العربية',   flag: '🇸🇦', rtl: true },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      it: { translation: it },
      ar: { translation: ar },
      pt: { translation: pt },
    },
    lng: 'fr',          // langue par défaut
    fallbackLng: 'fr',  // toujours fallback français
    interpolation: {
      escapeValue: false, // React gère déjà le XSS
    },
    compatibilityJSON: 'v4',
    initImmediate: false, // init synchrone → évite le throw Suspense au premier rendu
  });

export default i18n;
