/** Шапка страницы: HUD-лейбл, дисплейный заголовок и приглушённый подзаголовок в контейнере. */

import type { ReactElement } from 'react';
import type { PageHeadPropsInterface } from '@app/models/ui/atoms.interface';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import styles from './PageHead.module.scss';

export function PageHead({ label, title, subtitle }: PageHeadPropsInterface): ReactElement {
  return (
    <header className={styles.head}>
      <SectionLabel>{label}</SectionLabel>
      <Title level={1}>{title}</Title>
      {subtitle !== undefined && (
        <Text variant="lead" className={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </header>
  );
}
