/** Статистика загруженной модели: формат, геометрия, материалы и размер файла. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { LabStatsPropsInterface } from '@app/models/ui/lab-page.interface';
import { formatBytes } from '@app/utils/format.util';
import { formatInt } from '@app/utils/price.util';
import styles from './LabStats.module.scss';

export function LabStats({ stats }: LabStatsPropsInterface): ReactElement {
  const { t } = useTranslation();
  const rows = [
    { label: t('LAB.STATS.FORMAT'), value: stats.format },
    { label: t('LAB.STATS.VERTICES'), value: formatInt(stats.vertices) },
    { label: t('LAB.STATS.TRIANGLES'), value: formatInt(stats.triangles) },
    { label: t('LAB.STATS.MESHES'), value: formatInt(stats.meshes) },
    { label: t('LAB.STATS.MATERIALS'), value: formatInt(stats.materials) },
    { label: t('LAB.STATS.SIZE'), value: formatBytes(stats.sizeBytes) },
  ];

  return (
    <div className={styles.card}>
      <span className={styles.label}>{t('LAB.STATS.TITLE')}</span>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.term}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
