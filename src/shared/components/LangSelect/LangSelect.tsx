/** Переключатель локали: кастомный дропдаун; выбор меняет URL-префикс (/ru → /en) с перезагрузкой. */

import { Check, ChevronDown, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { LocalesList, LocalesMeta, isLocale } from '@app/config/locale.config';
import type { LangSelectPropsInterface } from '@app/models/ui/atoms.interface';
import type { LocaleType } from '@app/models/common/common.type';
import { StorageService } from '@app/services/storage.service';
import styles from './LangSelect.module.scss';

const ICON_SIZE = 14;
const LIST_OFFSET_PX = 6;
const LIST_DURATION_S = 0.22;

export function LangSelect({ compact = false, openUp = false, className }: LangSelectPropsInterface): ReactElement {
  const { i18n } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current: LocaleType = isLocale(i18n.language) ? i18n.language : 'ru';

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (!(rootRef.current?.contains(event.target as Node) ?? false)) setIsOpen(false);
    };
    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, [isOpen]);

  const selectLocale = (code: LocaleType): void => {
    setIsOpen(false);
    if (code === current) return;
    StorageService.setLanguage(code);
    window.location.assign(`/${code}${pathname === '/' ? '' : pathname}${search}${hash}`);
  };

  const rootClass = [styles.root, className].filter(Boolean).join(' ');
  const listClass = [styles.list, openUp && styles.listUp].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={rootClass}>
      <button
        type="button"
        className={compact ? `${styles.trigger} ${styles.compact}` : styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Globe size={ICON_SIZE} className={styles.globe} />
        <span className={styles.value}>
          {compact ? current.toUpperCase() : LocalesMeta[current].nativeName}
        </span>
        <ChevronDown size={ICON_SIZE} className={isOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className={listClass}
            role="listbox"
            initial={{ opacity: 0, y: openUp ? LIST_OFFSET_PX : -LIST_OFFSET_PX }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUp ? LIST_OFFSET_PX : -LIST_OFFSET_PX }}
            transition={{ duration: LIST_DURATION_S }}
          >
            {LocalesList.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={code === current}
                  className={code === current ? `${styles.option} ${styles.optionActive}` : styles.option}
                  dir={LocalesMeta[code].dir}
                  onClick={() => selectLocale(code)}
                >
                  <span className={styles.optionCode}>{code.toUpperCase()}</span>
                  <span className={styles.optionName}>{LocalesMeta[code].nativeName}</span>
                  {code === current && <Check size={ICON_SIZE} className={styles.check} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
