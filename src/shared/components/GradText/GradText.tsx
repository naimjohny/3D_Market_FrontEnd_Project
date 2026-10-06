/** Атом градиентного текста: тёплый градиент по фирменной палитре внутри строки. */

import type { ReactElement } from 'react';
import type { GradTextPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './GradText.module.scss';

export function GradText({ children }: GradTextPropsInterface): ReactElement {
  return <span className={styles.grad}>{children}</span>;
}
