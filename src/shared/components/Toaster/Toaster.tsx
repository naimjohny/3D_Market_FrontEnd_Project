/** Тостер: портал со стеком стеклянных уведомлений, иконка по типу, клик закрывает тост. */

import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import type { ToastKindType } from '@app/models/ui/ui.type';
import { useUiStore } from '@app/store/ui.store';
import { Text } from '@shared/components/Text/Text';
import styles from './Toaster.module.scss';

const ICON_SIZE = 18;
const TOAST_DURATION_S = 0.35;

const TOAST_ICONS: Record<ToastKindType, ReactNode> = {
  success: <CircleCheck size={ICON_SIZE} />,
  error: <CircleAlert size={ICON_SIZE} />,
  info: <Info size={ICON_SIZE} />,
};

export function Toaster(): ReactElement {
  const toasts = useUiStore((s) => s.toasts);
  const dismissToast = useUiStore((s) => s.dismissToast);

  return createPortal(
    <div className={styles.stack}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={styles.toast}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: TOAST_DURATION_S, ease: EaseOutExpo }}
            onClick={() => dismissToast(toast.id)}
          >
            <span className={`${styles.icon} ${styles[toast.kind]}`}>{TOAST_ICONS[toast.kind]}</span>
            <Text className={styles.message}>{toast.message}</Text>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
