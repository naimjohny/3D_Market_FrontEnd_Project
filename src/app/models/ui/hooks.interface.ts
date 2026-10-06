/** Контракты возвращаемых значений shared-хуков. */

import type { RefObject } from 'react';

export interface UseInViewResultInterface<T extends HTMLElement> {
  readonly ref: RefObject<T | null>;
  readonly visible: boolean;
}
