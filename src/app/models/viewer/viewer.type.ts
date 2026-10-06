/** Типы 3D-вьювера: пресеты окружения и поддерживаемые расширения файлов. */

export type ViewerEnvType = 'studio' | 'night' | 'neon' | 'sunset';

export type ModelFileExtType = 'glb' | 'gltf' | 'fbx' | 'obj' | 'stl';

export const ViewerEnvs = {
  Studio: 'studio',
  Night: 'night',
  Neon: 'neon',
  Sunset: 'sunset',
} as const;

export const ModelFileExts = {
  Glb: 'glb',
  Gltf: 'gltf',
  Fbx: 'fbx',
  Obj: 'obj',
  Stl: 'stl',
} as const;
