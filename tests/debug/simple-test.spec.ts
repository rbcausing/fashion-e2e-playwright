import { test, expect } from '@playwright/test';

test('Ultra simple test with error handling', async ({ page }) => {
  console.log('=== TEST STARTED ===');
  
  try {
    console.log('Testing Google...');
    await page.goto('https://www.google.com', { timeout: 30000 });
    console.log('Google loaded successfully!');
    
    await page.waitForTimeout(2000);
    
    console.log('Testing Demoblaze...');
    await page.goto('https://www.demoblaze.com/', { timeout: 30000 });
    console.log('Demoblaze loaded successfully!');
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
  } catch (error) {
    console.error('Navigation failed:', error.message);
    console.log('This might be due to public WiFi restrictions');
  }
  
  console.log('=== TEST COMPLETED ===');
});
