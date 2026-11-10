import type { Metadata } from 'next';
import { htmlLang, locales, openGraphLocale, type Locale } from '@/i18n/config';
import { absoluteUrl, site } from './site';

export interface PageSeo {
  readonly locale: Locale;
  /** Locale-independent path with a trailing slash, e.g. `projects/` ('' for the home page). */
  readonly path: string;
  readonly title: string;
  readonly description: string;
  /** Alternative text of the social image. */
  readonly imageAlt: string;
  /** The home page uses its title as is; other pages get the site name appended. */
  readonly absoluteTitle?: boolean;
}

/** hreflang map for a path: every locale plus `x-default`, which points at English. */
export function languageAlternates(path: string): Record<string, string> {
  const entries = locales.map((locale) => [htmlLang[locale], absoluteUrl(`/${locale}/${path}`)]);
  return { ...Object.fromEntries(entries), 'x-default': absoluteUrl(`/en/${path}`) };
}

/**
 * Builds the complete metadata for a page: canonical URL, hreflang alternates, Open Graph
 * and Twitter cards. Every page goes through here so none can forget a tag.
 */
export function pageMetadata(seo: PageSeo): Metadata {
  const url = absoluteUrl(`/${seo.locale}/${seo.path}`);
  const fullTitle = seo.absoluteTitle ? seo.title : `${seo.title} — ${site.name}`;
  const image = {
    url: absoluteUrl(`/og/${seo.locale}.png`),
    width: 1200,
    height: 630,
    alt: seo.imageAlt,
  };

  return {
    title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(seo.path),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: site.name,
      title: fullTitle,
      description: seo.description,
      locale: openGraphLocale[seo.locale],
      alternateLocale: locales
        .filter((locale) => locale !== seo.locale)
        .map((locale) => openGraphLocale[locale]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: [image],
    },
  };
}
