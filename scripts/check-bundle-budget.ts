/**
 * Fails when a page of the exported site outgrows its transfer budget.
 *
 * For every HTML file in `out/` it sums the gzip size of what the browser needs to render
 * that page: the document itself, the scripts and stylesheets it references and the fonts
 * it preloads. Budgets are deliberately close to today's numbers: the point is to make a
 * regression a conscious decision (raise the budget in the same pull request and say why),
 * not to leave room for one. See docs/PERFORMANCE.md.
 *
 * Usage: `pnpm build && pnpm budget`
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const KB = 1024;

/** Per-page budgets, in bytes after gzip (fonts are already compressed: raw size). */
const budgets = {
  html: 30 * KB,
  css: 12 * KB,
  js: 150 * KB,
  fonts: 105 * KB,
} as const;

/** Budget for each generated plate in `out/art`, after gzip. */
const plateBudget = 18 * KB;

const out = join(fileURLToPath(new URL('..', import.meta.url)), 'out');
if (!existsSync(out)) {
  console.error('No export found. Run `pnpm build` first.');
  process.exit(1);
}

function htmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return entry === '_next' ? [] : htmlFiles(path);
    return entry.endsWith('.html') ? [path] : [];
  });
}

const sizeCache = new Map<string, number>();
function gzipSize(path: string): number {
  const cached = sizeCache.get(path);
  if (cached !== undefined) return cached;
  const size = gzipSync(readFileSync(path)).length;
  sizeCache.set(path, size);
  return size;
}

const matches = (html: string, pattern: RegExp): string[] =>
  [...html.matchAll(pattern)].map((match) => match[1] ?? '').filter(Boolean);

const unique = (values: string[]): string[] => [...new Set(values)];
const local = (url: string): string => join(out, decodeURIComponent(url.split('?')[0] ?? ''));

let failed = false;
const rows: string[] = [];
const format = (bytes: number): string => `${(bytes / KB).toFixed(1)} kB`.padStart(9);

for (const file of htmlFiles(out).sort()) {
  const html = readFileSync(file, 'utf8');
  // `nomodule` scripts are polyfills for legacy browsers; current browsers never fetch them.
  const scripts = unique(matches(html, /<script(?![^>]*nomodule)[^>]+src="(\/_next\/[^"]+)"/gi));
  const styles = unique(matches(html, /<link[^>]+rel="stylesheet"[^>]+href="(\/_next\/[^"]+)"/g));
  const fonts = unique(matches(html, /<link[^>]+rel="preload"[^>]+href="([^"]+\.woff2)"/g));

  const sizes = {
    html: gzipSize(file),
    css: styles.reduce((total, url) => total + gzipSize(local(url)), 0),
    js: scripts.reduce((total, url) => total + gzipSize(local(url)), 0),
    fonts: fonts.reduce((total, url) => total + statSync(local(url)).size, 0),
  };

  const over = (Object.keys(budgets) as (keyof typeof budgets)[]).filter(
    (key) => sizes[key] > budgets[key],
  );
  if (over.length > 0) failed = true;

  rows.push(
    `${(over.length > 0 ? 'OVER' : 'ok').padEnd(5)}${format(sizes.html)}${format(sizes.css)}${format(sizes.js)}${format(sizes.fonts)}  /${relative(out, file)}` +
      (over.length > 0 ? `   <- ${over.join(', ')}` : ''),
  );
}

console.log(
  `${'     '}${'html'.padStart(9)}${'css'.padStart(9)}${'js'.padStart(9)}${'fonts'.padStart(9)}`,
);
console.log(rows.join('\n'));
console.log(
  `budget${format(budgets.html).slice(1)}${format(budgets.css)}${format(budgets.js)}${format(budgets.fonts)}  (gzip; fonts as shipped)`,
);

const artDirectory = join(out, 'art');
for (const plate of readdirSync(artDirectory).sort()) {
  const size = gzipSize(join(artDirectory, plate));
  const over = size > plateBudget;
  if (over) failed = true;
  console.log(`${(over ? 'OVER' : 'ok').padEnd(5)}${format(size)}  /art/${plate}`);
}
console.log(`budget${format(plateBudget).slice(1)}  per plate (gzip)`);

if (failed) {
  console.error('\nA budget was exceeded. Reduce the page, or raise the budget deliberately.');
  process.exit(1);
}
