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

  async applyFilterAndAddRandomProductToCart(
    categoryName: string,
    optionName: string,
    desiredSize?: string,
    desiredColor?: string,
    desiredQuantity: number = 1
  ): Promise<string | null> {
    try {
      const categoryFilterSelector = `//div[contains(@class, "filter-options-title") and normalize-space()="${categoryName}"]`;
      const filterTitle = this.page.locator(categoryFilterSelector);
      if (await filterTitle.isVisible()) {
        await filterTitle.click();
      }
  
      const optionSelector = `//div[contains(@class,"filter-options-content") and preceding-sibling::div[normalize-space()="${categoryName}"]]//a[contains(text(), "${optionName}")]`;
      const filterOption = this.page.locator(optionSelector);
      await filterOption.click();
  
      await this.page.waitForSelector('.product-item');
  
      const products = await this.page.$$eval('.product-item-info a.product-item-link', (links) =>
        links.map((link) => (link as HTMLAnchorElement).href)
      );
  
      if (products.length === 0) {
        console.warn(' No products found after applying the filter.');
        return null;
      }
  
      const randomIndex = Math.floor(Math.random() * products.length);
      const randomProductUrl = products[randomIndex];
      console.log(`🎯 Navigating to: ${randomProductUrl}`);
  
      await this.page.goto(randomProductUrl, { waitUntil: 'domcontentloaded' });
  
      if (categoryName === "Women" || categoryName === "Men") {
       const sizeOptions = await this.page.locator('.swatch-attribute.size .swatch-option.text').all();
        
       let selectedSizeElement;
  
        if (sizeOptions.length > 0) {
          if (desiredSize) {
            selectedSizeElement = sizeOptions.find(async (opt) => (await opt.getAttribute('option-label'))?.toUpperCase() === desiredSize.toUpperCase());
            if (!selectedSizeElement) {
              console.warn(`Desired size "${desiredSize}" not found. Selecting a random available size.`);
              selectedSizeElement = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
            }
          } else {
            selectedSizeElement = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
          }
  
          if (selectedSizeElement) {
            console.log(`Selecting size: ${await selectedSizeElement.getAttribute('option-label')}`);
            await selectedSizeElement.click();
            await this.page.waitForTimeout(500);
          } else {
            console.warn("No size options to select.");
          }
        } else {
          console.log("No size options found for this product.");
        }
       
        const colorOptions = await this.page.locator('.swatch-attribute.color .swatch-option.color').all();
        let selectedColorElement;
  
        if (colorOptions.length > 0) {
          if (desiredColor) {
            selectedColorElement = colorOptions.find(async (opt) => (await opt.getAttribute('option-label'))?.toUpperCase() === desiredColor.toUpperCase());
            if (!selectedColorElement) {
              console.warn(`Desired color "${desiredColor}" not found. Selecting a random available color.`);
              selectedColorElement = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            }
          } else {
            selectedColorElement = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          }
  
          if (selectedColorElement) {
            console.log(`Selecting color: ${await selectedColorElement.getAttribute('option-label')}`);
            await selectedColorElement.click();
            await this.page.waitForTimeout(500);
          } else {
            console.warn("No color options to select.");
          }
        } else {
          console.log("No color options found for this product.");
        }
  
  
      const qtyInput = this.page.locator('#qty');
        if (await qtyInput.isVisible()) {
          console.log(`Setting quantity to: ${desiredQuantity}`);
          await qtyInput.fill(desiredQuantity.toString());
        } else {
          console.warn("Quantity input field not found.");
        }
      }
  
      const addToCartButton = this.page.locator('button.tocart');
      await addToCartButton.waitFor({ state: 'visible', timeout: 5000 });
      await addToCartButton.click();
  
      await this.page.waitForSelector('.message-success', { timeout: 5000 });
      console.log('Product added to cart successfully!');
  
      return randomProductUrl;
    } catch (err) {
      console.error('Error in applyFilterAndAddRandomProductToCart:', err);
      return null;
    }
  }
}
