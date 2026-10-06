/** Кибершлем «Ронин»: hard-surface формы, неоновый визор, антенны. */

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Group } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SWAY_SPEED = 0.6;

export function HelmetModel({ color, accent, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const group = useRef<Group>(null);
  const visorColor = accent ?? '#22e0ff';

  useFrame((state) => {
    if (!spin || group.current === null) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * SWAY_SPEED) * 0.55;
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <mesh scale={[1, 1.12, 1.05]}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.05, 0.86]} rotation={[-0.12, 0, 0]} scale={[0.78, 0.3, 0.35]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color="#0a0a0c"
          emissive={visorColor}
          emissiveIntensity={2.4}
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[0, -0.78, 0.42]} scale={[0.62, 0.42, 0.55]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[-1.02, 0.1, 0]} rotation={[0, 0, 0.25]} scale={[0.12, 0.55, 0.35]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1d1d28" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[1.02, 0.1, 0]} rotation={[0, 0, -0.25]} scale={[0.12, 0.55, 0.35]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1d1d28" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.55, 1.05, -0.2]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.85, 8]} />
        <meshStandardMaterial color="#c7cdd9" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0.72, 1.45, -0.2]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={3} />
      </mesh>
    </group>
  );
}
