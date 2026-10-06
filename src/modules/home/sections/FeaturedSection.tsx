/** Секция избранных работ: ряды продуктов, управляющие сквозным 3D-объектом за контентом. */

import { ArrowRight } from 'lucide-react';
import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@app/config/router.config';
import type { ProductInterface } from '@app/models/products/product.interface';
import type { FeaturedSectionPropsInterface } from '@app/models/ui/home-page.interface';
import { ProductsService } from '@app/services/products.service';
import { Button } from '@shared/components/Button/Button';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { useInView } from '@shared/hooks/useInView';
import { FeaturedRow } from './FeaturedRow';
import styles from './FeaturedSection.module.scss';

const SECTION_THRESHOLD = 0.05;
const ARROW_ICON_SIZE = 16;

export function FeaturedSection({ onActiveProduct }: FeaturedSectionPropsInterface): ReactElement {
  const { t } = useTranslation();
  const [products, setProducts] = useState<readonly ProductInterface[]>([]);
  const { ref, visible } = useInView<HTMLElement>(SECTION_THRESHOLD, false);

  useEffect(() => {
    let cancelled = false;
    ProductsService.featured().then((items) => {
      if (!cancelled) setProducts(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!visible) onActiveProduct(null);
  }, [visible, onActiveProduct]);

  return (
    <section ref={ref} className={styles.featured}>
      <div className={styles.head}>
        <SectionLabel>{t('HOME.FEATURED.LABEL')}</SectionLabel>
        <span className={styles.count}>{t('WORKS.COUNT', { count: products.length })}</span>
      </div>
      {products.map((product, index) => (
        <FeaturedRow key={product.id} product={product} index={index} onActiveProduct={onActiveProduct} />
      ))}
      <div className={styles.allWorks}>
        <Button variant="ghost" to={AppRoutes.works} icon={<ArrowRight size={ARROW_ICON_SIZE} />}>
          {t('HOME.FEATURED.ALL_WORKS')}
        </Button>
      </div>
    </section>
  );
}
