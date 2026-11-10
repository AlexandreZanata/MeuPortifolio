import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button-link';
import { Mark } from '@/components/ui/icons';
import { defaultLocale, htmlLang, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';
import { site } from '@/lib/site';
import { fontVariables } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: `404 — ${site.name}`,
  robots: { index: false, follow: false },
};

/**
 * Exported as `404.html`. A static host serves it for any unknown URL, so it cannot know
 * the visitor's language: it shows both.
 */
export default function NotFound() {
  return (
    <html lang={htmlLang[defaultLocale]} className={fontVariables}>
      <body>
        <main className="container-page flex min-h-dvh flex-col justify-center py-20">
          <p className="flex items-center gap-3 label text-ink-muted">
            <Mark className="size-6" />
            404
          </p>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {locales.map((locale) => {
              const dict = getDictionary(locale);
              return (
                <section key={locale} lang={htmlLang[locale]} className="border-t border-ink pt-6">
                  <h1 className="display text-title-1">{dict.notFound.title}</h1>
                  <p className="mt-4 text-lede text-ink-soft">{dict.notFound.body}</p>
                  <ButtonLink href={routes.home(locale)} className="mt-8">
                    {dict.notFound.cta}
                  </ButtonLink>
                </section>
              );
            })}
          </div>
        </main>
      </body>
    </html>
  );
}
