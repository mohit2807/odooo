import { test, expect } from '@playwright/test'

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in a real app, you'd set up proper auth
    await page.goto('/feed')
  })

  test('should show product feed', async ({ page }) => {
    await expect(page.getByText('EcoFinds')).toBeVisible()
    await expect(page.getByPlaceholder('Search sustainable products...')).toBeVisible()
  })

  test('should show category filters', async ({ page }) => {
    await expect(page.getByText('All')).toBeVisible()
    await expect(page.getByText('Electronics')).toBeVisible()
    await expect(page.getByText('Fashion & Apparel')).toBeVisible()
  })

  test('should show sort options', async ({ page }) => {
    await expect(page.getByRole('combobox')).toBeVisible()
  })
})
