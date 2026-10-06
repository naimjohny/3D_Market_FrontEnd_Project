/** Спираль «Фибоначчи»: параметрическая труба по логарифмической спирали. */

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactElement } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import type { Mesh } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SPIN_SPEED = 0.35;
const TURNS = 3.2;
const POINTS = 120;
const GROWTH = 0.24;

const buildSpiralCurve = (): CatmullRomCurve3 => {
  const points: Vector3[] = [];
  for (let i = 0; i <= POINTS; i += 1) {
    const t = (i / POINTS) * TURNS * Math.PI * 2;
    const radius = 0.12 * Math.exp(GROWTH * t);
    points.push(new Vector3(Math.cos(t) * radius, (i / POINTS - 0.5) * 2.4, Math.sin(t) * radius));
  }
  return new CatmullRomCurve3(points);
};

export function SpiralModel({ color, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const mesh = useRef<Mesh>(null);
  const curve = useMemo(buildSpiralCurve, []);

  useFrame((_, delta) => {
    if (!spin || mesh.current === null) return;
    mesh.current.rotation.y += delta * SPIN_SPEED;
  });

  return (
    <mesh ref={mesh}>
      <tubeGeometry args={[curve, 180, 0.11, 12, false]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.18} />
    </mesh>
  );
}
