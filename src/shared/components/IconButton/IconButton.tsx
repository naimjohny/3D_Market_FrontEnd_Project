/** Атом круглой иконочной кнопки 44px: рамка, бейдж-счётчик и активное состояние. */

import type { ReactElement } from 'react';
import type { IconButtonPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './IconButton.module.scss';

export function IconButton({
  children,
  ariaLabel,
  badge,
  active = false,
  onClick,
}: IconButtonPropsInterface): ReactElement {
  return (
    <button
      type="button"
      className={[styles.iconButton, active && styles.active].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
      {badge !== undefined && badge > 0 && <span className={styles.badge}>{badge}</span>}
    </button>
  );
}
