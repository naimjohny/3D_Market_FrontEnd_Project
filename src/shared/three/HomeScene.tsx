/** Сцена главной страницы: объект живёт в фиксированном канвасе, меняется по скроллу, следит за мышью. */

import { Float, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, type ReactElement } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';
import type { HomeScenePropsInterface } from '@app/models/ui/three.interface';
import { ProductModel } from './ProductModel';
import { SceneEnvironment } from './SceneEnvironment';

const SWAP_DAMP = 7;
const PARALLAX_DAMP = 3;
const SCALE_EPSILON = 0.04;

export function HomeScene({ activeKind, accent, color }: HomeScenePropsInterface): ReactElement {
  const group = useRef<Group>(null);
  const [displayKind, setDisplayKind] = useState(activeKind);

  useFrame((state, delta) => {
    const node = group.current;
    if (node === null) return;
    const target = displayKind === activeKind ? 1 : 0;
    const next = MathUtils.damp(node.scale.x, target, SWAP_DAMP, delta);
    node.scale.setScalar(Math.max(next, 0.0001));
    if (target === 0 && next < SCALE_EPSILON) setDisplayKind(activeKind);
    node.rotation.y = MathUtils.damp(node.rotation.y, state.pointer.x * 0.55, PARALLAX_DAMP, delta);
    node.rotation.x = MathUtils.damp(node.rotation.x, -state.pointer.y * 0.35, PARALLAX_DAMP, delta);
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#dfe6ff" />
      <SceneEnvironment env="night" />
      <Sparkles count={140} scale={11} size={2.2} speed={0.35} opacity={0.4} color={accent} />
      <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.8}>
        <group ref={group}>
          <ProductModel kind={displayKind} color={color} accent={accent} />
        </group>
      </Float>
    </>
  );
}
