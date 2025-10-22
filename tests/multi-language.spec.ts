import { test, expect } from '@playwright/test';

/**
 * Multi-language functionality tests for AGG.homes
 * Tests all three language versions: English, Spanish, and Dutch
 */

test.describe('Multi-language Support', () => {
  
  test.describe('English Version', () => {
    test('should load English homepage', async ({ page }) => {
      await page.goto('/');
      
      // Check the lang attribute
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('en');
      
      // Check title contains English text
      await expect(page).toHaveTitle(/Dream Home|Real Estate/i);
    });

    test('should load English version from /en/', async ({ page }) => {
      await page.goto('/en/');
      
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('en');
      
      await expect(page).toHaveTitle(/Dream Home|Real Estate/i);
    });

    test('should have correct hreflang tags on English page', async ({ page }) => {
      await page.goto('/');
      
      // Check for hreflang alternates
      const hreflangLinks = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangLinks.count();
      expect(count).toBeGreaterThan(0);
      
      // Check for specific language alternates
      const enLink = page.locator('link[rel="alternate"][hreflang="en"]');
      await expect(enLink).toHaveAttribute('href', /agg\.homes/);
      
      const esLink = page.locator('link[rel="alternate"][hreflang="es"]');
      await expect(esLink).toHaveAttribute('href', /agg\.homes\/es/);
      
      const nlLink = page.locator('link[rel="alternate"][hreflang="nl"]');
      await expect(nlLink).toHaveAttribute('href', /agg\.homes\/nl/);
    });

    test('should have canonical URL on English page', async ({ page }) => {
      await page.goto('/');
      
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /agg\.homes/);
    });
  });

  test.describe('Spanish Version', () => {
    test('should load Spanish homepage', async ({ page }) => {
      await page.goto('/es/');
      
      // Check the lang attribute
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('es');
      
      // Check title contains Spanish text
      await expect(page).toHaveTitle(/Casa Ideal|Inmobiliario/i);
    });

    test('should have correct hreflang tags on Spanish page', async ({ page }) => {
      await page.goto('/es/');
      
      const hreflangLinks = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangLinks.count();
      expect(count).toBeGreaterThan(0);
      
      // Check canonical points to Spanish version
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /agg\.homes\/es/);
    });

    test('should have Spanish meta description', async ({ page }) => {
      await page.goto('/es/');
      
      const metaDescription = page.locator('meta[name="description"]');
      const content = await metaDescription.getAttribute('content');
      
      // Check for Spanish keywords
      expect(content).toMatch(/casa|propiedad|bienes raíces/i);
    });
  });

  test.describe('Dutch Version', () => {
    test('should load Dutch homepage', async ({ page }) => {
      await page.goto('/nl/');
      
      // Check the lang attribute
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('nl');
      
      // Check title contains Dutch text
      await expect(page).toHaveTitle(/Droomhuis|Vastgoed/i);
    });

    test('should have correct hreflang tags on Dutch page', async ({ page }) => {
      await page.goto('/nl/');
      
      const hreflangLinks = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangLinks.count();
      expect(count).toBeGreaterThan(0);
      
      // Check canonical points to Dutch version
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /agg\.homes\/nl/);
    });

    test('should have Dutch meta description', async ({ page }) => {
      await page.goto('/nl/');
      
      const metaDescription = page.locator('meta[name="description"]');
      const content = await metaDescription.getAttribute('content');
      
      // Check for Dutch keywords
      expect(content).toMatch(/huis|woning|vastgoed/i);
    });
  });
});
