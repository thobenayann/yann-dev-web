import { expect, test } from '@playwright/test';

// ── Home ──────────────────────────────────────────────────────────────────────
test.describe('Home page', () => {
    test('loads and shows hero headline', async ({ page }) => {
        await page.goto('/fr');
        await expect(page).toHaveTitle(/Yann/i);
        // Hero contains the developer's name or role
        await expect(page.locator('h1').first()).toBeVisible();
    });

    test('language switcher navigates to /en', async ({ page }) => {
        await page.goto('/fr');
        // Select the language switcher and switch to English
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: /english/i }).click();
        await expect(page).toHaveURL(/\/en/);
    });
});

// ── Blog ──────────────────────────────────────────────────────────────────────
test.describe('Blog page', () => {
    test('loads the blog list', async ({ page }) => {
        await page.goto('/fr/blog');
        await expect(page.locator('h1').first()).toBeVisible();
    });

    test('search filters articles', async ({ page }) => {
        await page.goto('/fr/blog');
        const input = page.getByPlaceholder(/rechercher/i);
        await input.fill('SEO');
        // URL should update with ?q=SEO after debounce
        await expect(page).toHaveURL(/q=SEO/, { timeout: 2000 });
    });

    test('clear button (×) resets search', async ({ page }) => {
        await page.goto('/fr/blog?q=SEO');
        // X button should be visible
        await page.getByRole('button', { name: /clear search/i }).click();
        await expect(page).toHaveURL(/\/fr\/blog$/, { timeout: 2000 });
    });

    test('tag filter updates URL', async ({ page }) => {
        await page.goto('/fr/blog');
        // Click first tag pill (skip "Tous" which is at index 0)
        const pills = page.getByRole('button').filter({ hasNotText: /tous|all/i });
        if ((await pills.count()) > 0) {
            const firstTag = pills.first();
            const tagText = await firstTag.innerText();
            await firstTag.click();
            await expect(page).toHaveURL(new RegExp(`tag=${encodeURIComponent(tagText.trim())}`), {
                timeout: 2000,
            });
        }
    });
});

// ── Work ──────────────────────────────────────────────────────────────────────
test.describe('Work page', () => {
    test('loads project list', async ({ page }) => {
        await page.goto('/fr/work');
        await expect(page.locator('h1').first()).toBeVisible();
    });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
test.describe('404 page', () => {
    test('shows custom 404 for unknown locale route', async ({ page }) => {
        const response = await page.goto('/fr/cette-page-nexiste-pas');
        // Custom 404 — gradient number should be present
        await expect(page.getByText('404')).toBeVisible();
        // HTTP status is 404
        expect(response?.status()).toBe(404);
    });
});

// ── Legal ─────────────────────────────────────────────────────────────────────
test.describe('Legal pages', () => {
    test('mentions légales loads', async ({ page }) => {
        await page.goto('/fr/legal/mentions-legales');
        await expect(page.locator('h1').first()).toBeVisible();
    });

    test('politique de confidentialité loads', async ({ page }) => {
        await page.goto('/fr/legal/confidentialite');
        await expect(page.locator('h1').first()).toBeVisible();
    });
});
