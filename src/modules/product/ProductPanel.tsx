/** Панель продукта: категория, цена, наличие, конфигуратор цвета и окружения, корзина. */

import type { CSSProperties, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductPanelPropsInterface } from '@app/models/ui/product-page.interface';
import { ViewerEnvs } from '@app/models/viewer/viewer.type';
import { useCartStore } from '@app/store/cart.store';
import { useUiStore } from '@app/store/ui.store';
import { formatPrice } from '@app/utils/price.util';
import { Badge } from '@shared/components/Badge/Badge';
import { Button } from '@shared/components/Button/Button';
import { Chip } from '@shared/components/Chip/Chip';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import { ProductSpecs } from './ProductSpecs';
import styles from './ProductPanel.module.scss';

const PERCENT = 100;
const ENV_OPTIONS = [
  ViewerEnvs.Studio,
  ViewerEnvs.Night,
  ViewerEnvs.Neon,
  ViewerEnvs.Sunset,
] as const;

export function ProductPanel({
  product,
  color,
  env,
  onColorChange,
  onEnvChange,
}: ProductPanelPropsInterface): ReactElement {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.open);
  const inCart = useCartStore((s) => s.items.some((i) => i.productId === product.id));

  const name = t(`PRODUCTS.${product.key}.NAME`);
  const discount =
    product.oldPrice === undefined
      ? 0
      : Math.round((1 - product.price / product.oldPrice) * PERCENT);

  const handleCart = (): void => {
    if (inCart) {
      openCart();
      return;
    }
    add(product.id, color);
    pushToast('success', t('TOASTS.ADDED_TO_CART', { name }));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.category}>
        <Chip>{t(`WORKS.CATEGORIES.${product.category.toUpperCase()}`)}</Chip>
      </div>
      <Title level={2}>{name}</Title>
      <div className={styles.prices}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        {product.oldPrice !== undefined && (
          <>
            <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
            <Badge kind="warning">-{discount}%</Badge>
          </>
        )}
      </div>
      <div className={styles.stock}>
        <span className={styles.stockDot} aria-hidden="true" />
        <Text variant="mono">{t('PRODUCT.IN_STOCK')}</Text>
      </div>
      <Text variant="lead" className={styles.desc}>
        {t(`PRODUCTS.${product.key}.DESC`)}
      </Text>
      <div className={styles.block}>
        <span className={styles.blockLabel}>{t('PRODUCT.COLOR')}</span>
        <div className={styles.swatches}>
          {product.colors.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`${t('PRODUCT.COLOR')} ${swatch}`}
              className={[styles.swatch, swatch === color && styles.swatchActive]
                .filter(Boolean)
                .join(' ')}
              style={{ '--swatch': swatch } as CSSProperties}
              onClick={() => onColorChange(swatch)}
            />
          ))}
        </div>
      </div>
      <div className={styles.block}>
        <span className={styles.blockLabel}>{t('LAB.SETTINGS.ENV')}</span>
        <div className={styles.envs}>
          {ENV_OPTIONS.map((option) => (
            <Chip key={option} active={option === env} onClick={() => onEnvChange(option)}>
              {t(`LAB.ENVS.${option.toUpperCase()}`)}
            </Chip>
          ))}
        </div>
      </div>
      <div className={styles.cart}>
        <Button variant={inCart ? 'secondary' : 'primary'} size="lg" fullWidth onClick={handleCart}>
          {inCart ? t('GENERAL.ACTIONS.IN_CART') : t('GENERAL.ACTIONS.ADD_TO_CART')}
        </Button>
      </div>
      <ProductSpecs product={product} />
    </div>
  );
}
