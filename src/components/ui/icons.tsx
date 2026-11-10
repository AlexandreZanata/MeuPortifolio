import type { SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

/** Icons are decorative: the text next to them carries the meaning. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </Icon>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" />
    </Icon>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </Icon>
  );
}

/** The site mark: the hero sphere reduced to a lit disc and one body in orbit. */
export function Mark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" {...props}>
      <circle cx="11" cy="13" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 4.75a8.25 8.25 0 0 1 0 16.5 4.6 8.25 0 0 0 0-16.5z" fill="currentColor" />
      <circle cx="20" cy="4.5" r="2.5" fill="var(--color-accent)" />
    </svg>
  );
}
