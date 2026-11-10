import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** A small monospace chip for technologies and short facts. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xs border border-rule px-2 py-1 font-mono text-xs leading-none text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
