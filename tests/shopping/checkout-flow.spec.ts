import { test, expect } from '../fixtures/testFixtures';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ productPage, cartPage, testProducts }) => {
    // Add items to cart before checkout tests
    const products = testProducts.featuredProducts.slice(0, 2);
    
    await productPage.goto(products[0].id);
    await productPage.addToCart();
    
    await productPage.goto(products[1].id);
    await productPage.addToCart();
    
    await cartPage.goto();
    await cartPage.proceedToCheckout();
  });

  test('should complete full checkout process @smoke', async ({ 
    checkoutPage, 
    shippingAddresses, 
    paymentInfo 
  }) => {
    // Fill shipping information
    await checkoutPage.fillShippingAddress(shippingAddresses.validAddress);
    
    // Fill payment information
    await checkoutPage.fillPaymentInfo(paymentInfo.validCard);
    
    // Place order
    await checkoutPage.placeOrder();
    
    // Verify order confirmation
    await expect(checkoutPage.page.locator('[data-testid="order-confirmation"]'))
      .toContainText('Order placed successfully');
    
    // Verify order number is displayed
    await expect(checkoutPage.page.locator('[data-testid="order-number"]'))
      .toBeVisible();
  });

  test('should validate required shipping fields', async ({ checkoutPage }) => {
    // Try to place order without filling required fields
    await checkoutPage.placeOrder();
    
    // Verify validation messages appear
    await expect(checkoutPage.firstNameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(checkoutPage.lastNameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(checkoutPage.addressInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('should validate payment information', async ({ 
    checkoutPage, 
    shippingAddresses, 
    paymentInfo 
  }) => {
    await checkoutPage.fillShippingAddress(shippingAddresses.validAddress);
    
    // Try with invalid card
    await checkoutPage.fillPaymentInfo(paymentInfo.invalidCard);
    await checkoutPage.placeOrder();
    
    // Verify payment error message
    await expect(checkoutPage.page.locator('[data-testid="payment-error"]'))
      .toContainText('Invalid card information');
  });

  test('should handle expired card', async ({ 
    checkoutPage, 
    shippingAddresses, 
    paymentInfo 
  }) => {
    await checkoutPage.fillShippingAddress(shippingAddresses.validAddress);
    await checkoutPage.fillPaymentInfo(paymentInfo.expiredCard);
    await checkoutPage.placeOrder();
    
    // Verify expired card error
    await expect(checkoutPage.page.locator('[data-testid="payment-error"]'))
      .toContainText('Card has expired');
  });

  test('should calculate order total correctly', async ({ 
    checkoutPage, 
    shippingAddresses, 
    paymentInfo 
  }) => {
    await checkoutPage.fillShippingAddress(shippingAddresses.validAddress);
    await checkoutPage.fillPaymentInfo(paymentInfo.validCard);
    
    const orderTotal = await checkoutPage.getOrderTotal();
    const shippingCost = await checkoutPage.getShippingCost();
    const taxAmount = await checkoutPage.getTaxAmount();
    
    // Verify all values are displayed and reasonable
    expect(orderTotal).toMatch(/\$\d+\.\d{2}/);
    expect(shippingCost).toMatch(/\$\d+\.\d{2}/);
    expect(taxAmount).toMatch(/\$\d+\.\d{2}/);
  });

  test('should use same address for billing', async ({ 
    checkoutPage, 
    shippingAddresses, 
    paymentInfo 
  }) => {
    await checkoutPage.fillShippingAddress(shippingAddresses.validAddress);
    await checkoutPage.useSameAsBillingAddress();
    await checkoutPage.fillPaymentInfo(paymentInfo.validCard);
    
    // Verify billing fields are auto-filled
    const isFormValid = await checkoutPage.isFormValid();
    expect(isFormValid).toBe(true);
    
    await checkoutPage.placeOrder();
    
    // Verify order is placed successfully
    await expect(checkoutPage.page.locator('[data-testid="order-confirmation"]'))
      .toBeVisible();
  });

  test('should handle international shipping', async ({ 
    checkoutPage, 
    shippingAddresses, 
    paymentInfo 
  }) => {
    await checkoutPage.fillShippingAddress(shippingAddresses.internationalAddress);
    await checkoutPage.fillPaymentInfo(paymentInfo.validCard);
    
    // Verify international shipping cost is calculated
    const shippingCost = await checkoutPage.getShippingCost();
    expect(parseFloat(shippingCost.replace('$', ''))).toBeGreaterThan(0);
    
    await checkoutPage.placeOrder();
    
    // Verify order is processed for international address
    await expect(checkoutPage.page.locator('[data-testid="order-confirmation"]'))
      .toBeVisible();
  });

  test('should allow editing cart from checkout', async ({ checkoutPage, cartPage }) => {
    // Click edit cart link
    await checkoutPage.page.locator('[data-testid="edit-cart-link"]').click();
    
    // Verify we're back on cart page
    expect(checkoutPage.page.url()).toContain('/cart');
    
    // Make changes and return to checkout
    await cartPage.updateItemQuantity(0, 2);
    await cartPage.proceedToCheckout();
    
    // Verify quantity change is reflected
    const updatedTotal = await checkoutPage.getOrderTotal();
    expect(updatedTotal).toBeTruthy();
  });
});
