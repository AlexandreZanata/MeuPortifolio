import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionHeadingProps {
  /** Id of the heading, referenced by the section's `aria-labelledby`. */
  readonly id: string;
  /** Two-digit index shown before the label, e.g. "01". */
  readonly index?: string;
  readonly label: string;
  readonly title: string;
  readonly description?: string;
  /** Optional trailing content, usually a link to the full list. */
  readonly action?: ReactNode;
  /** Heading level: sections on a page are `h2`, sub-sections `h3`. */
  readonly as?: 'h2' | 'h3';
  readonly tone?: 'ink' | 'paper';
}

/**
 * The editorial section opener: a rule, a monospace label in the margin column and the
 * title set in the display face.
 */
export function SectionHeading({
  id,
  index,
  label,
  title,
  description,
  action,
  as: Heading = 'h2',
  tone = 'ink',
}: SectionHeadingProps) {
  const onPaper = tone === 'ink';
  return (
    <div
      className={cn(
        'grid gap-x-10 gap-y-5 border-t pt-6 lg:grid-cols-12',
        onPaper ? 'border-ink' : 'border-paper/25',
      )}
    >
      <p className={cn('label lg:col-span-3', onPaper ? 'text-ink-muted' : 'text-paper/70')}>
        {index ? (
          <>
            <span className={onPaper ? 'text-accent' : 'text-accent-on-ink'}>{index}</span>
            <span aria-hidden="true"> — </span>
          </>
        ) : null}
        {label}
      </p>
      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <Heading id={id} className="max-w-[22ch] display text-title-1">
            {title}
          </Heading>
          {action}
        </div>
        {description ? (
          <p
            className={cn(
              'mt-4 max-w-[46ch] text-lede',
              onPaper ? 'text-ink-soft' : 'text-paper/75',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
