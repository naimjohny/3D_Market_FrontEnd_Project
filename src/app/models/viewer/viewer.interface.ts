/** Модели 3D-вьювера: статистика загруженной модели и настройки сцены. */

import type { ViewerEnvType } from './viewer.type';

export interface ModelStatsInterface {
  readonly name: string;
  readonly format: string;
  readonly vertices: number;
  readonly triangles: number;
  readonly meshes: number;
  readonly materials: number;
  readonly sizeBytes: number;
}

export interface ViewerSettingsInterface {
  readonly env: ViewerEnvType;
  readonly wireframe: boolean;
  readonly autoRotate: boolean;
  readonly grid: boolean;
  readonly shadows: boolean;
}
