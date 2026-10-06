/** UI-стор: мобильное меню, прелоадер, вариант курсора, очередь тостов. */

import { create } from 'zustand';
import type { UiStoreInterface } from '@app/models/ui/ui.interface';
import { makeId } from '@app/utils/id.util';

const TOAST_LIFETIME_MS = 3_600;

export const useUiStore = create<UiStoreInterface>()((set, get) => ({
  menuOpen: false,
  preloaderDone: false,
  toasts: [],

  setMenuOpen: (open) => set({ menuOpen: open }),
  finishPreloader: () => set({ preloaderDone: true }),

  pushToast: (kind, message) => {
    const id = makeId();
    set({ toasts: [...get().toasts, { id, kind, message }] });
    setTimeout(() => get().dismissToast(id), TOAST_LIFETIME_MS);
  },

  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
