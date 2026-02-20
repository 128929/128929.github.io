import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ArticleMeta from '../../src/components/ArticleMeta.vue'

test('renders meta', () => {
  const w = mount(ArticleMeta, { props: { author: 'a', date: '2025', categories: ['c'], tags: ['t'] } })
  expect(w.text()).toContain('a')
  expect(w.text()).toContain('2025')
  expect(w.text()).toContain('c')
  expect(w.text()).toContain('t')
})
