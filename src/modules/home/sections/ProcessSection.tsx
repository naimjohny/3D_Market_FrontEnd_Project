/** Секция процесса: три шага работы студии с огромными контурными номерами. */

import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './ProcessSection.module.scss';

const STEP_KEYS = ['S1', 'S2', 'S3'] as const;
const REVEAL_DURATION_S = 0.7;
const STEP_STAGGER_S = 0.12;

export function ProcessSection(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className={styles.process}>
      <div className={styles.head}>
        <SectionLabel>{t('HOME.PROCESS.LABEL')}</SectionLabel>
        <Title level={2}>{t('HOME.PROCESS.TITLE')}</Title>
      </div>
      <div className={styles.steps}>
        {STEP_KEYS.map((key, index) => (
          <motion.div
            key={key}
            className={styles.step}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: REVEAL_DURATION_S, delay: index * STEP_STAGGER_S, ease: EaseOutExpo }}
          >
            <span className={styles.num}>{t(`HOME.PROCESS.STEPS.${key}.NUM`)}</span>
            <Title level={3}>{t(`HOME.PROCESS.STEPS.${key}.TITLE`)}</Title>
            <Text variant="muted">{t(`HOME.PROCESS.STEPS.${key}.DESC`)}</Text>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
