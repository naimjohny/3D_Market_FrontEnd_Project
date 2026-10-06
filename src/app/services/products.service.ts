/** Сервис каталога: Go-API с фолбэком на локальные данные — сайт обязан работать и без бэкенда. */

import { http } from '@app/api/http.client';
import { ApiRoutes } from '@app/config/api-routes.config';
import { AppConfig } from '@app/config/app.config';
import { ProductsData } from '@app/data/products.data';
import type { ProductInterface } from '@app/models/products/product.interface';
import type { ProductCategoryType } from '@app/models/products/product.type';

const RELATED_LIMIT = 3;

const filterByCategory = (
  products: readonly ProductInterface[],
  category?: ProductCategoryType | null,
): readonly ProductInterface[] =>
  category === undefined || category === null
    ? products
    : products.filter((p) => p.category === category);

const pickRelated = (
  products: readonly ProductInterface[],
  id: string,
): readonly ProductInterface[] => {
  const current = products.find((p) => p.id === id);
  const pool = products.filter((p) => p.id !== id);
  const sameCategory = pool.filter((p) => p.category === current?.category);
  const rest = pool.filter((p) => p.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, RELATED_LIMIT);
};

let apiListCache: readonly ProductInterface[] | null = null;

const fetchAll = async (): Promise<readonly ProductInterface[]> => {
  if (AppConfig.useMocks) return ProductsData;
  try {
    apiListCache = await http.get<readonly ProductInterface[]>(ApiRoutes.products);
    return apiListCache;
  } catch (error) {
    console.warn('ProductsService: API недоступен, фолбэк на локальный каталог', error);
    return apiListCache ?? ProductsData;
  }
};

export const ProductsService = {
  list: (category?: ProductCategoryType | null): Promise<readonly ProductInterface[]> =>
    fetchAll().then((products) => filterByCategory(products, category)),

  featured: (): Promise<readonly ProductInterface[]> =>
    fetchAll().then((products) => products.filter((p) => p.featured)),

  get: async (id: string): Promise<ProductInterface | null> => {
    if (AppConfig.useMocks) return ProductsData.find((p) => p.id === id) ?? null;
    try {
      return await http.get<ProductInterface>(ApiRoutes.product(id));
    } catch (error) {
      console.warn('ProductsService: API недоступен, фолбэк на локальный каталог', error);
      return ProductsData.find((p) => p.id === id) ?? null;
    }
  },

  related: (id: string): Promise<readonly ProductInterface[]> =>
    fetchAll().then((products) => pickRelated(products, id)),

  byId: (id: string): ProductInterface | null => ProductsData.find((p) => p.id === id) ?? null,

  byIdCached: (id: string): ProductInterface | null =>
    (apiListCache ?? ProductsData).find((p) => p.id === id) ?? null,
};
