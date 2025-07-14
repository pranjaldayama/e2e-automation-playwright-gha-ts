import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class ProductDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectSize(size: string) {
    const sizeOption = this.page.locator(`.swatch-attribute.size .swatch-option[aria-label='${size}']`);
    if (await sizeOption.count() > 0) {
      await sizeOption.first().click();
      return true;
    }
    return false;
  }

  async selectColor(color: string) {
    const colorOption = this.page.locator(`.swatch-attribute.color .swatch-option[aria-label='${color}']`);
    if (await colorOption.count() > 0) {
      await colorOption.first().click();
      return true;
    }
    return false;
  }

  async setQuantity(quantity: number) {
    const qtyInput = this.page.locator('input#qty');
    if (await qtyInput.count() > 0) {
      await qtyInput.fill(quantity.toString());
      return true;
    }
    return false;
  }

  async addToCart() {
    await this.page.click('button#product-addtocart-button');
  }
} 