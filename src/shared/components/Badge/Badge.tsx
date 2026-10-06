/** Атом бейджа: компактная моно-капсула статуса — default, success, warning. */

import type { ReactElement } from 'react';
import type { BadgePropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Badge.module.scss';

export function Badge({ children, kind = 'default' }: BadgePropsInterface): ReactElement {
  return <span className={[styles.badge, styles[kind]].join(' ')}>{children}</span>;
}
