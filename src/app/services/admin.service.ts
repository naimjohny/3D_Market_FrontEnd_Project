/** Сервис админ-панели поверх http-клиента: на 401 разлогинивает через auth-стор и пробрасывает ошибку. */

import type { HttpErrorType } from '@app/api/http.client';
import { http } from '@app/api/http.client';
import { ApiRoutes } from '@app/config/api-routes.config';
import type {
  AdminOrderInterface,
  AdminStatsInterface,
  LoginRequestInterface,
  LoginResponseInterface,
  StripeSettingsInterface,
  StripeSettingsRequestInterface,
} from '@app/models/admin/admin.interface';
import type { OrderStatusType } from '@app/models/admin/admin.type';
import type { ProductInterface } from '@app/models/products/product.interface';
import { useAuthStore } from '@app/store/auth.store';

const HTTP_UNAUTHORIZED = 401;
const HTTP_BAD_REQUEST = 400;
const STRIPE_INVALID_KEY_CODE = 'stripe_invalid_key';

export const isUnauthorizedError = (error: unknown): boolean =>
  error instanceof Error && (error as HttpErrorType).status === HTTP_UNAUTHORIZED;

export const isStripeInvalidKeyError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const { status, body } = error as HttpErrorType;
  if (status !== HTTP_BAD_REQUEST || typeof body !== 'object' || body === null) return false;
  const code = (body as { readonly error?: { readonly code?: unknown } }).error?.code;
  return code === STRIPE_INVALID_KEY_CODE;
};

const authed = async <T>(request: Promise<T>): Promise<T> => {
  try {
    return await request;
  } catch (error) {
    if (isUnauthorizedError(error)) useAuthStore.getState().logout();
    throw error;
  }
};

export const AdminService = {
  login: (request: LoginRequestInterface): Promise<LoginResponseInterface> =>
    http.post<LoginResponseInterface>(ApiRoutes.authLogin, { json: request }),

  orders: (): Promise<readonly AdminOrderInterface[]> =>
    authed(http.get<readonly AdminOrderInterface[]>(ApiRoutes.admin.orders)),

  updateOrderStatus: (id: string, status: OrderStatusType): Promise<AdminOrderInterface> =>
    authed(http.patch<AdminOrderInterface>(ApiRoutes.admin.order(id), { json: { status } })),

  stats: (): Promise<AdminStatsInterface> =>
    authed(http.get<AdminStatsInterface>(ApiRoutes.admin.stats)),

  createProduct: (product: ProductInterface): Promise<ProductInterface> =>
    authed(http.post<ProductInterface>(ApiRoutes.admin.products, { json: product })),

  updateProduct: (product: ProductInterface): Promise<ProductInterface> =>
    authed(http.put<ProductInterface>(ApiRoutes.admin.product(product.id), { json: product })),

  deleteProduct: (id: string): Promise<void> =>
    authed(http.delete<void>(ApiRoutes.admin.product(id))),

  stripeSettings: (): Promise<StripeSettingsInterface> =>
    authed(http.get<StripeSettingsInterface>(ApiRoutes.admin.stripeSettings)),

  saveStripeSettings: (request: StripeSettingsRequestInterface): Promise<StripeSettingsInterface> =>
    authed(http.put<StripeSettingsInterface>(ApiRoutes.admin.stripeSettings, { json: request })),

  clearStripeSettings: (): Promise<void> =>
    authed(http.delete<void>(ApiRoutes.admin.stripeSettings)),
};
