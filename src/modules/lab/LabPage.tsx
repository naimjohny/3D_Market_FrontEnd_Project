/** Страница 3D-лаборатории: dropzone-вьювер локальных файлов, демо-модели и панель управления сценой. */

import { Camera, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type DragEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductsData } from '@app/data/products.data';
import type { ModelKindType } from '@app/models/products/product.type';
import type { LoadedModelInterface } from '@app/models/ui/three.interface';
import type { ViewerSettingsInterface } from '@app/models/viewer/viewer.interface';
import { useUiStore } from '@app/store/ui.store';
import { Button } from '@shared/components/Button/Button';
import { PageHead } from '@shared/components/PageHead/PageHead';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import { ModelViewer } from '@shared/three/ModelViewer';
import { getModelExt, loadModelFromFile } from '@shared/three/utils/model-loader.util';
import { downloadDataUrl } from '@shared/three/utils/screenshot.util';
import { LabStats } from './LabStats';
import { LabToolbar } from './LabToolbar';
import styles from './LabPage.module.scss';

const DEMO_COLOR = '#c7cdd9';
const ICON_SIZE = 16;
const DEFAULT_SETTINGS: ViewerSettingsInterface = {
  env: 'studio',
  wireframe: false,
  autoRotate: true,
  grid: true,
  shadows: true,
};

export function LabPage(): ReactElement {
  const { t } = useTranslation();
  usePageMeta({ title: t('META.LAB_TITLE'), description: t('META.LAB_DESC') });
  const pushToast = useUiStore((s) => s.pushToast);
  const [loaded, setLoaded] = useState<LoadedModelInterface | null>(null);
  const [demoKind, setDemoKind] = useState<ModelKindType | null>('torus');
  const [settings, setSettings] = useState<ViewerSettingsInterface>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [capture, setCapture] = useState<(() => string) | null>(null);
  const [viewerKey, setViewerKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const demoProduct = ProductsData.find((p) => p.model === demoKind);
  const hudName =
    loaded !== null
      ? loaded.stats.name
      : demoProduct === undefined
        ? ''
        : t(`PRODUCTS.${demoProduct.key}.NAME`);

  const handleFile = async (file: File): Promise<void> => {
    if (getModelExt(file.name) === null) {
      pushToast('error', t('LAB.ERROR_FORMAT'));
      return;
    }
    setLoading(true);
    try {
      const model = await loadModelFromFile(file);
      setLoaded(model);
      pushToast('success', t('TOASTS.MODEL_LOADED', { name: file.name }));
    } catch {
      pushToast('error', t('LAB.ERROR_LOAD'));
    } finally {
      setLoading(false);
    }
  };

  const submitFile = (file: File): void => {
    void handleFile(file);
  };

  const handleSelectDemo = (kind: ModelKindType): void => {
    setLoaded(null);
    setDemoKind(kind);
  };

  const handleScreenshot = (): void => {
    if (capture === null) return;
    downloadDataUrl(capture(), `forma3d-${Date.now()}.png`);
    pushToast('success', t('TOASTS.SCREENSHOT_SAVED'));
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file !== undefined) submitFile(file);
  };

  return (
    <div className={styles.page}>
      <PageHead label={t('GENERAL.NAV.LAB')} title={t('LAB.TITLE')} subtitle={t('LAB.SUBTITLE')} />

      <div className={styles.lab}>
        <div
          className={styles.viewer}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ModelViewer
            key={viewerKey}
            object={loaded?.object ?? null}
            settings={settings}
            demoKind={loaded !== null ? null : demoKind}
            demoColor={DEMO_COLOR}
            onCanvasReady={(shot) => setCapture(() => shot)}
            className={styles.canvas}
          />
          <span className={[styles.hud, styles.hudLeft].join(' ')}>{hudName}</span>
          <span className={[styles.hud, styles.hudRight].join(' ')}>
            <span className={styles.dot} aria-hidden="true" />
            {t('GENERAL.HUD.LOCAL')}
          </span>
          <AnimatePresence>
            {isDragging && (
              <motion.div
                key="drop"
                className={styles.dropOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className={styles.dropText}>{t('LAB.DROP')}</span>
              </motion.div>
            )}
            {loading && (
              <motion.div
                key="loading"
                className={styles.loadingOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Spinner size="lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className={styles.panel}>
          <LabToolbar
            demoKind={demoKind}
            hasLoaded={loaded !== null}
            settings={settings}
            onPickFile={submitFile}
            onSelectDemo={handleSelectDemo}
            onChangeSettings={setSettings}
          />
          <AnimatePresence>
            {loaded !== null && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <LabStats stats={loaded.stats} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className={styles.actions}>
            <Button
              variant="secondary"
              fullWidth
              icon={<Camera size={ICON_SIZE} />}
              onClick={handleScreenshot}
            >
              {t('LAB.SCREENSHOT')}
            </Button>
            <Button
              variant="ghost"
              fullWidth
              icon={<RotateCcw size={ICON_SIZE} />}
              onClick={() => setViewerKey((k) => k + 1)}
            >
              {t('LAB.RESET_VIEW')}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
