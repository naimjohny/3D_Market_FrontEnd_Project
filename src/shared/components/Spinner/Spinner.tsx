/** Атом спиннера: вращающееся кольцо с акцентной дугой в трёх размерах. */

import type { ReactElement } from 'react';
import type { SpinnerPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Spinner.module.scss';

export function Spinner({ size = 'md' }: SpinnerPropsInterface): ReactElement {
  return <span className={[styles.spinner, styles[size]].join(' ')} role="status" />;
}
