/** Секция статистики: четыре набегающих счётчика достижений студии. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { HomeStatInterface } from '@app/models/ui/home-page.interface';
import { Counter } from '@shared/components/Counter/Counter';
import styles from './StatsSection.module.scss';

const STAT_ITEMS: readonly HomeStatInterface[] = [
  { value: 120, suffix: '+', labelKey: 'HOME.STATS.MODELS' },
  { value: 46, labelKey: 'HOME.STATS.POLYGONS' },
  { value: 48, labelKey: 'HOME.STATS.HOURS' },
  { value: 60, labelKey: 'HOME.STATS.FPS' },
];

export function StatsSection(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className={styles.stats}>
      <div className={styles.grid}>
        {STAT_ITEMS.map((item) => (
          <div key={item.labelKey} className={styles.cell}>
            <Counter value={item.value} suffix={item.suffix} label={t(item.labelKey)} />
          </div>
        ))}
      </div>
    </section>
  );
}
