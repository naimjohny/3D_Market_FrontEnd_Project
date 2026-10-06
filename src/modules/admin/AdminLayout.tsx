/** Лейаут админки: гард по авторизации, свой сайдбар с навигацией и выходом, без публичного каркаса. */

import { Suspense, type ReactElement } from 'react';
import { ChartColumn, LayoutGrid, LogOut, Package, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Outlet } from 'react-router';
import { AppRoutes } from '@app/config/router.config';
import { useAuthStore } from '@app/store/auth.store';
import { Toaster } from '@shared/components/Toaster/Toaster';
import styles from './AdminLayout.module.scss';

const ICON_SIZE = 16;

const NAV_ITEMS = [
  { key: 'ADMIN.NAV.ORDERS', path: AppRoutes.admin.orders, Icon: LayoutGrid },
  { key: 'ADMIN.NAV.PRODUCTS', path: AppRoutes.admin.products, Icon: Package },
  { key: 'ADMIN.NAV.STATS', path: AppRoutes.admin.stats, Icon: ChartColumn },
  { key: 'ADMIN.NAV.SETTINGS', path: AppRoutes.admin.settings, Icon: Settings },
] as const;

export function AdminLayout(): ReactElement {
  const { t } = useTranslation();
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const logout = useAuthStore((s) => s.logout);

  if (!isAuthed) return <Navigate to={AppRoutes.admin.login} replace />;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          FORMA<sup className={styles.brandSup}>3</sup>
          <span className={styles.brandTag}>· ADMIN</span>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ key, path, Icon }) => (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              <Icon size={ICON_SIZE} aria-hidden="true" />
              {t(key)}
            </NavLink>
          ))}
        </nav>
        <button type="button" className={styles.logout} onClick={logout}>
          <LogOut size={ICON_SIZE} aria-hidden="true" />
          {t('ADMIN.NAV.LOGOUT')}
        </button>
      </aside>
      <main className={styles.content}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster />
    </div>
  );
}
