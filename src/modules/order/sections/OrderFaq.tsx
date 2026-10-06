/** Секция FAQ страницы заказа: аккордеон частых вопросов о цене, сроках, форматах и правах. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccordionItemInterface } from '@app/models/ui/atoms.interface';
import { Accordion } from '@shared/components/Accordion/Accordion';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Title } from '@shared/components/Title/Title';
import styles from './OrderFaq.module.scss';

export const FAQ_KEYS = ['PRICE', 'TIME', 'FORMATS', 'EDITS', 'RIGHTS'] as const;

export function OrderFaq(): ReactElement {
  const { t } = useTranslation();

  const items: readonly AccordionItemInterface[] = FAQ_KEYS.map((key) => ({
    id: key,
    question: t(`ORDER.FAQ.ITEMS.${key}.Q`),
    answer: t(`ORDER.FAQ.ITEMS.${key}.A`),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.head}>
            <SectionLabel>{t('ORDER.FAQ.LABEL')}</SectionLabel>
            <Title level={2}>{t('ORDER.FAQ.TITLE')}</Title>
          </div>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
