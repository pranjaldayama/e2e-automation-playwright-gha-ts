import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

interface ShippingAddress {
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators for shipping information
  private readonly emailInput: Locator = this.page.locator('#customer-email');
  private readonly firstNameInput: Locator = this.page.locator('input[name="firstname"]');
  private readonly lastNameInput: Locator = this.page.locator('input[name="lastname"]');
  private readonly streetInput: Locator = this.page.locator('input[name="street[0]"]');
  private readonly cityInput: Locator = this.page.locator('input[name="city"]');
  private readonly stateSelect: Locator = this.page.locator('select[name="region_id"]');
  private readonly postcodeInput: Locator = this.page.locator('input[name="postcode"]');
  private readonly countrySelect: Locator = this.page.locator('select[name="country_id"]');
  private readonly phoneInput: Locator = this.page.locator('input[name="telephone"]');
  private readonly nextButton: Locator = this.page.locator('button.button.action.continue');

  // Locators for discount code
  private readonly discountCodeToggle: Locator = this.page.getByRole('heading', { name: 'Apply Discount Code' });
  private readonly discountCodeInput: Locator = this.page.locator('input[name="discount_code"]');
  private readonly applyDiscountButton: Locator = this.page.getByRole('button', { name: 'Apply Discount' });

  // Locators for order summary and totals
  private readonly orderTotal: Locator = this.page.locator('tr.grand.totals span.price');
  private readonly discountedAmountElement: Locator = this.page.locator('td.amount span.price[data-th="checkout.sidebar.summary.totals.discount"]');
  private readonly shippingCostDisplay: Locator = this.page.locator('tr.shipping span.price');
  private readonly placeOrderButton: Locator = this.page.getByRole('button', { name: 'Place Order' });
  private readonly thankYouMessage: Locator = this.page.locator('span.base:has-text("Thank you for your purchase!")');


  async fillShippingAddress(data: ShippingAddress) {
    await this.page.waitForLoadState('networkidle');
    // For logged-in users, email might be pre-filled or read-only
    if (await this.emailInput.isVisible() && await this.emailInput.isEnabled()) {
        await this.emailInput.fill(data.email);
    }
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.countrySelect.selectOption({ label: data.country });
    await this.page.waitForLoadState('networkidle');
    try {
        await this.stateSelect.selectOption({ label: data.state }, { timeout: 2000 });
    } catch (e) {
        const stateTextInput = this.page.locator('input[name="region"]');
        if (await stateTextInput.isVisible()) {
            await stateTextInput.fill(data.state);
        } else {
            console.warn(`Could not set state using select or text input. Check HTML for state field}`);
        }
    }
    await this.postcodeInput.fill(data.postcode);
    await this.phoneInput.fill(data.phone);

    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectShippingMethod() {
    await this.page.locator('input[type="radio"][value="flatrate_flatrate"]').click();
    await this.page.waitForLoadState('networkidle');
   await this.nextButton.click();
  }

  async applyDiscountCode(code: string) {
    await this.discountCodeToggle.isVisible()
    await this.discountCodeToggle.click();
    if (await this.discountCodeToggle.isVisible()) {
      const ariaExpanded = await this.discountCodeToggle.getAttribute('aria-expanded');
      if (ariaExpanded === 'false') {
        await this.discountCodeToggle.click();
      }
    }
    await this.discountCodeInput.fill(code);
    await this.applyDiscountButton.click();
    await this.page.waitForLoadState('networkidle'); // Wait for discount to apply
    await this.page.waitForSelector('.opc-block-summary .loader', { state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async getOrderTotal(): Promise<number> {
    const totalText = await this.orderTotal.textContent();
    expect(totalText).not.toBeNull();
    return parseFloat(totalText!.replace(/[^0-9.-]+/g,"")); // Remove currency symbol and parse
  }

  async getDiscountAmount(): Promise<number> {

    await this.discountedAmountElement.waitFor({ state: 'visible', timeout: 10000 });
    await this.discountedAmountElement.isEnabled();
    // Check if the discount element is visible. If not, return 0.
    if (!(await this.discountedAmountElement.isVisible())) {
      return 0;
    }
    const discountText = await this.discountedAmountElement.textContent();
    expect(discountText).not.toBeNull();
    discountText?.trim();
    // Discount amount is usually negative, return absolute value for easier comparison
    return Math.abs(parseFloat(discountText!.replace(/[^0-9.-]+/g,"")));
  }

  async getShippingCost(): Promise<number> {
    const shippingCostText = await this.shippingCostDisplay.textContent();
    expect(shippingCostText).not.toBeNull();
    return parseFloat(shippingCostText!.replace(/[^0-9.-]+/g,""));
  }

  async placeOrderAndVerifySuccess() {
    await expect(this.placeOrderButton).toBeVisible({ timeout: 10000 });
    await expect(this.placeOrderButton).toBeEnabled({ timeout: 5000 });

    await this.placeOrderButton.click();
    await this.page.waitForURL(/.*checkout\/onepage\/success/, { waitUntil: 'domcontentloaded' });

    await expect(this.thankYouMessage).toBeVisible({ timeout: 15000 });
    await expect(this.thankYouMessage).toHaveText('Thank you for your purchase!');
}
}