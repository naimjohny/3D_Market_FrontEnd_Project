/** Свой fetch-клиент (без axios/ky): base URL, JSON, типизированные ошибки, AbortSignal. Готов под Go-бэкенд. */

import { AppConfig } from '@app/config/app.config';
import { StorageService } from '@app/services/storage.service';

interface RequestOptionsInterface {
  readonly params?: Record<string, string | number | boolean | null | undefined>;
  readonly json?: unknown;
  readonly signal?: AbortSignal;
  readonly headers?: Record<string, string>;
}

export type HttpErrorType = Error & { readonly status: number; readonly body: unknown };

export const isHttpError = (e: unknown): e is HttpErrorType =>
  e instanceof Error && typeof (e as Partial<HttpErrorType>).status === 'number' && 'body' in e;

const HTTP_NO_CONTENT = 204;

const buildUrl = (path: string, params?: RequestOptionsInterface['params']): string => {
  const url = new URL(path.replace(/^\//, ''), `${AppConfig.apiBaseUrl.replace(/\/$/, '')}/`);
  if (params !== undefined) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
};

const request = async <T>(
  method: string,
  path: string,
  options: RequestOptionsInterface = {},
): Promise<T> => {
  const token = StorageService.getAdminToken();
  const response = await fetch(buildUrl(path, options.params), {
    method,
    headers: {
      ...(options.json === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token === null ? {} : { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.json === undefined ? undefined : JSON.stringify(options.json),
    signal: options.signal,
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw Object.assign(new Error(`HTTP ${response.status}`), {
      status: response.status,
      body,
    }) as HttpErrorType;
  }
  return response.status === HTTP_NO_CONTENT ? (undefined as T) : (response.json() as Promise<T>);
};

export const http = {
  get: <T>(path: string, options?: RequestOptionsInterface): Promise<T> =>
    request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptionsInterface): Promise<T> =>
    request<T>('POST', path, options),
  put: <T>(path: string, options?: RequestOptionsInterface): Promise<T> =>
    request<T>('PUT', path, options),
  patch: <T>(path: string, options?: RequestOptionsInterface): Promise<T> =>
    request<T>('PATCH', path, options),
  delete: <T>(path: string, options?: RequestOptionsInterface): Promise<T> =>
    request<T>('DELETE', path, options),
};
