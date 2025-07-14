import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class ProductListingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async applyFilter(filterType: string, value: string) {
    // Example: filterType = 'Size', value = 'XS'
    const filterSelector = `//div[contains(@class, 'filter-options-title') and contains(., '${filterType}')]`;
    const valueSelector = `//div[contains(@class, 'filter-options-title') and contains(., '${filterType}')]/following-sibling::div//a[contains(., '${value}')]`;
    const filter = this.page.locator(filterSelector);
    if (await filter.count() > 0) {
      await filter.first().click();
      const valueEl = this.page.locator(valueSelector);
      if (await valueEl.count() > 0) {
        await valueEl.first().click();
        return true;
      }
    }
    return false;
  }

  async selectFirstProduct() {
    const product = this.page.locator('.product-item-info a.product-item-link');
    if (await product.count() > 0) {
      await product.first().click();
      return true;
    }
    return false;
  }

  async selectRandomProduct() {
    const products = this.page.locator('.product-item-info a.product-item-link');
    const count = await products.count();
    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      await products.nth(randomIndex).click();
      return true;
    }
    return false;
  }
} 