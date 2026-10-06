/** Базовое модальное окно: портал, стеклянная панель, Escape/оверлей и блокировка скролла. */

import { X } from 'lucide-react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useEffect, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { BaseModalPropsInterface } from '@app/models/ui/atoms.interface';
import { IconButton } from '../IconButton/IconButton';
import { Title } from '../Title/Title';
import styles from './BaseModal.module.scss';

const OVERLAY_TRANSITION: Transition = { duration: 0.25 };
const PANEL_TRANSITION: Transition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };

export function BaseModal({ isOpen, onClose, children, title, size = 'md' }: BaseModalPropsInterface): ReactElement {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={OVERLAY_TRANSITION}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className={[styles.panel, size === 'lg' && styles.lg].filter(Boolean).join(' ')}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={PANEL_TRANSITION}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.head}>
              {title !== undefined ? <Title level={3}>{title}</Title> : <span />}
              <IconButton ariaLabel={t('GENERAL.ACTIONS.CLOSE')} onClick={onClose}>
                <X size={18} />
              </IconButton>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
