import { test, expect } from '@playwright/test'

test.describe('openclaw-feishu layout', () => {
  test('left column width <= 360px', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('http://localhost:8000/posts/openclaw-feishu/')
    const left = page.locator('.openclaw-feishu .toc-container')
    const w = await left.evaluate(el => el.getBoundingClientRect().width)
    expect(w).toBeLessThanOrEqual(360)
  })

  test('right column >= 65% of container', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('http://localhost:8000/posts/openclaw-feishu/')
    const container = page.locator('.openclaw-feishu .post-body')
    const right = page.locator('.openclaw-feishu .article-content')
    const [cw, rw] = await Promise.all([
      container.evaluate(el => el.getBoundingClientRect().width),
      right.evaluate(el => el.getBoundingClientRect().width)
    ])
    expect(rw).toBeGreaterThanOrEqual(cw * 0.65)
  })

  test('color tokens scope intact', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('http://localhost:8000/posts/openclaw-feishu/')
    const brand = await page.evaluate(() => {
      const el = document.querySelector('.openclaw-feishu .toc-container .toc-list a') as HTMLElement
      return getComputedStyle(el).color
    })
    expect(brand.toLowerCase()).toBe('rgb(51, 112, 255)')
  })
})
