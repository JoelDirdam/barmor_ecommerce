<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { localized, useFormat } from '@/composables/useFormat'
import { useScrollLock } from '@/composables/useScrollLock'
import { useCartStore } from '@/stores/cart'
import type { Locale, Product } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import SizeSelector from './SizeSelector.vue'
import ColorSwatchGroup from './ColorSwatchGroup.vue'

/**
 * Bottom sheet de agregado rápido: evita navegar a la PDP para piezas simples
 * (cachucha, cinto) — §4.3 "Fast hands, not slow scrolls".
 */
const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ close: [] }>()

const { t, locale } = useI18n()
const { price } = useFormat()
const cart = useCartStore()

const size = ref('')
const variant = ref(0)
const isOpen = computed(() => Boolean(props.product))
useScrollLock(isOpen)

watch(
  () => props.product,
  (product) => {
    variant.value = 0
    // Talla única se preselecciona: un tap y listo
    const available = product?.sizes.filter((s) => s.inStock) ?? []
    size.value = available.length === 1 ? available[0]!.label : ''
  },
)

function confirm() {
  if (!props.product || !size.value) return
  cart.add(
    props.product,
    size.value,
    localized(props.product.variants[variant.value]!, 'name', locale.value as Locale),
  )
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="product" class="fixed inset-0 z-70 bg-black/45" @click="emit('close')" />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-[280ms] ease-drawer"
      enter-from-class="translate-y-full"
      leave-active-class="transition-transform duration-200 ease-drawer"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="product"
        class="fixed inset-x-0 bottom-0 z-70 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-bg pb-safe md:inset-x-auto md:right-6 md:bottom-6 md:w-96 md:rounded-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="t('common.quickAdd')"
        @keydown.esc="emit('close')"
      >
        <div class="flex items-start gap-4 border-b border-line p-4">
          <span class="h-20 w-16 shrink-0 overflow-hidden rounded-card bg-surface">
            <ProductImage :product="product" :show-label="false" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-[15px] font-semibold">
              {{ localized(product, 'name', locale as Locale) }}
            </p>
            <p class="nums-tabular mt-1 text-[17px] font-bold">{{ price(product.price) }}</p>
          </div>
          <button
            type="button"
            class="-mr-1 -mt-1 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"
            :aria-label="t('common.close')"
            @click="emit('close')"
          >
            <IconGlyph name="close" :size="20" />
          </button>
        </div>

        <div class="space-y-5 p-4">
          <ColorSwatchGroup
            v-if="product.variants.length > 1"
            v-model="variant"
            :variants="product.variants"
          />
          <SizeSelector v-model="size" :sizes="product.sizes" />
          <BaseButton block size="lg" :disabled="!size" @click="confirm()">
            {{ size ? t('common.addToCart') : t('common.selectSize') }}
          </BaseButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
