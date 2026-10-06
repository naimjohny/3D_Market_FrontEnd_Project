/** Секция-манифест: HUD-лейбл и крупная дисплейная фраза с каскадным появлением слов. */

import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { RevealText } from '@shared/components/RevealText/RevealText';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import styles from './ManifestoSection.module.scss';

export function ManifestoSection(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className={styles.manifesto}>
      <SectionLabel>{t('HOME.MANIFESTO.LABEL')}</SectionLabel>
      <RevealText text={t('HOME.MANIFESTO.TEXT')} className={styles.text} />
    </section>
  );
}
