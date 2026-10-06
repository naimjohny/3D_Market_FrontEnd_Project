/** Форматирование цен и чисел в рублёвой локали. */

const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const intFormatter = new Intl.NumberFormat('ru-RU');

export const formatPrice = (value: number): string => rubFormatter.format(value);

export const formatInt = (value: number): string => intFormatter.format(value);
