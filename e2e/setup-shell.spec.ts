import { expect, test } from '@playwright/test'

test('local setup serves the accessible FirmLedger shell', async ({ page }) => {
  const health = await page.request.get('/api/health')
  expect(health.ok()).toBe(true)
  await expect(health.json()).resolves.toMatchObject({ status: 'ok' })

  await page.goto('/')
  await expect(page).toHaveTitle('FirmLedger')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content')
  await expect(page.locator('#main-content')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'FirmLedger' })).toBeVisible()
  await expect(page.getByText('Finance controls are ready for local development.')).toBeVisible()
})
