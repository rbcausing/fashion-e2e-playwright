# Demoblaze E2E Testing

This directory contains end-to-end tests specifically for [Demoblaze.com](https://www.demoblaze.com/), a demo e-commerce website for testing purposes.

## 🎯 Test Coverage

### Main Test Suite: `laptops-luxury-checkout.spec.ts`

**Primary Test: "Browse Laptops, add luxury item, checkout on Demoblaze"**

This comprehensive test covers:
1. **Navigation**: Navigate to Demoblaze homepage
2. **Category Selection**: Select 'Laptops' category
3. **Luxury Item Detection**: Automatically find and select the most expensive laptop
4. **Add to Cart**: Add the luxury laptop to shopping cart
5. **Checkout Process**: Complete full checkout with order form
6. **Order Confirmation**: Verify successful order placement

### Additional Test Scenarios

- **Luxury Item Verification**: Ensures the selected item is actually the most expensive
- **Multiple Items Checkout**: Tests adding multiple laptops and completing checkout
- **Form Validation**: Tests checkout form validation and error handling

## 🏗️ Page Object Classes

### `DemoblazeHomePage.ts`
- Navigation to categories (Laptops, Phones, Monitors)
- Product browsing and selection
- Cart and user account navigation
- Luxury item detection and selection

### `DemoblazeProductPage.ts`
- Product detail page interactions
- Add to cart functionality
- Product information extraction

### `DemoblazeCartPage.ts`
- Cart management (view items, delete items)
- Proceed to checkout
- Cart total verification

### `DemoblazeCheckoutPage.ts`
- Order form filling
- Purchase completion
- Order confirmation verification

## 🚀 Running Demoblaze Tests

### Quick Commands
```bash
# Run all Demoblaze tests
npm run test:demoblaze

# Run smoke tests only
npm run test:demoblaze:smoke

# Run with UI mode
npm run test:demoblaze:ui

# Run in headed mode (see browser)
npm run test:demoblaze:headed

# Debug mode
npm run test:demoblaze:debug
```

### Browser-Specific Tests
```bash
# Run on specific browsers
npm run test:demoblaze:chromium
npm run test:demoblaze:firefox
npm run test:demoblaze:webkit

# Mobile testing
npm run test:demoblaze:mobile
```

## 🎯 Test Data

Test data is stored in `tests/data/demoblazeData.json`:
- Category mappings
- Test user credentials
- Order form data
- Expected product counts and titles

## 🔧 Configuration

The tests are configured to run against `https://www.demoblaze.com/` by default. This can be overridden using environment variables:

```bash
BASE_URL=https://www.demoblaze.com npm run test:demoblaze
```

## 📊 CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`) includes:
- **Smoke Tests**: Run on every push/PR across all browsers
- **Full Tests**: Run after smoke tests pass
- **Mobile Tests**: Run on main branch pushes
- **Regression Tests**: Comprehensive test suite on main branch
- **Daily Schedule**: Automated daily testing at 2 AM UTC

## 🎭 Test Features

### Smart Luxury Item Detection
The test automatically identifies the most expensive laptop by:
1. Fetching all laptop prices
2. Converting prices to numeric values
3. Finding the maximum price
4. Selecting that product for checkout

### Alert Dialog Handling
Demoblaze shows JavaScript alert dialogs when adding items to cart. The tests handle these automatically:
```typescript
this.page.on('dialog', async dialog => {
  console.log(`Dialog message: ${dialog.message()}`);
  await dialog.accept();
});
```

### Robust Order Verification
The checkout test verifies:
- Order confirmation message
- Order ID generation
- Order amount calculation
- Customer details
- Credit card information

## 🐛 Troubleshooting

### Common Issues

1. **Network Timeouts**: Demoblaze can be slow, tests include generous timeouts
2. **Alert Dialogs**: Tests handle JavaScript alerts automatically
3. **Dynamic Content**: Tests wait for page loads and network idle states

### Debug Mode
Use debug mode to step through failing tests:
```bash
npm run test:demoblaze:debug
```

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots on failure
- Video recordings
- Trace files for debugging

## 📈 Test Reports

After running tests, view detailed reports:
```bash
npm run test:report
```

Reports include:
- Test execution timeline
- Screenshots of failures
- Video recordings
- Performance metrics
- Network logs

## 🔄 Continuous Integration

The GitHub Actions workflow provides:
- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile device testing
- Parallel execution for faster feedback
- Artifact collection for failed tests
- Notification system for test results

## 📝 Test Tags

Tests use tags for easy filtering:
- `@smoke`: Critical functionality tests
- `@regression`: Full regression test suite

Example usage:
```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run regression tests
npx playwright test --grep @regression
```
