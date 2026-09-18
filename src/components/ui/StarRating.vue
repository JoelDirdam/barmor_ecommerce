<script setup lang="ts">
import IconGlyph from './IconGlyph.vue'

withDefaults(
  defineProps<{
    rating: number
    reviews?: number
    size?: number
    showCount?: boolean
  }>(),
  { reviews: 0, size: 13, showCount: true },
)
</script>

<template>
  <span class="inline-flex items-center gap-1 text-[12px] text-ink-soft">
    <IconGlyph name="star" :size="size" filled class="text-amber" />
    <span class="nums-tabular font-medium text-ink">{{ rating.toFixed(1) }}</span>
    <span v-if="showCount && reviews" class="nums-tabular">({{ reviews }})</span>
  </span>
</template>
