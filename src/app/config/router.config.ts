/** Маршруты клиента: паттерны для роутера и билдеры путей. */

export const AppRoutes = {
  home: '/',
  works: '/works',
  productPattern: '/works/:id',
  order: '/order',
  lab: '/lab',
  product: (id: string): string => `/works/${id}`,
  legal: {
    offer: '/legal/offer',
    privacy: '/legal/privacy',
    refunds: '/legal/refunds',
  },
  admin: {
    root: '/admin',
    login: '/admin/login',
    orders: '/admin/orders',
    products: '/admin/products',
    stats: '/admin/stats',
    settings: '/admin/settings',
  },
} as const;
