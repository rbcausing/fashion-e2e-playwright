import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import testUsers from '../data/testUsers.json';
import testProducts from '../data/testProducts.json';
import shippingAddresses from '../data/shippingAddresses.json';
import paymentInfo from '../data/paymentInfo.json';

// Extend basic test by providing page objects and test data
export const test = base.extend<{
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: ShoppingCartPage;
  checkoutPage: CheckoutPage;
  testUsers: typeof testUsers;
  testProducts: typeof testProducts;
  shippingAddresses: typeof shippingAddresses;
  paymentInfo: typeof paymentInfo;
}>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  
  cartPage: async ({ page }, use) => {
    const cartPage = new ShoppingCartPage(page);
    await use(cartPage);
  },
  
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  
  testUsers: async ({}, use) => {
    await use(testUsers);
  },
  
  testProducts: async ({}, use) => {
    await use(testProducts);
  },
  
  shippingAddresses: async ({}, use) => {
    await use(shippingAddresses);
  },
  
  paymentInfo: async ({}, use) => {
    await use(paymentInfo);
  },
});

export { expect } from '@playwright/test';
