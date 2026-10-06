/** Секция услуг: четыре направления студии карточками с иконками и каскадным появлением. */

import { Boxes, Eye, Globe, Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './ServicesSection.module.scss';

const SERVICE_KEYS = ['MODELING', 'PRODUCT', 'CHARACTERS', 'WEB3D'] as const;
const SERVICE_ICONS = { MODELING: Boxes, PRODUCT: Eye, CHARACTERS: Users, WEB3D: Globe } as const;
const ICON_SIZE = 28;
const REVEAL_DURATION_S = 0.7;
const CARD_STAGGER_S = 0.08;

export function ServicesSection(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className={styles.services}>
      <div className={styles.head}>
        <SectionLabel>{t('HOME.SERVICES.LABEL')}</SectionLabel>
        <Title level={2}>{t('HOME.SERVICES.TITLE')}</Title>
      </div>
      <div className={styles.grid}>
        {SERVICE_KEYS.map((key, index) => {
          const Icon = SERVICE_ICONS[key];

          return (
            <motion.div
              key={key}
              className={styles.cardWrap}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: REVEAL_DURATION_S, delay: index * CARD_STAGGER_S, ease: EaseOutExpo }}
            >
              <article className={styles.card}>
                <Icon size={ICON_SIZE} className={styles.icon} aria-hidden="true" />
                <Title level={4}>{t(`HOME.SERVICES.ITEMS.${key}.TITLE`)}</Title>
                <Text variant="muted">{t(`HOME.SERVICES.ITEMS.${key}.DESC`)}</Text>
              </article>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
