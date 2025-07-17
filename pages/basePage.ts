import { Page, Locator } from "@playwright/test";
import { acceptInitialCookies } from "../utils/helpers";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(url: string) {
    await this.page.goto(url);
    await acceptInitialCookies(this.page);
    await this.page
      .getByLabel("Email", { exact: true })
      .fill("pranjal.gaud@gmail.com");
    await this.page.getByLabel("Password").fill("Password@321");
    await this.page.getByLabel("Password").press("Enter");
  }
  

  async click(locator: string | Locator) {
    if (typeof locator === "string") {
      await this.page.click(locator);
    } else {
      await locator.click();
    }
  }

  async type(locator: string | Locator, text: string) {
    if (typeof locator === "string") {
      await this.page.fill(locator, text);
    } else {
      await locator.fill(text);
    }
  }

  async waitForSelector(locator: string) {
    await this.page.waitForSelector(locator);
  }

  async navigateToGearBags() {
    await this.page.goto(
      "https://magento.softwaretestingboard.com/gear/bags.html",
    );
  }
  async navigateToMenTopsJackets() {
    await this.page.goto(
      "https://magento.softwaretestingboard.com/men/tops-men/jackets-men.html",
    );
  }
  async navigateToWomenTopsJackets() {
    await this.page.goto(
      "https://magento.softwaretestingboard.com/women/tops-women/jackets-women.html",
    );
  }
}
