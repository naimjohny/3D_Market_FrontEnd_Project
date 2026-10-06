/** Пустое состояние: центрированный заголовок, подсказка и слот для действий. */

import type { ReactElement } from 'react';
import type { EmptyStatePropsInterface } from '@app/models/ui/atoms.interface';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import styles from './EmptyState.module.scss';

export function EmptyState({ title, hint, children }: EmptyStatePropsInterface): ReactElement {
  return (
    <div className={styles.empty}>
      <Title level={3} align="center">
        {title}
      </Title>
      {hint !== undefined && (
        <Text variant="muted" align="center">
          {hint}
        </Text>
      )}
      {children !== undefined && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
