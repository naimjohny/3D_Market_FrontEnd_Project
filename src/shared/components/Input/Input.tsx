/** Атом текстового поля: моно-лейбл, тёмная поверхность с фокус-свечением и строка ошибки. */

import type { ReactElement } from 'react';
import type { InputPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Input.module.scss';

export function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
}: InputPropsInterface): ReactElement {
  const hasError = error !== undefined && error !== '';

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasError || undefined}
        className={[styles.input, hasError && styles.invalid].filter(Boolean).join(' ')}
        onChange={(event) => onChange(event.target.value)}
      />
      {hasError && <span className={styles.error}>{error}</span>}
    </div>
  );
}
