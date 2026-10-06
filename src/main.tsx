/** Точка входа: локаль из URL-префикса (/ru, /en, …), шрифты, стили, i18n, роутер с basename. */

import '@fontsource-variable/unbounded/index.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import '@styles/index.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import {
  localeFromPath,
  LocalesMeta,
  matchBrowserLocale,
} from '@app/config/locale.config';
import { initI18n } from '@app/i18n/i18n';
import { StorageService } from '@app/services/storage.service';
import { App } from './App';

const resolveLocale = (): ReturnType<typeof matchBrowserLocale> => {
  const fromPath = localeFromPath(window.location.pathname);
  if (fromPath !== null) return fromPath;
  const saved = StorageService.getLanguage();
  const target = saved ?? matchBrowserLocale(navigator.languages);
  const { pathname, search, hash } = window.location;
  window.history.replaceState(null, '', `/${target}${pathname === '/' ? '' : pathname}${search}${hash}`);
  return target;
};

const locale = resolveLocale();
StorageService.setLanguage(locale);
document.documentElement.lang = locale;
document.documentElement.dir = LocalesMeta[locale].dir;
initI18n(locale);

const rootElement = document.getElementById('root');

if (rootElement !== null) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename={`/${locale}`}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
