import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export class CheckoutPage extends BasePage {
  readonly shippingSection: Locator;
  readonly billingSection: Locator;
  readonly paymentSection: Locator;
  readonly orderSummary: Locator;
  readonly placeOrderButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly zipCodeInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryMonthSelect: Locator;
  readonly expiryYearSelect: Locator;
  readonly cvvInput: Locator;
  readonly cardholderNameInput: Locator;
  readonly sameAsBillingCheckbox: Locator;
  readonly orderTotal: Locator;
  readonly shippingCost: Locator;
  readonly taxAmount: Locator;

  constructor(page: Page) {
    super(page);
    this.shippingSection = page.locator('[data-testid="shipping-section"]');
    this.billingSection = page.locator('[data-testid="billing-section"]');
    this.paymentSection = page.locator('[data-testid="payment-section"]');
    this.orderSummary = page.locator('[data-testid="order-summary"]');
    this.placeOrderButton = page.locator('[data-testid="place-order-button"]');
    this.firstNameInput = page.locator('[data-testid="first-name"]');
    this.lastNameInput = page.locator('[data-testid="last-name"]');
    this.addressInput = page.locator('[data-testid="address"]');
    this.cityInput = page.locator('[data-testid="city"]');
    this.stateSelect = page.locator('[data-testid="state"]');
    this.zipCodeInput = page.locator('[data-testid="zip-code"]');
    this.countrySelect = page.locator('[data-testid="country"]');
    this.phoneInput = page.locator('[data-testid="phone"]');
    this.cardNumberInput = page.locator('[data-testid="card-number"]');
    this.expiryMonthSelect = page.locator('[data-testid="expiry-month"]');
    this.expiryYearSelect = page.locator('[data-testid="expiry-year"]');
    this.cvvInput = page.locator('[data-testid="cvv"]');
    this.cardholderNameInput = page.locator('[data-testid="cardholder-name"]');
    this.sameAsBillingCheckbox = page.locator('[data-testid="same-as-billing"]');
    this.orderTotal = page.locator('[data-testid="order-total"]');
    this.shippingCost = page.locator('[data-testid="shipping-cost"]');
    this.taxAmount = page.locator('[data-testid="tax-amount"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.waitForPageLoad();
  }

  async fillShippingAddress(address: ShippingAddress): Promise<void> {
    await this.firstNameInput.fill(address.firstName);
    await this.lastNameInput.fill(address.lastName);
    await this.addressInput.fill(address.address);
    await this.cityInput.fill(address.city);
    await this.stateSelect.selectOption(address.state);
    await this.zipCodeInput.fill(address.zipCode);
    await this.countrySelect.selectOption(address.country);
    if (address.phone) {
      await this.phoneInput.fill(address.phone);
    }
  }

  async fillPaymentInfo(payment: PaymentInfo): Promise<void> {
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.expiryMonthSelect.selectOption(payment.expiryMonth);
    await this.expiryYearSelect.selectOption(payment.expiryYear);
    await this.cvvInput.fill(payment.cvv);
    await this.cardholderNameInput.fill(payment.cardholderName);
  }

  async useSameAsBillingAddress(): Promise<void> {
    await this.sameAsBillingCheckbox.check();
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.waitForPageLoad();
  }

  async getOrderTotal(): Promise<string> {
    return await this.orderTotal.textContent() || '';
  }

  async getShippingCost(): Promise<string> {
    return await this.shippingCost.textContent() || '';
  }

  async getTaxAmount(): Promise<string> {
    return await this.taxAmount.textContent() || '';
  }

  async scrollToPaymentSection(): Promise<void> {
    await this.paymentSection.scrollIntoViewIfNeeded();
  }

  async isFormValid(): Promise<boolean> {
    // Check if all required fields are filled
    const firstName = await this.firstNameInput.inputValue();
    const lastName = await this.lastNameInput.inputValue();
    const address = await this.addressInput.inputValue();
    const city = await this.cityInput.inputValue();
    const zipCode = await this.zipCodeInput.inputValue();
    const cardNumber = await this.cardNumberInput.inputValue();
    const cvv = await this.cvvInput.inputValue();
    
    return !!(firstName && lastName && address && city && zipCode && cardNumber && cvv);
  }
}
