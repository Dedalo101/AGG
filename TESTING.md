# Playwright Testing Setup for AGG.homes

This guide will help you set up and run Playwright tests for the AGG.homes multi-language real estate website.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Python 3 (for local development server)

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@playwright/test` - The Playwright testing framework
- `playwright` - Browser automation library

### 2. Install Playwright Browsers

Playwright requires browser binaries to run tests. Install them with:

```bash
npm run test:install
```

Or directly:

```bash
npx playwright install chromium
```

For all browsers (Chromium, Firefox, WebKit):

```bash
npx playwright install
```

If you encounter issues, try installing with dependencies:

```bash
npx playwright install --with-deps chromium
```

## Running Tests

### Quick Start

Run all tests:
```bash
npm test
```

### Available Test Scripts

The following npm scripts are available in `package.json`:

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:ui` | Open Playwright UI for interactive testing |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:chromium` | Run tests only in Chromium |
| `npm run test:firefox` | Run tests only in Firefox |
| `npm run test:webkit` | Run tests only in WebKit |
| `npm run test:mobile` | Run tests on mobile viewports |
| `npm run test:report` | Show HTML test report |
| `npm run test:install` | Install Playwright browsers |

### Running Specific Test Files

Run a specific test file:
```bash
npx playwright test tests/multi-language.spec.ts
```

Run tests matching a pattern:
```bash
npx playwright test --grep "English"
```

### Running Tests in Different Modes

**UI Mode (Recommended for Development):**
```bash
npm run test:ui
```
This opens an interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests run in real-time
- Debug failures
- See traces and screenshots

**Headed Mode (See Browser):**
```bash
npm run test:headed
```
Runs tests with the browser window visible.

**Debug Mode:**
```bash
npm run test:debug
```
Opens Playwright Inspector for step-by-step debugging.

## Test Structure

The test suite is organized into four main test files:

### 1. multi-language.spec.ts
Tests multi-language functionality:
- English, Spanish, and Dutch versions load correctly
- Correct `lang` attributes
- Proper hreflang tags
- Canonical URLs for each language

### 2. seo-metadata.spec.ts
Tests SEO and metadata:
- Structured data (JSON-LD)
- Meta tags (description, keywords, robots)
- Open Graph tags
- Twitter Card tags
- Canonical URLs

### 3. language-switcher.spec.ts
Tests language navigation:
- Language switcher functionality
- Links between language versions
- Content in correct language
- Page context preservation

### 4. accessibility-responsive.spec.ts
Tests accessibility and responsive design:
- HTML structure and semantic elements
- Alt text for images
- Heading hierarchy
- Responsive design on mobile, tablet, desktop
- Performance metrics

## Configuration

Tests are configured in `playwright.config.ts`:

### Key Settings

- **Base URL:** `http://localhost:8000` (configurable via `BASE_URL` env var)
- **Timeout:** 30 seconds per test
- **Browsers:** Chromium, Firefox, WebKit
- **Mobile Devices:** Pixel 5, iPhone 12
- **Web Server:** Automatically starts Python HTTP server on port 8000
- **Reporters:** HTML and console list
- **Screenshots:** On failure only
- **Videos:** On failure only
- **Traces:** On first retry

### Environment Variables

You can customize the configuration with environment variables:

```bash
# Use a different base URL
BASE_URL=http://localhost:3000 npm test

# Run in CI mode
CI=1 npm test
```

## Viewing Test Results

### HTML Report

After running tests, view the HTML report:

```bash
npm run test:report
```

This opens an interactive report showing:
- Test results
- Screenshots of failures
- Videos of failed tests
- Test traces for debugging

### Test Artifacts

Test artifacts are saved in:
- `playwright-report/` - HTML test reports
- `test-results/` - Screenshots, videos, and traces

These directories are gitignored and won't be committed.

## Continuous Integration

A GitHub Actions workflow is included at `.github/workflows/playwright.yml`.

### CI Features

- Runs on push to main/master branches
- Runs on pull requests
- Can be triggered manually
- Uses Ubuntu latest
- Installs Chromium only for faster CI
- Uploads test reports as artifacts
- Uploads screenshots on failure

### Viewing CI Results

1. Go to the Actions tab in GitHub
2. Select the workflow run
3. Download artifacts to see test reports

## Troubleshooting

### Browser Installation Issues

**Error: "Executable doesn't exist"**

Solution:
```bash
npx playwright install chromium --force
```

**Error: "Download failed"**

This can happen due to network issues. Try:
1. Use a VPN or different network
2. Install with dependencies: `npx playwright install --with-deps chromium`
3. Set download timeout: `PLAYWRIGHT_DOWNLOAD_TIMEOUT=300000 npx playwright install chromium`

### Server Issues

**Error: "Port 8000 already in use"**

Solution:
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
BASE_URL=http://localhost:9000 npm test
```

**Error: "net::ERR_CONNECTION_REFUSED"**

The local server isn't starting. Manually start it:
```bash
python3 -m http.server 8000
```

Then in another terminal:
```bash
npm test
```

### Test Failures

**Timeouts:**

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000, // 60 seconds
```

**Flaky Tests:**

Run with retries:
```bash
npx playwright test --retries=2
```

**Browser-Specific Issues:**

Test on specific browser:
```bash
npm run test:chromium
```

### Debug Failed Tests

1. **Use UI Mode:**
   ```bash
   npm run test:ui
   ```

2. **View Screenshots:**
   Check `test-results/` directory for screenshots

3. **Enable Video:**
   In `playwright.config.ts`, change:
   ```typescript
   video: 'on'
   ```

4. **Use Debug Mode:**
   ```bash
   npm run test:debug
   ```

## Best Practices

### Writing Tests

1. **Keep Tests Independent:** Each test should work standalone
2. **Use Descriptive Names:** Test names should clearly describe what they test
3. **Group Related Tests:** Use `test.describe()` blocks
4. **Use Page Object Pattern:** For complex pages
5. **Avoid Hardcoded Waits:** Use Playwright's auto-waiting
6. **Clean Up:** Clean up any test data after tests

### Performance

1. **Run Tests in Parallel:** Playwright runs tests in parallel by default
2. **Use Specific Selectors:** More specific selectors are faster
3. **Minimize Network Requests:** Mock external APIs when appropriate
4. **Skip Unnecessary Tests:** Use `test.skip()` for tests you don't need

### Maintenance

1. **Update Regularly:** Keep Playwright updated
   ```bash
   npm update @playwright/test playwright
   ```

2. **Review Test Reports:** Regularly check test reports for patterns
3. **Refactor Flaky Tests:** Fix or rewrite consistently failing tests
4. **Update Selectors:** When UI changes, update selectors

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the [Playwright documentation](https://playwright.dev)
3. Check existing tests for examples
4. Look at test results in `playwright-report/`
5. Run tests in debug mode: `npm run test:debug`

## Summary

To get started quickly:

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npm run test:install

# 3. Run tests
npm test

# 4. View report
npm run test:report
```

For development:
```bash
# Use UI mode for interactive testing
npm run test:ui
```

For CI/CD:
```bash
# Tests run automatically on push/PR via GitHub Actions
```
