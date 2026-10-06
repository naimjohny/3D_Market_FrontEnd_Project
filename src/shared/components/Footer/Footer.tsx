/** Подвал: маркиза, CTA-блок, колонки бренда/навигации/соцсетей и нижняя строка прав. */

import type { ReactElement } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { AppConfig } from '@app/config/app.config';
import { AppRoutes } from '@app/config/router.config';
import type { SocialLinkInterface } from '@app/models/ui/layout.interface';
import type { NavItemInterface } from '@app/models/ui/ui.interface';
import { Button } from '@shared/components/Button/Button';
import { LangSelect } from '@shared/components/LangSelect/LangSelect';
import { NavItems } from '@shared/components/Header/Header';
import { Marquee } from '@shared/components/Marquee/Marquee';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './Footer.module.scss';

const SOCIAL_ICON_SIZE = 14;

const SOCIAL_LINKS: readonly SocialLinkInterface[] = [
  { label: 'Behance', href: AppConfig.socials.behance },
  { label: 'Instagram', href: AppConfig.socials.instagram },
  { label: 'ArtStation', href: AppConfig.socials.artstation },
];

const LEGAL_LINKS: readonly NavItemInterface[] = [
  { key: 'GENERAL.FOOTER.LEGAL_OFFER', path: AppRoutes.legal.offer },
  { key: 'GENERAL.FOOTER.LEGAL_PRIVACY', path: AppRoutes.legal.privacy },
  { key: 'GENERAL.FOOTER.LEGAL_REFUNDS', path: AppRoutes.legal.refunds },
];

export function Footer(): ReactElement {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Marquee text={`${t('GENERAL.BRAND')} · ${t('GENERAL.TAGLINE')} · `} />

      <div className={styles.inner}>
        <div className={styles.cta}>
          <Title level={2}>{t('GENERAL.FOOTER.CTA_TITLE')}</Title>
          <Button variant="primary" size="lg" magnetic to={AppRoutes.order}>
            {t('GENERAL.FOOTER.CTA_BUTTON')}
          </Button>
        </div>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to={AppRoutes.home} className={styles.logo}>
              FORMA<sup className={styles.logoSup}>3</sup>
            </Link>
            <Text variant="muted">{t('GENERAL.TAGLINE')}</Text>
            <a className={styles.email} href={`mailto:${AppConfig.email}`}>
              {t('GENERAL.FOOTER.EMAIL')}
            </a>
          </div>

          <div className={styles.col}>
            <SectionLabel className={styles.colTitle}>{t('GENERAL.FOOTER.MENU')}</SectionLabel>
            <nav className={styles.colLinks}>
              {NavItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end={item.path === AppRoutes.home}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className={styles.col}>
            <SectionLabel className={styles.colTitle}>{t('GENERAL.FOOTER.SOCIALS')}</SectionLabel>
            <div className={styles.colLinks}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  className={styles.social}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                  <ArrowUpRight size={SOCIAL_ICON_SIZE} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{t('GENERAL.FOOTER.RIGHTS', { year })}</span>
          <nav className={styles.legalLinks}>
            {LEGAL_LINKS.map((item) => (
              <Link key={item.key} to={item.path} className={styles.legalLink}>
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <LangSelect openUp />
          <span>{t('GENERAL.FOOTER.MADE')}</span>
        </div>
      </div>
    </footer>
  );
}
