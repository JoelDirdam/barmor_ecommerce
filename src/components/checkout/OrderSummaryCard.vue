<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { localized, useFormat } from '@/composables/useFormat'
import { useCartStore } from '@/stores/cart'
import type { Locale } from '@/types'
import ProductImage from '@/components/ui/ProductImage.vue'
import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'

const cart = useCartStore()
const { t, locale } = useI18n()
const { price } = useFormat()
</script>

<template>
  <section
    class="rounded-card border border-line bg-surface p-4"
    :aria-label="t('checkout.orderSummary')"
  >
    <h2 class="text-[15px] font-semibold">{{ t('checkout.orderSummary') }}</h2>

    <ul class="mt-4 space-y-3">
      <li v-for="{ line, product } in cart.detailed" :key="line.key" class="flex gap-3">
        <span class="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-bg">
          <ProductImage :product="product" :show-label="false" />
        </span>
        <span class="min-w-0 flex-1 text-[13px]">
          <span class="block truncate font-semibold">
            {{ localized(product, 'name', locale as Locale) }}
          </span>
          <span class="block text-ink-soft">
            {{ line.variant }} · {{ line.size }} · ×{{ line.qty }}
          </span>
        </span>
        <span class="nums-tabular text-[14px] font-semibold">
          {{ price(product.price * line.qty) }}
        </span>
      </li>
    </ul>

    <div class="mt-4 border-t border-line pt-4">
      <FreeShippingBar />
    </div>

    <dl class="mt-4 space-y-2 text-[14px]">
      <div class="flex justify-between">
        <dt class="text-ink-soft">{{ t('common.subtotal') }}</dt>
        <dd class="nums-tabular font-medium">{{ price(cart.subtotal) }}</dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-ink-soft">{{ t('common.shipping') }}</dt>
        <dd class="nums-tabular font-medium">
          <span v-if="cart.shipping === 0" class="text-sage">{{ t('common.free') }}</span>
          <span v-else>{{ price(cart.shipping) }}</span>
        </dd>
      </div>
      <div v-if="cart.savings" class="flex justify-between text-sage">
        <dt>{{ t('common.youSave') }}</dt>
        <dd class="nums-tabular font-medium">−{{ price(cart.savings) }}</dd>
      </div>
      <div class="flex items-baseline justify-between border-t border-line pt-3">
        <dt class="font-semibold">{{ t('common.total') }}</dt>
        <dd class="nums-tabular text-[20px] font-bold">{{ price(cart.total) }}</dd>
      </div>
    </dl>
  </section>
</template>
