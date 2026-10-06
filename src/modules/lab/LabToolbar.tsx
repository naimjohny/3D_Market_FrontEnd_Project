/** Панель управления лаборатории: выбор файла, демо-модели и настройки сцены. */

import { Upload } from 'lucide-react';
import { useRef, type ChangeEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductsData } from '@app/data/products.data';
import type { LabToggleKeyType, LabToolbarPropsInterface } from '@app/models/ui/lab-page.interface';
import type { ViewerEnvType } from '@app/models/viewer/viewer.type';
import { Button } from '@shared/components/Button/Button';
import { Chip } from '@shared/components/Chip/Chip';
import { Text } from '@shared/components/Text/Text';
import styles from './LabToolbar.module.scss';

const FILE_ACCEPT = '.glb,.gltf,.fbx,.obj,.stl';
const ICON_SIZE = 16;
const ENV_OPTIONS: readonly ViewerEnvType[] = ['studio', 'night', 'neon', 'sunset'];
const TOGGLE_KEYS: readonly LabToggleKeyType[] = ['wireframe', 'autoRotate', 'grid', 'shadows'];
const DEMO_MODELS = ProductsData.filter(
  (product, index) => ProductsData.findIndex((p) => p.model === product.model) === index,
);

export function LabToolbar({
  demoKind,
  hasLoaded,
  settings,
  onPickFile,
  onSelectDemo,
  onChangeSettings,
}: LabToolbarPropsInterface): ReactElement {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file !== undefined) onPickFile(file);
    event.target.value = '';
  };

  const toggleSetting = (key: LabToggleKeyType): void =>
    onChangeSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className={styles.toolbar}>
      <div className={styles.block}>
        <Button variant="secondary" fullWidth icon={<Upload size={ICON_SIZE} />} onClick={() => fileRef.current?.click()}>
          {t('LAB.BROWSE')}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept={FILE_ACCEPT}
          className={styles.fileInput}
          onChange={handleInputChange}
        />
        <Text variant="dim" className={styles.privacy}>
          {t('LAB.PRIVACY')}
        </Text>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>{t('LAB.DEMO')}</span>
        <div className={styles.chips}>
          {DEMO_MODELS.map((product) => (
            <Chip
              key={product.model}
              active={demoKind === product.model && !hasLoaded}
              onClick={() => onSelectDemo(product.model)}
            >
              {t(`PRODUCTS.${product.key}.NAME`)}
            </Chip>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <span className={styles.label}>{t('LAB.SETTINGS.TITLE')}</span>
        <span className={styles.subLabel}>{t('LAB.SETTINGS.ENV')}</span>
        <div className={styles.chips}>
          {ENV_OPTIONS.map((env) => (
            <Chip key={env} active={settings.env === env} onClick={() => onChangeSettings({ ...settings, env })}>
              {t(`LAB.ENVS.${env.toUpperCase()}`)}
            </Chip>
          ))}
        </div>
        <div className={styles.chips}>
          {TOGGLE_KEYS.map((key) => (
            <Chip key={key} active={settings[key]} onClick={() => toggleSetting(key)}>
              {t(`LAB.SETTINGS.${key.toUpperCase()}`)}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
