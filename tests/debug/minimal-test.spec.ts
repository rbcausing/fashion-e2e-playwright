import { test } from '@playwright/test';

test('minimal test', async ({ page }) => {
  console.log('Test is running!');
  // Don't navigate anywhere, just log
  console.log('Test completed!');
});
