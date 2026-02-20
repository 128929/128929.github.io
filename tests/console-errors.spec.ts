import { test, expect } from '@playwright/test'

test('homepage has no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('http://localhost:8000/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test('archives page has no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('http://localhost:8000/archives/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})
