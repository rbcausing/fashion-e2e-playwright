import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImages: Locator;
  readonly sizeSelector: Locator;
  readonly colorSelector: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly buyNowButton: Locator;
  readonly wishlistButton: Locator;
  readonly reviewsSection: Locator;
  readonly productRating: Locator;
  readonly relatedProducts: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productImages = page.locator('[data-testid="product-images"]');
    this.sizeSelector = page.locator('[data-testid="size-selector"]');
    this.colorSelector = page.locator('[data-testid="color-selector"]');
    this.quantityInput = page.locator('[data-testid="quantity-input"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
    this.buyNowButton = page.locator('[data-testid="buy-now-button"]');
    this.wishlistButton = page.locator('[data-testid="wishlist-button"]');
    this.reviewsSection = page.locator('[data-testid="reviews-section"]');
    this.productRating = page.locator('[data-testid="product-rating"]');
    this.relatedProducts = page.locator('[data-testid="related-products"]');
    this.breadcrumb = page.locator('[data-testid="breadcrumb"]');
  }

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/products/${productId}`);
    await this.waitForPageLoad();
  }

  async selectSize(size: string): Promise<void> {
    await this.sizeSelector.locator(`[data-value="${size}"]`).click();
  }

  async selectColor(color: string): Promise<void> {
    await this.colorSelector.locator(`[data-color="${color}"]`).click();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(quantity.toString());
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.waitForLoadingToFinish();
  }

  async buyNow(): Promise<void> {
    await this.buyNowButton.click();
    await this.waitForPageLoad();
  }

  async addToWishlist(): Promise<void> {
    await this.wishlistButton.click();
    await this.waitForLoadingToFinish();
  }

  async getProductTitle(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async getProductRating(): Promise<string> {
    return await this.productRating.textContent() || '';
  }

  async scrollToReviews(): Promise<void> {
    await this.reviewsSection.scrollIntoViewIfNeeded();
  }

  async clickRelatedProduct(index: number): Promise<void> {
    await this.relatedProducts.locator('[data-testid="product-card"]').nth(index).click();
    await this.waitForPageLoad();
  }
}
