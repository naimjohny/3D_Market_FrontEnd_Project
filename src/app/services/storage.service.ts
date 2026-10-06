/** Абстракция хранилища поверх cookies — единственная точка доступа (готова к замене на RN). */

import Cookies from 'js-cookie';
import { isLocale } from '@app/config/locale.config';
import type { CartItemInterface } from '@app/models/cart/cart.interface';
import type { LocaleType } from '@app/models/common/common.type';

const COOKIE_KEYS = {
  language: 'frm_lang',
  cart: 'frm_cart',
  adminToken: 'frm_token',
} as const;

const YEAR_DAYS = 365;
const CART_DAYS = 30;
const TOKEN_DAYS = 1;

const secure = window.location.protocol === 'https:';

export const StorageService = {
  getLanguage: (): LocaleType | null => {
    const raw = Cookies.get(COOKIE_KEYS.language);
    return raw !== undefined && isLocale(raw) ? raw : null;
  },

  setLanguage: (lang: LocaleType): void => {
    Cookies.set(COOKIE_KEYS.language, lang, { sameSite: 'Lax', expires: YEAR_DAYS, secure });
  },

  getCart: (): readonly CartItemInterface[] => {
    const raw = Cookies.get(COOKIE_KEYS.cart);
    if (raw === undefined) return [];
    try {
      return JSON.parse(raw) as CartItemInterface[];
    } catch {
      return [];
    }
  },

  setCart: (items: readonly CartItemInterface[]): void => {
    Cookies.set(COOKIE_KEYS.cart, JSON.stringify(items), { sameSite: 'Lax', expires: CART_DAYS, secure });
  },

  getAdminToken: (): string | null => Cookies.get(COOKIE_KEYS.adminToken) ?? null,

  setAdminToken: (token: string): void => {
    Cookies.set(COOKIE_KEYS.adminToken, token, { sameSite: 'Strict', expires: TOKEN_DAYS, secure });
  },

  clearAdminToken: (): void => {
    Cookies.remove(COOKIE_KEYS.adminToken);
  },
};
