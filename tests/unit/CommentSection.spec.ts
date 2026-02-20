import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import CommentSection from '../../src/components/CommentSection.vue'

test('renders comments', () => {
  const w = mount(CommentSection)
  expect(w.text()).toContain('示例评论')
})
