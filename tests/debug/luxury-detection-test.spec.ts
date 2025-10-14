import { test, expect } from '@playwright/test';

test('Demoblaze with luxury detection', async ({ page }) => {
  console.log('Starting luxury detection test...');
  
  // Step 1: Go to Demoblaze and click Laptops
  await page.goto('https://www.demoblaze.com/');
  await page.click('a[onclick="byCat(\'notebook\')"]');
  await page.waitForSelector('.card-block');
  
  // Step 2: Find luxury item (most expensive)
  const cards = await page.locator('.card-block').all();
  let maxPrice = 0;
  let luxuryIndex = 0;
  
  for (let i = 0; i < cards.length; i++) {
    const priceText = await cards[i].locator('h5').textContent();
    if (priceText && priceText.startsWith('$')) {
      const price = parseFloat(priceText.replace('$', ''));
      if (price > maxPrice) {
        maxPrice = price;
        luxuryIndex = i;
      }
    }
  }
  
  console.log(`Luxury item: $${maxPrice} at index ${luxuryIndex}`);
  
  // Step 3: Click luxury item
  await cards[luxuryIndex].locator('.card-title a.hrefch').click();
  await page.waitForSelector('.btn.btn-success.btn-lg');
  
  // Step 4: Add to cart
  await page.once('dialog', dialog => dialog.accept());
  await page.click('.btn.btn-success.btn-lg');
  
  console.log('Luxury item added to cart!');
});
