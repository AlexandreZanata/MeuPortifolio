import { defineConfig, devices } from '@playwright/test';

const port = 4173;
// Lets a machine that cannot run `playwright install` point at an existing Chromium.
const executablePath = process.env.CHROMIUM_PATH;
const launchOptions = executablePath ? { executablePath } : {};

/**
 * End-to-end tests run against the exported site (`out/`), served the way a static host
 * would serve it. Run `pnpm build` first.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node scripts/serve-static.ts',
    url: `http://localhost:${port}/en/`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], launchOptions },
    },
  ],
});
