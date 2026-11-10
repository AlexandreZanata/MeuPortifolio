/**
 * Renders the social sharing images (public/og/<locale>.png) and the Apple touch icon.
 *
 * The images are screenshots of a small HTML page that uses the real fonts, tokens and
 * hero plate, so they always match the site. They are committed: the build does not
 * depend on a browser. Run `pnpm og` after changing the hero copy, the palette or the art.
 *
 * Requires a Chromium for Playwright (`pnpm exec playwright install chromium`), or set
 * CHROMIUM_PATH to an existing Chromium/Chrome binary.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { en } from '../src/i18n/dictionaries/en.ts';
import { ptBR } from '../src/i18n/dictionaries/pt-br.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string): Buffer => readFileSync(join(root, path));
const dataUrl = (path: string, type: string): string =>
  `data:${type};base64,${read(path).toString('base64')}`;

const fonts = `
  @font-face { font-family: Fraunces; font-weight: 400 700; font-style: normal;
    src: url(${dataUrl('src/assets/fonts/fraunces-display.woff2', 'font/woff2')}) format('woff2'); }
  @font-face { font-family: Fraunces; font-weight: 400 700; font-style: italic;
    src: url(${dataUrl('src/assets/fonts/fraunces-display-italic.woff2', 'font/woff2')}) format('woff2'); }
  @font-face { font-family: Mono; font-weight: 400 600;
    src: url(${dataUrl('src/assets/fonts/jetbrains-mono.woff2', 'font/woff2')}) format('woff2'); }
`;
const art = dataUrl('public/art/hero-armillary.svg', 'image/svg+xml');
const icon = read('src/app/icon.svg').toString('utf8');

const escape = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function card(copy: typeof en): string {
  const hero = copy.home.hero;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${fonts}
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: #f5f0e6; color: #17130e;
      display: grid; grid-template-columns: 1fr 470px; align-items: center;
      padding: 64px 40px 64px 72px; font-family: Mono, monospace; overflow: hidden; }
    .label { font-size: 17px; letter-spacing: 0.09em; text-transform: uppercase; color: #625a4e;
      font-weight: 500; }
    h1 { font-family: Fraunces, serif; font-weight: 560; font-size: 74px; line-height: 1.02;
      letter-spacing: -0.02em; margin-top: 28px; text-wrap: balance; }
    em { color: #b8430b; }
    .site { margin-top: 44px; display: flex; align-items: center; gap: 14px; font-size: 20px; }
    .site svg { width: 34px; height: 34px; }
    img { width: 470px; height: auto; }
  </style></head><body>
    <div>
      <p class="label">${escape(hero.eyebrow)}</p>
      <h1>${escape(hero.titleLead)}<em>${escape(hero.titleEmphasis)}</em>${escape(hero.titleTail)}</h1>
      <p class="site">${icon}alexandrezanata.com.br</p>
    </div>
    <img src="${art}" alt="">
  </body></html>`;
}

const touchIcon = `<!doctype html><html><head><style>
  * { margin: 0; } body { width: 180px; height: 180px; background: #f5f0e6; display: grid; place-items: center; }
  svg { width: 180px; height: 180px; }
</style></head><body>${icon.replace('rx="6"', 'rx="0"')}</body></html>`;

const executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
  mkdirSync(join(root, 'public', 'og'), { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [locale, copy] of [
    ['en', en],
    ['pt-br', ptBR],
  ] as const) {
    await page.setContent(card(copy), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(root, 'public', 'og', `${locale}.png`) });
    console.log(`public/og/${locale}.png`);
  }

  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(touchIcon, { waitUntil: 'load' });
  await page.screenshot({ path: join(root, 'src', 'app', 'apple-icon.png') });
  console.log('src/app/apple-icon.png');
} finally {
  await browser.close();
}
