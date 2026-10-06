/** Атом кнопки: pill-форма, варианты primary/secondary/ghost, магнитный ховер, ссылка или кнопка. */

import { useState, type CSSProperties, type MouseEvent, type ReactElement } from 'react';
import { Link } from 'react-router';
import type { ButtonPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './Button.module.scss';

const MAGNET_RANGE_PX = 6;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  to,
  href,
  fullWidth = false,
  magnetic = false,
  disabled = false,
  icon,
  onClick,
}: ButtonPropsInterface): ReactElement {
  const [shift, setShift] = useState({ x: 0, y: 0 });

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    magnetic && styles.magnetic,
  ]
    .filter(Boolean)
    .join(' ');

  const style = magnetic
    ? ({ '--mx': `${shift.x}px`, '--my': `${shift.y}px` } as CSSProperties)
    : undefined;

  const handleLeave = (): void => {
    if (magnetic) setShift({ x: 0, y: 0 });
  };

  const handleMove = (event: MouseEvent<HTMLElement>): void => {
    if (!magnetic) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * MAGNET_RANGE_PX;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * MAGNET_RANGE_PX;
    setShift({ x, y });
  };

  const shared = {
    className: classes,
    style,
    onClick,
    onMouseLeave: handleLeave,
    onMouseMove: handleMove,
  };

  const content = (
    <>
      {icon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (to !== undefined) {
    return (
      <Link to={to} {...shared}>
        {content}
      </Link>
    );
  }

  if (href !== undefined) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...shared}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} {...shared}>
      {content}
    </button>
  );
}
