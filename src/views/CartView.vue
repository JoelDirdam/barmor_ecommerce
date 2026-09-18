<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { localized, useFormat } from '@/composables/useFormat'
import { useCartStore } from '@/stores/cart'
import type { Locale } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'
import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'

const cart = useCartStore()
const { t, locale } = useI18n()
const { price } = useFormat()
</script>

<template>
  <div class="container-page py-8 md:py-12">
    <h1 class="text-section">{{ t('cart.title') }}</h1>

    <div v-if="!cart.detailed.length" class="py-16 text-center">
      <IconGlyph name="cart" :size="44" class="mx-auto text-line" />
      <p class="mt-4 text-[17px] font-semibold">{{ t('cart.empty') }}</p>
      <p class="mt-1 text-[14px] text-ink-soft">{{ t('cart.emptyHint') }}</p>
      <BaseButton class="mt-6" :to="{ name: 'catalog' }">{{ t('cart.keepShopping') }}</BaseButton>
    </div>

    <div v-else class="mt-8 gap-10 lg:grid lg:grid-cols-[1fr_360px]">
      <ul class="divide-y divide-line border-y border-line">
        <li v-for="{ line, product } in cart.detailed" :key="line.key" class="flex gap-4 py-5">
          <RouterLink
            :to="{ name: 'product', params: { slug: product.slug } }"
            class="h-28 w-24 shrink-0 overflow-hidden rounded-card bg-surface"
          >
            <ProductImage :product="product" :show-label="false" />
          </RouterLink>

          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-[15px] font-semibold">
                  {{ localized(product, 'name', locale as Locale) }}
                </h2>
                <p class="mt-1 text-[13px] text-ink-soft">
                  {{ line.variant }} · {{ t('common.size') }} {{ line.size }}
                </p>
              </div>
              <span class="nums-tabular text-[16px] font-bold">
                {{ price(product.price * line.qty) }}
              </span>
            </div>

            <div class="mt-3 flex items-center gap-3">
              <QuantityStepper
                :model-value="line.qty"
                @update:model-value="cart.setQty(line.key, $event)"
              />
              <button
                type="button"
                class="min-h-11 text-[13px] font-medium text-ink-soft underline decoration-line underline-offset-4"
                @click="cart.remove(line.key)"
              >
                {{ t('common.remove') }}
              </button>
            </div>
          </div>
        </li>
      </ul>

      <aside class="mt-8 lg:mt-0">
        <div class="rounded-card border border-line bg-surface p-4 lg:sticky lg:top-32">
          <FreeShippingBar />
          <dl class="mt-5 space-y-2 text-[14px]">
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
            <div class="flex items-baseline justify-between border-t border-line pt-3">
              <dt class="font-semibold">{{ t('common.total') }}</dt>
              <dd class="nums-tabular text-[20px] font-bold">{{ price(cart.total) }}</dd>
            </div>
          </dl>
          <BaseButton block size="lg" class="mt-5" :to="{ name: 'checkout' }">
            {{ t('cart.goToPay') }}
          </BaseButton>
        </div>
      </aside>
    </div>
  </div>
</template>
