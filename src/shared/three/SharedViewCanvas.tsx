/** Один WebGL-контекст на страницу: фиксированный канвас + карточные вьюпорты drei View. */

import { Float, View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState, type ReactElement, type RefObject } from 'react';
import type { SceneViewPropsInterface, SharedCanvasPropsInterface } from '@app/models/ui/three.interface';
import { ProductModel } from './ProductModel';
import { SceneEnvironment } from './SceneEnvironment';
import styles from './SharedViewCanvas.module.scss';

export function SharedCanvas({ eventSource }: SharedCanvasPropsInterface): ReactElement {
  return (
    <div className={styles.canvasWrap}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 5.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl }) => {
          gl.transmissionResolutionScale = 0.5;
        }}
        eventSource={eventSource as RefObject<HTMLElement>}
      >
        <View.Port />
      </Canvas>
    </div>
  );
}

export function SceneView({ kind, color, accent, env = 'studio', className }: SceneViewPropsInterface): ReactElement {
  const viewRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = viewRef.current;
    if (!node) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <View ref={viewRef} className={className}>
      {inView && (
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <SceneEnvironment env={env} resolution={128} />
          <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.7}>
            <ProductModel kind={kind} color={color} accent={accent} />
          </Float>
        </Suspense>
      )}
    </View>
  );
}
