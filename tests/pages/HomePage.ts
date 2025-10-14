import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly navigationMenu: Locator;
  readonly featuredProducts: Locator;
  readonly cartIcon: Locator;
  readonly userAccountIcon: Locator;
  readonly categoryLinks: Locator;
  readonly banner: Locator;
  readonly newsletterSignup: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    this.navigationMenu = page.locator('[data-testid="main-navigation"]');
    this.featuredProducts = page.locator('[data-testid="featured-products"]');
    this.cartIcon = page.locator('[data-testid="cart-icon"]');
    this.userAccountIcon = page.locator('[data-testid="user-account-icon"]');
    this.categoryLinks = page.locator('[data-testid="category-link"]');
    this.banner = page.locator('[data-testid="hero-banner"]');
    this.newsletterSignup = page.locator('[data-testid="newsletter-signup"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  async searchForProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async clickCategory(categoryName: string): Promise<void> {
    await this.categoryLinks.filter({ hasText: categoryName }).click();
    await this.waitForPageLoad();
  }

  async clickCartIcon(): Promise<void> {
    await this.cartIcon.click();
  }

  async clickUserAccountIcon(): Promise<void> {
    await this.userAccountIcon.click();
  }

  async getFeaturedProductsCount(): Promise<number> {
    return await this.featuredProducts.locator('[data-testid="product-card"]').count();
  }

  async signupForNewsletter(email: string): Promise<void> {
    await this.newsletterSignup.locator('input[type="email"]').fill(email);
    await this.newsletterSignup.locator('button[type="submit"]').click();
  }
}
