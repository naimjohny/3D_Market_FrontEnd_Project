/** Страница статистики админки: карточки ключевых метрик по заказам и выручке. */

import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminStatsInterface } from '@app/models/admin/admin.interface';
import { AdminService, isUnauthorizedError } from '@app/services/admin.service';
import { useUiStore } from '@app/store/ui.store';
import { formatInt, formatPrice } from '@app/utils/price.util';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { Title } from '@shared/components/Title/Title';
import styles from './AdminStatsPage.module.scss';

export function AdminStatsPage(): ReactElement {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [stats, setStats] = useState<AdminStatsInterface | null>(null);

  useEffect(() => {
    let alive = true;
    AdminService.stats()
      .then((data) => {
        if (alive) setStats(data);
      })
      .catch((error: unknown) => {
        if (alive && !isUnauthorizedError(error)) {
          pushToast('error', t('ADMIN.STATS.LOAD_FAILED'));
        }
      });
    return () => {
      alive = false;
    };
  }, [pushToast, t]);

  const cards =
    stats === null
      ? []
      : [
          { key: 'TOTAL', value: formatInt(stats.ordersTotal) },
          { key: 'NEW', value: formatInt(stats.ordersNew) },
          { key: 'REVENUE', value: formatPrice(stats.revenuePaid) },
          { key: 'CUSTOM', value: formatInt(stats.customCount) },
          { key: 'CHECKOUT', value: formatInt(stats.checkoutCount) },
        ];

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <SectionLabel>{t('ADMIN.LOGIN.LABEL')}</SectionLabel>
        <Title level={2}>{t('ADMIN.STATS.TITLE')}</Title>
      </header>

      {stats === null && (
        <div className={styles.loader}>
          <Spinner size="lg" />
        </div>
      )}

      {stats !== null && (
        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.key} className={styles.card}>
              <span className={styles.cardLabel}>{t(`ADMIN.STATS.${card.key}`)}</span>
              <span className={styles.cardValue}>{card.value}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
