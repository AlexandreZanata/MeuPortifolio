import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { htmlLang } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { generateLocaleParams, resolveLocale, type LocaleParams } from '@/i18n/params';
import { site } from '@/lib/site';
import { fontVariables } from '../fonts';
import '../globals.css';

// Only the listed locales exist; anything else is a 404 at build time, not a runtime route.
export const dynamicParams = false;
export const generateStaticParams = generateLocaleParams;

export const viewport: Viewport = {
  themeColor: '#f5f0e6',
  colorScheme: 'light',
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const dict = getDictionary(await resolveLocale(params));
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.siteTitle, template: `%s — ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <head>
        {/*
          Holds the first paint until the footer has been parsed, so the page appears whole
          instead of header-first. Without it the largest text can land in a second frame,
          which delays Largest Contentful Paint. Browsers that do not know `rel="expect"`
          ignore the link.
        */}
        <link rel="expect" href="#site-footer" {...{ blocking: 'render' }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-sm bg-ink px-4 py-3 font-medium text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          {dict.a11y.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}
