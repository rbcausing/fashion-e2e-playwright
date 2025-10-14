import { test } from '@playwright/test';

test('Network connectivity test', async ({ page }) => {
  console.log('Testing network connectivity...');
  
  try {
    // Test HTTP site first
    console.log('Testing HTTP site...');
    await page.goto('http://httpbin.org/', { timeout: 10000 });
    console.log('HTTP site works!');
    
    await page.waitForTimeout(2000);
    
    // Test HTTPS site
    console.log('Testing HTTPS site...');
    await page.goto('https://httpbin.org/', { timeout: 10000 });
    console.log('HTTPS site works!');
    
  } catch (error) {
    console.error('Network error:', error);
  }
});
