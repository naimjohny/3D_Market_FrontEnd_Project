/** Прелоадер: rAF-анимация фейкового прогресса, гигантский процент, уезжает вверх по завершении. */

import { useEffect, useRef, type ReactElement } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import { useUiStore } from '@app/store/ui.store';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import styles from './Preloader.module.scss';

const DURATION_MS = 1_600;
const EXIT_DELAY_MS = 250;
const HIDDEN_TAB_FAILSAFE_MS = 3_200;
const FULL_PERCENT = 100;
const EXIT_DURATION_S = 0.7;

export function Preloader(): ReactElement {
  const { t } = useTranslation();
  const preloaderDone = useUiStore((s) => s.preloaderDone);
  const finishPreloader = useUiStore((s) => s.finishPreloader);
  const rootRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (preloaderDone) return;
    let frame = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();

    const tick = (now: number): void => {
      const raw = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - raw) * (1 - raw);
      const value = Math.round(eased * FULL_PERCENT);
      rootRef.current?.style.setProperty('--progress', `${value}%`);
      if (percentRef.current !== null) percentRef.current.textContent = String(value);
      if (raw < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      timeoutId = setTimeout(finishPreloader, EXIT_DELAY_MS);
    };

    frame = requestAnimationFrame(tick);
    const failsafeId = setTimeout(finishPreloader, HIDDEN_TAB_FAILSAFE_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafeId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [preloaderDone, finishPreloader]);

  return (
    <AnimatePresence>
      {!preloaderDone && (
        <motion.div
          ref={rootRef}
          className={styles.preloader}
          exit={{ y: '-100%' }}
          transition={{ duration: EXIT_DURATION_S, ease: EaseOutExpo }}
        >
          <SectionLabel className={styles.label}>
            {`${t('GENERAL.BRAND')} · ${t('GENERAL.HUD.LOADING')}`}
          </SectionLabel>
          <div className={styles.percent}>
            <span ref={percentRef}>0</span>
            <span className={styles.percentSign}>%</span>
          </div>
          <div className={styles.bar} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
