/** Появление элемента во вьюпорте через IntersectionObserver — для reveal-анимаций. */

import { useEffect, useRef, useState } from 'react';
import type { UseInViewResultInterface } from '@app/models/ui/hooks.interface';

const DEFAULT_THRESHOLD = 0.2;

export const useInView = <T extends HTMLElement>(
  threshold: number = DEFAULT_THRESHOLD,
  once: boolean = true,
): UseInViewResultInterface<T> => {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node === null) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, visible };
};
