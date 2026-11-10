'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { htmlLang, localeLabel, locales, type Locale } from '@/i18n/config';
import { swapLocale } from '@/i18n/routes';
import { cn } from '@/lib/cn';

export interface LocaleSwitchProps {
  readonly locale: Locale;
  /** Accessible name of the group, e.g. "Language". */
  readonly label: string;
  readonly className?: string;
}

/** Links to the current page in each language. The other locale is never prefetched. */
export function LocaleSwitch({ locale, label, className }: LocaleSwitchProps) {
  const pathname = usePathname();
  return (
    <ul aria-label={label} className={cn('flex items-center', className)}>
      {locales.map((target, index) => {
        const current = target === locale;
        return (
          <li key={target} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="px-0.5 text-rule-strong">
                /
              </span>
            ) : null}
            <Link
              href={swapLocale(pathname, target)}
              prefetch={false}
              lang={htmlLang[target]}
              hrefLang={htmlLang[target]}
              title={localeLabel[target].name}
              aria-current={current ? 'true' : undefined}
              className={cn(
                'inline-flex h-11 min-w-8 items-center justify-center px-1 label transition-colors',
                current ? 'text-ink' : 'text-ink-muted hover:text-accent',
              )}
            >
              {localeLabel[target].short}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
