<template>
  <div class="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
    <div class="flex items-center gap-1"><i class="far fa-user"></i><span>{{ author }}</span></div>
    <div class="flex items-center gap-1"><i class="far fa-calendar-alt"></i><span>{{ date }}</span></div>
    <div class="flex items-center gap-1"><i class="fas fa-inbox"></i><span v-for="c in categories" :key="c">{{ c }}</span></div>
    <div class="flex items-center gap-1"><i class="fas fa-tags"></i><span v-for="t in tags" :key="t">{{ t }}</span></div>
  </div>
</template>

<script setup>
defineProps({
  author: String,
  date: String,
  categories: Array,
  tags: Array
})
</script>

<style scoped>
</style>
