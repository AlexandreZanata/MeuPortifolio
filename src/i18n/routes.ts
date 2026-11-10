import { isLocale, locales, type Locale } from './config';

/**
 * Every internal URL is built here. Paths keep a trailing slash because the site is
 * exported as `<path>/index.html` and canonical URLs must match what the host serves.
 */
const withLocale = (locale: Locale, path = ''): string => `/${locale}/${path}`;

export const routes = {
  home: (locale: Locale) => withLocale(locale),
  projects: (locale: Locale) => withLocale(locale, 'projects/'),
  project: (locale: Locale, slug: string) => withLocale(locale, `projects/${slug}/`),
  openSource: (locale: Locale) => withLocale(locale, 'open-source/'),
  lab: (locale: Locale) => withLocale(locale, 'lab/'),
  about: (locale: Locale) => withLocale(locale, 'about/'),
  contact: (locale: Locale) => withLocale(locale, 'contact/'),
  resume: (locale: Locale) => withLocale(locale, 'resume/'),
} as const;

/** Locale-independent paths of the static pages, used by the sitemap. */
export const staticPaths = [
  '',
  'projects/',
  'open-source/',
  'lab/',
  'about/',
  'contact/',
  'resume/',
] as const;

function ensureTrailingSlash(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** Returns the path without its locale segment, e.g. `/pt-br/projects/` -> `projects/`. */
export function stripLocale(pathname: string): string {
  const [, first = '', ...rest] = ensureTrailingSlash(pathname).split('/');
  return isLocale(first) ? rest.join('/') : [first, ...rest].join('/');
}

/** The same page in another locale. Unknown prefixes fall back to that locale's home. */
export function swapLocale(pathname: string, target: Locale): string {
  const [, first = ''] = pathname.split('/');
  if (!isLocale(first)) return routes.home(target);
  return withLocale(target, stripLocale(pathname));
}

/** Whether a navigation link should be marked as the current section. */
export function isCurrentPath(pathname: string, href: string): boolean {
  const current = ensureTrailingSlash(pathname);
  const isHome = locales.some((locale) => href === routes.home(locale));
  return isHome ? current === href : current.startsWith(href);
}
