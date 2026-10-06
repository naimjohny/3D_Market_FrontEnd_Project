/** Модели заказа: параметры калькулятора, заявка на кастомный 3D, ответ сервера, чекаут корзины. */

import type { ProductCategoryType } from '../products/product.type';
import type { DetailLevelType } from './order.type';

export interface OrderEstimateParamsInterface {
  readonly category: ProductCategoryType;
  readonly detail: DetailLevelType;
  readonly count: number;
  readonly deadlineWeeks: number;
}

export interface OrderRequestInterface extends OrderEstimateParamsInterface {
  readonly name: string;
  readonly email: string;
  readonly contact: string;
  readonly message: string;
  readonly fileName: string | null;
}

export interface OrderResponseInterface {
  readonly id: string;
  readonly status: 'accepted';
  readonly payUrl?: string;
}

export interface CheckoutItemInterface {
  readonly productId: string;
  readonly qty: number;
}

export interface CheckoutRequestInterface {
  readonly name: string;
  readonly email: string;
  readonly items: readonly CheckoutItemInterface[];
}
