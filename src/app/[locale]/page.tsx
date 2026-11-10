import type { Metadata } from 'next';
import { JsonLd } from '@/components/ui/json-ld';
import { profile } from '@/content/profile';
import { AboutTeaser, ContactCallout } from '@/features/home/closing';
import { Hero } from '@/features/home/hero';
import { OpenSourceBand } from '@/features/home/open-source-band';
import { SelectedWork } from '@/features/home/selected-work';
import { htmlLang } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { resolveLocale, type LocaleParams } from '@/i18n/params';
import { routes } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, site } from '@/lib/site';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: '',
    title: dict.meta.siteTitle,
    description: dict.meta.description,
    imageAlt: dict.meta.ogAlt,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': `${site.url}/#person`,
              name: profile.name,
              url: site.url,
              jobTitle: dict.resume.headline,
              sameAs: [profile.github.url, profile.organization.url],
            },
            {
              '@type': 'WebSite',
              '@id': `${site.url}/#website`,
              url: absoluteUrl(routes.home(locale)),
              name: site.name,
              description: dict.meta.description,
              inLanguage: htmlLang[locale],
              author: { '@id': `${site.url}/#person` },
            },
          ],
        }}
      />
      <Hero locale={locale} dict={dict} />
      <SelectedWork locale={locale} dict={dict} />
      <OpenSourceBand locale={locale} dict={dict} />
      <AboutTeaser locale={locale} dict={dict} />
      <ContactCallout locale={locale} dict={dict} />
    </>
  );
}
