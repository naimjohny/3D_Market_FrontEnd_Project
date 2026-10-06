/** Модель продукта каталога: процедурная 3D-модель с ценой, характеристиками и вариантами цвета. */

import type { ModelFormatType, ModelKindType, ProductCategoryType } from './product.type';

export interface ProductInterface {
  readonly id: string;
  readonly key: string;
  readonly category: ProductCategoryType;
  readonly model: ModelKindType;
  readonly price: number;
  readonly oldPrice?: number;
  readonly polycount: number;
  readonly formats: readonly ModelFormatType[];
  readonly textured: boolean;
  readonly rigged: boolean;
  readonly animated: boolean;
  readonly colors: readonly string[];
  readonly accent: string;
  readonly featured: boolean;
}
