/** Страница входа в админку: центрированная форма email + пароль с ошибкой при 401. */

import { useState, type FormEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router';
import { AppRoutes } from '@app/config/router.config';
import { AdminService, isUnauthorizedError } from '@app/services/admin.service';
import { useAuthStore } from '@app/store/auth.store';
import { Button } from '@shared/components/Button/Button';
import { Input } from '@shared/components/Input/Input';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { Title } from '@shared/components/Title/Title';
import styles from './AdminLoginPage.module.scss';

export function AdminLoginPage(): ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthed) return <Navigate to={AppRoutes.admin.root} replace />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    AdminService.login({ email, password })
      .then((response) => {
        login(response.token);
        void navigate(AppRoutes.admin.orders, { replace: true });
      })
      .catch((requestError: unknown) => {
        setError(
          isUnauthorizedError(requestError)
            ? t('ADMIN.LOGIN.ERROR_AUTH')
            : t('ADMIN.LOGIN.ERROR_GENERIC'),
        );
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <SectionLabel>{t('ADMIN.LOGIN.LABEL')}</SectionLabel>
        <Title level={3}>{t('ADMIN.LOGIN.TITLE')}</Title>
        <Input
          label={t('ADMIN.LOGIN.EMAIL')}
          name="admin-email"
          type="email"
          value={email}
          required
          onChange={setEmail}
        />
        <Input
          label={t('ADMIN.LOGIN.PASSWORD')}
          name="admin-password"
          type="password"
          value={password}
          required
          error={error ?? undefined}
          onChange={setPassword}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          icon={isLoading ? <Spinner size="sm" /> : undefined}
        >
          {t('ADMIN.LOGIN.SUBMIT')}
        </Button>
      </form>
    </div>
  );
}
