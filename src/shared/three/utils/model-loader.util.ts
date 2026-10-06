/** Локальная загрузка 3D-файлов пользователя: GLB/GLTF/FBX/OBJ/STL → Object3D + статистика. */

import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import type { BufferGeometry, Object3D } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { LoadedModelInterface } from '@app/models/ui/three.interface';
import type { ModelFileExtType } from '@app/models/viewer/viewer.type';

const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';
const TARGET_SIZE = 2.6;
const SUPPORTED_EXTS: readonly ModelFileExtType[] = ['glb', 'gltf', 'fbx', 'obj', 'stl'];

export const getModelExt = (fileName: string): ModelFileExtType | null => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return (SUPPORTED_EXTS as readonly string[]).includes(ext) ? (ext as ModelFileExtType) : null;
};

const stlToObject = (geometry: BufferGeometry): Object3D => {
  geometry.computeVertexNormals();
  return new Mesh(
    geometry,
    new MeshStandardMaterial({ color: '#c7cdd9', metalness: 0.35, roughness: 0.45 }),
  );
};

let cachedGltfLoader: GLTFLoader | null = null;
let cachedFbxLoader: FBXLoader | null = null;
let cachedObjLoader: OBJLoader | null = null;
let cachedStlLoader: STLLoader | null = null;

const getGltfLoader = (): GLTFLoader => {
  if (cachedGltfLoader === null) {
    cachedGltfLoader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_DECODER_PATH);
    cachedGltfLoader.setDRACOLoader(draco);
  }
  return cachedGltfLoader;
};

const getFbxLoader = (): FBXLoader => {
  cachedFbxLoader ??= new FBXLoader();
  return cachedFbxLoader;
};

const getObjLoader = (): OBJLoader => {
  cachedObjLoader ??= new OBJLoader();
  return cachedObjLoader;
};

const getStlLoader = (): STLLoader => {
  cachedStlLoader ??= new STLLoader();
  return cachedStlLoader;
};

const parseByExt = async (ext: ModelFileExtType, url: string): Promise<Object3D> => {
  if (ext === 'glb' || ext === 'gltf') {
    const gltf = await getGltfLoader().loadAsync(url);
    return gltf.scene;
  }
  if (ext === 'fbx') return getFbxLoader().loadAsync(url);
  if (ext === 'obj') return getObjLoader().loadAsync(url);
  return stlToObject(await getStlLoader().loadAsync(url));
};

/** Центрирует объект и масштабирует до единого габарита, чтобы любой файл влезал в кадр. */
const normalizeObject = (object: Object3D): void => {
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = maxAxis > 0 ? TARGET_SIZE / maxAxis : 1;
  object.position.sub(center.multiplyScalar(1));
  object.position.multiplyScalar(scale);
  object.scale.setScalar(scale);
};

const collectStats = (
  object: Object3D,
  name: string,
  format: string,
  sizeBytes: number,
): LoadedModelInterface['stats'] => {
  let vertices = 0;
  let triangles = 0;
  let meshes = 0;
  const materials = new Set<string>();
  object.traverse((child) => {
    if (child instanceof Mesh) {
      meshes += 1;
      const geometry: BufferGeometry = child.geometry;
      const position = geometry.getAttribute('position');
      if (position !== undefined) {
        vertices += position.count;
        triangles += Math.floor(
          (geometry.index !== null ? geometry.index.count : position.count) / 3,
        );
      }
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => materials.add(m.uuid));
    }
  });
  return { name, format, vertices, triangles, meshes, materials: materials.size, sizeBytes };
};

export const loadModelFromFile = async (file: File): Promise<LoadedModelInterface> => {
  const ext = getModelExt(file.name);
  if (ext === null) throw new Error('UNSUPPORTED_FORMAT');
  const url = URL.createObjectURL(file);
  try {
    const object = await parseByExt(ext, url);
    normalizeObject(object);
    return { object, stats: collectStats(object, file.name, ext.toUpperCase(), file.size) };
  } finally {
    URL.revokeObjectURL(url);
  }
};
