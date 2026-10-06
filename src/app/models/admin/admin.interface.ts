/** Модели админ-панели: авторизация, заказы, статистика и контракт auth-стора. */

import type { DetailLevelType } from '../order/order.type';
import type { ProductCategoryType } from '../products/product.type';
import type { OrderKindType, OrderStatusType, StripeModeType } from './admin.type';

export interface LoginRequestInterface {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponseInterface {
  readonly token: string;
  readonly expiresAt: string;
}

export interface AdminOrderItemInterface {
  readonly productId: string;
  readonly qty: number;
}

export interface AdminOrderInterface {
  readonly id: string;
  readonly kind: OrderKindType;
  readonly name: string;
  readonly email: string;
  readonly contact: string;
  readonly message: string;
  readonly category: ProductCategoryType | null;
  readonly detail: DetailLevelType | null;
  readonly count: number | null;
  readonly deadlineWeeks: number | null;
  readonly estimate: number | null;
  readonly items: readonly AdminOrderItemInterface[] | null;
  readonly total: number | null;
  readonly status: OrderStatusType;
  readonly createdAt: string;
}

export interface AdminStatsInterface {
  readonly ordersTotal: number;
  readonly ordersNew: number;
  readonly revenuePaid: number;
  readonly customCount: number;
  readonly checkoutCount: number;
}

export interface StripeSettingsInterface {
  readonly configured: boolean;
  readonly mode: StripeModeType | null;
  readonly secretKeyLast4: string | null;
  readonly webhookConfigured: boolean;
  readonly accountName: string | null;
}

export interface StripeSettingsRequestInterface {
  readonly secretKey: string;
  readonly webhookSecret?: string;
}

export interface AuthStoreInterface {
  readonly isAuthed: boolean;
  readonly login: (token: string) => void;
  readonly logout: () => void;
}
