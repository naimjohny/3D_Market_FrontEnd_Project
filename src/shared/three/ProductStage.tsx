/** Готовая 3D-сцена в собственном канвасе: модель + свет + орбит-контролы + тень. */

import { ContactShadows, Float, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactElement } from 'react';
import type { ProductStagePropsInterface } from '@app/models/ui/three.interface';
import { ProductModel } from './ProductModel';
import { SceneEnvironment } from './SceneEnvironment';

const DEFAULT_CAMERA_Z = 5.4;
const AUTO_ROTATE_SPEED = 1.6;

export function ProductStage({
  kind,
  color,
  accent,
  env = 'studio',
  interactive = true,
  zoom = false,
  autoRotate = true,
  float = true,
  shadows = true,
  cameraZ = DEFAULT_CAMERA_Z,
  className,
}: ProductStagePropsInterface): ReactElement {
  const model = <ProductModel kind={kind} color={color} accent={accent} />;

  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, cameraZ], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => {
        gl.transmissionResolutionScale = 0.75;
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <SceneEnvironment env={env} />
        {float ? (
          <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.7}>
            {model}
          </Float>
        ) : (
          model
        )}
        {shadows && (
          <ContactShadows position={[0, -1.9, 0]} opacity={0.45} scale={9} blur={2.6} far={3.4} resolution={256} />
        )}
        {interactive && (
          <OrbitControls
            enableZoom={zoom}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={AUTO_ROTATE_SPEED}
            minDistance={3}
            maxDistance={9}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
