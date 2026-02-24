import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FlinkSection from '../../src/components/FlinkSection.vue'

describe('FlinkSection.vue', () => {
  const mockData = [
    {
      title: '测试分类',
      anchor: 'test-category',
      description: '测试描述',
      items: [
        {
          name: '测试链接1',
          link: 'https://test1.com',
          avatar: 'https://test1.com/logo.png',
          descr: '测试描述1'
        },
        {
          name: '测试链接2',
          link: 'https://test2.com',
          avatar: 'https://test2.com/logo.png',
          descr: '测试描述2'
        }
      ]
    }
  ]

  it('renders loading state initially', () => {
    const wrapper = mount(FlinkSection)
    expect(wrapper.find('.loading-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('正在加载友情链接...')
  })

  it('renders data correctly after loading', async () => {
    const wrapper = mount(FlinkSection, {
      props: {
        initialData: mockData
      }
    })

    // Wait for the async loadData to complete (simulated delay is 500ms)
    await new Promise(resolve => setTimeout(resolve, 600))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.loading-state').exists()).toBe(false)
    expect(wrapper.findAll('.flink-category').length).toBe(1)
    expect(wrapper.findAll('.flink-list-item').length).toBe(2)
    expect(wrapper.text()).toContain('测试分类')
    expect(wrapper.text()).toContain('测试链接1')
  })

  it('handles image load error correctly', async () => {
    const wrapper = mount(FlinkSection, {
      props: {
        initialData: mockData,
        fallbackImage: '/img/fallback.png'
      }
    })

    await new Promise(resolve => setTimeout(resolve, 600))
    await wrapper.vm.$nextTick()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    
    // Simulate error
    await img.trigger('error')
    
    // Check if src changed to fallback
    expect(img.attributes('src')).toBe('/img/fallback.png')
  })

  it('applies correct classes for items', async () => {
    const wrapper = mount(FlinkSection, {
      props: {
        initialData: mockData
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 600))
    await wrapper.vm.$nextTick()
    
    const item = wrapper.find('.flink-list-item')
    expect(item.classes()).toContain('flink-list-item')
  })
})
