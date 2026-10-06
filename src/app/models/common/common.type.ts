/** Общие типы приложения: локали и направление письма. */

export type LocaleType =
  | 'ru'
  | 'en'
  | 'es'
  | 'de'
  | 'pl'
  | 'tg'
  | 'kk'
  | 'fa'
  | 'ar'
  | 'ko'
  | 'zh';

export type TextDirectionType = 'ltr' | 'rtl';

export const Locales = {
  Ru: 'ru',
  En: 'en',
  Es: 'es',
  De: 'de',
  Pl: 'pl',
  Tg: 'tg',
  Kk: 'kk',
  Fa: 'fa',
  Ar: 'ar',
  Ko: 'ko',
  Zh: 'zh',
} as const;
