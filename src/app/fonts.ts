import localFont from 'next/font/local';

/**
 * Fonts are self-hosted, Latin-subset variable files (src/assets/fonts/README.md).
 * Nothing is fetched from a third party, and `next/font` generates size-adjusted
 * fallbacks so the swap from the system font does not move the layout.
 */
export const fraunces = localFont({
  src: '../assets/fonts/fraunces-display.woff2',
  weight: '400 700',
  variable: '--font-fraunces',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

export const instrumentSans = localFont({
  src: '../assets/fonts/instrument-sans.woff2',
  weight: '400 700',
  variable: '--font-instrument',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

/** Used for small labels only, so it is not worth a preload. */
export const jetbrainsMono = localFont({
  src: '../assets/fonts/jetbrains-mono.woff2',
  weight: '400 600',
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
});

export const fontVariables = [
  fraunces.variable,
  instrumentSans.variable,
  jetbrainsMono.variable,
].join(' ');
