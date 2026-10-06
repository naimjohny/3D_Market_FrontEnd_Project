/** Контракты каркаса сайта: соцссылки подвала, ошибки формы чекаута, общая easing-кривая анимаций. */

export interface SocialLinkInterface {
  readonly label: string;
  readonly href: string;
}

export interface CheckoutFormErrorsInterface {
  readonly name?: string;
  readonly email?: string;
}

export const EaseOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
