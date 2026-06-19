import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import fr from './locales/fr';
import en from './locales/en';
import de from './locales/de';
import es from './locales/es';
import it from './locales/it';
import pt from './locales/pt';
import { getItemAsync, setItemAsync } from '../utils/storage';

export type AppLanguage = 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt';
export type AppLanguageOrSystem = AppLanguage | 'system';

export const LANGUAGE_STORAGE_KEY = 'cc_app_language';

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

const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

function getSystemLanguage(): AppLanguage {
  const locale = getLocales()[0]?.languageCode ?? 'fr';
  const code = locale.split('-')[0].toLowerCase();
  return (SUPPORTED_CODES.includes(code as AppLanguage) ? code : 'fr') as AppLanguage;
}

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
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  } as any);

/** À appeler au démarrage de l'appli pour charger la préférence sauvegardée. */
export async function initLanguage(): Promise<void> {
  const saved = (await getItemAsync(LANGUAGE_STORAGE_KEY)) as AppLanguageOrSystem | null;
  const lang = (!saved || saved === 'system') ? getSystemLanguage() : saved as AppLanguage;
  if (lang !== i18n.language) await i18n.changeLanguage(lang);
}

/** Change la langue et persiste le choix. */
export async function setLanguage(choice: AppLanguageOrSystem): Promise<void> {
  await setItemAsync(LANGUAGE_STORAGE_KEY, choice);
  const lang = choice === 'system' ? getSystemLanguage() : choice;
  await i18n.changeLanguage(lang);
}

export default i18n;
