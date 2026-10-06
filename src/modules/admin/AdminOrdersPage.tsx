/** Страница заказов админки: таблица с фильтром по статусу и оптимистичной сменой статуса. */

import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminOrderInterface } from '@app/models/admin/admin.interface';
import { OrderStatuses, type OrderStatusType } from '@app/models/admin/admin.type';
import { AdminService, isUnauthorizedError } from '@app/services/admin.service';
import { useUiStore } from '@app/store/ui.store';
import { formatPrice } from '@app/utils/price.util';
import { Badge } from '@shared/components/Badge/Badge';
import { Chip } from '@shared/components/Chip/Chip';
import { EmptyState } from '@shared/components/EmptyState/EmptyState';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Select } from '@shared/components/Select/Select';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { Title } from '@shared/components/Title/Title';
import styles from './AdminOrdersPage.module.scss';

const STATUS_LIST = Object.values(OrderStatuses);

export function AdminOrdersPage(): ReactElement {
  const { t, i18n } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [orders, setOrders] = useState<readonly AdminOrderInterface[] | null>(null);
  const [filter, setFilter] = useState<OrderStatusType | null>(null);

  useEffect(() => {
    let alive = true;
    AdminService.orders()
      .then((items) => {
        if (alive) setOrders(items);
      })
      .catch((error: unknown) => {
        if (alive && !isUnauthorizedError(error)) {
          setOrders([]);
          pushToast('error', t('ADMIN.ORDERS.LOAD_FAILED'));
        }
      });
    return () => {
      alive = false;
    };
  }, [pushToast, t]);

  const handleStatus = (id: string, next: OrderStatusType): void => {
    const previous = orders;
    setOrders((items) => items?.map((o) => (o.id === id ? { ...o, status: next } : o)) ?? items);
    AdminService.updateOrderStatus(id, next)
      .then(() => pushToast('success', t('ADMIN.ORDERS.STATUS_UPDATED')))
      .catch((error: unknown) => {
        setOrders(previous);
        if (!isUnauthorizedError(error)) pushToast('error', t('ADMIN.ORDERS.STATUS_FAILED'));
      });
  };

  const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString(i18n.language === 'en' ? 'en-GB' : 'ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

  const statusOptions = STATUS_LIST.map((status) => ({
    value: status,
    label: t(`ADMIN.STATUS.${status.toUpperCase()}`),
  }));

  const items = (orders ?? []).filter((order) => filter === null || order.status === filter);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <SectionLabel>{t('ADMIN.LOGIN.LABEL')}</SectionLabel>
        <Title level={2}>{t('ADMIN.ORDERS.TITLE')}</Title>
      </header>

      <div className={styles.filters}>
        <Chip active={filter === null} onClick={() => setFilter(null)}>
          {t('ADMIN.ORDERS.ALL')}
        </Chip>
        {STATUS_LIST.map((status) => (
          <Chip key={status} active={filter === status} onClick={() => setFilter(status)}>
            {t(`ADMIN.STATUS.${status.toUpperCase()}`)}
          </Chip>
        ))}
      </div>

      {orders === null && (
        <div className={styles.loader}>
          <Spinner size="lg" />
        </div>
      )}

      {orders !== null && items.length === 0 && <EmptyState title={t('ADMIN.ORDERS.EMPTY')} />}

      {items.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('ADMIN.ORDERS.TH_ID')}</th>
                <th>{t('ADMIN.ORDERS.TH_KIND')}</th>
                <th>{t('ADMIN.ORDERS.TH_NAME')}</th>
                <th>{t('ADMIN.ORDERS.TH_EMAIL')}</th>
                <th>{t('ADMIN.ORDERS.TH_TOTAL')}</th>
                <th>{t('ADMIN.ORDERS.TH_STATUS')}</th>
                <th>{t('ADMIN.ORDERS.TH_DATE')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <tr key={order.id}>
                  <td className={styles.mono} title={order.id}>
                    {order.id}
                  </td>
                  <td>
                    <Badge kind={order.kind === 'custom' ? 'warning' : 'default'}>
                      {t(`ADMIN.KIND.${order.kind.toUpperCase()}`)}
                    </Badge>
                  </td>
                  <td>{order.name}</td>
                  <td className={styles.mono}>{order.email}</td>
                  <td className={styles.sum}>{formatPrice(order.estimate ?? order.total ?? 0)}</td>
                  <td className={styles.statusCell}>
                    <Select
                      label={t('ADMIN.ORDERS.TH_STATUS')}
                      hideLabel
                      name={`status-${order.id}`}
                      value={order.status}
                      options={statusOptions}
                      onChange={(value) => handleStatus(order.id, value as OrderStatusType)}
                    />
                  </td>
                  <td className={styles.mono}>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
