import { test, expect } from '../fixtures/testFixtures';

test.describe('Shopping Cart - Cart Management', () => {
  test.beforeEach(async ({ productPage, cartPage, testProducts }) => {
    // Add items to cart before each test
    const products = testProducts.featuredProducts.slice(0, 2);
    
    await productPage.goto(products[0].id);
    await productPage.addToCart();
    
    await productPage.goto(products[1].id);
    await productPage.addToCart();
    
    await cartPage.goto();
  });

  test('should display cart items correctly', async ({ cartPage, testProducts }) => {
    const products = testProducts.featuredProducts.slice(0, 2);
    const cartItems = await cartPage.getCartItems();
    
    expect(cartItems).toHaveLength(2);
    expect(cartItems[0].name).toContain(products[0].name);
    expect(cartItems[1].name).toContain(products[1].name);
  });

  test('should update item quantity', async ({ cartPage }) => {
    const newQuantity = 3;
    
    await cartPage.updateItemQuantity(0, newQuantity);
    
    const cartItems = await cartPage.getCartItems();
    expect(cartItems[0].quantity).toBe(newQuantity);
  });

  test('should remove item from cart', async ({ cartPage }) => {
    const initialCount = await cartPage.getCartItemsCount();
    
    await cartPage.removeItem(0);
    
    const finalCount = await cartPage.getCartItemsCount();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('should clear entire cart', async ({ cartPage }) => {
    await cartPage.clearCart();
    
    const isCartEmpty = await cartPage.isCartEmpty();
    expect(isCartEmpty).toBe(true);
  });

  test('should calculate subtotal correctly', async ({ cartPage, testProducts }) => {
    const products = testProducts.featuredProducts.slice(0, 2);
    
    // Update quantities to test calculation
    await cartPage.updateItemQuantity(0, 2);
    await cartPage.updateItemQuantity(1, 1);
    
    const subtotal = await cartPage.getSubtotal();
    const expectedSubtotal = 2 * 19.99 + 1 * 59.99; // Based on test data prices
    
    expect(parseFloat(subtotal.replace('$', ''))).toBeCloseTo(expectedSubtotal, 2);
  });

  test('should apply promo code successfully', async ({ cartPage }) => {
    const promoCode = 'SAVE10';
    
    await cartPage.applyPromoCode(promoCode);
    
    const promoMessage = await cartPage.getPromoCodeMessage();
    expect(promoMessage).toContain('Promo code applied');
  });

  test('should show error for invalid promo code', async ({ cartPage }) => {
    const invalidPromoCode = 'INVALID';
    
    await cartPage.applyPromoCode(invalidPromoCode);
    
    const promoMessage = await cartPage.getPromoCodeMessage();
    expect(promoMessage).toContain('Invalid promo code');
  });

  test('should proceed to checkout', async ({ cartPage }) => {
    await cartPage.proceedToCheckout();
    
    // Verify we're on checkout page
    expect(cartPage.page.url()).toContain('/checkout');
  });

  test('should continue shopping from cart', async ({ cartPage }) => {
    await cartPage.continueShopping();
    
    // Verify we're back on home page
    expect(cartPage.page.url()).toContain('/');
  });

  test('should persist cart items on page refresh', async ({ cartPage, testProducts }) => {
    const initialItems = await cartPage.getCartItemsCount();
    
    // Refresh the page
    await cartPage.page.reload();
    await cartPage.waitForPageLoad();
    
    const itemsAfterRefresh = await cartPage.getCartItemsCount();
    expect(itemsAfterRefresh).toBe(initialItems);
  });
});
