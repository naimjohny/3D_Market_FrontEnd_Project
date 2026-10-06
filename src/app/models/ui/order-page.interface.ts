/** Контракты компонентов страницы заказа: пропсы калькулятора и формы, ошибки полей, вложение. */

import type { OrderEstimateParamsInterface } from '../order/order.interface';

export interface CalculatorCardPropsInterface {
  readonly value: OrderEstimateParamsInterface;
  readonly onChange: (next: OrderEstimateParamsInterface) => void;
}

export interface OrderFormPropsInterface {
  readonly calc: OrderEstimateParamsInterface;
}

export interface OrderFormErrorsInterface {
  readonly name?: string;
  readonly email?: string;
  readonly message?: string;
}

export interface OrderAttachmentInterface {
  readonly fileName: string;
  readonly sizeBytes: number;
}
