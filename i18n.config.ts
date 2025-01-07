import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enLocalization from './locales/en.json';
import koLocalization from './locales/ko.json';
import uzLocalization from './locales/uz.json';
import ruLocalization from './locales/ru.json';

const resources = {
  en: { translation: enLocalization },
  ko: { translation: koLocalization },
  uz: { translation: uzLocalization },
  ru: { translation: ruLocalization },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = Localization.locale;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
