<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import ProductCard from './ProductCard.vue'

defineProps<{ products: Product[] }>()
const emit = defineEmits<{ quickAdd: [product: Product] }>()

const track = ref<HTMLElement | null>(null)

function scrollBy(direction: 1 | -1) {
  track.value?.scrollBy({ left: direction * track.value.clientWidth * 0.8, behavior: 'smooth' })
}
</script>

<template>
  <div class="relative">
    <ul
      ref="track"
      class="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:px-0"
    >
      <li
        v-for="product in products"
        :key="product.id"
        class="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23%] lg:w-[19%]"
      >
        <ProductCard :product="product" @quick-add="emit('quickAdd', $event)" />
      </li>
    </ul>

    <div class="mt-4 hidden justify-end gap-2 md:flex">
      <button
        type="button"
        class="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-leather"
        aria-label="Anterior"
        @click="scrollBy(-1)"
      >
        <IconGlyph name="arrowLeft" :size="18" />
      </button>
      <button
        type="button"
        class="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-leather"
        aria-label="Siguiente"
        @click="scrollBy(1)"
      >
        <IconGlyph name="arrowRight" :size="18" />
      </button>
    </div>
  </div>
</template>
