import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should load admin login page', async ({ page }) => {
    await page.goto('http://localhost:8000/admin-login.html');
    await expect(page).toHaveTitle(/Admin Login/);
  });

  test('should login and access dashboard', async ({ page }) => {
    await page.goto('http://localhost:8000/admin-login.html');

    // Fill login form
    await page.fill('#username', 'dedalo101');
    await page.fill('#password', 'qwerty');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await page.waitForURL('**/admin-dashboard.html');
    await expect(page).toHaveTitle(/Admin Dashboard/);
  });

  test('should load conversations when button is clicked', async ({ page }) => {
    await page.goto('http://localhost:8000/admin-login.html');

    // Login first
    await page.fill('#username', 'dedalo101');
    await page.fill('#password', 'qwerty');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin-dashboard.html');

    // Click Load Conversations button
    await page.click('#load-conversations-btn');

    // Should show conversations list (mock data)
    await expect(page.locator('#conversations-list')).toBeVisible();
    await expect(page.locator('.conversation-card')).toHaveCount(4); // Mock data has 4 conversations
  });

  test('should refresh data when button is clicked', async ({ page }) => {
    await page.goto('http://localhost:8000/admin-login.html');

    // Login first
    await page.fill('#username', 'dedalo101');
    await page.fill('#password', 'qwerty');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin-dashboard.html');

    // Click Refresh Data button
    await page.click('text=Refresh Data');

    // Should update stats (check if stats are visible)
    await expect(page.locator('#active-chats')).toBeVisible();
    await expect(page.locator('#total-messages')).toBeVisible();
  });
});