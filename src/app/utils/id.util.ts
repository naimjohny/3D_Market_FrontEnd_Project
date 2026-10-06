/** Генерация коротких уникальных идентификаторов для тостов и мок-заказов. */

const ID_RADIX = 36;
const ID_SLICE = 2;

export const makeId = (): string =>
  `${Date.now().toString(ID_RADIX)}${Math.random().toString(ID_RADIX).slice(ID_SLICE)}`;
