# AGG.homes Playwright Tests

This directory contains end-to-end tests for the AGG.homes multi-language real estate website using Playwright.

## Test Structure

### Test Files

1. **multi-language.spec.ts** - Tests for multi-language functionality
   - Validates English, Spanish, and Dutch versions
   - Checks hreflang tags and language attributes
   - Verifies canonical URLs for each language

2. **seo-metadata.spec.ts** - SEO and metadata validation
   - Tests structured data (JSON-LD schema)
   - Validates meta tags (description, keywords, robots)
   - Checks Open Graph and Twitter Card tags
   - Verifies canonical URLs

3. **language-switcher.spec.ts** - Language navigation tests
   - Tests language switcher functionality
   - Validates links between language versions
   - Checks page content is in the correct language

4. **accessibility-responsive.spec.ts** - Accessibility and responsive design
   - Tests HTML structure and semantic elements
   - Validates responsive design on different viewports
   - Checks accessibility features (alt text, heading hierarchy)
   - Performance tests

## Running Tests

### Prerequisites

Install Playwright browsers:
```bash
npm run test:install
```

Or manually:
```bash
npx playwright install
```

### Run All Tests

```bash
npm test
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Tests with Browser Visible

```bash
npm run test:headed
```

### Run Tests for Specific Browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run Mobile Tests Only

```bash
npm run test:mobile
```

### Debug Tests

```bash
npm run test:debug
```

### View Test Report

After running tests:
```bash
npm run test:report
```

## Configuration

Tests are configured in `playwright.config.ts` with:
- Multi-browser support (Chromium, Firefox, WebKit)
- Mobile device testing (Pixel 5, iPhone 12)
- Local development server (Python HTTP server on port 8000)
- HTML reporter for test results
- Screenshot and video on failure
- Retry on CI

## Test Coverage

The test suite covers:
- ✅ Multi-language support (EN, ES, NL)
- ✅ SEO metadata and structured data
- ✅ Hreflang and canonical URLs
- ✅ Language switcher functionality
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility features
- ✅ Page load performance
- ✅ Navigation and links

## Continuous Integration

Tests can be integrated into CI/CD pipelines. The configuration automatically:
- Uses 1 worker on CI
- Retries failed tests 2 times
- Fails the build if test.only is accidentally left in code
- Starts a local server before running tests

## Writing New Tests

Follow the existing patterns:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

## Best Practices

1. Use descriptive test names
2. Group related tests with `test.describe()`
3. Use page object pattern for complex interactions
4. Keep tests independent and idempotent
5. Use appropriate timeouts
6. Clean up after tests if needed

## Troubleshooting

### Browser Installation Issues

If you encounter issues installing browsers:
```bash
npx playwright install --force
```

### Tests Failing Locally

Make sure the local server is running:
```bash
python3 -m http.server 8000
```

Or let Playwright start it automatically (default configuration).

### Debugging Failed Tests

1. Run with headed mode: `npm run test:headed`
2. Use debug mode: `npm run test:debug`
3. Check screenshots in `test-results/` directory
4. Review the HTML report: `npm run test:report`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
