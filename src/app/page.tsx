import type { Metadata } from 'next';
import { defaultLocale, htmlLang, localeLabel, locales } from '@/i18n/config';
import { routes } from '@/i18n/routes';
import { languageAlternates } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export const metadata: Metadata = {
  title: site.name,
  robots: { index: false, follow: true },
  alternates: {
    canonical: absoluteUrl(routes.home(defaultLocale)),
    languages: languageAlternates(''),
  },
};

/**
 * A static host cannot negotiate languages, so `/` is a tiny page that forwards the
 * visitor: by browser language when scripts run, to English otherwise (meta refresh),
 * and with plain links as the last resort. Hosts that support redirect rules can skip
 * this page entirely (see docs/DEPLOYMENT.md).
 */
const redirectScript = `(function(){try{var l=(navigator.language||'').toLowerCase();location.replace(l.indexOf('pt')===0?'/pt-br/':'/en/')}catch(e){location.replace('/en/')}})()`;

export default function RootPage() {
  return (
    <html lang={htmlLang[defaultLocale]}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
        <meta httpEquiv="refresh" content={`0; url=${routes.home(defaultLocale)}`} />
      </head>
      <body>
        <main>
          <h1>{site.name}</h1>
          <ul>
            {locales.map((locale) => (
              <li key={locale}>
                <a href={routes.home(locale)} lang={htmlLang[locale]} hrefLang={htmlLang[locale]}>
                  {localeLabel[locale].name}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
