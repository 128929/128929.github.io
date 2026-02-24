<template>
  <div class="article-container">
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <header class="mb-4">
      <h1 class="article-title">{{ meta.title }}</h1>
      <ArticleMeta :author="meta.author" :date="meta.date" :categories="meta.categories" :tags="meta.tags" />
    </header>
    <div class="reading-area">
      <article id="article-container" class="article-content prose prose-zinc dark:prose-invert">
        <div v-html="html"></div>
      </article>
      <aside class="toc">
        <ArticleToc :items="tocItems" />
      </aside>
    </div>
    <CommentSection />
  </div>
</template>

<script setup>
import './..//assets/css/article.css'
import { onMounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useFontSize } from '../composables/useFontSize'
import { useI18n } from '../composables/useI18n'
import { createMarkdownRenderer } from '../plugins/markdown'
import ArticleMeta from '../components/ArticleMeta.vue'
import ArticleToc from '../components/ArticleToc.vue'
import CommentSection from '../components/CommentSection.vue'

const meta = ref({
  title: '示例文章',
  author: 'tutu',
  date: '2025-08-24',
  categories: ['教程'],
  tags: ['Butterfly']
})

const { toggleTheme } = useTheme()
const { increase, decrease } = useFontSize()
const { t } = useI18n()

const md = createMarkdownRenderer()
const source = ref('# 标题\n\n一些内容\n\n```js\nconsole.log(1)\n```\n\n```mermaid\nflowchart TD;A-->B;\n```')
const html = ref('')
const tocItems = ref([])
const progress = ref(0)

const calcProgress = () => {
  const el = document.getElementById('article-container')
  if (!el) return
  const h = el.scrollHeight - window.innerHeight
  const y = window.scrollY - el.offsetTop
  const p = Math.max(0, Math.min(100, Math.round((y / h) * 100)))
  progress.value = isNaN(p) ? 0 : p
}

let ticking = false
const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      calcProgress()
      ticking = false
    })
    ticking = true
  }
}

onMounted(async () => {
  html.value = await md.render(source.value)
  // Wait for DOM update
  await new Promise(r => setTimeout(r, 0))
  
  const hs = Array.from(document.querySelectorAll('#article-container h1, #article-container h2, #article-container h3, #article-container h4, #article-container h5, #article-container h6'))
  tocItems.value = hs.map(h => ({ id: h.id, text: h.textContent, level: Number(h.tagName[1]) }))
  calcProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
})
</script>

<style scoped>
</style>
