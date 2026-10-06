/** Корень приложения: маршруты с ленивыми страницами внутри публичного лейаута и админ-панель. */

import { lazy, Suspense, type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AppRoutes } from '@app/config/router.config';
import { PublicLayout } from '@shared/layouts/PublicLayout/PublicLayout';

const HomePage = lazy(() =>
  import('@modules/home/HomePage').then((m) => ({ default: m.HomePage })),
);
const WorksPage = lazy(() =>
  import('@modules/works/WorksPage').then((m) => ({ default: m.WorksPage })),
);
const ProductPage = lazy(() =>
  import('@modules/product/ProductPage').then((m) => ({ default: m.ProductPage })),
);
const OrderPage = lazy(() =>
  import('@modules/order/OrderPage').then((m) => ({ default: m.OrderPage })),
);
const LabPage = lazy(() => import('@modules/lab/LabPage').then((m) => ({ default: m.LabPage })));
const LegalPage = lazy(() =>
  import('@modules/legal/LegalPage').then((m) => ({ default: m.LegalPage })),
);
const NotFoundPage = lazy(() =>
  import('@modules/not-found/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const AdminLoginPage = lazy(() =>
  import('@modules/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminLayout = lazy(() =>
  import('@modules/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const AdminOrdersPage = lazy(() =>
  import('@modules/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage })),
);
const AdminProductsPage = lazy(() =>
  import('@modules/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })),
);
const AdminStatsPage = lazy(() =>
  import('@modules/admin/AdminStatsPage').then((m) => ({ default: m.AdminStatsPage })),
);
const AdminSettingsPage = lazy(() =>
  import('@modules/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
);

export function App(): ReactElement {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={AppRoutes.home} element={<HomePage />} />
          <Route path={AppRoutes.works} element={<WorksPage />} />
          <Route path={AppRoutes.productPattern} element={<ProductPage />} />
          <Route path={AppRoutes.order} element={<OrderPage />} />
          <Route path={AppRoutes.lab} element={<LabPage />} />
          <Route path={AppRoutes.legal.offer} element={<LegalPage kind="offer" />} />
          <Route path={AppRoutes.legal.privacy} element={<LegalPage kind="privacy" />} />
          <Route path={AppRoutes.legal.refunds} element={<LegalPage kind="refunds" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path={AppRoutes.admin.login} element={<AdminLoginPage />} />
        <Route path={AppRoutes.admin.root} element={<AdminLayout />}>
          <Route index element={<Navigate to={AppRoutes.admin.orders} replace />} />
          <Route path={AppRoutes.admin.orders} element={<AdminOrdersPage />} />
          <Route path={AppRoutes.admin.products} element={<AdminProductsPage />} />
          <Route path={AppRoutes.admin.stats} element={<AdminStatsPage />} />
          <Route path={AppRoutes.admin.settings} element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
