/** Планета «Терра-9»: лоу-поли сфера с наклонённым кольцом и спутником на орбите. */

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactElement } from 'react';
import type { Group, Mesh } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const PLANET_SPIN = 0.15;
const MOON_ORBIT = 0.9;
const MOON_DISTANCE = 2.1;

export function PlanetModel({ color, accent, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const planet = useRef<Mesh>(null);
  const moonPivot = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!spin) return;
    if (planet.current !== null) planet.current.rotation.y += delta * PLANET_SPIN;
    if (moonPivot.current !== null) moonPivot.current.rotation.y += delta * MOON_ORBIT;
  });

  return (
    <group rotation={[0.18, 0, -0.12]}>
      <mesh ref={planet}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshStandardMaterial color={color} flatShading roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.85, 0.09, 2, 64]} />
        <meshStandardMaterial color={accent ?? color} flatShading roughness={0.6} metalness={0.3} />
      </mesh>
      <group ref={moonPivot} rotation={[0.4, 0, 0]}>
        <mesh position={[MOON_DISTANCE, 0, 0]}>
          <icosahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial color="#c7cdd9" flatShading roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
