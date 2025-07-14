import { test, expect } from '../fixtures/baseFixture';
import { HomePage } from '../../pages/homePage';
import { ProductListingPage } from '../../pages/productListingPage';
import { ProductDetailsPage } from '../../pages/productDetailsPage';
import { ShoppingCartPage } from '../../pages/shoppingCartPage';
import { CheckoutPage } from '../../pages/checkoutPage';
import { testData } from '../../utils/testData';
import { logSkip } from '../../utils/helpers';

const BASE_URL = 'https://magento.softwaretestingboard.com/';

test.only('Women: Add 2x XS Blue Jacket to cart and checkout with discount', async ({ page }) => {
  const home = new HomePage(page);
  const listing = new ProductListingPage(page);
  const details = new ProductDetailsPage(page);
  const cart = new ShoppingCartPage(page);
  const checkout = new CheckoutPage(page);

  await home.goto(BASE_URL);
  await home.navigateToWomenTopsJackets();

  // Apply filters
  const sizeApplied = await listing.applyFilter('Size', testData.women.size);
  const colorApplied = await listing.applyFilter('Color', testData.women.color);
  if (!sizeApplied || !colorApplied) {
    logSkip('No products found for Women Jackets with Size XS and Color Blue');
    test.skip();
  }

  // Select product
  const productSelected = await listing.selectFirstProduct();
  if (!productSelected) {
    logSkip('No product available after filtering');
    test.skip();
  }

  // Select size, color, quantity
  await details.selectSize(testData.women.size);
  await details.selectColor(testData.women.color);
  await details.setQuantity(testData.women.quantity);
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