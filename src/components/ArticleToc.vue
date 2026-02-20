<template>
  <nav class="text-sm">
    <ul>
      <li v-for="i in items" :key="i.id" :class="'pl-'+(i.level-1)*2">
        <a :href="'#'+i.id">{{ i.text }}</a>
      </li>
    </ul>
  </nav>
  </template>

<script setup>
defineProps({ items: Array })
</script>

<style scoped>
</style>
