/** Карточка характеристик продукта: полигоны, форматы, текстуры, риггинг, анимация, лицензия. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductSpecsPropsInterface } from '@app/models/ui/product-page.interface';
import { formatInt } from '@app/utils/price.util';
import { Chip } from '@shared/components/Chip/Chip';
import styles from './ProductSpecs.module.scss';

export function ProductSpecs({ product }: ProductSpecsPropsInterface): ReactElement {
  const { t } = useTranslation();
  const yesNo = (value: boolean): string => t(value ? 'PRODUCT.YES' : 'PRODUCT.NO');

  const formats = (
    <span className={styles.formats}>
      {product.formats.map((format) => (
        <Chip key={format} className={styles.formatChip}>
          {format}
        </Chip>
      ))}
    </span>
  );

  const rows = [
    { key: 'POLYCOUNT', value: formatInt(product.polycount) },
    { key: 'FORMATS', value: formats },
    { key: 'TEXTURES', value: yesNo(product.textured) },
    { key: 'RIGGED', value: yesNo(product.rigged) },
    { key: 'ANIMATED', value: yesNo(product.animated) },
    { key: 'LICENSE', value: t('PRODUCT.LICENSE_VALUE') },
  ];

  return (
    <div className={styles.card}>
      <span className={styles.head}>{t('PRODUCT.SPECS')}</span>
      {rows.map((row) => (
        <div key={row.key} className={styles.row}>
          <span className={styles.label}>{t(`PRODUCT.${row.key}`)}</span>
          <span className={styles.value}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
