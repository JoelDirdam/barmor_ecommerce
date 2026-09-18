<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 8 })
</script>

<template>
  <!-- Skeletons en lugar de spinner en blanco (§5) -->
  <ul class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4" aria-hidden="true">
    <li v-for="index in count" :key="index">
      <div class="skeleton aspect-4/5 rounded-card" />
      <div class="skeleton mt-3 h-4 w-3/4 rounded-sm" />
      <div class="skeleton mt-2 h-3 w-1/2 rounded-sm" />
      <div class="skeleton mt-2.5 h-4 w-1/3 rounded-sm" />
    </li>
  </ul>
</template>
