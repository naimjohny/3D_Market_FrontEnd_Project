/**
 * Пострендер SEO-слоя. Запускается после `vite build`:
 * читает dist/index.html как шаблон и для каждой локали × маршрута
 * (11 локалей × (4 статических + 10 продуктовых) = 154 страницы) пишет
 * dist/<locale>/<route>/index.html с локализованными <title>, meta description,
 * og:*, twitter:*, canonical и hreflang-альтернативами, плюс dist/sitemap.xml.
 *
 * Без зависимостей, Node ESM. Идемпотентен: шаблон не мутирует, страницы
 * перезаписываются целиком. При отсутствии ключа перевода — падает с ошибкой.
 *
 * SEO_LOCALES_DIR (env) — переопределение каталога переводов, только для тестов.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const LOCALES_DIR = process.env.SEO_LOCALES_DIR ?? path.join(ROOT, 'src/app/i18n/locales');
const LOCALE_CONFIG = path.join(ROOT, 'src/app/config/locale.config.ts');
const PRODUCTS_DATA = path.join(ROOT, 'src/app/data/products.data.ts');

const SITE = 'https://forma3d-studio.netlify.app';
const SITE_NAME = 'FORMA³';
const OG_IMAGE = `${SITE}/og-cover.png`;
const X_DEFAULT_LOCALE = 'en';
const EXPECTED_LOCALES = 11;
const EXPECTED_PRODUCTS = 10;

/** og:locale по коду языка. */
const OG_LOCALE = {
  ru: 'ru_RU',
  en: 'en_US',
  es: 'es_ES',
  de: 'de_DE',
  pl: 'pl_PL',
  tg: 'tg_TJ',
  kk: 'kk_KZ',
  fa: 'fa_IR',
  ar: 'ar_AR',
  ko: 'ko_KR',
  zh: 'zh_CN',
};

const fail = (message) => {
  console.error(`[prerender-seo] ОШИБКА: ${message}`);
  process.exit(1);
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

/** Локали (код + направление письма) из locale.config.ts. */
const parseLocales = () => {
  const source = readFileSync(LOCALE_CONFIG, 'utf8');
  const locales = [];
  const re = /\{\s*code:\s*'([a-z]+)',\s*nativeName:\s*'[^']+',\s*dir:\s*'(ltr|rtl)'\s*\}/g;
  for (const match of source.matchAll(re)) {
    locales.push({ code: match[1], dir: match[2] });
  }
  if (locales.length !== EXPECTED_LOCALES) {
    fail(
      `из ${LOCALE_CONFIG} извлечено ${locales.length} локалей вместо ${EXPECTED_LOCALES} — проверь формат LocalesMeta`,
    );
  }
  return locales;
};

/** Продукты (id маршрута + ключ перевода) из products.data.ts. */
const parseProducts = () => {
  const source = readFileSync(PRODUCTS_DATA, 'utf8');
  const products = [];
  const re = /id:\s*'([a-z0-9-]+)',\s*key:\s*'([A-Z0-9_]+)'/g;
  for (const match of source.matchAll(re)) {
    products.push({ id: match[1], key: match[2] });
  }
  if (products.length !== EXPECTED_PRODUCTS) {
    fail(
      `из ${PRODUCTS_DATA} извлечено ${products.length} продуктов вместо ${EXPECTED_PRODUCTS} — проверь формат ProductsData`,
    );
  }
  return products;
};

const readTranslations = (code) => {
  const file = path.join(LOCALES_DIR, `${code}.json`);
  if (!existsSync(file)) fail(`нет файла переводов ${file}`);
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return fail(`битый JSON в ${file}: ${error.message}`);
  }
};

const metaOf = (code, translations, key) => {
  const value = translations.META?.[key];
  if (typeof value !== 'string' || value.length === 0) {
    fail(`в src/app/i18n/locales/${code}.json нет ключа META.${key}`);
  }
  return value;
};

const productNameOf = (code, translations, key) => {
  const value = translations.PRODUCTS?.[key]?.NAME;
  if (typeof value !== 'string' || value.length === 0) {
    fail(`в src/app/i18n/locales/${code}.json нет ключа PRODUCTS.${key}.NAME`);
  }
  return value;
};

/** Абсолютный URL страницы: route '' → /<locale>, '/works' → /<locale>/works. */
const urlFor = (code, route) => `${SITE}/${code}${route}`;

/** hreflang-альтернативы (11 локалей + x-default) для <head>. */
const alternateLinks = (locales, route) => {
  const links = locales.map(
    ({ code }) => `<link rel="alternate" hreflang="${code}" href="${urlFor(code, route)}" />`,
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${urlFor(X_DEFAULT_LOCALE, route)}" />`,
  );
  return links;
};

/** Собирает head-блок страницы: description, canonical, og, twitter, hreflang. */
const seoBlock = ({ locale, locales, route, title, description }) => {
  const url = urlFor(locale.code, route);
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const lines = [
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[locale.code]}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...alternateLinks(locales, route),
  ];
  return lines.map((line) => `    ${line}`).join('\n');
};

/** Чистит шаблон от дефолтных SEO-тегов, меняет lang/dir и title, вставляет блок. */
const renderPage = (template, { locale, title, block }) => {
  let html = template;

  html = html.replace(/<html[^>]*>/, `<html lang="${locale.code}" dir="${locale.dir}">`);
  if (!html.includes(`lang="${locale.code}"`)) fail('в шаблоне dist/index.html не найден тег <html>');

  if (!/<title>[\s\S]*?<\/title>/.test(html)) fail('в шаблоне dist/index.html не найден <title>');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  html = html
    .replace(/[ \t]*<meta\s+name="description"[^>]*>\n?/g, '')
    .replace(/[ \t]*<meta\s+property="og:[^"]*"[^>]*>\n?/g, '')
    .replace(/[ \t]*<meta\s+name="twitter:[^"]*"[^>]*>\n?/g, '')
    .replace(/[ \t]*<link\s+rel="canonical"[^>]*>\n?/g, '')
    .replace(/[ \t]*<link\s+rel="alternate"[^>]*>\n?/g, '');

  if (!html.includes('</head>')) fail('в шаблоне dist/index.html не найден </head>');
  return html.replace(/[ \t]*<\/head>/, `${block}\n  </head>`);
};

const buildSitemap = (locales, routes, buildDate) => {
  const entries = [];
  for (const route of routes) {
    for (const { code } of locales) {
      const links = alternateLinks(locales, route.path)
        .map((link) => `    ${link.replace(' />', '/>').replace('<link rel=', '<xhtml:link rel=')}`)
        .join('\n');
      entries.push(
        [
          '  <url>',
          `    <loc>${urlFor(code, route.path)}</loc>`,
          `    <lastmod>${buildDate}</lastmod>`,
          links,
          '  </url>',
        ].join('\n'),
      );
    }
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
};

const main = () => {
  const templatePath = path.join(DIST, 'index.html');
  if (!existsSync(templatePath)) {
    fail(`нет ${templatePath} — сначала выполни vite build`);
  }
  const template = readFileSync(templatePath, 'utf8');

  const locales = parseLocales();
  const products = parseProducts();

  const staticRoutes = [
    { path: '', titleKey: 'HOME_TITLE', descKey: 'HOME_DESC' },
    { path: '/works', titleKey: 'WORKS_TITLE', descKey: 'WORKS_DESC' },
    { path: '/order', titleKey: 'ORDER_TITLE', descKey: 'ORDER_DESC' },
    { path: '/lab', titleKey: 'LAB_TITLE', descKey: 'LAB_DESC' },
  ];
  const productRoutes = products.map(({ id, key }) => ({ path: `/works/${id}`, productKey: key }));
  const routes = [...staticRoutes, ...productRoutes];

  let written = 0;
  for (const locale of locales) {
    const translations = readTranslations(locale.code);

    for (const route of routes) {
      let title;
      let description;
      if (route.productKey === undefined) {
        title = metaOf(locale.code, translations, route.titleKey);
        description = metaOf(locale.code, translations, route.descKey);
      } else {
        const name = productNameOf(locale.code, translations, route.productKey);
        title = metaOf(locale.code, translations, 'PRODUCT_TITLE').replaceAll('{{name}}', name);
        description = metaOf(locale.code, translations, 'PRODUCT_DESC').replaceAll('{{name}}', name);
      }

      const block = seoBlock({ locale, locales, route: route.path, title, description });
      const html = renderPage(template, { locale, title, block });

      const outDir = path.join(DIST, locale.code, ...route.path.split('/').filter(Boolean));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, 'index.html'), html);
      written += 1;
    }
  }

  const buildDate = new Date().toISOString().slice(0, 10);
  writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(locales, routes, buildDate));

  const expected = locales.length * routes.length;
  if (written !== expected) fail(`записано ${written} страниц вместо ${expected}`);
  console.log(`[prerender-seo] готово: ${written} страниц + sitemap.xml (${buildDate})`);
};

main();
