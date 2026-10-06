/** Zustand-стор корзины: состояние + действия, персист в cookies через StorageService. */

import { create } from 'zustand';
import type { CartItemInterface, CartStoreInterface } from '@app/models/cart/cart.interface';
import { StorageService } from '@app/services/storage.service';

const persist = (items: readonly CartItemInterface[]): readonly CartItemInterface[] => {
  StorageService.setCart(items);
  return items;
};

export const useCartStore = create<CartStoreInterface>()((set, get) => ({
  items: StorageService.getCart(),
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  add: (productId, color) => {
    const exists = get().items.some((i) => i.productId === productId);
    const items = exists
      ? get().items.map((i) => (i.productId === productId ? { ...i, qty: i.qty + 1, color } : i))
      : [...get().items, { productId, qty: 1, color }];
    set({ items: persist(items), isOpen: true });
  },

  remove: (productId) => {
    set({ items: persist(get().items.filter((i) => i.productId !== productId)) });
  },

  setQty: (productId, qty) => {
    if (qty < 1) return;
    set({
      items: persist(get().items.map((i) => (i.productId === productId ? { ...i, qty } : i))),
    });
  },

  clear: () => set({ items: persist([]) }),
}));
