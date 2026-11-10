import { Mark } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/smart-link';
import { profile } from '@/content/profile';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/get-dictionary';
import { routes } from '@/i18n/routes';
import { site } from '@/lib/site';
import { LocaleSwitch } from './locale-switch';
import { primaryNavigation } from './navigation';

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = [
    ...primaryNavigation(locale, dict),
    { href: routes.resume(locale), label: dict.nav.resume },
  ];
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="mt-(--section) border-t border-ink print:hidden">
      <div className="container-page grid gap-x-10 gap-y-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 display text-title-2">
            <Mark className="size-7" />
            {profile.name}
          </p>
          <p className="mt-4 max-w-[34ch] text-ink-soft">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.a11y.footerNavigation} className="lg:col-span-3">
          <ul className="grid gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  prefetch={false}
                  className="inline-flex h-11 items-center transition-colors hover:text-accent lg:h-9"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
            <li>
              <SmartLink
                href={profile.github.url}
                className="inline-flex h-11 items-center transition-colors hover:text-accent lg:h-9"
              >
                {dict.common.github}
              </SmartLink>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="label text-ink-muted">{dict.footer.colophonTitle}</h2>
          <p className="mt-3 text-sm text-ink-soft">{dict.footer.colophon}</p>
          <p className="mt-3 text-sm">
            <SmartLink href={site.repository} className="link">
              {dict.footer.source}
            </SmartLink>
          </p>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4">
          <p className="text-sm text-ink-muted">
            © {year} {profile.name}. {dict.footer.rights}
          </p>
          <LocaleSwitch locale={locale} label={dict.a11y.language} />
        </div>
      </div>
    </footer>
  );
}
