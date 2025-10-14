import { test, expect } from '@playwright/test';

test.describe('Demoblaze Debug Tests', () => {
  test('Simple navigation test', async ({ page }) => {
    console.log('Starting navigation to Demoblaze...');
    
    // Try with longer timeout
    await page.goto('https://www.demoblaze.com/', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    console.log('Page loaded, checking title...');
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check if we can see the main elements
    const homeLink = page.locator('text=Home');
    await expect(homeLink).toBeVisible({ timeout: 10000 });
    
    console.log('Basic navigation successful!');
  });
});
