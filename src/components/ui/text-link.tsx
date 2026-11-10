import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight, ArrowUpRight } from './icons';
import { isInternal, SmartLink } from './smart-link';

export interface TextLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  /** Shows a trailing arrow: right for internal links, up-right for external ones. */
  readonly arrow?: boolean;
  readonly className?: string;
}

/** An underlined inline link. Underlines keep links distinguishable without colour. */
export function TextLink({ href, children, arrow = false, className }: TextLinkProps) {
  const Arrow = isInternal(href) ? ArrowRight : ArrowUpRight;
  return (
    <SmartLink
      href={href}
      className={cn('link', arrow && 'inline-flex items-center gap-1.5 font-medium', className)}
    >
      {children}
      {arrow ? <Arrow className="shrink-0" /> : null}
    </SmartLink>
  );
}
