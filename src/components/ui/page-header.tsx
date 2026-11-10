import type { ReactNode } from 'react';

export interface PageHeaderProps {
  readonly title: string;
  readonly lede: string;
  /** Monospace line above the title. */
  readonly label?: ReactNode;
  readonly children?: ReactNode;
}

/** Title block shared by the inner pages. Each page has exactly one `h1`, rendered here. */
export function PageHeader({ title, lede, label, children }: PageHeaderProps) {
  return (
    <header className="container-page pt-12 pb-4 lg:pt-20">
      {label ? <p className="mb-5 label text-ink-muted">{label}</p> : null}
      <h1 className="max-w-[18ch] display text-display-2">{title}</h1>
      <p className="mt-6 max-w-[56ch] text-lede text-ink-soft">{lede}</p>
      {children}
    </header>
  );
}
