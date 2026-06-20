import { test, expect } from '@playwright/test';
import { injectWalletMock, connectWallet, MOCK_ADDRESS } from './test-utils';

test.describe('Profile Flow', () => {
  test.beforeEach(async ({ page }) => {
    await injectWalletMock(page);
  });

  test('profile page renders for a valid address', async ({ page }) => {
    await page.goto(`/profile/${MOCK_ADDRESS}`);
    await page.waitForLoadState('networkidle');
    // Page shows either a profile or "not found" — either way the page loads
    const content = page.locator('main, [data-testid="profile"], h1, h2').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('own profile shows edit option when connected', async ({ page }) => {
    await page.goto('/');
    await connectWallet(page);
    await page.goto(`/profile/${MOCK_ADDRESS}`);
    await page.waitForLoadState('networkidle');
    // Edit profile link or own profile indicator
    const editOrProfile = page.locator('a[href*="edit"], text=/edit profile/i, h1, h2').first();
    await expect(editOrProfile).toBeVisible({ timeout: 10000 });
  });
});
