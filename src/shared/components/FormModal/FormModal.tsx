/** Модальное окно с формой: сабмит через футер-кнопку и спиннер в состоянии загрузки. */

import type { FormEvent, ReactElement } from 'react';
import type { FormModalPropsInterface } from '@app/models/ui/atoms.interface';
import { BaseModal } from '../BaseModal/BaseModal';
import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';
import styles from './FormModal.module.scss';

export function FormModal({
  isOpen,
  onClose,
  children,
  title,
  size,
  onSubmit,
  submitText,
  isLoading = false,
}: FormModalPropsInterface): ReactElement {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {children}
        <div className={styles.footer}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            icon={isLoading ? <Spinner size="sm" /> : undefined}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
