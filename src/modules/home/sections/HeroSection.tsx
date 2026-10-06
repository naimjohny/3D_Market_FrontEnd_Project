/** Hero главной: scramble-заголовок, CTA-кнопки, HUD-строка рендерера и скролл-индикатор. */

import { MousePointer2 } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@app/config/router.config';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { useUiStore } from '@app/store/ui.store';
import { Button } from '@shared/components/Button/Button';
import { GradText } from '@shared/components/GradText/GradText';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import { useFps } from '@shared/hooks/useFps';
import { useScramble } from '@shared/hooks/useScramble';
import styles from './HeroSection.module.scss';

const ITEM_DURATION_S = 0.9;
const HUD_DURATION_S = 0.8;
const HUD_DELAY_S = 1.1;
const HINT_ICON_SIZE = 14;

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: ITEM_DURATION_S, ease: EaseOutExpo } },
};

const FpsValue = (): ReactElement => {
  const fps = useFps();
  return <>{fps}</>;
};

export function HeroSection(): ReactElement {
  const { t } = useTranslation();
  const preloaderDone = useUiStore((s) => s.preloaderDone);
  const titleTop = useScramble(t('HOME.HERO.TITLE_TOP'), preloaderDone);

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.inner}
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate={preloaderDone ? 'show' : 'hidden'}
      >
        <motion.div variants={ITEM_VARIANTS}>
          <SectionLabel>{t('HOME.HERO.LABEL')}</SectionLabel>
        </motion.div>
        <motion.div variants={ITEM_VARIANTS}>
          <Title level={1}>
            <span className={styles.line}>{titleTop}</span>
            <span className={styles.line}>
              <GradText>{t('HOME.HERO.TITLE_GRAD')}</GradText>
            </span>
          </Title>
        </motion.div>
        <motion.div variants={ITEM_VARIANTS}>
          <Text variant="lead" className={styles.subtitle}>
            {t('HOME.HERO.SUBTITLE')}
          </Text>
        </motion.div>
        <motion.div className={styles.actions} variants={ITEM_VARIANTS}>
          <Button variant="primary" size="lg" magnetic to={AppRoutes.order}>
            {t('HOME.HERO.CTA_PRIMARY')}
          </Button>
          <Button variant="secondary" size="lg" to={AppRoutes.works}>
            {t('HOME.HERO.CTA_SECONDARY')}
          </Button>
        </motion.div>
        <motion.div variants={ITEM_VARIANTS}>
          <Text variant="mono" className={styles.hint}>
            <MousePointer2 size={HINT_ICON_SIZE} aria-hidden="true" />
            {t('HOME.HERO.HINT')}
          </Text>
        </motion.div>
      </motion.div>
      <motion.div
        className={styles.hud}
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderDone ? 1 : 0 }}
        transition={{ duration: HUD_DURATION_S, delay: HUD_DELAY_S, ease: EaseOutExpo }}
      >
        <span>
          {t('GENERAL.HUD.RENDERER')}: {t('GENERAL.HUD.WEBGL')}
        </span>
        <span className={styles.sep} aria-hidden="true">
          |
        </span>
        <span>
          <FpsValue /> {t('GENERAL.HUD.FPS')}
        </span>
        <span className={styles.sep} aria-hidden="true">
          |
        </span>
        <span>{t('GENERAL.HUD.COORDS')}</span>
        <span className={styles.sep} aria-hidden="true">
          |
        </span>
        <span>{t('GENERAL.HUD.CODE')}</span>
      </motion.div>
      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderDone ? 1 : 0 }}
        transition={{ duration: HUD_DURATION_S, delay: HUD_DELAY_S, ease: EaseOutExpo }}
      >
        <span className={styles.scrollLabel}>{t('GENERAL.HUD.SCROLL')}</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </motion.div>
    </section>
  );
}
