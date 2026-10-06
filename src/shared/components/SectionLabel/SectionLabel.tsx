/** HUD-лейбл секции: моноширинная капс-подпись с акцентной точкой слева. */

import type { ReactElement } from 'react';
import type { SectionLabelPropsInterface } from '@app/models/ui/atoms.interface';
import styles from './SectionLabel.module.scss';

export function SectionLabel({ children, className }: SectionLabelPropsInterface): ReactElement {
  return <span className={[styles.label, className].filter(Boolean).join(' ')}>{children}</span>;
}
