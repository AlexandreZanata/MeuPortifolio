import Link from 'next/link';
import type { ReactNode } from 'react';

export interface SmartLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly prefetch?: boolean;
  readonly 'aria-label'?: string;
  readonly 'aria-current'?: 'page' | 'true';
  readonly lang?: string;
  readonly hrefLang?: string;
}

const isInternal = (href: string): boolean => href.startsWith('/');

/**
 * The single place that decides how a link leaves the page.
 *
 * Internal paths use the router. Everything else is a plain anchor that opens in the same
 * tab (the visitor keeps control of their tabs) and never leaks the opener or the referrer.
 */
export function SmartLink({ href, children, prefetch, ...rest }: SmartLinkProps) {
  if (isInternal(href)) {
    return (
      <Link href={href} {...(prefetch === undefined ? {} : { prefetch })} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

export { isInternal };
