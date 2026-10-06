/** Публичный лейаут: Lenis-скролл, каркас (шапка/подвал/дровер/тосты/курсор) и переходы страниц. */

import { Suspense, useEffect, type ReactElement } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { AnimatePresence, motion } from 'motion/react';
import { Outlet, useLocation } from 'react-router';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { CartDrawer } from '@shared/components/CartDrawer/CartDrawer';
import { Footer } from '@shared/components/Footer/Footer';
import { Header } from '@shared/components/Header/Header';
import { Preloader } from '@shared/components/Preloader/Preloader';
import { Toaster } from '@shared/components/Toaster/Toaster';
import { usePaymentResult } from '@shared/hooks/usePaymentResult';
import styles from './PublicLayout.module.scss';

const LENIS_OPTIONS = { lerp: 0.1, smoothWheel: true };
const PAGE_DURATION_S = 0.45;

export function PublicLayout(): ReactElement {
  const { pathname } = useLocation();
  const lenis = useLenis();
  usePaymentResult();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <div className="grain" />
      <Preloader />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className={styles.main}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: PAGE_DURATION_S, ease: EaseOutExpo }}
        >
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <Toaster />
    </ReactLenis>
  );
}
