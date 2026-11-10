'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { SmartLink } from '@/components/ui/smart-link';
import type { Locale } from '@/i18n/config';
import { LocaleSwitch } from './locale-switch';
import { NavLink } from './nav-link';
import type { NavigationItem } from './navigation';

export interface MobileNavProps {
  readonly locale: Locale;
  readonly items: readonly NavigationItem[];
  readonly secondary: readonly NavigationItem[];
  readonly labels: {
    readonly menu: string;
    readonly close: string;
    readonly navigation: string;
    readonly language: string;
  };
}

/**
 * The small-screen menu. It is a native modal `<dialog>`: the browser provides the focus
 * trap, Escape to close, an inert page behind it and focus restoration to the trigger.
 */
export function MobileNav({ locale, items, secondary, labels }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // The header outlives navigations, so the dialog has to be closed when the route changes.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-11 items-center rounded-sm border border-rule-strong px-3.5 label transition-colors hover:border-ink"
      >
        {labels.menu}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.menu}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-paper text-ink open:animate-fade"
      >
        <div className="container-page flex min-h-full flex-col pb-10">
          <div className="flex h-(--header-height) items-center justify-between">
            <p className="label text-ink-muted">{labels.menu}</p>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 items-center rounded-sm border border-rule-strong px-3.5 label transition-colors hover:border-ink"
            >
              {labels.close}
            </button>
          </div>

          <nav aria-label={labels.navigation} className="mt-4 border-t border-ink">
            <ul>
              {items.map((item, index) => (
                <li key={item.href} className="border-b border-rule">
                  <NavLink
                    href={item.href}
                    onNavigate={close}
                    className="flex items-baseline gap-4 py-4 display text-title-1 aria-[current=page]:text-accent"
                  >
                    <span aria-hidden="true" className="w-6 label text-ink-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex items-center justify-between gap-6 pt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {secondary.map((item) => (
                <li key={item.href}>
                  <SmartLink
                    href={item.href}
                    className="inline-flex h-11 items-center font-medium link"
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <LocaleSwitch locale={locale} label={labels.language} />
          </div>
        </div>
      </dialog>
    </div>
  );
}
