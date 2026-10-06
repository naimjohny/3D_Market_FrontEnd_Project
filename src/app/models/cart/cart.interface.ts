/** Модели корзины: позиция и контракт стора. */

export interface CartItemInterface {
  readonly productId: string;
  readonly qty: number;
  readonly color: string;
}

export interface CartStoreInterface {
  readonly items: readonly CartItemInterface[];
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly add: (productId: string, color: string) => void;
  readonly remove: (productId: string) => void;
  readonly setQty: (productId: string, qty: number) => void;
  readonly clear: () => void;
}
