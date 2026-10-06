/** Главная страница: сквозной 3D-объект в фиксированном канвасе и секции лендинга поверх. */

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useRef, useState, type ReactElement, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { AppConfig } from '@app/config/app.config';
import type { ProductInterface } from '@app/models/products/product.interface';
import type { HomeActiveModelInterface } from '@app/models/ui/home-page.interface';
import { JsonLd } from '@shared/components/JsonLd/JsonLd';
import { Marquee } from '@shared/components/Marquee/Marquee';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import { HomeScene } from '@shared/three/HomeScene';
import { CtaSection } from './sections/CtaSection';
import { FeaturedSection } from './sections/FeaturedSection';
import { HeroSection } from './sections/HeroSection';
import { ManifestoSection } from './sections/ManifestoSection';
import { ProcessSection } from './sections/ProcessSection';
import { ServicesSection } from './sections/ServicesSection';
import { StatsSection } from './sections/StatsSection';
import styles from './HomePage.module.scss';

const DEFAULT_ACTIVE: HomeActiveModelInterface = { kind: 'torus', color: '#c7cdd9', accent: '#6c5ce7' };
const CAMERA_POSITION: [number, number, number] = [0, 0.2, 6];
const CAMERA_FOV = 40;
const DPR_MAX = Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 2);
const DPR_MIN = 1.1;

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FORMA³',
  url: AppConfig.siteUrl,
  logo: `${AppConfig.siteUrl}/favicon.svg`,
  sameAs: Object.values(AppConfig.socials),
} as const;

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FORMA³',
  url: AppConfig.siteUrl,
} as const;

export function HomePage(): ReactElement {
  const { t } = useTranslation();
  usePageMeta({ title: t('META.HOME_TITLE'), description: t('META.HOME_DESC') });
  const pageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<HomeActiveModelInterface>(DEFAULT_ACTIVE);
  const [dpr, setDpr] = useState(DPR_MAX);

  const handleActiveProduct = useCallback((product: ProductInterface | null): void => {
    setActive(
      product === null ? DEFAULT_ACTIVE : { kind: product.model, color: product.colors[0], accent: product.accent },
    );
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      <JsonLd data={ORGANIZATION_JSON_LD} />
      <JsonLd data={WEBSITE_JSON_LD} />
      <div className={styles.canvasWrap}>
        <Canvas
          dpr={dpr}
          camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
          eventSource={pageRef as RefObject<HTMLElement>}
          onCreated={({ gl }) => {
            gl.transmissionResolutionScale = 0.75;
          }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr((current) => Math.max(DPR_MIN, current - 0.35))}
            onIncline={() => setDpr((current) => Math.min(DPR_MAX, current + 0.25))}
          />
          <Suspense fallback={null}>
            <HomeScene activeKind={active.kind} color={active.color} accent={active.accent} />
          </Suspense>
        </Canvas>
      </div>
      <div className={styles.content}>
        <HeroSection />
        <ManifestoSection />
        <FeaturedSection onActiveProduct={handleActiveProduct} />
        <Marquee text={t('HOME.MARQUEE')} />
        <ServicesSection />
        <ProcessSection />
        <StatsSection />
        <CtaSection />
      </div>
    </div>
  );
}
