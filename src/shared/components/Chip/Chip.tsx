/** Атом чипа-капсулы: статичная метка или кликабельный фильтр с активным состоянием. */

import type { ReactElement } from 'react';
import type { ChipPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Chip.module.scss';

export function Chip({
  children,
  active = false,
  onClick,
  className,
}: ChipPropsInterface): ReactElement {
  const classes = [styles.chip, active && styles.active, className].filter(Boolean).join(' ');

  if (onClick === undefined) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <button type="button" className={[classes, styles.clickable].join(' ')} onClick={onClick}>
      {children}
    </button>
  );
}
