import localFont from 'next/font/local';

/**
 * The italic display face is used for one phrase in the home hero and nowhere else.
 * `next/font` preloads a font only on the routes whose modules import it, so declaring it
 * here, next to its single consumer, keeps 39 kB off every other page.
 */
export const frauncesItalic = localFont({
  src: '../../assets/fonts/fraunces-display-italic.woff2',
  weight: '400 700',
  style: 'italic',
  variable: '--font-fraunces-italic',
  // `optional` never swaps after the first paint, so this phrase cannot shift the headline.
  // If the file is late, the `display-italic` utility falls back to a slanted roman
  // Fraunces, which has almost the same widths.
  display: 'optional',
  adjustFontFallback: false,
});
