<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types'
import ProductImage from '@/components/ui/ProductImage.vue'

const props = withDefaults(defineProps<{ product: Product; slides?: number }>(), { slides: 4 })

const active = ref(0)
const track = ref<HTMLElement | null>(null)

const indexes = computed(() =>
  props.product.images.length
    ? props.product.images.map((_, index) => index)
    : Array.from({ length: props.slides }, (_, index) => index),
)

function onScroll() {
  const element = track.value
  if (!element) return
  active.value = Math.round(element.scrollLeft / element.clientWidth)
}

function goTo(index: number) {
  const element = track.value
  if (!element) return
  element.scrollTo({ left: index * element.clientWidth, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <!-- Móvil: galería deslizable con indicador de puntos (§4.4) -->
    <div class="md:hidden">
      <div
        ref="track"
        class="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        @scroll.passive="onScroll()"
      >
        <div v-for="index in indexes" :key="index" class="w-full shrink-0 snap-center">
          <div class="aspect-4/5 overflow-hidden bg-surface">
            <ProductImage
              :product="product"
              :index="index"
              :eager="index === 0"
              :show-label="index === 0"
            />
          </div>
        </div>
      </div>
      <div class="mt-3 flex justify-center gap-1.5">
        <button
          v-for="index in indexes"
          :key="index"
          type="button"
          class="grid h-11 w-6 place-items-center"
          :aria-label="`Imagen ${index + 1}`"
          :aria-current="active === index"
          @click="goTo(index)"
        >
          <span
            class="block h-1.5 rounded-full transition-all duration-200"
            :class="active === index ? 'w-5 bg-leather' : 'w-1.5 bg-line'"
          />
        </button>
      </div>
    </div>

    <!-- Desktop: retícula de imágenes, la primera a todo lo ancho -->
    <div class="hidden gap-3 md:grid md:grid-cols-2">
      <div
        v-for="(index, position) in indexes"
        :key="index"
        class="overflow-hidden rounded-card bg-surface"
        :class="
          position === 0 || (position === indexes.length - 1 && indexes.length % 2 === 0)
            ? 'col-span-2 aspect-16/11'
            : 'aspect-4/5'
        "
      >
        <ProductImage
          :product="product"
          :index="index"
          :eager="position === 0"
          :show-label="position === 0"
        />
      </div>
    </div>
  </div>
</template>
