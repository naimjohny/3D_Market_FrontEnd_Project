/** Страница 404: гигантский контурный код ошибки, приглушённая 3D-сцена и возврат в каталог. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@app/config/router.config';
import { Button } from '@shared/components/Button/Button';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import { usePageMeta } from '@shared/hooks/usePageMeta';
import { ProductStage } from '@shared/three/ProductStage';
import styles from './NotFoundPage.module.scss';

const ERROR_CODE = '404';
const STAGE_COLOR = '#3d3d52';

export function NotFoundPage(): ReactElement {
  const { t } = useTranslation();
  usePageMeta({ title: t('META.NOT_FOUND_TITLE'), description: t('META.HOME_DESC') });

  return (
    <div className={styles.page}>
      <section className={styles.inner}>
        <div className={styles.stage} aria-hidden="true">
          <ProductStage
            kind="torus"
            color={STAGE_COLOR}
            interactive={false}
            shadows={false}
            className={styles.canvas}
          />
        </div>
        <div className={styles.content}>
          <span className={styles.code} aria-hidden="true">
            {ERROR_CODE}
          </span>
          <Title level={3} align="center">
            {t('NOT_FOUND.TITLE')}
          </Title>
          <Text variant="muted" align="center">
            {t('NOT_FOUND.TEXT')}
          </Text>
          <div className={styles.action}>
            <Button variant="primary" to={AppRoutes.works}>
              {t('NOT_FOUND.BUTTON')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
