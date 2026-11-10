import { expect, test } from '@playwright/test';

test.describe('entry points', () => {
  test('the root forwards to English by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('the root forwards Portuguese browsers to /pt-br/', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'pt-BR' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page).toHaveURL('/pt-br/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await context.close();
  });

  test('unknown URLs get the 404 page with a 404 status', async ({ page }) => {
    const response = await page.goto('/en/does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  });
});

test.describe('keyboard', () => {
  test('the skip link is the first stop and moves focus to the content', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('primary navigation', () => {
  test('desktop: links navigate and mark the current section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the inline navigation is shown on wide screens only');
    await page.goto('/en/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await nav.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL('/en/projects/');
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
  });

  test('mobile: the menu is a modal dialog that closes on Escape and on navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'the menu button is shown on small screens only');
    await page.goto('/en/');
    const trigger = page.getByRole('button', { name: 'Menu' });
    const dialog = page.getByRole('dialog', { name: 'Menu' });

    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await dialog.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/en/about/');
    await expect(dialog).toBeHidden();
  });
});

test.describe('language switch', () => {
  test('keeps the visitor on the same page', async ({ page }) => {
    await page.goto('/en/projects/opencnpj/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'PT', exact: true }).click();
    await expect(page).toHaveURL('/pt-br/projects/opencnpj/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('OpenCNPJ');
  });
});

test.describe('project cards', () => {
  test('open the case study', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('link', { name: 'br-validators', exact: true }).first().click();
    await expect(page).toHaveURL('/en/projects/br-validators/');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Architecture decisions' }),
    ).toBeVisible();
  });
});
