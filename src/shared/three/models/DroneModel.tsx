/** Дрон «Оса»: меха-корпус, четыре луча с кольцами и вращающимися винтами. */

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Group } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const ROTOR_SPEED = 14;
const HOVER_SPEED = 1.6;
const ARM_OFFSET = 1.05;

const ARM_POSITIONS: readonly (readonly [number, number])[] = [
  [ARM_OFFSET, ARM_OFFSET],
  [-ARM_OFFSET, ARM_OFFSET],
  [ARM_OFFSET, -ARM_OFFSET],
  [-ARM_OFFSET, -ARM_OFFSET],
];

export function DroneModel({ color, accent, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const group = useRef<Group>(null);
  const rotors = useRef<(Group | null)[]>([]);

  useFrame((state, delta) => {
    if (group.current !== null && spin) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * HOVER_SPEED) * 0.12;
      group.current.rotation.y += delta * 0.2;
    }
    rotors.current.forEach((rotor) => {
      if (rotor !== null) rotor.rotation.y += delta * ROTOR_SPEED;
    });
  });

  return (
    <group ref={group} scale={0.92}>
      <mesh scale={[1.15, 0.45, 1.5]}>
        <sphereGeometry args={[0.85, 24, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.12, 0.95]} scale={[0.45, 0.22, 0.35]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial
          color="#0a0a0c"
          emissive={accent ?? '#fdcb6e'}
          emissiveIntensity={2.2}
          roughness={0.1}
        />
      </mesh>
      {ARM_POSITIONS.map(([x, z], index) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x / 2, 0, z / 2]} rotation={[0, Math.atan2(x, z), 0]} scale={[0.14, 0.1, 1.1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[x, 0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.05, 12, 32]} />
            <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} />
          </mesh>
          <group
            position={[x, 0.08, z]}
            ref={(node) => {
              rotors.current[index] = node;
            }}
          >
            <mesh scale={[0.72, 0.015, 0.07]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#c7cdd9" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh scale={[0.07, 0.015, 0.72]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#c7cdd9" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
