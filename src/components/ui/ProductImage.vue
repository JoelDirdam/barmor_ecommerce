<script setup lang="ts">
import { computed } from 'vue'
import MaterialTexture from './MaterialTexture.vue'
import type { Product } from '@/types'

const props = withDefaults(
  defineProps<{
    product: Product
    index?: number
    /** Texto alternativo; si no se pasa se usa el nombre del producto */
    alt?: string
    eager?: boolean
    showLabel?: boolean
  }>(),
  { index: 0, alt: '', eager: false, showLabel: true },
)

const src = computed(() => props.product.images[props.index] ?? '')
const seed = computed(() => props.product.id.charCodeAt(props.product.id.length - 1) + props.index)
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt || product.name"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    class="h-full w-full object-cover"
  />
  <MaterialTexture
    v-else
    :kind="product.texture"
    :seed="seed"
    :label="showLabel ? product.name : ''"
  />
</template>
