import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { allPages } from './pages';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * Automated checks catch roughly a third of accessibility problems. They are a floor, not
 * a certificate: the manual checklist in docs/ACCESSIBILITY.md covers the rest.
 */
for (const path of allPages) {
  test(`${path} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('the open mobile menu has no detectable accessibility violations', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'the menu exists on small screens only');
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(results.violations).toEqual([]);
});

test('the page outline has one h1 and no skipped levels', async ({ page }) => {
  for (const path of allPages) {
    await page.goto(path);
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
    expect(
      levels.filter((level) => level === 1),
      path,
    ).toHaveLength(1);
    levels.forEach((level, index) => {
      const previous = levels[index - 1] ?? 1;
      expect(level - previous, `${path}: h${previous} followed by h${level}`).toBeLessThanOrEqual(
        1,
      );
    });
  }
});
