/** Атом текстового абзаца: варианты body/lead/muted/dim/mono и выравнивание. */

import type { ReactElement } from 'react';
import type { TextPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Text.module.scss';

export function Text({ children, variant = 'body', align = 'left', className }: TextPropsInterface): ReactElement {
  const classes = [styles[variant], align === 'center' && styles.center, className].filter(Boolean).join(' ');

  return <p className={classes}>{children}</p>;
}
