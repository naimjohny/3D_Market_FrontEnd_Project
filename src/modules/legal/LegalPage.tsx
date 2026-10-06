/** Страница юридического документа: оферта, политика ПДн или возвраты из i18n-массива секций. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  LegalKindType,
  LegalPagePropsInterface,
  LegalSectionInterface,
} from '@app/models/ui/legal-page.interface';
import { PageHead } from '@shared/components/PageHead/PageHead';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import styles from './LegalPage.module.scss';

const KIND_KEYS: Record<LegalKindType, 'OFFER' | 'PRIVACY' | 'REFUNDS'> = {
  offer: 'OFFER',
  privacy: 'PRIVACY',
  refunds: 'REFUNDS',
};

const isLegalSection = (value: unknown): value is LegalSectionInterface =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>).TITLE === 'string' &&
  typeof (value as Record<string, unknown>).BODY === 'string';

export function LegalPage({ kind }: LegalPagePropsInterface): ReactElement {
  const { t } = useTranslation();
  const docKey = KIND_KEYS[kind];
  usePageMeta({ title: `${t(`LEGAL.${docKey}.TITLE`)} | FORMA³`, description: t(`LEGAL.${docKey}.TITLE`) });

  const rawSections: unknown = t(`LEGAL.${docKey}.SECTIONS`, { returnObjects: true });
  const sections: readonly LegalSectionInterface[] = Array.isArray(rawSections)
    ? rawSections.filter(isLegalSection)
    : [];

  return (
    <div className={styles.page}>
      <PageHead label={t('LEGAL.LABEL')} title={t(`LEGAL.${docKey}.TITLE`)} />
      <section className={styles.document}>
        <div className={styles.inner}>
          <div className={styles.column}>
            <Text variant="mono" className={styles.updated}>
              {t('LEGAL.UPDATED_LABEL', { date: t(`LEGAL.${docKey}.UPDATED`) })}
            </Text>
            {sections.map((section, index) => (
              <article key={section.TITLE} className={styles.block}>
                <Title level={3}>{`${index + 1}. ${section.TITLE}`}</Title>
                <Text variant="muted">{section.BODY}</Text>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
