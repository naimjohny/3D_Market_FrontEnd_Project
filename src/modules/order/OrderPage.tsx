/** Страница заказа кастомного 3D: калькулятор бюджета, форма заявки с 3D-превью и FAQ. */

import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppConfig } from '@app/config/app.config';
import type { OrderEstimateParamsInterface } from '@app/models/order/order.interface';
import { DetailLevels } from '@app/models/order/order.type';
import { ProductCategories } from '@app/models/products/product.type';
import { JsonLd } from '@shared/components/JsonLd/JsonLd';
import { PageHead } from '@shared/components/PageHead/PageHead';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import { CalculatorCard } from './sections/CalculatorCard';
import { FAQ_KEYS, OrderFaq } from './sections/OrderFaq';
import { OrderForm } from './sections/OrderForm';
import styles from './OrderPage.module.scss';

const DEFAULT_CALC: OrderEstimateParamsInterface = {
  category: ProductCategories.Art,
  detail: DetailLevels.Mid,
  count: 1,
  deadlineWeeks: 4,
};

const SERVICE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Custom 3D modeling',
  provider: { '@type': 'Organization', name: 'FORMA³', url: AppConfig.siteUrl },
  areaServed: 'Worldwide',
} as const;

export function OrderPage(): ReactElement {
  const { t } = useTranslation();
  usePageMeta({ title: t('META.ORDER_TITLE'), description: t('META.ORDER_DESC') });
  const [calc, setCalc] = useState<OrderEstimateParamsInterface>(DEFAULT_CALC);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`ORDER.FAQ.ITEMS.${key}.Q`),
      acceptedAnswer: { '@type': 'Answer', text: t(`ORDER.FAQ.ITEMS.${key}.A`) },
    })),
  };

  return (
    <div className={styles.page}>
      <JsonLd data={SERVICE_JSON_LD} />
      <JsonLd data={faqJsonLd} />
      <PageHead
        label={t('GENERAL.NAV.ORDER')}
        title={t('ORDER.TITLE')}
        subtitle={t('ORDER.SUBTITLE')}
      />
      <div className={styles.layout}>
        <CalculatorCard value={calc} onChange={setCalc} />
        <OrderForm calc={calc} />
      </div>
      <OrderFaq />
    </div>
  );
}
