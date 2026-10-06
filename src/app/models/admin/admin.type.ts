/** Типы админ-панели: статусы заказов и их виды. */

export type OrderStatusType = 'new' | 'paid' | 'in_progress' | 'done' | 'cancelled';

export const OrderStatuses = {
  New: 'new',
  Paid: 'paid',
  InProgress: 'in_progress',
  Done: 'done',
  Cancelled: 'cancelled',
} as const;

export type OrderKindType = 'custom' | 'checkout';

export type StripeModeType = 'test' | 'live';

export const StripeModes = {
  Test: 'test',
  Live: 'live',
} as const;
