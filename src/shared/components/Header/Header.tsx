/** Шапка сайта: фиксированная навигация со стеклом при скролле, язык, корзина и мобильное меню. */

import { useEffect, useState, type ReactElement } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router';
import { AppConfig } from '@app/config/app.config';
import { AppRoutes } from '@app/config/router.config';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import type { NavItemInterface } from '@app/models/ui/ui.interface';
import { useCartStore } from '@app/store/cart.store';
import { useUiStore } from '@app/store/ui.store';
import { Button } from '@shared/components/Button/Button';
import { IconButton } from '@shared/components/IconButton/IconButton';
import { LangSelect } from '@shared/components/LangSelect/LangSelect';
import styles from './Header.module.scss';

const SCROLL_THRESHOLD_PX = 24;
const MENU_STAGGER_S = 0.06;
const MENU_FADE_S = 0.35;
const MENU_LINK_S = 0.6;
const ICON_SIZE = 20;

export const NavItems: readonly NavItemInterface[] = [
  { key: 'GENERAL.NAV.HOME', path: AppRoutes.home },
  { key: 'GENERAL.NAV.WORKS', path: AppRoutes.works },
  { key: 'GENERAL.NAV.ORDER', path: AppRoutes.order },
  { key: 'GENERAL.NAV.LAB', path: AppRoutes.lab },
];

export function Header(): ReactElement {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useUiStore((s) => s.menuOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  const openCart = useCartStore((s) => s.open);
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.qty, 0));

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  return (
    <>
      <header className={scrolled ? `${styles.header} ${styles.scrolled}` : styles.header}>
        <div className={styles.inner}>
          <Link to={AppRoutes.home} className={styles.logo}>
            FORMA<sup className={styles.logoSup}>3</sup>
          </Link>

          <nav className={styles.nav}>
            {NavItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === AppRoutes.home}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <LangSelect compact className={styles.lang} />

            <IconButton
              ariaLabel={t('CART.TITLE')}
              badge={cartCount > 0 ? cartCount : undefined}
              onClick={openCart}
            >
              <ShoppingBag size={ICON_SIZE} />
            </IconButton>

            <div className={styles.orderCta}>
              <Button variant="secondary" size="sm" to={AppRoutes.order}>
                {t('GENERAL.ACTIONS.ORDER_PROJECT')}
              </Button>
            </div>

            <div className={styles.burger}>
              <IconButton ariaLabel={t('GENERAL.ACTIONS.MENU')} onClick={() => setMenuOpen(true)}>
                <Menu size={ICON_SIZE} />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MENU_FADE_S, ease: EaseOutExpo }}
          >
            <div className={styles.menuHead}>
              <span className={styles.logo}>
                FORMA<sup className={styles.logoSup}>3</sup>
              </span>
              <IconButton ariaLabel={t('GENERAL.ACTIONS.CLOSE')} onClick={() => setMenuOpen(false)}>
                <X size={ICON_SIZE} />
              </IconButton>
            </div>

            <nav className={styles.menuNav}>
              {NavItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * MENU_STAGGER_S,
                    duration: MENU_LINK_S,
                    ease: EaseOutExpo,
                  }}
                >
                  <NavLink to={item.path} className={styles.menuLink}>
                    {t(item.key)}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className={styles.menuFoot}>
              <a className={styles.menuContact} href={`mailto:${AppConfig.email}`}>
                {AppConfig.email}
              </a>
              <a
                className={styles.menuContact}
                href={AppConfig.telegram}
                target="_blank"
                rel="noreferrer"
              >
                {AppConfig.telegram.replace('https://', '')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
