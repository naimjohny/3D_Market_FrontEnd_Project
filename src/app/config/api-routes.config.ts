/** Все эндпоинты Go-бэкенда — единственный источник URL (зеркало server/internal/httpapi/router.go). */

export const ApiRoutes = {
  health: '/health',
  products: '/products',
  product: (id: string): string => `/products/${id}`,
  orders: '/orders',
  checkout: '/checkout',
  authLogin: '/auth/login',
  admin: {
    orders: '/admin/orders',
    order: (id: string): string => `/admin/orders/${id}`,
    products: '/admin/products',
    product: (id: string): string => `/admin/products/${id}`,
    stats: '/admin/stats',
    stripeSettings: '/admin/settings/stripe',
  },
} as const;
