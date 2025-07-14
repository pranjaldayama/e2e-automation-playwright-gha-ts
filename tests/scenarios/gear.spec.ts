import { test, expect } from '../fixtures/baseFixture';
import { HomePage } from '../../pages/homePage';
import { ProductListingPage } from '../../pages/productListingPage';
import { ProductDetailsPage } from '../../pages/productDetailsPage';
import { ShoppingCartPage } from '../../pages/shoppingCartPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { testData } from '../../utils/testData';
import { logSkip } from '../../utils/helpers';

const BASE_URL = 'https://magento.softwaretestingboard.com/';

test('Gear: Add random Yoga Bag to cart and checkout with discount', async ({ page }) => {
  const home = new HomePage(page);
  const listing = new ProductListingPage(page);
  const details = new ProductDetailsPage(page);
  const cart = new ShoppingCartPage(page);
  const checkout = new CheckoutPage(page);

  await home.goto(BASE_URL);
  await home.navigateToGearBags();

  // Apply filter for Activity Yoga
  const activityApplied = await listing.applyFilter('Activity', testData.gear.activity);
  if (!activityApplied) {
    logSkip('No bags found for Activity Yoga');
    test.skip();
  }

  // Select random product
  const productSelected = await listing.selectRandomProduct();
  if (!productSelected) {
    logSkip('No product available after filtering');
    test.skip();
  }

  // Set quantity and add to cart
  await details.setQuantity(testData.gear.quantity);
  await details.addToCart();

  // Go to cart and checkout
  await page.goto(BASE_URL + 'checkout/cart/');
  await cart.proceedToCheckout();

  // Apply discount and set shipping
  await checkout.applyDiscountCode(testData.discountCode);
  await checkout.setShippingCountry(testData.shippingCountry);

  // Assert discount applied
  const discount = await checkout.getDiscountAmount();
  expect(discount).not.toBeNull();
}); 