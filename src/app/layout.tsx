import type { ReactNode } from 'react';

/**
 * The document shell (`<html>`, `<body>`) is rendered by `app/[locale]/layout.tsx`, because
 * the `lang` attribute depends on the locale. Next.js still requires a root layout for the
 * root page and the 404 page, so this one only passes its children through.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
