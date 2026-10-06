/** Пропсы 3D-компонентов ядра shared/three. */

import type { Object3D } from 'three';
import type { ModelKindType } from '../products/product.type';
import type { ModelStatsInterface, ViewerSettingsInterface } from '../viewer/viewer.interface';
import type { ViewerEnvType } from '../viewer/viewer.type';

export interface ProceduralModelPropsInterface {
  readonly color: string;
  readonly accent?: string;
  readonly spin?: boolean;
}

export interface ProductModelPropsInterface extends ProceduralModelPropsInterface {
  readonly kind: ModelKindType;
}

export interface SceneEnvironmentPropsInterface {
  readonly env?: ViewerEnvType;
  readonly resolution?: number;
}

export interface ProductStagePropsInterface {
  readonly kind: ModelKindType;
  readonly color: string;
  readonly accent?: string;
  readonly env?: ViewerEnvType;
  readonly interactive?: boolean;
  readonly zoom?: boolean;
  readonly autoRotate?: boolean;
  readonly float?: boolean;
  readonly shadows?: boolean;
  readonly cameraZ?: number;
  readonly className?: string;
}

export interface SceneViewPropsInterface {
  readonly kind: ModelKindType;
  readonly color: string;
  readonly accent?: string;
  readonly env?: ViewerEnvType;
  readonly className?: string;
}

export interface SharedCanvasPropsInterface {
  readonly eventSource: React.RefObject<HTMLElement | null>;
}

export interface HomeScenePropsInterface {
  readonly activeKind: ModelKindType;
  readonly accent: string;
  readonly color: string;
}

export interface ModelViewerPropsInterface {
  readonly object: Object3D | null;
  readonly settings: ViewerSettingsInterface;
  readonly demoKind: ModelKindType | null;
  readonly demoColor?: string;
  readonly className?: string;
  readonly onCanvasReady?: (capture: () => string) => void;
}

export interface LoadedModelInterface {
  readonly object: Object3D;
  readonly stats: ModelStatsInterface;
}
