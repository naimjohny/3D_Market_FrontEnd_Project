/** Страница настроек админки: статус Stripe, подключение по секретному ключу и отключение с подтверждением. */

import { useEffect, useState, type FormEvent, type ReactElement } from 'react';
import { Copy, Unplug } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppConfig } from '@app/config/app.config';
import type {
  StripeSettingsInterface,
  StripeSettingsRequestInterface,
} from '@app/models/admin/admin.interface';
import { StripeModes } from '@app/models/admin/admin.type';
import {
  AdminService,
  isStripeInvalidKeyError,
  isUnauthorizedError,
} from '@app/services/admin.service';
import { useUiStore } from '@app/store/ui.store';
import { Badge } from '@shared/components/Badge/Badge';
import { Button } from '@shared/components/Button/Button';
import { FormModal } from '@shared/components/FormModal/FormModal';
import { IconButton } from '@shared/components/IconButton/IconButton';
import { Input } from '@shared/components/Input/Input';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './AdminSettingsPage.module.scss';

const ICON_SIZE = 16;
const SECRET_KEY_PLACEHOLDER = 'sk_test_...';
const WEBHOOK_SECRET_PLACEHOLDER = 'whsec_...';
const KEY_MASK_PREFIX = '••••';
const STRIPE_KEYS_URL = 'https://dashboard.stripe.com/test/apikeys';
const WEBHOOK_URL = `${AppConfig.apiBaseUrl}/stripe/webhook`;

const EMPTY_SETTINGS: StripeSettingsInterface = {
  configured: false,
  mode: null,
  secretKeyLast4: null,
  webhookConfigured: false,
  accountName: null,
};

const modeBadge = (
  settings: StripeSettingsInterface,
): { readonly kind: 'default' | 'success' | 'warning'; readonly key: string } => {
  if (!settings.configured) return { kind: 'default', key: 'ADMIN.SETTINGS.MODE_MOCK' };
  if (settings.mode === StripeModes.Live) return { kind: 'success', key: 'ADMIN.SETTINGS.MODE_LIVE' };
  return { kind: 'warning', key: 'ADMIN.SETTINGS.MODE_TEST' };
};

export function AdminSettingsPage(): ReactElement {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [settings, setSettings] = useState<StripeSettingsInterface | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    let alive = true;
    AdminService.stripeSettings()
      .then((data) => {
        if (alive) setSettings(data);
      })
      .catch((error: unknown) => {
        if (alive && !isUnauthorizedError(error)) {
          pushToast('error', t('ADMIN.SETTINGS.LOAD_FAILED'));
        }
      });
    return () => {
      alive = false;
    };
  }, [pushToast, t]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const key = secretKey.trim();
    const secret = webhookSecret.trim();
    if (key === '') return;
    const request: StripeSettingsRequestInterface = {
      secretKey: key,
      ...(secret === '' ? {} : { webhookSecret: secret }),
    };
    setKeyError(null);
    setIsSaving(true);
    AdminService.saveStripeSettings(request)
      .then((next) => {
        setSettings(next);
        setSecretKey('');
        setWebhookSecret('');
        pushToast('success', t('ADMIN.SETTINGS.CONNECTED'));
      })
      .catch((error: unknown) => {
        if (isStripeInvalidKeyError(error)) {
          setKeyError(t('ADMIN.SETTINGS.ERROR_INVALID_KEY'));
        } else if (!isUnauthorizedError(error)) {
          pushToast('error', t('ADMIN.SETTINGS.SAVE_FAILED'));
        }
      })
      .finally(() => setIsSaving(false));
  };

  const handleDisconnect = (): void => {
    setIsDisconnecting(true);
    AdminService.clearStripeSettings()
      .then(() => {
        setSettings(EMPTY_SETTINGS);
        setIsDisconnectOpen(false);
        pushToast('success', t('ADMIN.SETTINGS.DISCONNECTED'));
      })
      .catch((error: unknown) => {
        if (!isUnauthorizedError(error)) {
          pushToast('error', t('ADMIN.SETTINGS.DISCONNECT_FAILED'));
        }
      })
      .finally(() => setIsDisconnecting(false));
  };

  const handleCopy = (): void => {
    void navigator.clipboard
      .writeText(WEBHOOK_URL)
      .then(() => pushToast('success', t('TOASTS.COPIED')));
  };

  const badge = settings === null ? null : modeBadge(settings);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <SectionLabel>{t('ADMIN.LOGIN.LABEL')}</SectionLabel>
        <Title level={2}>{t('ADMIN.SETTINGS.TITLE')}</Title>
      </header>

      {settings === null && (
        <div className={styles.loader}>
          <Spinner size="lg" />
        </div>
      )}

      {settings !== null && badge !== null && (
        <div className={styles.grid}>
          <section className={styles.card}>
            <span className={styles.cardTitle}>{t('ADMIN.SETTINGS.STATUS_TITLE')}</span>
            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('ADMIN.SETTINGS.ROW_MODE')}</span>
                <Badge kind={badge.kind}>{t(badge.key)}</Badge>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('ADMIN.SETTINGS.ROW_ACCOUNT')}</span>
                <span className={styles.rowValue}>{settings.accountName ?? '—'}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('ADMIN.SETTINGS.ROW_KEY')}</span>
                <span className={styles.rowValue}>
                  {settings.secretKeyLast4 === null
                    ? '—'
                    : `${KEY_MASK_PREFIX}${settings.secretKeyLast4}`}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('ADMIN.SETTINGS.ROW_WEBHOOK')}</span>
                <Badge kind={settings.webhookConfigured ? 'success' : 'default'}>
                  {settings.webhookConfigured
                    ? t('ADMIN.SETTINGS.WEBHOOK_ON')
                    : t('ADMIN.SETTINGS.WEBHOOK_OFF')}
                </Badge>
              </div>
            </div>
            {settings.configured && (
              <button
                type="button"
                className={styles.disconnect}
                onClick={() => setIsDisconnectOpen(true)}
              >
                <Unplug size={ICON_SIZE} aria-hidden="true" />
                {t('ADMIN.SETTINGS.DISCONNECT')}
              </button>
            )}
          </section>

          <form className={`${styles.card} ${styles.form}`} onSubmit={handleSubmit}>
            <span className={styles.cardTitle}>{t('ADMIN.SETTINGS.FORM_TITLE')}</span>
            <Input
              label={t('ADMIN.SETTINGS.FIELD_KEY')}
              name="stripe-secret-key"
              type="password"
              value={secretKey}
              placeholder={SECRET_KEY_PLACEHOLDER}
              required
              error={keyError ?? undefined}
              onChange={setSecretKey}
            />
            <Input
              label={t('ADMIN.SETTINGS.FIELD_WEBHOOK')}
              name="stripe-webhook-secret"
              type="password"
              value={webhookSecret}
              placeholder={WEBHOOK_SECRET_PLACEHOLDER}
              onChange={setWebhookSecret}
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSaving}
              icon={isSaving ? <Spinner size="sm" /> : undefined}
            >
              {t('ADMIN.SETTINGS.SUBMIT')}
            </Button>
          </form>

          <section className={`${styles.card} ${styles.hint}`}>
            <span className={styles.cardTitle}>{t('ADMIN.SETTINGS.HINT_TITLE')}</span>
            <p className={styles.hintText}>
              {t('ADMIN.SETTINGS.HINT_KEYS')}{' '}
              <a
                className={styles.hintLink}
                href={STRIPE_KEYS_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                dashboard.stripe.com/test/apikeys
              </a>
            </p>
            <p className={styles.hintText}>{t('ADMIN.SETTINGS.HINT_WEBHOOK')}</p>
            <div className={styles.copyRow}>
              <code className={styles.copyField}>{WEBHOOK_URL}</code>
              <IconButton ariaLabel={t('ADMIN.SETTINGS.COPY')} onClick={handleCopy}>
                <Copy size={ICON_SIZE} />
              </IconButton>
            </div>
          </section>
        </div>
      )}

      <FormModal
        isOpen={isDisconnectOpen}
        title={t('ADMIN.SETTINGS.DISCONNECT_TITLE')}
        submitText={t('ADMIN.SETTINGS.CONFIRM_DISCONNECT')}
        isLoading={isDisconnecting}
        onClose={() => setIsDisconnectOpen(false)}
        onSubmit={handleDisconnect}
      >
        <Text variant="muted">{t('ADMIN.SETTINGS.DISCONNECT_TEXT')}</Text>
      </FormModal>
    </div>
  );
}
