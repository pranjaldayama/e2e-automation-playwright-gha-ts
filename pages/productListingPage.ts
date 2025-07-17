import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductListingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly productItems: Locator = this.page.locator(
    "ol.products-list > li.product-item",
  );
  private readonly addToCartButton: (productId: string) => Locator = (
    productId,
  ) => this.page.locator(`button[data-product-id="${productId}"]`);
  private readonly miniCartButton: Locator =
    this.page.locator(".action.showcart");
  private readonly proceedToCheckoutButton: Locator = this.page.locator(
    "#top-cart-btn-checkout",
  );
  private readonly filtersContainer: Locator =
    this.page.locator("#narrow-by-list");

  getFilterCategoryTitle(categoryName: string): Locator {
    return this.filtersContainer.locator(
      `div.filter-options-title[role="tab"]:has-text("${categoryName}")`,
    );
  }

  getFilterCategoryContent(categoryName: string): Locator {
    return this.filtersContainer.locator(
      `div[data-role="collapsible"]:has(div.filter-options-title[role="tab"]:has-text("${categoryName}")) div[data-role="content"]`,
    );
  }

  getFilterOptionLink(categoryName: string, optionName: string): Locator {
    const categoryContent = this.getFilterCategoryContent(categoryName);
    return categoryContent.locator(
      `a:has(span:has-text(/${optionName} \\(\\d+ item \\)/))`,
    );
  }

  async applyFilter(categoryName: string, optionName: string) {
    const categoryTitle = this.getFilterCategoryTitle(categoryName);
    const categoryContent = this.getFilterCategoryContent(categoryName);
    const optionLink = this.getFilterOptionLink(categoryName, optionName);

    if ((await categoryTitle.getAttribute("aria-expanded")) === "false") {
      await categoryTitle.click();
      await expect(categoryTitle).toHaveAttribute("aria-expanded", "true");
      await expect(categoryContent).toBeVisible();
    } else {
      console.log(`Category "${categoryName}" is already expanded.`);
    }
    const activityTitle = this.page.locator(
      `div.filter-options-title[role="tab"]:has-text("${categoryName}")`,
    );
    if ((await activityTitle.getAttribute("aria-expanded")) === "false") {
      await activityTitle.click();
      await expect(activityTitle).toHaveAttribute("aria-expanded", "true");
      await expect(
        this.page.locator(
          `div[data-role="collapsible"]:has(div[data-role="title"]:has-text("${categoryName}")) div[data-role="content"]`,
        ),
      ).toBeVisible();
    }
    await this.page.locator(`div[data-role="collapsible"]:has(div[data-role="title"]:has-text("${categoryName}")) div[data-role="content"] ol.items li.item a:has-text("${optionName}")`).click();                            
  }

  async addRandomProductToCart() {
    await this.page.waitForSelector(".product-item", {
      state: "visible",
      timeout: 10000,
    });

    const productItems = this.page.locator(".product-item");
    const count = await productItems.count();
    if (count === 0) {
      throw new Error("No products found on the listing page.");
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomProduct = productItems.nth(randomIndex);
    const productName = await randomProduct
      .locator(".product-item-name a, .product-item-link")
      .textContent();
    await randomProduct.click();
    const addToCartButtonByRole = this.page.getByRole("button", {
      name: "Add to Cart",
    });
    const possibleLoadingMask = this.page.locator(".loading-mask");
    if (await possibleLoadingMask.isVisible()) {
      await expect(possibleLoadingMask).toBeHidden({ timeout: 15000 });
    }

    await addToCartButtonByRole.click();

    try {
      await expect(this.page.locator(".message-success")).toBeVisible({
        timeout: 15000,
      });
    } catch (error: any) {
      console.error(
        `Failed to add product "${productName}" to cart: Product Selected is Out of Stock.`,
        error.message,
      );
      throw error;
    }
  }

  async proceedToCheckoutFromMiniCart() {
    await this.miniCartButton.waitFor({ state: "visible" });
    await this.miniCartButton.click();

    await this.proceedToCheckoutButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.proceedToCheckoutButton.click();

    await this.page.waitForURL(/.*checkout/, { waitUntil: "domcontentloaded" });
  }
}
