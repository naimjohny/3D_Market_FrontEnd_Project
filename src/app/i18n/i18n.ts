/** Инициализация i18next: 11 локалей, активная локаль приходит из URL-префикса роута. */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { LocaleType } from '@app/models/common/common.type';
import ar from './locales/ar.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fa from './locales/fa.json';
import kk from './locales/kk.json';
import ko from './locales/ko.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import tg from './locales/tg.json';
import zh from './locales/zh.json';

export const initI18n = (locale: LocaleType): void => {
  void i18n.use(initReactI18next).init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      es: { translation: es },
      de: { translation: de },
      pl: { translation: pl },
      tg: { translation: tg },
      kk: { translation: kk },
      fa: { translation: fa },
      ar: { translation: ar },
      ko: { translation: ko },
      zh: { translation: zh },
    },
    lng: locale,
    fallbackLng: ['en', 'ru'],
    interpolation: { escapeValue: false },
  });
};
