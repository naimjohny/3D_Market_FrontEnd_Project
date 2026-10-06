/** UI-модели: тосты, пункты навигации, контракт UI-стора. */

import type { ToastKindType } from './ui.type';

export interface ToastInterface {
  readonly id: string;
  readonly kind: ToastKindType;
  readonly message: string;
}

export interface NavItemInterface {
  readonly key: string;
  readonly path: string;
}

export interface UiStoreInterface {
  readonly menuOpen: boolean;
  readonly preloaderDone: boolean;
  readonly toasts: readonly ToastInterface[];
  readonly setMenuOpen: (open: boolean) => void;
  readonly finishPreloader: () => void;
  readonly pushToast: (kind: ToastKindType, message: string) => void;
  readonly dismissToast: (id: string) => void;
}
