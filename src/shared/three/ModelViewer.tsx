/** Ядро 3D-лаборатории: канвас с загруженной моделью или демо, сетка, wireframe, орбита. */

import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState, type ReactElement } from 'react';
import { Mesh } from 'three';
import type { Group } from 'three';
import type { ModelViewerPropsInterface } from '@app/models/ui/three.interface';
import { ProductModel } from './ProductModel';
import { SceneEnvironment } from './SceneEnvironment';

const CAMERA_POSITION: readonly [number, number, number] = [2.6, 1.6, 4.6];
const AUTO_ROTATE_SPEED = 1.4;
const DEFAULT_DEMO_COLOR = '#c7cdd9';
const TRANSMISSION_RESOLUTION_SCALE = 0.75;
const SHADOW_RESOLUTION = 256;

interface WireframeGroupPropsInterface {
  readonly wireframe: boolean;
  readonly children: React.ReactNode;
}

function WireframeGroup({ wireframe, children }: WireframeGroupPropsInterface): ReactElement {
  const group = useRef<Group>(null);

  useEffect(() => {
    group.current?.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if ('wireframe' in material) material.wireframe = wireframe;
      });
    });
  }, [wireframe, children]);

  return <group ref={group}>{children}</group>;
}

export function ModelViewer({
  object,
  settings,
  demoKind,
  demoColor = DEFAULT_DEMO_COLOR,
  className,
  onCanvasReady,
}: ModelViewerPropsInterface): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = wrapperRef.current;
    if (node === null) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry !== undefined) setVisible(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [...CAMERA_POSITION], fov: 42 }}
        gl={{ antialias: true, alpha: true, stencil: false, powerPreference: 'high-performance' }}
        onCreated={(state) => {
          state.gl.transmissionResolutionScale = TRANSMISSION_RESOLUTION_SCALE;
          onCanvasReady?.(() => {
            state.gl.render(state.scene, state.camera);
            return state.gl.domElement.toDataURL('image/png');
          });
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <SceneEnvironment env={settings.env} />
          <WireframeGroup wireframe={settings.wireframe}>
            {object !== null ? (
              <primitive object={object} />
            ) : (
              demoKind !== null && <ProductModel kind={demoKind} color={demoColor} />
            )}
          </WireframeGroup>
          {settings.grid && (
            <Grid
              position={[0, -1.6, 0]}
              args={[12, 12]}
              cellColor="#2a2a38"
              sectionColor="#3d3d52"
              fadeDistance={16}
              infiniteGrid
            />
          )}
          {settings.shadows && (
            <ContactShadows
              key={object?.uuid ?? 'demo'}
              position={[0, -1.58, 0]}
              opacity={0.5}
              scale={10}
              blur={2.4}
              far={3.6}
              resolution={SHADOW_RESOLUTION}
              frames={object !== null ? 1 : undefined}
            />
          )}
          <OrbitControls
            enablePan
            enableZoom
            autoRotate={settings.autoRotate}
            autoRotateSpeed={AUTO_ROTATE_SPEED}
            minDistance={1.4}
            maxDistance={14}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
