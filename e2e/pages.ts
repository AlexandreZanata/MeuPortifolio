/** Locale-independent paths of every page type, shared by the end-to-end specs. */
export const pagePaths = [
  '',
  'projects/',
  'projects/opencnpj/',
  'projects/br-validators/',
  'projects/tupi-battle-grounds/',
  'projects/abastevo/',
  'open-source/',
  'lab/',
  'about/',
  'contact/',
  'resume/',
] as const;

export const locales = ['en', 'pt-br'] as const;

export const allPages = locales.flatMap((locale) => pagePaths.map((path) => `/${locale}/${path}`));

export const siteUrl = 'https://alexandrezanata.com.br';
