import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Welcome to EcoFinds')).toBeVisible()
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible()
    await expect(page.getByPlaceholder('Your password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('should navigate to signup', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Sign up').click()
    await expect(page).toHaveURL('/signup')
    await expect(page.getByText('Join EcoFinds')).toBeVisible()
  })

  test('should show signup form', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByPlaceholder('Choose a username')).toBeVisible()
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible()
    await expect(page.getByPlaceholder('Create a password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })
})
