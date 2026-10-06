/** Финальный призыв: крупный заголовок, подпись и магнитная кнопка на фоне нижнего свечения. */

import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@app/config/router.config';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { Button } from '@shared/components/Button/Button';
import { RevealText } from '@shared/components/RevealText/RevealText';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './CtaSection.module.scss';

const REVEAL_DURATION_S = 0.9;

export function CtaSection(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: REVEAL_DURATION_S, ease: EaseOutExpo }}
      >
        <Title level={1} align="center">
          <RevealText text={t('HOME.CTA.TITLE')} />
        </Title>
        <Text variant="lead" align="center" className={styles.subtitle}>
          {t('HOME.CTA.SUBTITLE')}
        </Text>
        <Button variant="primary" size="lg" magnetic to={AppRoutes.order}>
          {t('HOME.CTA.BUTTON')}
        </Button>
      </motion.div>
    </section>
  );
}
