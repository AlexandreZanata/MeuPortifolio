import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';

export interface NavigationItem {
  readonly href: string;
  readonly label: string;
}

/** The primary navigation, shared by the header, the mobile menu and the footer. */
export function primaryNavigation(locale: Locale, dict: Dictionary): NavigationItem[] {
  return [
    { href: routes.projects(locale), label: dict.nav.projects },
    { href: routes.openSource(locale), label: dict.nav.openSource },
    { href: routes.lab(locale), label: dict.nav.lab },
    { href: routes.about(locale), label: dict.nav.about },
    { href: routes.contact(locale), label: dict.nav.contact },
  ];
}
