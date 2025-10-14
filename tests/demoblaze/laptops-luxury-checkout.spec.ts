import { test, expect } from '@playwright/test';
import { DemoblazeHomePage } from '../pages/DemoblazeHomePage';
import { DemoblazeCartPage } from '../pages/DemoblazeCartPage';
import { DemoblazeCheckoutPage } from '../pages/DemoblazeCheckoutPage';

test.describe('Demoblaze - Laptops Luxury Checkout Flow', () => {
  test('Browse Laptops, add luxury item, checkout on Demoblaze @smoke', async ({ page }) => {
    const home = new DemoblazeHomePage(page);
    const cart = new DemoblazeCartPage(page);
    const checkout = new DemoblazeCheckoutPage(page);

    // Step 1: Navigate to Demoblaze homepage
    await home.navigate();
    
    // Step 2: Navigate to Laptops category
    await home.selectCategory('Laptops');
    
    // Step 3: Find and add luxury item (most expensive laptop)
    await home.findLuxuryItem();
    
    // Step 4: Navigate to cart and verify item
    await cart.navigateToCart();
    await cart.verifyItem('MacBook Pro'); // Changed from 'Sony vaio i7' to 'MacBook Pro'
    
    // Step 5: Proceed to checkout
    await cart.proceedToCheckout();
    
    // Step 6: Fill out order form
    await checkout.fillForm('Test User', 'USA', 'New York', '4111111111111111', '12', '2026');
    
    // Step 7: Complete the purchase
    await checkout.completePurchase();
    
    // Step 8: Verify order confirmation
    await checkout.verifyConfirmation();
  });

  // Add more tests here for additional scenarios
  
  test('Verify luxury laptop detection works correctly', async ({ page }) => {
    const home = new DemoblazeHomePage(page);
    const cart = new DemoblazeCartPage(page);
    
    await home.navigate();
    await home.selectCategory('Laptops');
    
    // Use the working method from DemoblazeHomePage
    await home.findLuxuryItem();
    
    // Verify it was added by going to cart
    await cart.navigateToCart();
    const cartItems = await cart.getCartItemDetails();
    expect(cartItems.length).toBeGreaterThan(0);
    
    // Check that we have the MacBook Pro (our luxury item)
    expect(cartItems[0].title).toContain('MacBook Pro');
    console.log('Luxury detection verified successfully!');
  });

  test('Complete checkout with multiple items', async ({ page }) => {
    const home = new DemoblazeHomePage(page);
    const cart = new DemoblazeCartPage(page);
    const checkout = new DemoblazeCheckoutPage(page);
    
    await home.navigate();
    await home.selectCategory('Laptops');
    
    // Add first laptop (luxury item)
    await home.findLuxuryItem();
    console.log('Added first laptop to cart');
    
    // Navigate back to homepage and then to laptops again
    await home.navigate();
    await home.selectCategory('Laptops');
    
    // Add second laptop (first available item)
    await page.waitForSelector('.card-block .card-title a.hrefch');
    await page.click('.card-block .card-title a.hrefch >> nth=0');
    await page.waitForSelector('.btn.btn-success.btn-lg');
    
    // Set up dialog handler and add to cart
    page.once('dialog', dialog => dialog.accept());
    await page.click('.btn.btn-success.btn-lg');
    await page.waitForTimeout(1000);
    console.log('Added second laptop to cart');
    
    // Go to cart
    await cart.navigateToCart();
    
    // Verify we have 2 items
    const cartItemCount = await cart.getCartItemsCount();
    expect(cartItemCount).toBe(2);
    
    // Get total price
    const totalPrice = await cart.getTotal();
    console.log(`Total cart value: ${totalPrice}`);
    
    // Proceed to checkout
    await cart.proceedToCheckout();
    
    // Fill order form
    await checkout.fillForm('Jane Smith', 'Canada', 'Toronto', '9876543210987654', '06', '2026');
    await checkout.completePurchase();
    
    // Verify confirmation
    await checkout.verifyConfirmation();
  });

  test('Handle form validation scenarios', async ({ page }) => {
    const home = new DemoblazeHomePage(page);
    const cart = new DemoblazeCartPage(page);
    const checkout = new DemoblazeCheckoutPage(page);
    
    await home.navigate();
    await home.selectCategory('Laptops');
    await home.addFirstProductToCart();
    
    // Go to cart and proceed to checkout
    await cart.navigateToCart();
    await cart.proceedToCheckout();
    
    // Try to purchase without filling form
    await checkout.completePurchase();
    
    // The form should not submit without required fields
    // Verify the modal stays open (Demoblaze doesn't have client-side validation)
    const orderModal = await checkout.orderModal();
    await expect(orderModal).toBeVisible();
  });
});
