/** Конфиг локалей: список, нативные названия, направление письма, определение из URL. */

import type { LocaleType, TextDirectionType } from '@app/models/common/common.type';
import { Locales } from '@app/models/common/common.type';

export interface LocaleMetaInterface {
  readonly code: LocaleType;
  readonly nativeName: string;
  readonly dir: TextDirectionType;
}

export const DefaultLocale: LocaleType = Locales.Ru;

export const LocalesList: readonly LocaleType[] = [
  Locales.Ru,
  Locales.En,
  Locales.Es,
  Locales.De,
  Locales.Pl,
  Locales.Tg,
  Locales.Kk,
  Locales.Fa,
  Locales.Ar,
  Locales.Ko,
  Locales.Zh,
];

export const LocalesMeta: Record<LocaleType, LocaleMetaInterface> = {
  ru: { code: 'ru', nativeName: 'Русский', dir: 'ltr' },
  en: { code: 'en', nativeName: 'English', dir: 'ltr' },
  es: { code: 'es', nativeName: 'Español', dir: 'ltr' },
  de: { code: 'de', nativeName: 'Deutsch', dir: 'ltr' },
  pl: { code: 'pl', nativeName: 'Polski', dir: 'ltr' },
  tg: { code: 'tg', nativeName: 'Тоҷикӣ', dir: 'ltr' },
  kk: { code: 'kk', nativeName: 'Қазақша', dir: 'ltr' },
  fa: { code: 'fa', nativeName: 'فارسی', dir: 'rtl' },
  ar: { code: 'ar', nativeName: 'العربية', dir: 'rtl' },
  ko: { code: 'ko', nativeName: '한국어', dir: 'ltr' },
  zh: { code: 'zh', nativeName: '中文', dir: 'ltr' },
};

export const isLocale = (value: string): value is LocaleType =>
  (LocalesList as readonly string[]).includes(value);

/** Локаль из первого сегмента пути ('/en/works' → 'en'), null если сегмент не локаль. */
export const localeFromPath = (pathname: string): LocaleType | null => {
  const [first] = pathname.replace(/^\//, '').split('/');
  return first !== undefined && isLocale(first) ? first : null;
};

/** Подбор локали по языку браузера ('de-AT' → 'de'), иначе дефолт. */
export const matchBrowserLocale = (languages: readonly string[]): LocaleType => {
  for (const lang of languages) {
    const short = lang.toLowerCase().split('-')[0];
    if (short !== undefined && isLocale(short)) return short;
  }
  return DefaultLocale;
};
