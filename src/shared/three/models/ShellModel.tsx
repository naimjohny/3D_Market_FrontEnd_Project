/** Золотая раковина: спираль Фибоначчи из убывающих сфер в полированном металле. */

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactElement } from 'react';
import { MeshStandardMaterial, SphereGeometry } from 'three';
import type { Group } from 'three';
import type { ProceduralModelPropsInterface } from '@app/models/ui/three.interface';

const SPIN_SPEED = 0.28;
const SPHERES = 26;
const TURNS = 2.4;

interface ShellSphereInterface {
  readonly position: readonly [number, number, number];
  readonly radius: number;
}

const buildSpheres = (): readonly ShellSphereInterface[] => {
  const spheres: ShellSphereInterface[] = [];
  for (let i = 0; i < SPHERES; i += 1) {
    const t = (i / SPHERES) * TURNS * Math.PI * 2;
    const radius = 0.16 * Math.exp(0.22 * t);
    spheres.push({
      position: [Math.cos(t) * radius, Math.sin(t) * radius, 0],
      radius: 0.08 + i * 0.028,
    });
  }
  return spheres;
};

export function ShellModel({ color, spin = true }: ProceduralModelPropsInterface): ReactElement {
  const group = useRef<Group>(null);
  const spheres = useMemo(buildSpheres, []);
  const geometry = useMemo(() => new SphereGeometry(1, 16, 16), []);
  const material = useMemo(() => new MeshStandardMaterial({ metalness: 1, roughness: 0.16 }), []);

  useEffect(() => {
    material.color.set(color);
  }, [material, color]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!spin || group.current === null) return;
    group.current.rotation.z += delta * SPIN_SPEED;
    group.current.rotation.y += delta * SPIN_SPEED * 0.4;
  });

  return (
    <group ref={group} scale={0.82} position={[0.2, 0.1, 0]}>
      {spheres.map((sphere, index) => (
        <mesh
          key={`shell-${sphere.position[0]}-${index === 0 ? 'a' : index}`}
          geometry={geometry}
          material={material}
          position={[...sphere.position]}
          scale={sphere.radius}
        />
      ))}
    </group>
  );
}
