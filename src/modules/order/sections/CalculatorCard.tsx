/** Карточка-калькулятор бюджета: категория, детализация, объём, срок и живая оценка цены. */

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { DetailLevelType } from '@app/models/order/order.type';
import { ProductCategories, type ProductCategoryType } from '@app/models/products/product.type';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import type { CalculatorCardPropsInterface } from '@app/models/ui/order-page.interface';
import { OrderService } from '@app/services/order.service';
import { formatPrice } from '@app/utils/price.util';
import { Chip } from '@shared/components/Chip/Chip';
import { RangeSlider } from '@shared/components/RangeSlider/RangeSlider';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Select } from '@shared/components/Select/Select';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './CalculatorCard.module.scss';

const DETAIL_LEVELS: readonly DetailLevelType[] = ['low', 'mid', 'high'];
const COUNT_MIN = 1;
const COUNT_MAX = 10;
const DEADLINE_MIN = 1;
const DEADLINE_MAX = 8;
const ESTIMATE_DURATION_S = 0.35;

export function CalculatorCard({ value, onChange }: CalculatorCardPropsInterface): ReactElement {
  const { t } = useTranslation();
  const estimate = OrderService.estimate(value);

  const categoryOptions = Object.values(ProductCategories).map((category) => ({
    value: category,
    label: t(`WORKS.CATEGORIES.${category.toUpperCase()}`),
  }));

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <SectionLabel>{t('ORDER.CALC.LABEL')}</SectionLabel>
        <Title level={3}>{t('ORDER.CALC.TITLE')}</Title>
      </div>

      <Select
        label={t('ORDER.CALC.CATEGORY')}
        name="calc-category"
        value={value.category}
        options={categoryOptions}
        onChange={(category) => onChange({ ...value, category: category as ProductCategoryType })}
      />

      <div className={styles.detail}>
        <span className={styles.label}>{t('ORDER.CALC.DETAIL')}</span>
        <div className={styles.chips}>
          {DETAIL_LEVELS.map((detail) => (
            <Chip
              key={detail}
              active={detail === value.detail}
              onClick={() => onChange({ ...value, detail })}
            >
              {t(`ORDER.CALC.DETAILS.${detail.toUpperCase()}`)}
            </Chip>
          ))}
        </div>
      </div>

      <RangeSlider
        label={t('ORDER.CALC.COUNT')}
        min={COUNT_MIN}
        max={COUNT_MAX}
        value={value.count}
        valueLabel={String(value.count)}
        onChange={(count) => onChange({ ...value, count })}
      />

      <RangeSlider
        label={t('ORDER.CALC.DEADLINE')}
        min={DEADLINE_MIN}
        max={DEADLINE_MAX}
        value={value.deadlineWeeks}
        valueLabel={String(value.deadlineWeeks)}
        onChange={(deadlineWeeks) => onChange({ ...value, deadlineWeeks })}
      />

      <div className={styles.total}>
        <span className={styles.label}>{t('ORDER.CALC.ESTIMATE')}</span>
        <motion.span
          key={estimate}
          className={styles.estimate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ESTIMATE_DURATION_S, ease: EaseOutExpo }}
        >
          {formatPrice(estimate)}
        </motion.span>
        <Text variant="dim">{t('ORDER.CALC.NOTE')}</Text>
      </div>
    </section>
  );
}
