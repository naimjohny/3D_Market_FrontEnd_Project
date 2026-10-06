/** Страница продукта: живой 3D-вьювер, конфигуратор цвета и окружения, похожие объекты. */

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { AppConfig } from '@app/config/app.config';
import { AppRoutes } from '@app/config/router.config';
import type { ProductInterface } from '@app/models/products/product.interface';
import { ViewerEnvs, type ViewerEnvType } from '@app/models/viewer/viewer.type';
import { ProductsService } from '@app/services/products.service';
import { Button } from '@shared/components/Button/Button';
import { EmptyState } from '@shared/components/EmptyState/EmptyState';
import { JsonLd } from '@shared/components/JsonLd/JsonLd';
import { ProductCard } from '@shared/components/ProductCard/ProductCard';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import { SharedCanvas } from '@shared/three/SharedViewCanvas';
import { ProductPanel } from './ProductPanel';
import { ProductViewer } from './ProductViewer';
import styles from './ProductPage.module.scss';

export function ProductPage(): ReactElement {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const pageRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const [related, setRelated] = useState<readonly ProductInterface[]>([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<ViewerEnvType>(ViewerEnvs.Studio);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProduct(null);
    setSelectedEnv(ViewerEnvs.Studio);
    void ProductsService.get(id).then((found) => {
      if (cancelled) return;
      setProduct(found);
      setSelectedColor(found?.colors[0] ?? '');
      setLoading(false);
    });
    void ProductsService.related(id).then((items) => {
      if (!cancelled) setRelated(items);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const productName = product === null ? '' : t(`PRODUCTS.${product.key}.NAME`);
  usePageMeta({
    title: product === null ? t('META.WORKS_TITLE') : t('META.PRODUCT_TITLE', { name: productName }),
    description: product === null ? t('META.WORKS_DESC') : t('META.PRODUCT_DESC', { name: productName }),
  });

  const productJsonLd =
    product === null
      ? null
      : {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productName,
          description: t('META.PRODUCT_DESC', { name: productName }),
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            url: `${AppConfig.siteUrl}${AppRoutes.product(product.id)}`,
          },
        };

  return (
    <div ref={pageRef} className={styles.page}>
      {productJsonLd !== null && <JsonLd data={productJsonLd} />}
      <div className={styles.container}>
        {loading && (
          <div className={styles.center}>
            <Spinner size="lg" />
          </div>
        )}
        {!loading && product === null && (
          <div className={styles.center}>
            <EmptyState title={t('PRODUCT.NOT_FOUND')}>
              <Button to={AppRoutes.works}>{t('GENERAL.ACTIONS.TO_CATALOG')}</Button>
            </EmptyState>
          </div>
        )}
        {!loading && product !== null && (
          <>
            <nav className={styles.crumbs}>
              <Link to={AppRoutes.works} className={styles.crumbLink}>
                {t('GENERAL.NAV.WORKS')}
              </Link>
              <span aria-hidden="true">›</span>
              <span className={styles.crumbCurrent}>{t(`PRODUCTS.${product.key}.NAME`)}</span>
            </nav>
            <div className={styles.grid}>
              <ProductViewer product={product} color={selectedColor} env={selectedEnv} />
              <ProductPanel
                product={product}
                color={selectedColor}
                env={selectedEnv}
                onColorChange={setSelectedColor}
                onEnvChange={setSelectedEnv}
              />
            </div>
            <section className={styles.related}>
              <SectionLabel>{t('PRODUCT.RELATED')}</SectionLabel>
              <div className={styles.relatedGrid}>
                {related.map((item, index) => (
                  <ProductCard key={item.id} product={item} index={index} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <SharedCanvas eventSource={pageRef} />
    </div>
  );
}
