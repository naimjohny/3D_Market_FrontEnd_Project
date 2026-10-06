/** Атом многострочного поля: оформление Input, вертикальный ресайз и строка ошибки. */

import type { ReactElement } from 'react';
import type { TextareaPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Textarea.module.scss';

const DEFAULT_ROWS = 5;

export function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = DEFAULT_ROWS,
}: TextareaPropsInterface): ReactElement {
  const hasError = error !== undefined && error !== '';

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        rows={rows}
        aria-invalid={hasError || undefined}
        className={[styles.control, hasError && styles.invalid].filter(Boolean).join(' ')}
        onChange={(event) => onChange(event.target.value)}
      />
      {hasError && <span className={styles.error}>{error}</span>}
    </div>
  );
}
