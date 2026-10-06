/** Световой риг сцены: четыре пресета окружения на Lightformer'ах — без сетевых HDR. */

import { Environment, Lightformer } from '@react-three/drei';
import type { ReactElement } from 'react';
import type { SceneEnvironmentPropsInterface } from '@app/models/ui/three.interface';

const DEFAULT_ENV_RESOLUTION = 256;

const StudioRig = (): ReactElement => (
  <>
    <Lightformer intensity={4} position={[0, 4, 3]} scale={[6, 3, 1]} />
    <Lightformer intensity={1.6} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} />
    <Lightformer intensity={1.1} position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[5, 3, 1]} />
    <Lightformer intensity={0.5} color="#c9d4ff" position={[0, -3, -4]} scale={[8, 3, 1]} />
  </>
);

const NightRig = (): ReactElement => (
  <>
    <Lightformer intensity={2.6} color="#4a5cff" position={[0, 4, -3]} scale={[7, 3, 1]} />
    <Lightformer intensity={2} color="#9db0ff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
    <Lightformer intensity={1.4} color="#c9d4ff" position={[3, 3, 4]} scale={[3, 2, 1]} />
    <Lightformer intensity={0.9} color="#2b3880" position={[5, -1, 0]} rotation-y={-Math.PI / 2} scale={[5, 3, 1]} />
  </>
);

const NeonRig = (): ReactElement => (
  <>
    <Lightformer intensity={2.4} color="#ff3fa4" position={[-4, 2, 2]} rotation-y={Math.PI / 2} scale={[5, 3, 1]} />
    <Lightformer intensity={2.4} color="#22e0ff" position={[4, 1, 1]} rotation-y={-Math.PI / 2} scale={[5, 3, 1]} />
    <Lightformer intensity={1.2} color="#7b3fff" position={[0, 5, -2]} scale={[8, 3, 1]} />
  </>
);

const SunsetRig = (): ReactElement => (
  <>
    <Lightformer intensity={2.6} color="#ff9a3d" position={[0, 1.5, -5]} scale={[9, 4, 1]} />
    <Lightformer intensity={1.5} color="#ff5f7e" position={[-4, 3, 1]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} />
    <Lightformer intensity={0.8} color="#8b7cff" position={[4, 4, 2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
  </>
);

export function SceneEnvironment({
  env = 'studio',
  resolution = DEFAULT_ENV_RESOLUTION,
}: SceneEnvironmentPropsInterface): ReactElement {
  return (
    <Environment resolution={resolution}>
      {env === 'studio' && <StudioRig />}
      {env === 'night' && <NightRig />}
      {env === 'neon' && <NeonRig />}
      {env === 'sunset' && <SunsetRig />}
    </Environment>
  );
}
