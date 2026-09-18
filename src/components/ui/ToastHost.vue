<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import IconGlyph from './IconGlyph.vue'

const ui = useUiStore()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="ui.toast"
        class="fixed inset-x-4 bottom-20 z-70 mx-auto flex w-fit max-w-[90vw] items-center gap-2 rounded-card bg-denim px-4 py-3 text-[14px] font-medium text-white md:bottom-8"
        role="status"
      >
        <IconGlyph name="check" :size="18" class="text-sage" />
        <span>{{ ui.toast.text }}</span>
      </div>
    </Transition>
  </Teleport>
</template>
