/** Атом выпадающего списка: нативный select в оформлении Input со стрелкой lucide. */

import { ChevronDown } from 'lucide-react';
import type { ReactElement } from 'react';
import type { SelectPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Select.module.scss';

export function Select({
  label,
  name,
  value,
  onChange,
  options,
  hideLabel = false,
}: SelectPropsInterface): ReactElement {
  return (
    <div className={styles.field}>
      <label className={hideLabel ? styles.hiddenLabel : styles.label} htmlFor={name}>
        {label}
      </label>
      <div className={styles.wrap}>
        <select
          id={name}
          name={name}
          value={value}
          className={styles.control}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} size={18} aria-hidden="true" />
      </div>
    </div>
  );
}
