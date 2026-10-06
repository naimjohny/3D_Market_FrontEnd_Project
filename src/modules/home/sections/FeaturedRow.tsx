/** Ряд избранного продукта: инфо-блок слева и просвет справа для сквозного 3D-объекта. */

import { motion } from 'motion/react';
import { useEffect, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@app/config/router.config';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import type { FeaturedRowPropsInterface } from '@app/models/ui/home-page.interface';
import { formatCompact } from '@app/utils/format.util';
import { formatPrice } from '@app/utils/price.util';
import { Button } from '@shared/components/Button/Button';
import { Chip } from '@shared/components/Chip/Chip';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import { useInView } from '@shared/hooks/useInView';
import styles from './FeaturedRow.module.scss';

const ACTIVE_THRESHOLD = 0.55;
const INDEX_PAD = 2;
const REVEAL_DURATION_S = 0.9;

export function FeaturedRow({ product, index, onActiveProduct }: FeaturedRowPropsInterface): ReactElement {
  const { t } = useTranslation();
  const { ref, visible } = useInView<HTMLDivElement>(ACTIVE_THRESHOLD, false);

  useEffect(() => {
    if (visible) onActiveProduct(product);
  }, [visible, onActiveProduct, product]);

  return (
    <div ref={ref} className={styles.row}>
      <motion.div
        className={styles.info}
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: REVEAL_DURATION_S, ease: EaseOutExpo }}
      >
        <span className={styles.index}>
          {t('HOME.FEATURED.PRODUCT')} {String(index + 1).padStart(INDEX_PAD, '0')}
        </span>
        <Title level={2}>{t(`PRODUCTS.${product.key}.NAME`)}</Title>
        <Text variant="muted" className={styles.desc}>
          {t(`PRODUCTS.${product.key}.DESC`)}
        </Text>
        <div className={styles.chips}>
          <Chip>{t(`WORKS.CATEGORIES.${product.category.toUpperCase()}`)}</Chip>
          <Chip>{formatCompact(product.polycount)} POLY</Chip>
          <Chip>{product.formats.join(' · ')}</Chip>
        </div>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        <Button variant="secondary" to={AppRoutes.product(product.id)}>
          {t('GENERAL.ACTIONS.VIEW_PRODUCT')}
        </Button>
      </motion.div>
      <div className={styles.stage} aria-hidden="true" />
    </div>
  );
}
