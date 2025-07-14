import { test as base, chromium, firefox, webkit, Browser, Page, BrowserContext } from '@playwright/test';

// Extend base test to provide browser, context, and page
export const test = base.extend<{
  browser: Browser;
  context: BrowserContext;
  page: Page;
}>({
  browser: async ({}, use, testInfo) => {
    let browser: Browser;
    switch (testInfo.project.name) {
      case 'firefox':
        browser = await firefox.launch();
        break;
      case 'webkit':
        browser = await webkit.launch();
        break;
      default:
        browser = await chromium.launch();
    }
    await use(browser);
    await browser.close();
  },
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

export { expect } from '@playwright/test'; 