/** Хром-узел: бесшовный тор-узел в жидком металле. */

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Mesh } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SPIN_SPEED = 0.25;

export function TorusModel({ color, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin || mesh.current === null) return;
    mesh.current.rotation.x += delta * SPIN_SPEED;
    mesh.current.rotation.y += delta * SPIN_SPEED * 1.4;
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1, 0.34, 180, 32]} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.12} />
    </mesh>
  );
}
