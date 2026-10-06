/** Форма заявки на кастомный 3D: контакты, дроп-зона с локальным 3D-превью и экран успеха. */

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactElement,
} from 'react';
import { CheckCircle2, Upload } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { OrderResponseInterface } from '@app/models/order/order.interface';
import { EaseOutExpo } from '@app/models/ui/layout.interface';
import type {
  OrderAttachmentInterface,
  OrderFormErrorsInterface,
  OrderFormPropsInterface,
} from '@app/models/ui/order-page.interface';
import type { LoadedModelInterface } from '@app/models/ui/three.interface';
import type { ViewerSettingsInterface } from '@app/models/viewer/viewer.interface';
import { ViewerEnvs } from '@app/models/viewer/viewer.type';
import { OrderService } from '@app/services/order.service';
import { useUiStore } from '@app/store/ui.store';
import { formatBytes, formatCompact } from '@app/utils/format.util';
import { Button } from '@shared/components/Button/Button';
import { Chip } from '@shared/components/Chip/Chip';
import { Input } from '@shared/components/Input/Input';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { Text } from '@shared/components/Text/Text';
import { Textarea } from '@shared/components/Textarea/Textarea';
import { Title } from '@shared/components/Title/Title';
import { ModelViewer } from '@shared/three/ModelViewer';
import { getModelExt, loadModelFromFile } from '@shared/three/utils/model-loader.util';
import styles from './OrderForm.module.scss';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE_ACCEPT = '.glb,.gltf,.fbx,.obj,.stl,image/*';
const MESSAGE_ROWS = 5;
const UPLOAD_ICON_SIZE = 20;
const SUCCESS_ICON_SIZE = 48;
const SWAP_DURATION_S = 0.45;

const VIEWER_SETTINGS: ViewerSettingsInterface = {
  env: ViewerEnvs.Studio,
  wireframe: false,
  autoRotate: true,
  grid: false,
  shadows: true,
};

export function OrderForm({ calc }: OrderFormPropsInterface): ReactElement {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<OrderFormErrorsInterface>({});
  const [attachment, setAttachment] = useState<OrderAttachmentInterface | null>(null);
  const [model, setModel] = useState<LoadedModelInterface | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<OrderResponseInterface | null>(null);

  const handleFile = (file: File): void => {
    setAttachment({ fileName: file.name, sizeBytes: file.size });
    setModel(null);
    if (getModelExt(file.name) === null) return;
    setLoadingFile(true);
    loadModelFromFile(file)
      .then(setModel)
      .catch(() => pushToast('error', t('LAB.ERROR_LOAD')))
      .finally(() => setLoadingFile(false));
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file !== undefined) handleFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file !== undefined) handleFile(file);
    event.target.value = '';
  };

  const validate = (): OrderFormErrorsInterface => ({
    ...(name.trim() === '' ? { name: t('ORDER.FORM.REQUIRED') } : {}),
    ...(email.trim() === '' ? { email: t('ORDER.FORM.REQUIRED') } : {}),
    ...(email.trim() !== '' && !EMAIL_PATTERN.test(email.trim())
      ? { email: t('ORDER.FORM.INVALID_EMAIL') }
      : {}),
    ...(message.trim() === '' ? { message: t('ORDER.FORM.REQUIRED') } : {}),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSending(true);
    void OrderService.submit({
      ...calc,
      name: name.trim(),
      email: email.trim(),
      contact: contact.trim(),
      message: message.trim(),
      fileName: attachment?.fileName ?? null,
    })
      .then((response) => {
        setResult(response);
        pushToast('success', t('TOASTS.ORDER_SENT'));
      })
      .catch(() => pushToast('error', t('TOASTS.ORDER_FAILED')))
      .finally(() => setSending(false));
  };

  return (
    <section className={styles.card}>
      <AnimatePresence mode="wait">
        {result === null ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: SWAP_DURATION_S, ease: EaseOutExpo }}
          >
            <div className={styles.head}>
              <SectionLabel>{t('ORDER.FORM.LABEL')}</SectionLabel>
              <Title level={3}>{t('ORDER.FORM.TITLE')}</Title>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Input
                label={t('ORDER.FORM.NAME')}
                name="order-name"
                value={name}
                onChange={setName}
                required
                error={errors.name}
              />
              <Input
                label={t('ORDER.FORM.EMAIL')}
                name="order-email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                error={errors.email}
              />
              <Input
                label={t('ORDER.FORM.CONTACT')}
                name="order-contact"
                type="tel"
                value={contact}
                onChange={setContact}
              />
              <Textarea
                label={t('ORDER.FORM.MESSAGE')}
                name="order-message"
                value={message}
                onChange={setMessage}
                placeholder={t('ORDER.FORM.MESSAGE_PLACEHOLDER')}
                rows={MESSAGE_ROWS}
                required
                error={errors.message}
              />

              <div className={styles.fileBlock}>
                <label className={styles.fileLabel} htmlFor="order-file">
                  {t('ORDER.FORM.FILE')}
                </label>
                <div
                  className={[styles.zone, dragOver && styles.dragOver].filter(Boolean).join(' ')}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <Upload size={UPLOAD_ICON_SIZE} className={styles.zoneIcon} aria-hidden="true" />
                  <Text variant="muted" align="center">
                    {t('ORDER.FORM.FILE_HINT')}
                  </Text>
                  <input
                    ref={fileInputRef}
                    id="order-file"
                    name="order-file"
                    type="file"
                    accept={FILE_ACCEPT}
                    className={styles.hiddenInput}
                    onChange={handleInputChange}
                  />
                  <Chip onClick={() => fileInputRef.current?.click()}>{t('LAB.BROWSE')}</Chip>
                </div>

                {loadingFile && (
                  <div className={styles.loading}>
                    <Spinner size="sm" />
                  </div>
                )}

                {model !== null && (
                  <div className={styles.preview}>
                    <ModelViewer
                      object={model.object}
                      settings={VIEWER_SETTINGS}
                      demoKind={null}
                      className={styles.canvas}
                    />
                  </div>
                )}

                {attachment !== null && (
                  <div className={styles.fileMeta}>
                    <Chip>{attachment.fileName}</Chip>
                    {model !== null && (
                      <>
                        <Chip>{`${formatCompact(model.stats.vertices)} VERT`}</Chip>
                        <Chip>{`${formatCompact(model.stats.triangles)} TRI`}</Chip>
                      </>
                    )}
                    <Chip>{formatBytes(attachment.sizeBytes)}</Chip>
                  </div>
                )}

                <Text variant="dim" className={styles.privacy}>
                  {t('LAB.PRIVACY')}
                </Text>
              </div>

              <Button variant="primary" size="lg" fullWidth type="submit" disabled={sending}>
                {sending ? t('ORDER.FORM.SENDING') : t('ORDER.FORM.SUBMIT')}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className={styles.success}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: SWAP_DURATION_S, ease: EaseOutExpo }}
          >
            <CheckCircle2 size={SUCCESS_ICON_SIZE} className={styles.successIcon} aria-hidden="true" />
            <Title level={3} align="center">
              {t('ORDER.FORM.SUCCESS_TITLE')}
            </Title>
            <Text variant="muted" align="center">
              {t('ORDER.FORM.SUCCESS_TEXT')}
            </Text>
            <Text variant="mono" className={styles.orderId}>{`ID: ${result.id}`}</Text>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
