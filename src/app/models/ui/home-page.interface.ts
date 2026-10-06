/** Контракты главной страницы: активная 3D-модель фона, пропсы секций и элементы статистики. */

import type { ProductInterface } from '../products/product.interface';
import type { ModelKindType } from '../products/product.type';

export interface HomeActiveModelInterface {
  readonly kind: ModelKindType;
  readonly color: string;
  readonly accent: string;
}

export interface FeaturedSectionPropsInterface {
  readonly onActiveProduct: (product: ProductInterface | null) => void;
}

export interface FeaturedRowPropsInterface extends FeaturedSectionPropsInterface {
  readonly product: ProductInterface;
  readonly index: number;
}

export interface HomeStatInterface {
  readonly value: number;
  readonly labelKey: string;
  readonly suffix?: string;
}
