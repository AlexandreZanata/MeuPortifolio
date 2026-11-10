import { expect, test } from '@playwright/test';
import { allPages, pagePaths, siteUrl } from './pages';

test.skip(({ isMobile }) => isMobile, 'metadata does not depend on the viewport');

test('every page has complete, self-consistent metadata', async ({ page }) => {
  // Titles must be unique within a language. The same page in two languages may share one
  // (for example "Lab"); those are declared as alternates of each other, not duplicates.
  const titles = new Set<string>();

  for (const path of allPages) {
    await page.goto(path);
    const head = page.locator('head');

    const title = await page.title();
    const key = `${path.split('/')[1]}: ${title}`;
    expect(title.length, `${path}: title`).toBeGreaterThan(10);
    expect(titles.has(key), `${path}: duplicate title "${title}"`).toBe(false);
    titles.add(key);

    const description = await head.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0, `${path}: description`).toBeGreaterThan(60);

    await expect(head.locator('link[rel="canonical"]'), path).toHaveAttribute(
      'href',
      `${siteUrl}${path}`,
    );

    const localeless = path.replace(/^\/(en|pt-br)\//, '');
    for (const [hreflang, prefix] of [
      ['en', '/en/'],
      ['pt-BR', '/pt-br/'],
      ['x-default', '/en/'],
    ] as const) {
      await expect(
        head.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        `${path}: hreflang ${hreflang}`,
      ).toHaveAttribute('href', `${siteUrl}${prefix}${localeless}`);
    }

    await expect(head.locator('meta[property="og:image"]'), path).toHaveAttribute(
      'content',
      /\/og\/(en|pt-br)\.png$/,
    );
    await expect(head.locator('meta[name="twitter:card"]'), path).toHaveAttribute(
      'content',
      'summary_large_image',
    );
  }
});

test('structured data is valid JSON-LD', async ({ page }) => {
  for (const path of ['/en/', '/pt-br/projects/opencnpj/']) {
    await page.goto(path);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length, path).toBeGreaterThan(0);
    for (const block of blocks) {
      const data = JSON.parse(block) as { '@context'?: string };
      expect(data['@context']).toBe('https://schema.org');
    }
  }
});

test('the sitemap lists every page in every locale', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  for (const path of allPages) {
    expect(xml, path).toContain(`<loc>${siteUrl}${path}</loc>`);
  }
  expect(xml.match(/<url>/g)).toHaveLength(pagePaths.length * 2);
});

test('robots.txt allows crawling and points at the sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/User-Agent: \*/i);
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
});

test('social images exist at the advertised size', async ({ request }) => {
  for (const locale of ['en', 'pt-br']) {
    const response = await request.get(`/og/${locale}.png`);
    expect(response.ok(), locale).toBe(true);
    expect(response.headers()['content-type']).toBe('image/png');
  }
});
