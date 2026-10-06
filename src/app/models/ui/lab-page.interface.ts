/** Пропсы подкомпонентов страницы 3D-лаборатории: панель управления и статистика модели. */

import type { ModelKindType } from '../products/product.type';
import type { ModelStatsInterface, ViewerSettingsInterface } from '../viewer/viewer.interface';

export type LabToggleKeyType = Exclude<keyof ViewerSettingsInterface, 'env'>;

export interface LabToolbarPropsInterface {
  readonly demoKind: ModelKindType | null;
  readonly hasLoaded: boolean;
  readonly settings: ViewerSettingsInterface;
  readonly onPickFile: (file: File) => void;
  readonly onSelectDemo: (kind: ModelKindType) => void;
  readonly onChangeSettings: (settings: ViewerSettingsInterface) => void;
}

export interface LabStatsPropsInterface {
  readonly stats: ModelStatsInterface;
}
