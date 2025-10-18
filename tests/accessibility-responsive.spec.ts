import { test, expect } from '@playwright/test';

/**
 * Accessibility and responsive design tests for AGG.homes
 * Tests across different devices and screen sizes
 */

test.describe('Accessibility', () => {
  
  test('should have proper HTML structure', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for DOCTYPE
      const doctype = await page.evaluate(() => {
        const node = document.doctype;
        if (!node) return null;
        return {
          name: node.name,
          publicId: node.publicId,
          systemId: node.systemId
        };
      });
      
      expect(doctype?.name).toBe('html');
      
      // Check for lang attribute
      const lang = await page.getAttribute('html', 'lang');
      expect(lang).toBeTruthy();
      expect(['en', 'es', 'nl']).toContain(lang);
    }
  });

  test('should have alt text for images', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const images = await page.locator('img').all();
      
      // Allow pages to have no images, but if they do, check for alt text
      if (images.length > 0) {
        for (const img of images) {
          const alt = await img.getAttribute('alt');
          // Alt can be empty string for decorative images, but should exist
          expect(alt).not.toBeNull();
        }
      }
    }
  });

  test('should have semantic HTML elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for semantic elements (at least some should exist)
    const hasHeader = await page.locator('header').count() > 0;
    const hasNav = await page.locator('nav').count() > 0;
    const hasMain = await page.locator('main').count() > 0;
    const hasFooter = await page.locator('footer').count() > 0;
    const hasSection = await page.locator('section').count() > 0;
    
    // At least one semantic element should be present
    const hasSemanticElements = hasHeader || hasNav || hasMain || hasFooter || hasSection;
    expect(hasSemanticElements).toBeTruthy();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2); // Should have 1-2 h1 elements max
  });
});

test.describe('Responsive Design', () => {
  
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('load');
      
      // Check that content is visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check that there's no horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      // Allow small overflow but not significant
      if (hasHorizontalScroll) {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        const overflow = scrollWidth - clientWidth;
        
        // Allow up to 20px overflow (for scrollbars, etc)
        expect(overflow).toBeLessThan(20);
      }
    }
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Performance', () => {
  
  test('should load pages within reasonable time', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      await page.waitForLoadState('load');
      const loadTime = Date.now() - startTime;
      
      // Should load within 10 seconds (generous for CI environments)
      expect(loadTime).toBeLessThan(10000);
    }
  });

  test('should have proper charset encoding', async ({ page }) => {
    const pages = ['/', '/es/', '/nl/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const charset = await page.locator('meta[charset]').getAttribute('charset');
      expect(charset?.toUpperCase()).toBe('UTF-8');
    }
  });
});
