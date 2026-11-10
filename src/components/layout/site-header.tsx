import Link from 'next/link';
import { Mark } from '@/components/ui/icons';
import { profile } from '@/content/profile';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';
import { LocaleSwitch } from './locale-switch';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';
import { primaryNavigation } from './navigation';

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = primaryNavigation(locale, dict);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-sm print:hidden">
      <div className="container-page flex h-(--header-height) items-center justify-between gap-6">
        <Link
          href={routes.home(locale)}
          aria-label={dict.a11y.homeLink}
          className="group -ml-1 flex h-11 items-center gap-2.5 px-1"
        >
          <Mark className="size-6 transition-transform duration-500 ease-editorial group-hover:rotate-[24deg]" />
          <span className="display text-[1.1875rem]">{profile.name}</span>
        </Link>

        <nav aria-label={dict.a11y.mainNavigation} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="relative inline-flex h-11 items-center text-[0.9375rem] text-ink-soft transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-editorial hover:text-ink hover:after:scale-x-100 aria-[current=page]:text-ink aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} label={dict.a11y.language} className="max-sm:hidden" />
          <MobileNav
            locale={locale}
            items={items}
            secondary={[
              { href: routes.resume(locale), label: dict.nav.resume },
              { href: profile.github.url, label: dict.common.github },
            ]}
            labels={{
              menu: dict.a11y.menu,
              close: dict.a11y.close,
              navigation: dict.a11y.mainNavigation,
              language: dict.a11y.language,
            }}
          />
        </div>
      </div>
    </header>
  );
}
