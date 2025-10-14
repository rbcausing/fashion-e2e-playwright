import { test, expect } from '../fixtures/testFixtures';

test.describe('User Registration', () => {
  test('should register new user successfully @smoke', async ({ 
    homePage, 
    testUsers 
  }) => {
    const newUser = testUsers.newUser;
    
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    
    // Navigate to registration page
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Fill registration form
    await homePage.page.locator('[data-testid="first-name-input"]').fill(newUser.firstName);
    await homePage.page.locator('[data-testid="last-name-input"]').fill(newUser.lastName);
    await homePage.page.locator('[data-testid="email-input"]').fill(newUser.email);
    await homePage.page.locator('[data-testid="password-input"]').fill(newUser.password);
    await homePage.page.locator('[data-testid="confirm-password-input"]').fill(newUser.password);
    await homePage.page.locator('[data-testid="phone-input"]').fill(newUser.phone);
    
    // Submit registration
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify successful registration
    await expect(homePage.page.locator('[data-testid="registration-success"]'))
      .toContainText('Registration successful');
    
    // Verify user is logged in
    await expect(homePage.page.locator('[data-testid="user-menu"]'))
      .toContainText(newUser.firstName);
  });

  test('should show validation errors for invalid input', async ({ homePage }) => {
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Try to submit empty form
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify validation messages
    await expect(homePage.page.locator('[data-testid="first-name-error"]'))
      .toContainText('First name is required');
    await expect(homePage.page.locator('[data-testid="email-error"]'))
      .toContainText('Email is required');
    await expect(homePage.page.locator('[data-testid="password-error"]'))
      .toContainText('Password is required');
  });

  test('should prevent duplicate email registration', async ({ 
    homePage, 
    testUsers 
  }) => {
    const existingUser = testUsers.validUser;
    
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Try to register with existing email
    await homePage.page.locator('[data-testid="first-name-input"]').fill('New');
    await homePage.page.locator('[data-testid="last-name-input"]').fill('User');
    await homePage.page.locator('[data-testid="email-input"]').fill(existingUser.email);
    await homePage.page.locator('[data-testid="password-input"]').fill('NewPassword123!');
    await homePage.page.locator('[data-testid="confirm-password-input"]').fill('NewPassword123!');
    
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify error message
    await expect(homePage.page.locator('[data-testid="registration-error"]'))
      .toContainText('Email already exists');
  });

  test('should validate password strength', async ({ homePage }) => {
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Enter weak password
    await homePage.page.locator('[data-testid="password-input"]').fill('weak');
    
    // Verify password strength indicator
    await expect(homePage.page.locator('[data-testid="password-strength"]'))
      .toContainText('Weak');
    
    // Enter strong password
    await homePage.page.locator('[data-testid="password-input"]').fill('StrongPassword123!');
    
    // Verify password strength indicator
    await expect(homePage.page.locator('[data-testid="password-strength"]'))
      .toContainText('Strong');
  });

  test('should validate password confirmation match', async ({ homePage }) => {
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Enter different passwords
    await homePage.page.locator('[data-testid="password-input"]').fill('Password123!');
    await homePage.page.locator('[data-testid="confirm-password-input"]').fill('DifferentPassword123!');
    
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify password mismatch error
    await expect(homePage.page.locator('[data-testid="confirm-password-error"]'))
      .toContainText('Passwords do not match');
  });

  test('should validate email format', async ({ homePage }) => {
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Enter invalid email format
    await homePage.page.locator('[data-testid="email-input"]').fill('invalid-email');
    
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify email format error
    await expect(homePage.page.locator('[data-testid="email-error"]'))
      .toContainText('Please enter a valid email address');
  });

  test('should redirect to login after successful registration', async ({ 
    homePage, 
    testUsers 
  }) => {
    const newUser = testUsers.newUser;
    const timestamp = Date.now();
    const uniqueEmail = `user-${timestamp}@example.com`;
    
    await homePage.goto();
    await homePage.clickUserAccountIcon();
    await homePage.page.locator('[data-testid="register-link"]').click();
    
    // Fill and submit registration form
    await homePage.page.locator('[data-testid="first-name-input"]').fill(newUser.firstName);
    await homePage.page.locator('[data-testid="last-name-input"]').fill(newUser.lastName);
    await homePage.page.locator('[data-testid="email-input"]').fill(uniqueEmail);
    await homePage.page.locator('[data-testid="password-input"]').fill(newUser.password);
    await homePage.page.locator('[data-testid="confirm-password-input"]').fill(newUser.password);
    
    await homePage.page.locator('[data-testid="register-button"]').click();
    
    // Verify redirect to login page or dashboard
    await expect(homePage.page).toHaveURL(/login|dashboard/);
  });
});
