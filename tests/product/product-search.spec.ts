import { test, expect } from '../fixtures/testFixtures';

test.describe('Product Search', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should search for products by name @smoke', async ({ 
    homePage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    
    await homePage.searchForProduct(product.name);
    
    // Verify search results page
    await expect(homePage.page.locator('[data-testid="search-results"]'))
      .toBeVisible();
    
    // Verify product appears in results
    await expect(homePage.page.locator('[data-testid="product-card"]')
      .filter({ hasText: product.name }))
      .toBeVisible();
  });

  test('should show no results for non-existent product', async ({ homePage }) => {
    const nonExistentProduct = 'NonExistentProduct123';
    
    await homePage.searchForProduct(nonExistentProduct);
    
    // Verify no results message
    await expect(homePage.page.locator('[data-testid="no-results-message"]'))
      .toContainText('No products found');
  });

  test('should search with partial product name', async ({ 
    homePage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    const partialName = product.name.split(' ')[0]; // First word
    
    await homePage.searchForProduct(partialName);
    
    // Verify search results contain products with partial match
    await expect(homePage.page.locator('[data-testid="product-card"]'))
      .toHaveCount(1, { timeout: 5000 });
  });

  test('should filter search results by category', async ({ 
    homePage, 
    testProducts 
  }) => {
    await homePage.searchForProduct('shirt');
    
    // Apply category filter
    await homePage.page.locator('[data-testid="category-filter"]')
      .locator(`text=${testProducts.featuredProducts[0].category}`)
      .click();
    
    // Verify filtered results
    await expect(homePage.page.locator('[data-testid="product-card"]'))
      .toHaveCount(1, { timeout: 5000 });
  });

  test('should sort search results by price', async ({ homePage }) => {
    await homePage.searchForProduct('clothing');
    
    // Sort by price low to high
    await homePage.page.locator('[data-testid="sort-dropdown"]')
      .selectOption('price-low-high');
    
    // Verify products are sorted by price
    const prices = await homePage.page.locator('[data-testid="product-price"]')
      .allTextContents();
    
    const numericPrices = prices.map(price => 
      parseFloat(price.replace(/[$,]/g, ''))
    );
    
    // Verify prices are in ascending order
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test('should sort search results by rating', async ({ homePage }) => {
    await homePage.searchForProduct('shoes');
    
    // Sort by rating high to low
    await homePage.page.locator('[data-testid="sort-dropdown"]')
      .selectOption('rating-high-low');
    
    // Verify products are sorted by rating
    const ratings = await homePage.page.locator('[data-testid="product-rating"]')
      .allTextContents();
    
    const numericRatings = ratings.map(rating => 
      parseFloat(rating.split(' ')[0])
    );
    
    // Verify ratings are in descending order
    for (let i = 1; i < numericRatings.length; i++) {
      expect(numericRatings[i]).toBeLessThanOrEqual(numericRatings[i - 1]);
    }
  });

  test('should display search suggestions', async ({ homePage }) => {
    await homePage.searchInput.fill('sh');
    
    // Wait for suggestions to appear
    await expect(homePage.page.locator('[data-testid="search-suggestions"]'))
      .toBeVisible();
    
    // Verify suggestions contain relevant products
    const suggestions = await homePage.page.locator('[data-testid="suggestion-item"]')
      .allTextContents();
    
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(suggestion => 
      suggestion.toLowerCase().includes('sh')
    )).toBe(true);
  });

  test('should clear search and show all products', async ({ homePage }) => {
    await homePage.searchForProduct('nonexistent');
    
    // Clear search
    await homePage.page.locator('[data-testid="clear-search-button"]').click();
    
    // Verify we're back to showing all products
    await expect(homePage.page.locator('[data-testid="all-products"]'))
      .toBeVisible();
  });

  test('should handle special characters in search', async ({ homePage }) => {
    const specialSearch = 't-shirt & jeans';
    
    await homePage.searchForProduct(specialSearch);
    
    // Verify search doesn't break with special characters
    await expect(homePage.page.locator('[data-testid="search-results"]'))
      .toBeVisible();
  });

  test('should search by product ID', async ({ 
    homePage, 
    testProducts 
  }) => {
    const product = testProducts.featuredProducts[0];
    
    await homePage.searchForProduct(product.id);
    
    // Verify exact product match
    await expect(homePage.page.locator('[data-testid="product-card"]'))
      .toHaveCount(1, { timeout: 5000 });
    
    await expect(homePage.page.locator('[data-testid="product-card"]'))
      .toContainText(product.name);
  });
});
