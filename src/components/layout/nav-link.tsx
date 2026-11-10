'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { isCurrentPath } from '@/i18n/routes';
import { cn } from '@/lib/cn';

export interface NavLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly onNavigate?: () => void;
}

/**
 * A navigation link that marks itself with `aria-current`. It is a client component only
 * because the current path is known on the client; the markup is still rendered at build.
 */
export function NavLink({ href, children, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const current = isCurrentPath(pathname, href);
  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className={cn(className)}
      {...(onNavigate ? { onClick: onNavigate } : {})}
    >
      {children}
    </Link>
  );
}
