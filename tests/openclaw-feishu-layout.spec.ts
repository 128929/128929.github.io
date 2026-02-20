import { test, expect } from '@playwright/test'

test.describe('openclaw-feishu layout', () => {
test('has card toc on right', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto('http://localhost:8000/posts/openclaw-feishu/')
  const exists = await page.locator('#card-toc .toc-content .toc').count()
  expect(exists).toBeGreaterThan(0)
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

test('brand color applied to toc links', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto('http://localhost:8000/posts/openclaw-feishu/')
  const brand = await page.evaluate(() => {
    const el = document.querySelector('#card-toc .toc-content .toc a') as HTMLElement
    return getComputedStyle(el).color
  })
  expect(brand.toLowerCase()).toBe('rgb(51, 112, 255)')
})
})
