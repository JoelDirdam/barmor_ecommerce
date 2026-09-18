<script setup lang="ts">
import { ref } from 'vue'
import IconGlyph from './IconGlyph.vue'

const props = withDefaults(defineProps<{ title: string; open?: boolean }>(), { open: false })
const isOpen = ref(props.open)
</script>

<template>
  <div class="border-b border-line">
    <h3>
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span>{{ title }}</span>
        <IconGlyph
          name="chevronDown"
          :size="18"
          class="text-leather transition-transform duration-200"
          :class="isOpen ? 'rotate-180' : ''"
        />
      </button>
    </h3>
    <div v-show="isOpen" class="pb-5 text-[14px] leading-relaxed text-ink-soft">
      <slot />
    </div>
  </div>
</template>
