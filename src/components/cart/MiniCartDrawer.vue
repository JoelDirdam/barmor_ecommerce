<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localized, useFormat } from '@/composables/useFormat'
import { useScrollLock } from '@/composables/useScrollLock'
import { useCartStore } from '@/stores/cart'
import type { Locale } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import ProductImage from '@/components/ui/ProductImage.vue'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'
import FreeShippingBar from './FreeShippingBar.vue'

const cart = useCartStore()
const { t, locale } = useI18n()
const { price } = useFormat()

const isOpen = computed(() => cart.isOpen)
useScrollLock(isOpen)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-[280ms]"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="cart.isOpen" class="fixed inset-0 z-70 bg-black/45" @click="cart.close()" />
    </Transition>

    <!-- Slide-over a la derecha en desktop, hoja de altura completa en móvil -->
    <Transition
      enter-active-class="transition-transform duration-[280ms] ease-drawer"
      enter-from-class="translate-x-full"
      leave-active-class="transition-transform duration-200 ease-drawer"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="cart.isOpen"
        class="fixed inset-y-0 right-0 z-70 flex w-full max-w-[420px] flex-col bg-bg"
        role="dialog"
        aria-modal="true"
        :aria-label="t('cart.title')"
        @keydown.esc="cart.close()"
      >
        <header class="flex h-14 items-center justify-between border-b border-line px-4">
          <h2 class="text-[16px] font-semibold">
            {{ t('cart.title') }}
            <span v-if="cart.count" class="nums-tabular text-ink-soft">({{ cart.count }})</span>
          </h2>
          <button
            type="button"
            class="-mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"
            :aria-label="t('common.close')"
            @click="cart.close()"
          >
            <IconGlyph name="close" :size="20" />
          </button>
        </header>

        <!-- Región viva para lectores de pantalla (§6) -->
        <p class="sr-only" aria-live="polite">{{ cart.lastAnnouncement }}</p>

        <div v-if="!cart.detailed.length" class="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <IconGlyph name="cart" :size="40" class="text-line" />
          <p class="text-[16px] font-semibold">{{ t('cart.empty') }}</p>
          <p class="text-[14px] text-ink-soft">{{ t('cart.emptyHint') }}</p>
          <BaseButton variant="secondary" :to="{ name: 'catalog' }" @click="cart.close()">
            {{ t('cart.keepShopping') }}
          </BaseButton>
        </div>

        <ul v-else class="flex-1 divide-y divide-line overflow-y-auto px-4">
          <li v-for="{ line, product } in cart.detailed" :key="line.key" class="flex gap-3 py-4">
            <RouterLink
              :to="{ name: 'product', params: { slug: product.slug } }"
              class="h-24 w-20 shrink-0 overflow-hidden rounded-card bg-surface"
              @click="cart.close()"
            >
              <ProductImage :product="product" :show-label="false" />
            </RouterLink>

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <p class="text-[14px] font-semibold">
                  {{ localized(product, 'name', locale as Locale) }}
                </p>
                <button
                  type="button"
                  class="-mr-2 -mt-2 grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-ink/5"
                  :aria-label="`${t('common.remove')} ${product.name}`"
                  @click="cart.remove(line.key)"
                >
                  <IconGlyph name="close" :size="16" />
                </button>
              </div>
              <p class="mt-0.5 text-[13px] text-ink-soft">
                {{ line.variant }} · {{ t('common.size') }} {{ line.size }}
              </p>
              <div class="mt-2 flex items-center justify-between gap-2">
                <QuantityStepper
                  :model-value="line.qty"
                  @update:model-value="cart.setQty(line.key, $event)"
                />
                <span class="nums-tabular text-[15px] font-bold">
                  {{ price(product.price * line.qty) }}
                </span>
              </div>
            </div>
          </li>
        </ul>

        <footer v-if="cart.detailed.length" class="border-t border-line px-4 pt-4 pb-safe">
          <FreeShippingBar />
          <div class="mt-4 flex items-baseline justify-between">
            <span class="text-[14px] font-medium">{{ t('common.subtotal') }}</span>
            <span class="nums-tabular text-[20px] font-bold">{{ price(cart.subtotal) }}</span>
          </div>
          <p v-if="cart.savings" class="mt-1 text-[13px] font-medium text-sage">
            {{ t('common.youSave') }} {{ price(cart.savings) }}
          </p>
          <BaseButton
            block
            size="lg"
            class="mt-4"
            :to="{ name: 'checkout' }"
            @click="cart.close()"
          >
            {{ t('cart.goToPay') }}
          </BaseButton>
          <button
            type="button"
            class="mt-2 h-11 w-full text-[13px] font-medium text-ink-soft"
            @click="cart.close()"
          >
            {{ t('cart.keepShopping') }}
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
