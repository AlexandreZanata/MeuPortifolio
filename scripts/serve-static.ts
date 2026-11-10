/**
 * Serves the exported site (`out/`) the way a correctly configured static host would:
 * directory indexes, the exported 404 page, compression for text and long-lived caching
 * for fingerprinted assets. Used by `pnpm start`, the end-to-end tests and Lighthouse runs.
 *
 * It has no dependencies on purpose. It is a preview tool, not a production server.
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'out');
const port = Number(process.env.PORT ?? 4173);

const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};
const compressible = new Set(['.html', '.css', '.js', '.json', '.txt', '.xml', '.svg']);

interface Encoded {
  readonly br: Buffer;
  readonly gzip: Buffer;
}
const encodedCache = new Map<string, Encoded>();

function encode(file: string): Encoded {
  const cached = encodedCache.get(file);
  if (cached) return cached;
  const raw = readFileSync(file);
  const encoded = { br: brotliCompressSync(raw), gzip: gzipSync(raw) };
  encodedCache.set(file, encoded);
  return encoded;
}

/** Maps a request path to a file inside `out/`, or `null` when there is none. */
function resolveFile(pathname: string): string | null {
  const decoded = decodeURIComponent(pathname);
  const candidate = normalize(join(root, decoded));
  // Never serve anything outside the export directory.
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;

  const attempts = [candidate, join(candidate, 'index.html'), `${candidate}.html`];
  for (const attempt of attempts) {
    if (existsSync(attempt) && statSync(attempt).isFile()) return attempt;
  }
  return null;
}

if (!existsSync(root)) {
  console.error('No export found. Run `pnpm build` first.');
  process.exit(1);
}

interface HeaderRule {
  readonly pattern: RegExp;
  readonly headers: readonly (readonly [string, string])[];
}

/**
 * Reads the exported `_headers` file (the format Cloudflare Pages and Netlify use), so the
 * preview applies the same security and cache headers as production. Tests and Lighthouse
 * then run under the real Content Security Policy instead of a more permissive one.
 */
function loadHeaderRules(): HeaderRule[] {
  const file = join(root, '_headers');
  if (!existsSync(file)) return [];
  const rules: { pattern: RegExp; headers: [string, string][] }[] = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      const source = line
        .trim()
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
      rules.push({ pattern: new RegExp(`^${source}$`), headers: [] });
      continue;
    }
    const separator = line.indexOf(':');
    const name = line.slice(0, separator).trim();
    // The preview is plain HTTP, where this directive would break every request.
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/;?\s*upgrade-insecure-requests/, '');
    rules.at(-1)?.headers.push([name, value]);
  }
  return rules;
}

const headerRules = loadHeaderRules();

createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  const found = resolveFile(pathname);
  const file = found ?? join(root, '404.html');
  const extension = extname(file);

  response.statusCode = found ? 200 : 404;
  response.setHeader('Content-Type', contentTypes[extension] ?? 'application/octet-stream');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  for (const rule of headerRules) {
    if (!rule.pattern.test(pathname)) continue;
    for (const [name, value] of rule.headers) response.setHeader(name, value);
  }

  if (!compressible.has(extension)) {
    createReadStream(file).pipe(response);
    return;
  }

  const accepted = String(request.headers['accept-encoding'] ?? '');
  const encoded = encode(file);
  response.setHeader('Vary', 'Accept-Encoding');
  if (accepted.includes('br')) {
    response.setHeader('Content-Encoding', 'br');
    response.end(encoded.br);
  } else if (accepted.includes('gzip')) {
    response.setHeader('Content-Encoding', 'gzip');
    response.end(encoded.gzip);
  } else {
    response.end(readFileSync(file));
  }
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}`);
});
