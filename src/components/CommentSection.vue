<template>
  <section id="comments" class="mt-8">
    <h3 class="text-lg font-semibold mb-3">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="c in comments" :key="c.id" class="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800">
        <div class="text-sm font-semibold">{{ c.author }}</div>
        <div class="text-sm">{{ c.content }}</div>
        <div v-if="c.children && c.children.length" class="ml-4 mt-2 border-l pl-3 space-y-3">
          <div v-for="cc in c.children" :key="cc.id" class="text-sm">
            <div class="font-medium">{{ cc.author }}</div>
            <div>{{ cc.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const title = '评论'
const comments = ref([
  { id: 1, author: '用户A', content: '示例评论', children: [{ id: 11, author: '用户B', content: '回复内容' }] }
])
</script>

<style scoped>
</style>
