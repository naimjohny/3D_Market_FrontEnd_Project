/** Страница каталога: фильтры по категориям, анимированный грид карточек и общий 3D-канвас. */

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AppConfig } from '@app/config/app.config';
import { AppRoutes } from '@app/config/router.config';
import type { ProductInterface } from '@app/models/products/product.interface';
import { ProductCategories, type ProductCategoryType } from '@app/models/products/product.type';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { ProductsService } from '@app/services/products.service';
import { Chip } from '@shared/components/Chip/Chip';
import { EmptyState } from '@shared/components/EmptyState/EmptyState';
import { JsonLd } from '@shared/components/JsonLd/JsonLd';
import { PageHead } from '@shared/components/PageHead/PageHead';
import { ProductCard } from '@shared/components/ProductCard/ProductCard';
import { Text } from '@shared/components/Text/Text';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import { SharedCanvas } from '@shared/three/SharedViewCanvas';
import styles from './WorksPage.module.scss';

const CATEGORY_LIST = Object.values(ProductCategories);
const CARD_DURATION_S = 0.55;
const CARD_EXIT_DURATION_S = 0.25;
const CARD_STAGGER_S = 0.05;
const CARD_SHIFT_PX = 24;

export function WorksPage(): ReactElement {
  const { t } = useTranslation();
  usePageMeta({ title: t('META.WORKS_TITLE'), description: t('META.WORKS_DESC') });
  const pageRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<ProductCategoryType | null>(null);
  const [products, setProducts] = useState<readonly ProductInterface[] | null>(null);

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('GENERAL.NAV.HOME'), item: AppConfig.siteUrl },
      { '@type': 'ListItem', position: 2, name: t('GENERAL.NAV.WORKS'), item: `${AppConfig.siteUrl}${AppRoutes.works}` },
    ],
  };

  useEffect(() => {
    let alive = true;
    void ProductsService.list(category).then((items) => {
      if (alive) setProducts(items);
    });
    return () => {
      alive = false;
    };
  }, [category]);

  const items = products ?? [];

  return (
    <div ref={pageRef} className={styles.page}>
      <JsonLd data={breadcrumbsJsonLd} />
      <PageHead label={t('GENERAL.NAV.WORKS')} title={t('WORKS.TITLE')} subtitle={t('WORKS.SUBTITLE')} />
      <section className={styles.catalog}>
        <div className={styles.filters}>
          <Chip active={category === null} onClick={() => setCategory(null)}>
            {t('WORKS.CATEGORIES.ALL')}
          </Chip>
          {CATEGORY_LIST.map((item) => (
            <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
              {t(`WORKS.CATEGORIES.${item.toUpperCase()}`)}
            </Chip>
          ))}
          <Text variant="mono" className={styles.count}>
            {t('WORKS.COUNT', { count: items.length })}
          </Text>
        </div>
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: CARD_SHIFT_PX }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: CARD_SHIFT_PX,
                  transition: { duration: CARD_EXIT_DURATION_S, ease: EaseOutExpo },
                }}
                transition={{ duration: CARD_DURATION_S, ease: EaseOutExpo, delay: index * CARD_STAGGER_S }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {products !== null && products.length === 0 && (
          <div className={styles.empty}>
            <EmptyState title={t('WORKS.EMPTY')} />
          </div>
        )}
      </section>
      <SharedCanvas eventSource={pageRef} />
    </div>
  );
}
