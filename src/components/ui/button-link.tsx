import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight, ArrowUpRight } from './icons';
import { isInternal, SmartLink } from './smart-link';

type Variant = 'primary' | 'secondary' | 'inverse';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-accent-strong',
  secondary: 'border border-rule-strong text-ink hover:border-ink hover:bg-ink hover:text-paper',
  inverse: 'bg-paper text-ink hover:bg-accent-on-ink',
};

export interface ButtonLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: Variant;
  readonly className?: string;
}

/**
 * A link styled as a button. It is always an anchor: buttons that navigate are links,
 * and the arrow tells internal navigation from an external destination.
 */
export function ButtonLink({ href, children, variant = 'primary', className }: ButtonLinkProps) {
  const Arrow = isInternal(href) ? ArrowRight : ArrowUpRight;
  return (
    <SmartLink
      href={href}
      className={cn(
        'group/button inline-flex h-12 items-center justify-center gap-2.5 rounded-sm px-5 text-[0.9375rem] font-medium whitespace-nowrap',
        'transition-colors duration-200 ease-editorial',
        variants[variant],
        className,
      )}
    >
      {children}
      <Arrow
        className={cn(
          'transition-transform duration-200 ease-editorial',
          isInternal(href)
            ? 'group-hover/button:translate-x-0.5'
            : 'group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5',
        )}
      />
    </SmartLink>
  );
}
