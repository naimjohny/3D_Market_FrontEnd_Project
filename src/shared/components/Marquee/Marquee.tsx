/** Бегущая строка: outline-текст дисплейной гарнитурой, бесшовный цикл из четырёх копий. */

import type { ReactElement } from 'react';
import type { MarqueePropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Marquee.module.scss';

const COPY_COUNT = 4;

export function Marquee({ text, reverse = false }: MarqueePropsInterface): ReactElement {
  return (
    <div className={styles.marquee}>
      <div className={[styles.track, reverse && styles.reverse].filter(Boolean).join(' ')}>
        {Array.from({ length: COPY_COUNT }, (_, index) => (
          <span key={index} className={styles.text} aria-hidden={index > 0 || undefined}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
