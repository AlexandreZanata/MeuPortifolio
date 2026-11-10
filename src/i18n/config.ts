export const locales = ['en', 'pt-br'] as const;

export type Locale = (typeof locales)[number];

/** A value that must exist in every locale. Missing translations fail the type check. */
export type Localized<T> = Readonly<Record<Locale, T>>;

export const defaultLocale: Locale = 'en';

/** BCP 47 tags for the `lang` attribute and `hreflang`. URL segments stay lowercase. */
export const htmlLang: Localized<string> = {
  en: 'en',
  'pt-br': 'pt-BR',
};

export const openGraphLocale: Localized<string> = {
  en: 'en_US',
  'pt-br': 'pt_BR',
};

export const localeLabel: Localized<{ short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  'pt-br': { short: 'PT', name: 'Português' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
