/** Аккордеон вопросов-ответов: открыт один пункт, разворот через grid-rows, плюс-иконка. */

import { Plus } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import type { AccordionPropsInterface } from '@app/models/ui/atoms.interface';
import { Text } from '../Text/Text';
import styles from './Accordion.module.scss';

export function Accordion({ items }: AccordionPropsInterface): ReactElement {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = item.id === openId;

        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className={styles.question}>{item.question}</span>
              <Plus
                className={[styles.icon, isOpen && styles.iconOpen].filter(Boolean).join(' ')}
                size={20}
                aria-hidden="true"
              />
            </button>
            <div className={[styles.panel, isOpen && styles.panelOpen].filter(Boolean).join(' ')}>
              <div className={styles.panelInner}>
                <Text variant="muted" className={styles.answer}>
                  {item.answer}
                </Text>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
