/** Читает payment=success|cancel из query после возврата со Stripe: тост и очистка адресной строки. */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@app/store/ui.store';

export const usePaymentResult = (): void => {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    if (payment === null) return;
    if (payment === 'success') pushToast('success', t('TOASTS.PAYMENT_SUCCESS'));
    if (payment === 'cancel') pushToast('error', t('TOASTS.PAYMENT_CANCEL'));
    params.delete('payment');
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query === '' ? '' : `?${query}`}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [pushToast, t]);
};
