import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from './config';

/** Props of every page and layout under `app/[locale]`. Next passes params as a promise. */
export interface LocaleParams {
  readonly params: Promise<{ locale: string }>;
}

/** Narrows the raw route segment to a `Locale`, or renders the 404 page. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function generateLocaleParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}
