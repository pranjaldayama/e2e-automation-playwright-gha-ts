import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToMenTopsJackets() {
    await this.page.hover('a[role="menuitem"][href*="men.html"]');
    await this.page.hover('a[role="menuitem"][href*="men/tops-men.html"]');
    await this.page.click('a[role="menuitem"][href*="men/tops-men/jackets-men.html"]');
  }

  async navigateToWomenTopsJackets() {
    await this.page.hover('a[role="menuitem"][href*="women.html"]');
    await this.page.hover('a[role="menuitem"][href*="women/tops-women.html"]');
    await this.page.click('a[role="menuitem"][href*="women/tops-women/jackets-women.html"]');
  }

  async navigateToGearBags() {
    await this.page.hover('a[role="menuitem"][href*="gear.html"]');
    await this.page.click('a[role="menuitem"][href*="gear/bags.html"]');
  }
} 