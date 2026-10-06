/** Дровер корзины: оверлей, панель позиций со свотчами и степперами, чекаут через FormModal. */

import { useState, type CSSProperties, type ReactElement } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@app/config/router.config';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import type { CheckoutFormErrorsInterface } from '@app/models/ui/layout.interface';
import { OrderService } from '@app/services/order.service';
import { ProductsService } from '@app/services/products.service';
import { useCartStore } from '@app/store/cart.store';
import { useUiStore } from '@app/store/ui.store';
import { formatPrice } from '@app/utils/price.util';
import { Button } from '@shared/components/Button/Button';
import { EmptyState } from '@shared/components/EmptyState/EmptyState';
import { FormModal } from '@shared/components/FormModal/FormModal';
import { IconButton } from '@shared/components/IconButton/IconButton';
import { Input } from '@shared/components/Input/Input';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './CartDrawer.module.scss';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PANEL_DURATION_S = 0.55;
const OVERLAY_DURATION_S = 0.35;
const ICON_SIZE = 18;
const STEP_ICON_SIZE = 14;

export function CartDrawer(): ReactElement {
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const pushToast = useUiStore((s) => s.pushToast);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<CheckoutFormErrorsInterface>({});
  const [sending, setSending] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + (ProductsService.byIdCached(item.productId)?.price ?? 0) * item.qty,
    0,
  );

  const validate = (): CheckoutFormErrorsInterface => ({
    ...(name.trim() === '' ? { name: t('ORDER.FORM.REQUIRED') } : {}),
    ...(email.trim() === '' ? { email: t('ORDER.FORM.REQUIRED') } : {}),
    ...(email.trim() !== '' && !EMAIL_PATTERN.test(email.trim())
      ? { email: t('ORDER.FORM.INVALID_EMAIL') }
      : {}),
  });

  const submitCheckout = (): void => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSending(true);
    void OrderService.checkout({
      name: name.trim(),
      email: email.trim(),
      items: items.map((item) => ({ productId: item.productId, qty: item.qty })),
    })
      .then((response) => {
        if (response.payUrl !== undefined && response.payUrl !== '') {
          window.location.assign(response.payUrl);
          return;
        }
        clear();
        setCheckoutOpen(false);
        close();
        pushToast('success', t('CART.SUCCESS_TITLE'));
      })
      .catch(() => pushToast('error', t('TOASTS.ORDER_FAILED')))
      .finally(() => setSending(false));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OVERLAY_DURATION_S }}
            onClick={close}
          />
        )}
        {isOpen && (
          <motion.aside
            key="panel"
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: PANEL_DURATION_S, ease: EaseOutExpo }}
          >
            <div className={styles.head}>
              <Title level={3}>{t('CART.TITLE')}</Title>
              <IconButton ariaLabel={t('GENERAL.ACTIONS.CLOSE')} onClick={close}>
                <X size={ICON_SIZE} />
              </IconButton>
            </div>

            {items.length === 0 ? (
              <div className={styles.empty}>
                <EmptyState title={t('CART.EMPTY')} hint={t('CART.EMPTY_HINT')}>
                  <Button variant="secondary" to={AppRoutes.works} onClick={close}>
                    {t('GENERAL.ACTIONS.TO_CATALOG')}
                  </Button>
                </EmptyState>
              </div>
            ) : (
              <>
                <div className={styles.list}>
                  {items.map((item) => {
                    const product = ProductsService.byIdCached(item.productId);
                    if (product === null) return null;
                    return (
                      <div key={item.productId} className={styles.item}>
                        <span
                          className={styles.swatch}
                          style={{ '--swatch': item.color } as CSSProperties}
                        />
                        <div className={styles.info}>
                          <span className={styles.name}>{t(`PRODUCTS.${product.key}.NAME`)}</span>
                          <span className={styles.price}>{formatPrice(product.price)}</span>
                        </div>
                        <div className={styles.stepper}>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => setQty(item.productId, item.qty - 1)}
                          >
                            <Minus size={STEP_ICON_SIZE} />
                          </button>
                          <span className={styles.qty}>{item.qty}</span>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => setQty(item.productId, item.qty + 1)}
                          >
                            <Plus size={STEP_ICON_SIZE} />
                          </button>
                        </div>
                        <IconButton
                          ariaLabel={t('CART.REMOVE')}
                          onClick={() => remove(item.productId)}
                        >
                          <X size={STEP_ICON_SIZE} />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.foot}>
                  <div className={styles.totalRow}>
                    <SectionLabel>{t('CART.TOTAL')}</SectionLabel>
                    <span className={styles.totalValue}>{formatPrice(total)}</span>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setCheckoutOpen(true)}
                  >
                    {t('CART.CHECKOUT')}
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <FormModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={t('CART.CHECKOUT_TITLE')}
        onSubmit={submitCheckout}
        submitText={t('CART.PAY')}
        isLoading={sending}
      >
        <Text variant="muted">{t('CART.CHECKOUT_NOTE')}</Text>
        <Input
          label={t('ORDER.FORM.NAME')}
          name="name"
          value={name}
          onChange={setName}
          required
          error={errors.name}
        />
        <Input
          label={t('ORDER.FORM.EMAIL')}
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          error={errors.email}
        />
      </FormModal>
    </>
  );
}
