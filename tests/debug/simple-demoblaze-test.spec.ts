import { test, expect } from '@playwright/test';

test('Simple Demoblaze test - just add first laptop', async ({ page }) => {
  console.log('Starting simple Demoblaze test...');
  
  // Step 1: Go to Demoblaze
  await page.goto('https://www.demoblaze.com/');
  console.log('Demoblaze loaded!');
  
  // Step 2: Click Laptops
  await page.click('a[onclick="byCat(\'notebook\')"]');
  console.log('Clicked Laptops!');
  
  // Step 3: Wait for laptops to load
  await page.waitForSelector('.card-block', { timeout: 10000 });
  console.log('Laptops loaded!');
  
  // Step 4: Click the first laptop
  await page.click('.card-block .card-title a.hrefch >> nth=0');
  console.log('Clicked first laptop!');
  
  // Step 5: Wait for product page
  await page.waitForSelector('.btn.btn-success.btn-lg');
  console.log('Product page loaded!');
  
  // Step 6: Add to cart
  await page.once('dialog', dialog => dialog.accept());
  await page.click('.btn.btn-success.btn-lg');
  console.log('Added to cart!');
  
  // Step 7: Go to cart
  await page.click('#cartur');
  console.log('Went to cart!');
  
  console.log('Test completed successfully!');
});
