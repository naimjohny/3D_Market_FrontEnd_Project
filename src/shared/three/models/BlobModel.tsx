/** Жидкий металл: дышащая капля с искажающимся рельефом. */

import { MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Mesh } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SPIN_SPEED = 0.18;

export function BlobModel({ color, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin || mesh.current === null) return;
    mesh.current.rotation.y += delta * SPIN_SPEED;
  });

  return (
    <mesh ref={mesh} scale={1.35}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial color={color} metalness={0.85} roughness={0.15} distort={0.42} speed={2.2} />
    </mesh>
  );
}
