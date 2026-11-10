import { expect, test } from '@playwright/test';
import { allPages } from './pages';

/** The widths the design is specified at, plus a narrow phone and a wide desktop. */
const widths = [320, 375, 768, 1024, 1440, 1920];

test.describe('responsive layout', () => {
  test.skip(({ isMobile }) => isMobile, 'viewport widths are set explicitly in this spec');

  for (const width of widths) {
    test(`no page scrolls sideways at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of allPages) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test('every image reserves its space before it loads', async ({ page }) => {
    for (const path of allPages) {
      await page.goto(path);
      const unsized = await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !image.getAttribute('width') || !image.getAttribute('height'))
            .map((image) => image.getAttribute('src')),
        );
      expect(unsized, path).toEqual([]);
    }
  });

  test('the page still works at 200% zoom on a small laptop', async ({ page }) => {
    // 1280px at 200% zoom is a 640px layout viewport (WCAG 1.4.4 and 1.4.10).
    await page.setViewportSize({ width: 640, height: 400 });
    await page.goto('/en/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  });
});

test.describe('review screenshots', () => {
  test.skip(({ isMobile }) => isMobile, 'viewport widths are set explicitly in this spec');

  // Not assertions: full-page captures attached to the report so a reviewer can look at
  // the layouts a change touches without checking the branch out.
  for (const width of [375, 768, 1024, 1440]) {
    test(`home and case study at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      for (const [name, path] of [
        ['home', '/en/'],
        ['case-study', '/en/projects/opencnpj/'],
      ] as const) {
        await page.goto(path);
        await testInfo.attach(`${name}-${width}`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      }
    });
  }
});
