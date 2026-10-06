/** SEO-мета страницы: title, description, OG/Twitter, canonical и hreflang на 11 локалей. */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { AppConfig } from '@app/config/app.config';
import { LocalesList, isLocale } from '@app/config/locale.config';

interface PageMetaInterface {
  readonly title: string;
  readonly description: string;
  readonly image?: string;
}

const DEFAULT_OG_IMAGE = '/og.png';
const HREFLANG_DEFAULT = 'en';

const upsertMeta = (attr: 'name' | 'property', key: string, content: string): void => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (tag === null) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string, hreflang?: string): void => {
  const selector = hreflang === undefined ? `link[rel="${rel}"]` : `link[rel="${rel}"][hreflang="${hreflang}"]`;
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (tag === null) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    if (hreflang !== undefined) tag.setAttribute('hreflang', hreflang);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

export const usePageMeta = ({ title, description, image }: PageMetaInterface): void => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const locale = isLocale(i18n.language) ? i18n.language : HREFLANG_DEFAULT;
    const path = pathname === '/' ? '' : pathname;
    const pageUrl = `${AppConfig.siteUrl}/${locale}${path}`;
    const imageUrl = `${AppConfig.siteUrl}${image ?? DEFAULT_OG_IMAGE}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', pageUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:site_name', 'FORMA³');
    upsertMeta('property', 'og:locale', locale);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertLink('canonical', pageUrl);

    for (const alt of LocalesList) {
      upsertLink('alternate', `${AppConfig.siteUrl}/${alt}${path}`, alt);
    }
    upsertLink('alternate', `${AppConfig.siteUrl}/${HREFLANG_DEFAULT}${path}`, 'x-default');
  }, [title, description, image, pathname, i18n.language]);
};
