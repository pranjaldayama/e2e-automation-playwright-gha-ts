import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async applyDiscountCode(code: string) {
    await this.page.locator('#block-discount input[name="discount_code"]').fill(code);
    await this.page.locator('#block-discount button').click();
  }

  async setShippingCountry(country: string) {
    await this.page.selectOption('select[name="country_id"]', { label: country });
  }

  async getDiscountAmount() {
    const discount = this.page.locator('.totals-discount .price');
    if (await discount.count() > 0) {
      return await discount.first().innerText();
    }
    return null;
  }
} 