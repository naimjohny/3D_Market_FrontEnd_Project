/** Вьювер продукта: интерактивная 3D-сцена в рамке с HUD-подписями по углам. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductViewerPropsInterface } from '@app/models/ui/product-page.interface';
import { formatCompact } from '@app/utils/format.util';
import { ProductStage } from '@shared/three/ProductStage';
import styles from './ProductViewer.module.scss';

export function ProductViewer({ product, color, env }: ProductViewerPropsInterface): ReactElement {
  const { t } = useTranslation();

  return (
    <div className={styles.viewer}>
      <ProductStage
        kind={product.model}
        color={color}
        accent={product.accent}
        env={env}
        zoom
        autoRotate
        float
        shadows
        className={styles.stage}
      />
      <span className={[styles.hud, styles.hudName].join(' ')}>
        {t(`PRODUCTS.${product.key}.NAME`)}
      </span>
      <span
        className={[styles.hud, styles.hudPoly].join(' ')}
      >{`${formatCompact(product.polycount)} POLY`}</span>
      <span className={[styles.hud, styles.hudHint].join(' ')}>{t('PRODUCT.DRAG_HINT')}</span>
    </div>
  );
}
