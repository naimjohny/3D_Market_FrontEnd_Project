/** Типы заказа: уровни детализации модели. */

export type DetailLevelType = 'low' | 'mid' | 'high';

export const DetailLevels = {
  Low: 'low',
  Mid: 'mid',
  High: 'high',
} as const;
