/** Колонна «Баухаус»: строгая композиция из чистых геометрических форм. */

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Group } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SPIN_SPEED = 0.2;

export function ColumnModel({ color, accent, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!spin || group.current === null) return;
    group.current.rotation.y += delta * SPIN_SPEED;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[1.9, 0.35, 1.9]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.72, 0.82, 0.28, 32]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.52, 0.58, 1.7, 10]} />
        <meshStandardMaterial color={color} flatShading roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <boxGeometry args={[1.35, 0.22, 1.35]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={accent ?? color} roughness={0.35} metalness={0.4} />
      </mesh>
    </group>
  );
}
