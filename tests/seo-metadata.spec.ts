import { test, expect } from '@playwright/test';

/**
 * SEO and metadata tests for AGG.homes
 * Validates proper SEO implementation across all language versions
 */

test.describe('SEO and Metadata', () => {
  
  test.describe('Structured Data (JSON-LD)', () => {
    test('English page should have valid RealEstateAgent schema', async ({ page }) => {
      await page.goto('/');
      
      const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(jsonLd).toBeTruthy();
      
      const schema = JSON.parse(jsonLd!);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('RealEstateAgent');
      expect(schema.name).toBeTruthy();
      expect(schema.url).toBeTruthy();
    });

    test('Spanish page should have valid RealEstateAgent schema', async ({ page }) => {
      await page.goto('/es/');
      
      const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(jsonLd).toBeTruthy();
      
      const schema = JSON.parse(jsonLd!);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('RealEstateAgent');
    });

    test('Dutch page should have valid RealEstateAgent schema', async ({ page }) => {
      await page.goto('/nl/');
      
      const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(jsonLd).toBeTruthy();
      
      const schema = JSON.parse(jsonLd!);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('RealEstateAgent');
    });
  });

  test.describe('Meta Tags', () => {
    test('English page should have proper meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check description
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
      
      // Check keywords
      const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
      expect(keywords).toBeTruthy();
      
      // Check robots
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toContain('index');
      expect(robots).toContain('follow');
    });

    test('All pages should have Open Graph tags', async ({ page }) => {
      const pages = ['/', '/es/', '/nl/'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        // OG title
        const ogTitle = page.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveCount(1);
        
        // OG description
        const ogDescription = page.locator('meta[property="og:description"]');
        await expect(ogDescription).toHaveCount(1);
        
        // OG type
        const ogType = page.locator('meta[property="og:type"]');
        await expect(ogType).toHaveAttribute('content', 'website');
      }
    });

    test('All pages should have Twitter Card tags', async ({ page }) => {
      const pages = ['/', '/es/', '/nl/'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        const twitterCard = page.locator('meta[name="twitter:card"]');
        await expect(twitterCard).toHaveCount(1);
        
        const twitterTitle = page.locator('meta[name="twitter:title"]');
        await expect(twitterTitle).toHaveCount(1);
      }
    });
  });

  test.describe('Canonical URLs', () => {
    test('Each language version should have correct canonical URL', async ({ page }) => {
      // English
      await page.goto('/');
      let canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toMatch(/agg\.homes\/$/);
      
      // Spanish
      await page.goto('/es/');
      canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toMatch(/agg\.homes\/es/);
      
      // Dutch
      await page.goto('/nl/');
      canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toMatch(/agg\.homes\/nl/);
    });
  });

  test.describe('Viewport and Responsive Design', () => {
    test('All pages should have viewport meta tag', async ({ page }) => {
      const pages = ['/', '/es/', '/nl/'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveAttribute('content', /width=device-width/);
      }
    });
  });
});
