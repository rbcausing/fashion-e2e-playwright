import { test, expect } from '../fixtures/testFixtures';

test.describe('Smoke Tests - Critical Functionality', () => {
  test('should load homepage successfully @smoke', async ({ homePage }) => {
    await homePage.goto();
    
    // Verify page loads
    await expect(homePage.page).toHaveTitle(/Fashion|Store|Shop/);
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.navigationMenu).toBeVisible();
  });

  test('should search for products @smoke', async ({ 
    homePage, 
    testProducts 
  }) => {
    await homePage.goto();
    
    const product = testProducts.featuredProducts[0];
    await homePage.searchForProduct(product.name);
    
    // Verify search results page loads
    await expect(homePage.page.locator('[data-testid="search-results"]'))
      .toBeVisible();
  });

  test('should add product to cart @smoke', async ({ 
    productPage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    
    await productPage.goto(product.id);
    await productPage.addToCart();
    
    // Verify product was added to cart
    await expect(productPage.page.locator('[data-testid="cart-icon"]'))
      .toContainText('1');
  });

  test('should proceed to checkout @smoke', async ({ 
    productPage, 
    cartPage, 
    checkoutPage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    
    // Add product to cart
    await productPage.goto(product.id);
    await productPage.addToCart();
    
    // Go to cart and proceed to checkout
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    
    // Verify checkout page loads
    await expect(checkoutPage.shippingSection).toBeVisible();
    await expect(checkoutPage.paymentSection).toBeVisible();
  });

  test('should complete user registration @smoke', async ({ 
    homePage, 
    testUsers 
  }) => {
    const timestamp = Date.now();
    const uniqueEmail = `smoke-test-${timestamp}@example.com`;
    
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Fill registration form
    await homePage.page.locator('[data-testid="first-name-input"]').fill('Smoke');
    await homePage.page.locator('[data-testid="last-name-input"]').fill('Test');
    await homePage.page.locator('[data-testid="email-input"]').fill(uniqueEmail);
    await homePage.page.locator('[data-testid="password-input"]').fill('SmokeTest123!');
    await homePage.page.locator('[data-testid="confirm-password-input"]').fill('SmokeTest123!');
    
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify registration success
    await expect(homePage.page.locator('[data-testid="registration-success"]'))
      .toBeVisible();
  });
});
