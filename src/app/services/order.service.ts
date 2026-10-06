/** Сервис заказов: калькулятор цены (чистая логика), отправка в Go-API; в mock-режиме — мок-ответ, ошибки API пробрасываются наружу. */

import { http } from '@app/api/http.client';
import { ApiRoutes } from '@app/config/api-routes.config';
import { AppConfig } from '@app/config/app.config';
import type {
  CheckoutRequestInterface,
  OrderEstimateParamsInterface,
  OrderRequestInterface,
  OrderResponseInterface,
} from '@app/models/order/order.interface';
import type { DetailLevelType } from '@app/models/order/order.type';
import type { ProductCategoryType } from '@app/models/products/product.type';
import { makeId } from '@app/utils/id.util';

const NETWORK_DELAY_MS = 900;
const ROUND_STEP = 100;

const BASE_PRICE: Record<ProductCategoryType, number> = {
  art: 9_000,
  tech: 15_000,
  character: 30_000,
  environment: 18_000,
  architecture: 14_000,
};

const DETAIL_FACTOR: Record<DetailLevelType, number> = {
  low: 1,
  mid: 1.8,
  high: 3.2,
};

const RUSH_WEEKS_HARD = 1;
const RUSH_WEEKS_SOFT = 2;
const RUSH_FACTOR_HARD = 1.5;
const RUSH_FACTOR_SOFT = 1.2;
const BULK_COUNT = 5;
const BULK_FACTOR = 0.85;

const rushFactor = (weeks: number): number => {
  if (weeks <= RUSH_WEEKS_HARD) return RUSH_FACTOR_HARD;
  if (weeks <= RUSH_WEEKS_SOFT) return RUSH_FACTOR_SOFT;
  return 1;
};

const respondLater = <T>(value: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), NETWORK_DELAY_MS);
  });

const mockResponse = (): OrderResponseInterface => ({
  id: `FRM-${makeId()}`,
  status: 'accepted',
});

export const OrderService = {
  estimate: (params: OrderEstimateParamsInterface): number => {
    const bulk = params.count >= BULK_COUNT ? BULK_FACTOR : 1;
    const raw =
      BASE_PRICE[params.category] *
      DETAIL_FACTOR[params.detail] *
      params.count *
      rushFactor(params.deadlineWeeks) *
      bulk;
    return Math.round(raw / ROUND_STEP) * ROUND_STEP;
  },

  submit: (request: OrderRequestInterface): Promise<OrderResponseInterface> =>
    AppConfig.useMocks
      ? respondLater(mockResponse())
      : http.post<OrderResponseInterface>(ApiRoutes.orders, { json: request }),

  checkout: (request: CheckoutRequestInterface): Promise<OrderResponseInterface> =>
    AppConfig.useMocks
      ? respondLater(mockResponse())
      : http.post<OrderResponseInterface>(ApiRoutes.checkout, { json: request }),
};
