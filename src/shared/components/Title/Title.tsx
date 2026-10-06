/** Атом заголовка: h1–h4 дисплейной гарнитурой, опциональные градиент и центрирование. */

import type { ReactElement } from 'react';
import type { TitlePropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Title.module.scss';

const LEVEL_TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;

export function Title({
  children,
  level = 2,
  align = 'left',
  gradient = false,
  className,
}: TitlePropsInterface): ReactElement {
  const Tag = LEVEL_TAGS[level];
  const classes = [styles[`h${level}`], gradient && styles.gradient, align === 'center' && styles.center, className]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
}
