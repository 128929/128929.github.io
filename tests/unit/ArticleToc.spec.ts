import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ArticleToc from '../../src/components/ArticleToc.vue'

test('toc items render', () => {
  const items = [{ id: 'h1', text: 'H1', level: 1 }]
  const w = mount(ArticleToc, { props: { items } })
  expect(w.find('a').text()).toBe('H1')
})
