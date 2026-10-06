/** Атом слайдера-диапазона: моно-подписи и залитый трек через CSS-переменную --fill. */

import type { CSSProperties, ReactElement } from 'react';
import type { RangeSliderPropsInterface } from '@app/models/ui/atoms.interface';
import { formatInt } from '@app/utils/price.util';
import styles from './RangeSlider.module.scss';

const FULL_PERCENT = 100;

export function RangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  valueLabel,
}: RangeSliderPropsInterface): ReactElement {
  const fill = max === min ? 0 : ((value - min) / (max - min)) * FULL_PERCENT;
  const style = { '--fill': `${fill}%` } as CSSProperties;

  return (
    <div className={styles.slider}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{valueLabel ?? formatInt(value)}</span>
      </div>
      <input
        type="range"
        className={styles.range}
        style={style}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
