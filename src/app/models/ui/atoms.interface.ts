/** Контракты атомарных UI-компонентов shared/components — единый источник их API. */

import type { ReactNode } from 'react';
import type { ProductInterface } from '../products/product.interface';

export type TitleLevelType = 1 | 2 | 3 | 4;
export type ControlSizeType = 'sm' | 'md' | 'lg';
export type ButtonVariantType = 'primary' | 'secondary' | 'ghost';
export type TextVariantType = 'body' | 'lead' | 'muted' | 'dim' | 'mono';
export type BadgeKindType = 'default' | 'success' | 'warning';
export type AlignType = 'left' | 'center';

export interface TitlePropsInterface {
  readonly children: ReactNode;
  readonly level?: TitleLevelType;
  readonly align?: AlignType;
  readonly gradient?: boolean;
  readonly className?: string;
}

export interface TextPropsInterface {
  readonly children: ReactNode;
  readonly variant?: TextVariantType;
  readonly align?: AlignType;
  readonly className?: string;
}

export interface ButtonPropsInterface {
  readonly children: ReactNode;
  readonly variant?: ButtonVariantType;
  readonly size?: ControlSizeType;
  readonly type?: 'button' | 'submit';
  readonly to?: string;
  readonly href?: string;
  readonly fullWidth?: boolean;
  readonly magnetic?: boolean;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly onClick?: () => void;
}

export interface IconButtonPropsInterface {
  readonly children: ReactNode;
  readonly ariaLabel: string;
  readonly badge?: number;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

export interface ChipPropsInterface {
  readonly children: ReactNode;
  readonly active?: boolean;
  readonly onClick?: () => void;
  readonly className?: string;
}

export interface BadgePropsInterface {
  readonly children: ReactNode;
  readonly kind?: BadgeKindType;
}

export interface SectionLabelPropsInterface {
  readonly children: ReactNode;
  readonly className?: string;
}

export interface GradTextPropsInterface {
  readonly children: ReactNode;
}

export interface InputPropsInterface {
  readonly label: string;
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly type?: 'text' | 'email' | 'tel' | 'password';
  readonly placeholder?: string;
  readonly error?: string;
  readonly required?: boolean;
}

export interface TextareaPropsInterface {
  readonly label: string;
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly rows?: number;
}

export interface SelectOptionInterface {
  readonly value: string;
  readonly label: string;
}

export interface SelectPropsInterface {
  readonly label: string;
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly SelectOptionInterface[];
  readonly hideLabel?: boolean;
}

export interface RangeSliderPropsInterface {
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly step?: number;
  readonly valueLabel?: string;
}

export interface AccordionItemInterface {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface AccordionPropsInterface {
  readonly items: readonly AccordionItemInterface[];
}

export interface MarqueePropsInterface {
  readonly text: string;
  readonly reverse?: boolean;
}

export interface CounterPropsInterface {
  readonly value: number;
  readonly label: string;
  readonly suffix?: string;
}

export interface RevealTextPropsInterface {
  readonly text: string;
  readonly className?: string;
}

export interface SpinnerPropsInterface {
  readonly size?: ControlSizeType;
}

export interface EmptyStatePropsInterface {
  readonly title: string;
  readonly hint?: string;
  readonly children?: ReactNode;
}

export interface BaseModalPropsInterface {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly title?: string;
  readonly size?: 'md' | 'lg';
}

export interface FormModalPropsInterface extends BaseModalPropsInterface {
  readonly onSubmit: () => void;
  readonly submitText: string;
  readonly isLoading?: boolean;
}

export interface ProductCardPropsInterface {
  readonly product: ProductInterface;
  readonly index?: number;
}

export interface JsonLdPropsInterface {
  readonly data: object;
}

export interface PageHeadPropsInterface {
  readonly label: string;
  readonly title: string;
  readonly subtitle?: string;
}

export interface LangSelectPropsInterface {
  readonly compact?: boolean;
  readonly openUp?: boolean;
  readonly className?: string;
}
