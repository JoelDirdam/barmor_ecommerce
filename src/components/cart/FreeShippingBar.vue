<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/composables/useFormat'
import { useCartStore } from '@/stores/cart'
import IconGlyph from '@/components/ui/IconGlyph.vue'

const cart = useCartStore()
const { t } = useI18n()
const { price } = useFormat()
</script>

<template>
  <div>
    <p class="flex items-center gap-2 text-[13px] font-medium">
      <IconGlyph name="truck" :size="16" class="text-sage" />
      <span v-if="cart.missingForFreeShipping > 0">
        {{ t('cart.missingForFree', { amount: price(cart.missingForFreeShipping) }) }}
      </span>
      <span v-else class="text-sage">{{ t('cart.freeUnlocked') }}</span>
    </p>
    <div
      class="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
      role="progressbar"
      :aria-valuenow="cart.freeShippingProgress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full bg-sage transition-[width] duration-300"
        :style="{ width: `${cart.freeShippingProgress}%` }"
      />
    </div>
  </div>
</template>
