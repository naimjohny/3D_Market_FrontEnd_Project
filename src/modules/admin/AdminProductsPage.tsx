/** Страница каталога админки: таблица продуктов, создание и правка через FormModal, удаление с подтверждением. */

import { useEffect, useState, type ReactElement } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProductInterface } from '@app/models/products/product.interface';
import { ProductCategories, type ProductCategoryType } from '@app/models/products/product.type';
import { AdminService, isUnauthorizedError } from '@app/services/admin.service';
import { ProductsService } from '@app/services/products.service';
import { useUiStore } from '@app/store/ui.store';
import { makeId } from '@app/utils/id.util';
import { formatPrice } from '@app/utils/price.util';
import { Badge } from '@shared/components/Badge/Badge';
import { Button } from '@shared/components/Button/Button';
import { EmptyState } from '@shared/components/EmptyState/EmptyState';
import { FormModal } from '@shared/components/FormModal/FormModal';
import { IconButton } from '@shared/components/IconButton/IconButton';
import { Input } from '@shared/components/Input/Input';
import { SectionLabel } from '@shared/components/SectionLabel/SectionLabel';
import { Select } from '@shared/components/Select/Select';
import { Spinner } from '@shared/components/Spinner/Spinner';
import { Text } from '@shared/components/Text/Text';
import { Title } from '@shared/components/Title/Title';
import styles from './AdminProductsPage.module.scss';

type ProductModalType = 'create' | 'edit' | 'delete' | null;

const CATEGORY_LIST = Object.values(ProductCategories);
const ICON_SIZE = 16;
const YES = 'yes';
const NO = 'no';
const DEFAULT_POLYCOUNT = 12_000;
const DEFAULT_ACCENT = '#6c5ce7';

const parseAmount = (value: string): number => {
  const amount = Number(value.replace(',', '.'));
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;
};

export function AdminProductsPage(): ReactElement {
  const { t } = useTranslation();
  const pushToast = useUiStore((s) => s.pushToast);
  const [products, setProducts] = useState<readonly ProductInterface[] | null>(null);
  const [modal, setModal] = useState<ProductModalType>(null);
  const [selected, setSelected] = useState<ProductInterface | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formKey, setFormKey] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategoryType>(ProductCategories.Art);
  const [formPrice, setFormPrice] = useState('');
  const [formOldPrice, setFormOldPrice] = useState('');
  const [formFeatured, setFormFeatured] = useState(NO);

  useEffect(() => {
    let alive = true;
    void ProductsService.list().then((items) => {
      if (alive) setProducts(items);
    });
    return () => {
      alive = false;
    };
  }, []);

  const categoryOptions = CATEGORY_LIST.map((category) => ({
    value: category,
    label: t(`WORKS.CATEGORIES.${category.toUpperCase()}`),
  }));

  const featuredOptions = [
    { value: YES, label: t('ADMIN.COMMON.YES') },
    { value: NO, label: t('ADMIN.COMMON.NO') },
  ];

  const closeModal = (): void => {
    setModal(null);
    setSelected(null);
  };

  const openCreate = (): void => {
    setFormKey('');
    setFormCategory(ProductCategories.Art);
    setFormPrice('');
    setFormOldPrice('');
    setFormFeatured(NO);
    setSelected(null);
    setModal('create');
  };

  const openEdit = (product: ProductInterface): void => {
    setFormKey(product.key);
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormOldPrice(product.oldPrice === undefined ? '' : String(product.oldPrice));
    setFormFeatured(product.featured ? YES : NO);
    setSelected(product);
    setModal('edit');
  };

  const openDelete = (product: ProductInterface): void => {
    setSelected(product);
    setModal('delete');
  };

  const failToast = (error: unknown, key: string): void => {
    if (!isUnauthorizedError(error)) pushToast('error', t(key));
  };

  const handleCreate = (): void => {
    const price = parseAmount(formPrice);
    const oldPrice = parseAmount(formOldPrice);
    if (formKey.trim() === '' || price === 0) {
      pushToast('error', t('ADMIN.PRODUCTS.INVALID'));
      return;
    }
    const product: ProductInterface = {
      id: makeId(),
      key: formKey.trim().toUpperCase(),
      category: formCategory,
      model: 'torus',
      price,
      oldPrice: oldPrice > 0 ? oldPrice : undefined,
      polycount: DEFAULT_POLYCOUNT,
      formats: ['GLB'],
      textured: true,
      rigged: false,
      animated: false,
      colors: [DEFAULT_ACCENT],
      accent: DEFAULT_ACCENT,
      featured: formFeatured === YES,
    };
    setIsSaving(true);
    AdminService.createProduct(product)
      .then((created) => {
        setProducts((items) => [...(items ?? []), created]);
        pushToast('success', t('ADMIN.PRODUCTS.CREATED'));
        closeModal();
      })
      .catch((error: unknown) => failToast(error, 'ADMIN.PRODUCTS.SAVE_FAILED'))
      .finally(() => setIsSaving(false));
  };

  const handleEdit = (): void => {
    if (selected === null) return;
    const price = parseAmount(formPrice);
    const oldPrice = parseAmount(formOldPrice);
    if (price === 0) {
      pushToast('error', t('ADMIN.PRODUCTS.INVALID'));
      return;
    }
    const product: ProductInterface = {
      ...selected,
      category: formCategory,
      price,
      oldPrice: oldPrice > 0 ? oldPrice : undefined,
      featured: formFeatured === YES,
    };
    setIsSaving(true);
    AdminService.updateProduct(product)
      .then((updated) => {
        setProducts((items) => items?.map((p) => (p.id === updated.id ? updated : p)) ?? items);
        pushToast('success', t('ADMIN.PRODUCTS.SAVED'));
        closeModal();
      })
      .catch((error: unknown) => failToast(error, 'ADMIN.PRODUCTS.SAVE_FAILED'))
      .finally(() => setIsSaving(false));
  };

  const handleDelete = (): void => {
    if (selected === null) return;
    const { id } = selected;
    setIsSaving(true);
    AdminService.deleteProduct(id)
      .then(() => {
        setProducts((items) => items?.filter((p) => p.id !== id) ?? items);
        pushToast('success', t('ADMIN.PRODUCTS.DELETED'));
        closeModal();
      })
      .catch((error: unknown) => failToast(error, 'ADMIN.PRODUCTS.DELETE_FAILED'))
      .finally(() => setIsSaving(false));
  };

  const formFields = (
    <>
      <Select
        label={t('ADMIN.PRODUCTS.FIELD_CATEGORY')}
        name="product-category"
        value={formCategory}
        options={categoryOptions}
        onChange={(value) => setFormCategory(value as ProductCategoryType)}
      />
      <Input
        label={t('ADMIN.PRODUCTS.FIELD_PRICE')}
        name="product-price"
        value={formPrice}
        required
        onChange={setFormPrice}
      />
      <Input
        label={t('ADMIN.PRODUCTS.FIELD_OLD_PRICE')}
        name="product-old-price"
        value={formOldPrice}
        onChange={setFormOldPrice}
      />
      <Select
        label={t('ADMIN.PRODUCTS.FIELD_FEATURED')}
        name="product-featured"
        value={formFeatured}
        options={featuredOptions}
        onChange={setFormFeatured}
      />
    </>
  );

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <SectionLabel>{t('ADMIN.LOGIN.LABEL')}</SectionLabel>
        <div className={styles.headRow}>
          <Title level={2}>{t('ADMIN.PRODUCTS.TITLE')}</Title>
          <Button variant="secondary" size="sm" icon={<Plus size={ICON_SIZE} />} onClick={openCreate}>
            {t('ADMIN.PRODUCTS.ADD')}
          </Button>
        </div>
      </header>

      {products === null && (
        <div className={styles.loader}>
          <Spinner size="lg" />
        </div>
      )}

      {products !== null && products.length === 0 && (
        <EmptyState title={t('ADMIN.PRODUCTS.EMPTY')} />
      )}

      {products !== null && products.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('ADMIN.PRODUCTS.TH_KEY')}</th>
                <th>{t('ADMIN.PRODUCTS.TH_CATEGORY')}</th>
                <th>{t('ADMIN.PRODUCTS.TH_PRICE')}</th>
                <th>{t('ADMIN.PRODUCTS.TH_OLD_PRICE')}</th>
                <th>{t('ADMIN.PRODUCTS.TH_FEATURED')}</th>
                <th>{t('ADMIN.PRODUCTS.TH_ACTIONS')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.mono}>{product.key}</td>
                  <td>{t(`WORKS.CATEGORIES.${product.category.toUpperCase()}`)}</td>
                  <td className={styles.sum}>{formatPrice(product.price)}</td>
                  <td className={styles.sum}>
                    {product.oldPrice === undefined ? '—' : formatPrice(product.oldPrice)}
                  </td>
                  <td>
                    <Badge kind={product.featured ? 'success' : 'default'}>
                      {product.featured ? t('ADMIN.COMMON.YES') : t('ADMIN.COMMON.NO')}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <IconButton
                        ariaLabel={t('ADMIN.PRODUCTS.EDIT')}
                        onClick={() => openEdit(product)}
                      >
                        <Pencil size={ICON_SIZE} />
                      </IconButton>
                      <IconButton
                        ariaLabel={t('ADMIN.PRODUCTS.DELETE')}
                        onClick={() => openDelete(product)}
                      >
                        <Trash2 size={ICON_SIZE} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormModal
        isOpen={modal === 'create'}
        title={t('ADMIN.PRODUCTS.CREATE_TITLE')}
        submitText={t('ADMIN.PRODUCTS.CREATE')}
        isLoading={isSaving}
        onClose={closeModal}
        onSubmit={handleCreate}
      >
        <Input
          label={t('ADMIN.PRODUCTS.FIELD_KEY')}
          name="product-key"
          value={formKey}
          required
          onChange={setFormKey}
        />
        {formFields}
      </FormModal>

      <FormModal
        isOpen={modal === 'edit'}
        title={t('ADMIN.PRODUCTS.EDIT_TITLE')}
        submitText={t('ADMIN.PRODUCTS.SAVE')}
        isLoading={isSaving}
        onClose={closeModal}
        onSubmit={handleEdit}
      >
        {formFields}
      </FormModal>

      <FormModal
        isOpen={modal === 'delete'}
        title={t('ADMIN.PRODUCTS.DELETE_TITLE')}
        submitText={t('ADMIN.PRODUCTS.CONFIRM_DELETE')}
        isLoading={isSaving}
        onClose={closeModal}
        onSubmit={handleDelete}
      >
        <Text variant="muted">
          {t('ADMIN.PRODUCTS.DELETE_TEXT', { key: selected?.key ?? '' })}
        </Text>
      </FormModal>
    </div>
  );
}
