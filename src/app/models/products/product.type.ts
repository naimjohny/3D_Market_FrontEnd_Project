/** Типы каталога: категории, виды процедурных моделей, форматы файлов, финиши. */

export type ProductCategoryType = 'art' | 'tech' | 'character' | 'environment' | 'architecture';

export type ModelKindType =
  | 'torus'
  | 'crystal'
  | 'blob'
  | 'planet'
  | 'helmet'
  | 'column'
  | 'spiral'
  | 'drone'
  | 'wave'
  | 'shell';

export type ModelFormatType = 'GLB' | 'FBX' | 'OBJ' | 'STL';

export type FinishKindType = 'gloss' | 'matte' | 'chrome' | 'gold' | 'glass';

export const ProductCategories = {
  Art: 'art',
  Tech: 'tech',
  Character: 'character',
  Environment: 'environment',
  Architecture: 'architecture',
} as const;
