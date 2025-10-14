import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CartItem {
  name: string;
  price: string;
  quantity: number;
  size?: string;
  color?: string;
}

export class ShoppingCartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartEmptyMessage: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly updateCartButton: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly shipping: Locator;
  readonly total: Locator;
  readonly promoCodeInput: Locator;
  readonly applyPromoButton: Locator;
  readonly promoCodeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.cartEmptyMessage = page.locator('[data-testid="cart-empty-message"]');
    this.checkoutButton = page.locator('[data-testid="checkout-button"]');
    this.continueShoppingButton = page.locator('[data-testid="continue-shopping-button"]');
    this.updateCartButton = page.locator('[data-testid="update-cart-button"]');
    this.subtotal = page.locator('[data-testid="subtotal"]');
    this.tax = page.locator('[data-testid="tax"]');
    this.shipping = page.locator('[data-testid="shipping"]');
    this.total = page.locator('[data-testid="total"]');
    this.promoCodeInput = page.locator('[data-testid="promo-code-input"]');
    this.applyPromoButton = page.locator('[data-testid="apply-promo-button"]');
    this.promoCodeMessage = page.locator('[data-testid="promo-code-message"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
    await this.waitForPageLoad();
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItems(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const count = await this.getCartItemsCount();
    
    for (let i = 0; i < count; i++) {
      const item = this.cartItems.nth(i);
      const name = await item.locator('[data-testid="item-name"]').textContent() || '';
      const price = await item.locator('[data-testid="item-price"]').textContent() || '';
      const quantity = parseInt(await item.locator('[data-testid="quantity-input"]').inputValue() || '0');
      const size = await item.locator('[data-testid="item-size"]').textContent() || undefined;
      const color = await item.locator('[data-testid="item-color"]').textContent() || undefined;
      
      items.push({ name, price, quantity, size, color });
    }
    
    return items;
  }

  async updateItemQuantity(itemIndex: number, newQuantity: number): Promise<void> {
    await this.cartItems.nth(itemIndex)
      .locator('[data-testid="quantity-input"]')
      .fill(newQuantity.toString());
    await this.updateCartButton.click();
    await this.waitForLoadingToFinish();
  }

  async removeItem(itemIndex: number): Promise<void> {
    await this.cartItems.nth(itemIndex)
      .locator('[data-testid="remove-item-button"]')
      .click();
    await this.waitForLoadingToFinish();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.waitForPageLoad();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.waitForPageLoad();
  }

  async applyPromoCode(code: string): Promise<void> {
    await this.promoCodeInput.fill(code);
    await this.applyPromoButton.click();
    await this.waitForLoadingToFinish();
  }

  async getSubtotal(): Promise<string> {
    return await this.subtotal.textContent() || '';
  }

  async getTotal(): Promise<string> {
    return await this.total.textContent() || '';
  }

  async getPromoCodeMessage(): Promise<string> {
    return await this.promoCodeMessage.textContent() || '';
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.cartEmptyMessage.isVisible();
  }

  async clearCart(): Promise<void> {
    const itemCount = await this.getCartItemsCount();
    for (let i = itemCount - 1; i >= 0; i--) {
      await this.removeItem(i);
    }
  }
}
