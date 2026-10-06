/** Пропсы подкомпонентов страницы продукта: вьювер, панель конфигуратора и характеристики. */

import type { ProductInterface } from '../products/product.interface';
import type { ViewerEnvType } from '../viewer/viewer.type';

export interface ProductViewerPropsInterface {
  readonly product: ProductInterface;
  readonly color: string;
  readonly env: ViewerEnvType;
}

export interface ProductPanelPropsInterface extends ProductViewerPropsInterface {
  readonly onColorChange: (color: string) => void;
  readonly onEnvChange: (env: ViewerEnvType) => void;
}

export interface ProductSpecsPropsInterface {
  readonly product: ProductInterface;
}
