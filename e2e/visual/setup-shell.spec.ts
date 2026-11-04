import { expect, test } from '@playwright/test'

test('setup shell keeps its visual layout', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'FirmLedger' })).toBeVisible()
  await expect(page).toHaveScreenshot('setup-shell.png', { animations: 'disabled' })
})
