import { Page, Locator } from '@playwright/test';

export class DemoblazeHomePage {
  constructor(private page: Page) {}

  // Navigation elements
  readonly homeLink = this.page.locator('text=Home');
  readonly contactLink = this.page.locator('text=Contact');
  readonly aboutUsLink = this.page.locator('text=About us');
  readonly cartLink = this.page.locator('text=Cart');
  readonly logInLink = this.page.locator('text=Log in');
  readonly signUpLink = this.page.locator('text=Sign up');

  // Category navigation - using exact selectors from Demoblaze
  readonly laptopsCategory = this.page.locator('text=Laptops');
  readonly phonesCategory = this.page.locator('text=Phones');
  readonly monitorsCategory = this.page.locator('text=Monitors');

  // Product elements - using exact selectors
  readonly productCards = this.page.locator('.card');
  readonly productTitles = this.page.locator('.card-title a');
  readonly productPrices = this.page.locator('h5');
  readonly addToCartButton = this.page.locator('text=Add to cart');

  async navigate(): Promise<void> {
    console.log('Navigating to Demoblaze...');
    
    try {
      // Use the same approach that worked in simple-test.spec.ts
      await this.page.goto('https://www.demoblaze.com/', { 
        waitUntil: 'domcontentloaded', // Changed from 'networkidle'
        timeout: 30000 // Reduced timeout
      });
      
      // Wait for key elements to be visible
      await this.page.waitForSelector('text=Home', { timeout: 10000 });
      console.log('Navigation successful!');
      
    } catch (error) {
      console.error('Navigation failed:', error);
      throw error;
    }
  }

  async selectCategory(category: string): Promise<void> {
    if (category.toLowerCase() === 'laptops') {
      // Use the exact onclick method we found
      await this.page.click('a[onclick="byCat(\'notebook\')"]');
    } else {
      await this.page.click(`text=${category}`);
    }
    // Wait for the correct product container
    await this.page.waitForSelector('.card-block');
  }

  async selectLaptopsCategory(): Promise<void> {
    await this.selectCategory('Laptops');
  }

  async addFirstProductToCart(): Promise<void> {
    await this.page.click('.card-title a >> nth=0');
    
    // Replace the problematic wait with the working approach
    await this.page.waitForSelector('.btn.btn-success.btn-lg', { timeout: 10000 });
    
    // Set up dialog handler before clicking
    this.page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    
    await this.page.click('text=Add to cart');
    // Small wait to ensure dialog is handled
    await this.page.waitForTimeout(1000);
  }

  async findLuxuryItem(): Promise<void> {
    console.log('Finding luxury item...');
    
    // Wait for products to load
    await this.page.waitForSelector('.card-block', { timeout: 10000 });
    
    // Get all product cards using the correct selector
    const productCards = await this.page.locator('.card-block').all();
    console.log(`Found ${productCards.length} product cards`);
    
    let maxPrice = 0;
    let luxuryCardIndex = 0;
    const validPrices = [];
    
    // Find the most expensive item by iterating through actual product cards
    for (let i = 0; i < productCards.length; i++) {
      try {
        // Use the exact selector from your HTML: .card-block h5
        const priceElement = await productCards[i].locator('h5').textContent();
        if (priceElement && priceElement.startsWith('$')) {
          const price = parseFloat(priceElement.replace('$', ''));
          validPrices.push(price);
          console.log(`Card ${i}: $${price}`);
          
          if (price > maxPrice) {
            maxPrice = price;
            luxuryCardIndex = i;
          }
        }
      } catch (error) {
        console.log(`Card ${i}: No valid price found`);
      }
    }
    
    console.log(`Valid prices found: ${validPrices.length}`);
    console.log(`Luxury item found: Card ${luxuryCardIndex} at $${maxPrice}`);
    
    if (validPrices.length === 0) {
      throw new Error('No valid product prices found');
    }
    
    // Click the luxury item using the exact link selector from your HTML
    const luxuryCard = productCards[luxuryCardIndex];
    await luxuryCard.locator('.card-title a.hrefch').click();
    
    // Replace the problematic wait with a more reliable one
    await this.page.waitForSelector('.btn.btn-success.btn-lg', { timeout: 10000 });
    console.log('Product page loaded!');
    
    // Set up dialog handler before clicking - use the exact button selector
    this.page.once('dialog', dialog => dialog.accept());
    await this.page.click('.btn.btn-success.btn-lg'); // Exact selector from your HTML
    await this.page.waitForTimeout(1000);
    
    console.log('Luxury item added to cart!');
  }

  async addLuxuryLaptopToCart(): Promise<void> {
    await this.selectLaptopsCategory();
    await this.findLuxuryItem();
  }

  async clickCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getProductTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productPrices.allTextContents();
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    await this.productTitles.nth(index).click();
    
    // Replace the problematic wait with a more reliable one
    await this.page.waitForSelector('.btn.btn-success.btn-lg', { timeout: 10000 });
    console.log('Product page loaded!');
    
    // Set up dialog handler before clicking
    this.page.once('dialog', dialog => dialog.accept());
    await this.page.click('text=Add to cart');
    await this.page.waitForTimeout(1000);
  }
}
