/** Разъезжающийся текст: слова выезжают из-под маски каскадом при появлении во вьюпорте. */

import { Fragment, type CSSProperties, type ReactElement } from 'react';
import type { RevealTextPropsInterface } from '@app/models/ui/atoms.interface';
import { useInView } from '@shared/hooks/useInView';
import styles from './RevealText.module.scss';

export function RevealText({ text, className }: RevealTextPropsInterface): ReactElement {
  const { ref, visible } = useInView<HTMLSpanElement>();
  const words = text.split(' ');
  const classes = [styles.reveal, visible && styles.visible, className].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={styles.word}>
            <span className={styles.inner} style={{ '--i': index } as CSSProperties}>
              {word}
            </span>
          </span>
          {index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  );
}
