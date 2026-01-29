import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

// Import translations
import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';
import caTranslation from '../locales/ca/translation.json';
import frTranslation from '../locales/fr/translation.json';
import deTranslation from '../locales/de/translation.json';
import itTranslation from '../locales/it/translation.json';
import ptTranslation from '../locales/pt/translation.json';
import jaTranslation from '../locales/ja/translation.json';
import zhTranslation from '../locales/zh/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  ca: {
    translation: caTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
  it: {
    translation: itTranslation,
  },
  pt: {
    translation: ptTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

// Get the device locale
const getDeviceLocale = (): string => {
  // For web, we'll use a simple approach
  if (Platform.OS === 'web') {
    // Try to get locale from browser
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const languageCode = browserLang.split('-')[0];

    // Check if we support this language
    if (resources[languageCode as keyof typeof resources]) {
      return languageCode;
    }

    return 'en';
  }

  // For native platforms, use react-native-localize
  try {
    const Localize = require('react-native-localize');
    const locales = Localize.getLocales();
    if (locales.length > 0) {
      const locale = locales[0];
      const languageCode = locale.languageCode;

      // Check if we support this language
      if (resources[languageCode as keyof typeof resources]) {
        return languageCode;
      }
    }
  } catch (error) {
    console.warn('react-native-localize not available:', error);
  }

  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLocale(),
  fallbackLng: 'en',
  debug: __DEV__,

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  react: {
    useSuspense: false, // React Native doesn't support Suspense yet
  },
});

export default i18n;
