/** Волна «Ампер»: живое поле синусоидальных волн на лоу-поли сетке. */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactElement } from 'react';
import { PlaneGeometry } from 'three';
import type { Mesh } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SEGMENTS = 56;
const PLANE_SIZE = 4.4;
const WAVE_HEIGHT = 0.24;

export function WaveModel({ color, spin: _spin, accent: _accent }: ProceduralModelPropsInterface): ReactElement {
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(PLANE_SIZE, PLANE_SIZE, SEGMENTS, SEGMENTS), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const position = geometry.getAttribute('position');
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z =
        Math.sin(x * 1.6 + t * 1.4) * Math.cos(y * 1.4 + t) * WAVE_HEIGHT +
        Math.sin((x + y) * 0.8 + t * 0.7) * WAVE_HEIGHT * 0.6;
      position.setZ(i, z);
    }
    position.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2.6, 0, 0.4]} position={[0, -0.3, 0]}>
      <meshStandardMaterial color={color} flatShading metalness={0.55} roughness={0.35} />
    </mesh>
  );
}
