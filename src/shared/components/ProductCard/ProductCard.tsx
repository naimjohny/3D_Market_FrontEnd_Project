/** Карточка продукта каталога: живая 3D-сцена через SceneView, имя, категория и цены. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { AppRoutes } from '@app/config/router.config';
import type { ProductCardPropsInterface } from '@app/models/ui/atoms.interface';
import { formatPrice } from '@app/utils/price.util';
import { SceneView } from '@shared/three/SharedViewCanvas';
import { Badge } from '../Badge/Badge';
import { Chip } from '../Chip/Chip';
import { Title } from '../Title/Title';
import styles from './ProductCard.module.scss';

const PERCENT = 100;
const INDEX_PAD = 2;

export function ProductCard({ product, index = 0 }: ProductCardPropsInterface): ReactElement {
  const { t } = useTranslation();
  const discount =
    product.oldPrice === undefined
      ? 0
      : Math.round((1 - product.price / product.oldPrice) * PERCENT);

  return (
    <Link to={AppRoutes.product(product.id)} className={styles.card}>
      <div className={styles.stage}>
        <SceneView
          kind={product.model}
          color={product.colors[0]}
          accent={product.accent}
          className={styles.scene}
        />
        <span className={styles.number}>{String(index + 1).padStart(INDEX_PAD, '0')}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.headRow}>
          <Title level={4}>{t(`PRODUCTS.${product.key}.NAME`)}</Title>
          <Chip>{t(`WORKS.CATEGORIES.${product.category.toUpperCase()}`)}</Chip>
        </div>
        <div className={styles.prices}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.oldPrice !== undefined && (
            <>
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
              <Badge kind="warning">-{discount}%</Badge>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
