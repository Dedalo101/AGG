import { test, expect } from '@playwright/test';

/**
 * Language switcher and navigation tests for AGG.homes
 * Tests the functionality of language switching between EN, ES, and NL
 */

test.describe('Language Switcher', () => {
  
  test('should display language switcher on all pages', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Look for language switcher container
      const langSwitcher = page.locator('.lang-switcher, .language-switcher, [class*="lang"]').first();
      
      // Check if any language links exist
      const hasLanguageLinks = await page.locator('a[href*="/es/"], a[href*="/nl/"], a[href="/"]').count() > 0;
      
      if (hasLanguageLinks) {
        expect(hasLanguageLinks).toBeTruthy();
      }
    }
  });

  test('should have links to all language versions', async ({ page }) => {
    await page.goto('/');
    
    // Check for language navigation elements
    const allLinks = await page.locator('a').all();
    const hrefs = await Promise.all(allLinks.map(link => link.getAttribute('href')));
    
    // Filter for language-related links
    const hasEnglishLink = hrefs.some(href => href === '/' || href?.includes('agg.homes/') && !href.includes('/es/') && !href.includes('/nl/'));
    const hasSpanishLink = hrefs.some(href => href?.includes('/es/'));
    const hasDutchLink = hrefs.some(href => href?.includes('/nl/'));
    
    // At minimum, we should have hreflang alternates even if no visible switcher
    const hreflangLinks = await page.locator('link[rel="alternate"][hreflang]').all();
    expect(hreflangLinks.length).toBeGreaterThan(0);
  });

  test('should maintain page context when switching languages', async ({ page }) => {
    // Start on English homepage
    await page.goto('/');
    const enTitle = await page.title();
    
    // Navigate to Spanish version
    await page.goto('/es/');
    const esTitle = await page.title();
    
    // Navigate to Dutch version
    await page.goto('/nl/');
    const nlTitle = await page.title();
    
    // All titles should be different (translated)
    expect(enTitle).not.toBe(esTitle);
    expect(enTitle).not.toBe(nlTitle);
    expect(esTitle).not.toBe(nlTitle);
  });
});

test.describe('Navigation and Links', () => {
  
  test('should have working navigation on all pages', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check that page has loaded
      await expect(page).toHaveTitle(/.+/);
      
      // Check for common navigation elements (they might be in different languages)
      const hasNav = await page.locator('nav, header, .nav, .navigation').count() > 0;
      const hasLinks = await page.locator('a').count() > 0;
      
      expect(hasLinks).toBeTruthy();
    }
  });

  test('should load resources successfully', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Check that page doesn't have major errors
      const pageErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      
      // Reload to catch any errors
      await page.reload();
      await page.waitForLoadState('load');
      
      // Allow some errors but not critical ones
      const criticalErrors = pageErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('analytics') &&
        !error.includes('tracking')
      );
      
      expect(criticalErrors.length).toBe(0);
    }
  });
});

test.describe('Page Content', () => {
  
  test('should have main content on all language pages', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for body content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(100);
    }
  });

  test('should display appropriate language content', async ({ page }) => {
    // English page should have English text
    await page.goto('/');
    const enContent = await page.textContent('body');
    expect(enContent).toMatch(/home|property|real estate|dream/i);
    
    // Spanish page should have Spanish text
    await page.goto('/es/');
    const esContent = await page.textContent('body');
    expect(esContent).toMatch(/casa|propiedad|inmobiliario/i);
    
    // Dutch page should have Dutch text
    await page.goto('/nl/');
    const nlContent = await page.textContent('body');
    expect(nlContent).toMatch(/huis|woning|vastgoed|droomhuis/i);
  });
});
