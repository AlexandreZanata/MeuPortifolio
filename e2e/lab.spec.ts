import { expect, test } from '@playwright/test';

test('the CNPJ playground explains a valid and an invalid number', async ({ page }) => {
  await page.goto('/en/lab/');
  const input = page.getByLabel('CNPJ', { exact: true });
  const status = page.getByRole('status');

  // The official alphanumeric example is prefilled, so the page is useful before any input.
  await expect(input).toHaveValue('12.ABC.345/01DE-35');
  await expect(status).toContainText('Valid');
  await expect(page.getByRole('table', { name: 'Calculation of check digit 1' })).toBeVisible();

  await input.fill('12.ABC.345/01DE-36');
  await expect(status).toContainText('should be 35');
  await expect(input).toHaveAttribute('aria-invalid', 'true');

  await input.fill('12.ABC');
  await expect(status).toContainText('9 characters to go');
  await expect(page.getByRole('table')).toHaveCount(0);

  await page.getByRole('button', { name: '00.000.000/0001-91' }).click();
  await expect(status).toContainText('Valid');
});

test('no page logs errors to the console', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  for (const path of ['/en/', '/en/projects/abastevo/', '/pt-br/lab/', '/pt-br/contact/']) {
    await page.goto(path, { waitUntil: 'networkidle' });
  }
  expect(errors).toEqual([]);
});
