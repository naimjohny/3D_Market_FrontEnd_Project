/** Кристалл «Небула»: гранёное стекло с преломлением и светящимся ядром. */

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Group } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SPIN_SPEED = 0.3;

export function CrystalModel({ color, accent, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (group.current === null) return;
    if (spin) group.current.rotation.y += delta * SPIN_SPEED;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={group}>
      <mesh scale={[0.85, 1.5, 0.85]}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.7}
          thickness={1.6}
          roughness={0.04}
          ior={1.8}
          metalness={0.15}
          envMapIntensity={2.2}
          iridescence={0.9}
          iridescenceIOR={1.35}
          clearcoat={1}
          clearcoatRoughness={0.06}
          flatShading
        />
      </mesh>
      <mesh scale={[0.32, 0.62, 0.32]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={accent ?? color}
          emissive={accent ?? color}
          emissiveIntensity={1.8}
        />
      </mesh>
      <mesh position={[0.95, -0.55, 0.25]} rotation={[0.4, 0.2, -0.5]} scale={[0.28, 0.52, 0.28]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.08} metalness={0.3} envMapIntensity={2} />
      </mesh>
      <mesh position={[-0.85, -0.62, -0.2]} rotation={[-0.3, 0.5, 0.4]} scale={[0.22, 0.4, 0.22]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.08} metalness={0.3} envMapIntensity={2} />
      </mesh>
    </group>
  );
}
