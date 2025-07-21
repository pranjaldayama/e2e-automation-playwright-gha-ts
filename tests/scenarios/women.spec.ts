
import { test, expect } from "@playwright/test";
import { ProductListingPage } from "../../pages/productListingPage";
import { CheckoutPage } from "../../pages/checkoutPage";
import { testData } from "../../utils/testData";
import { dismissAnnoyances } from "../../utils/helpers";
import { BasePage } from "../../pages/basePage";

test.describe("Womens Category Tests", () => {
  let basePage: BasePage;
  let productListingPage: ProductListingPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    productListingPage = new ProductListingPage(page);
    checkoutPage = new CheckoutPage(page);

    await page.route("**#google_vignette", (route) => {
      route.abort();
    });

    await page.route(
      /googlesyndication\.com|googleadservices\.com|doubleclick\.net|google-analytics\.com/,
      (route) => {
        route.abort();
      },
    );

    await basePage.login(testData.baseUrl);
    await dismissAnnoyances(page);
  });

  test("Add product from Women -> Tops -> Jackets (filtered) and checkout with discount and shipping", async ({
    page,
  }) => {
    await basePage.navigateToWomenTopsJackets();
    await expect(page.locator("#page-title-heading span.base")).toHaveText("Jackets");

    await productListingPage.applyFilterAndAddRandomProductToCart(
      testData.women.name,
      testData.women.size
    );

    await productListingPage.proceedToCheckoutFromMiniCart();
    await expect(page).toHaveURL(/.*checkout/);

   // Fill shipping address for Netherlands - Not needed for this test user as the shipping address is already stored.
   // await checkoutPage.fillShippingAddress(testData); // This line is commented out as per the note above.

    await checkoutPage.selectShippingMethod();

    await checkoutPage.applyDiscountCode(testData.discountCode);

    const discountAmount = await checkoutPage.getDiscountAmount();
    const totalAfterDiscount = await checkoutPage.getOrderTotal();

    if (!(discountAmount > 0)) {
      throw new Error("Discount amount should be greater than 0");
    }
    expect(totalAfterDiscount).toBeGreaterThan(discountAmount);

    await checkoutPage.placeOrderAndVerifySuccess();
  });
});
