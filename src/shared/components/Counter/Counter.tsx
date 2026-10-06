/** Счётчик-статистика: набегающее число с easeOutExpo при появлении во вьюпорте. */

import { useEffect, useState, type ReactElement } from 'react';
import type { CounterPropsInterface } from '@app/models/ui/atoms.interface';
import { formatInt } from '@app/utils/price.util';
import { useInView } from '@shared/hooks/useInView';
import styles from './Counter.module.scss';

const DURATION_MS = 1400;

/** Экспоненциальное замедление к финалу — фирменная кривая набега цифр. */
const easeOutExpo = (progress: number): number => (progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress));

export function Counter({ value, label, suffix }: CounterPropsInterface): ReactElement {
  const { ref, visible } = useInView<HTMLDivElement>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number): void => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setCurrent(Math.round(value * easeOutExpo(progress)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [visible, value]);

  return (
    <div ref={ref} className={styles.counter}>
      <div className={styles.value}>
        {formatInt(current)}
        {suffix !== undefined && <span className={styles.suffix}>{suffix}</span>}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
