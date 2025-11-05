import { test, expect } from '@playwright/test'

const basePath = process.env.PLAYWRIGHT_BASE_PATH ?? ''

test.describe('Home visual regression', () => {
  test('hero section matches baseline', async ({ page }: { page: any }) => {
    await page.goto(`${basePath}/`)
    await page.waitForTimeout(2000)
    await expect(page).toHaveScreenshot('home-hero.png', {
      fullPage: false,
      mask: [page.locator('#newsletter form')],
    })
  })
})
