import { test, expect } from '../fixtures/testFixtures';

test.describe('Shopping Cart - Add to Cart', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should add a single product to cart @smoke', async ({ 
    homePage, 
    productPage, 
    cartPage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    
    // Navigate to product page
    await homePage.searchForProduct(product.name);
    await productPage.goto(product.id);
    
    // Verify product details
    await expect(productPage.productTitle).toContainText(product.name);
    await expect(productPage.productPrice).toContainText(product.price);
    
    // Select size and color if available
    if (await productPage.sizeSelector.isVisible()) {
      await productPage.selectSize(product.sizes[0]);
    }
    if (await productPage.colorSelector.isVisible()) {
      await productPage.selectColor(product.colors[0]);
    }
    
    // Add to cart
    await productPage.addToCart();
    
    // Verify cart icon shows item count
    await expect(homePage.cartIcon).toContainText('1');
    
    // Navigate to cart and verify item
    await cartPage.goto();
    const cartItems = await cartPage.getCartItems();
    
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].name).toContain(product.name);
    expect(cartItems[0].price).toContain(product.price);
    expect(cartItems[0].quantity).toBe(1);
  });

  test('should add multiple quantities of the same product', async ({ 
    productPage, 
    cartPage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    const quantity = 3;
    
    await productPage.goto(product.id);
    await productPage.setQuantity(quantity);
    await productPage.addToCart();
    
    await cartPage.goto();
    const cartItems = await cartPage.getCartItems();
    
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].quantity).toBe(quantity);
  });

  test('should not add out of stock product to cart', async ({ 
    productPage, 
    testProducts 
  }) => {
    const outOfStockProduct = testProducts.outOfStockProduct;
    
    await productPage.goto(outOfStockProduct.id);
    
    // Verify add to cart button is disabled or shows out of stock
    await expect(productPage.addToCartButton).toBeDisabled();
  });

  test('should add different products to cart', async ({ 
    homePage, 
    productPage, 
    cartPage, 
    testProducts 
  }) => {
    const products = testProducts.featuredProducts.slice(0, 2);
    
    // Add first product
    await productPage.goto(products[0].id);
    await productPage.addToCart();
    
    // Add second product
    await productPage.goto(products[1].id);
    await productPage.addToCart();
    
    // Verify both products in cart
    await cartPage.goto();
    const cartItems = await cartPage.getCartItems();
    
    expect(cartItems).toHaveLength(2);
    expect(cartItems[0].name).toContain(products[0].name);
    expect(cartItems[1].name).toContain(products[1].name);
  });

  test('should show success message when adding to cart', async ({ 
    productPage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    
    await productPage.goto(product.id);
    await productPage.addToCart();
    
    // Verify success message appears
    await expect(productPage.page.locator('[data-testid="success-message"]'))
      .toContainText('Added to cart');
  });
});
