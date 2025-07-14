import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class ShoppingCartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async proceedToCheckout() {
    await this.page.click('button[title="Proceed to Checkout"]');
  }
} 