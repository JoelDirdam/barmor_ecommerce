<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { categories, categoryBySlug } from '@/data/categories'
import { productsByCategory } from '@/data/products'
import { localized } from '@/composables/useFormat'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'
import { setLocale } from '@/i18n'
import type { Locale } from '@/types'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import MaterialTexture from '@/components/ui/MaterialTexture.vue'
import BrandWordmark from './BrandWordmark.vue'

const { t, locale } = useI18n()
const cart = useCartStore()
const ui = useUiStore()
const wishlist = useWishlistStore()

/** Categoría con mega-menú abierto en desktop */
const hovered = ref<string | null>(null)

const toggleLocale = () => setLocale((locale.value === 'es' ? 'en' : 'es') as Locale)
const label = (slug: string) => {
  const category = categories.find((c) => c.slug === slug)!
  return localized(category, 'name', locale.value as Locale)
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-denim text-white">
    <!-- Cinta de servicio -->
    <div class="hidden border-b border-white/10 md:block">
      <div class="container-page flex h-9 items-center justify-between text-[12px]">
        <p class="flex items-center gap-2 opacity-85">
          <IconGlyph name="truck" :size="15" />
          {{ t('pdp.craft3') }} · {{ t('footer.madeIn') }}
        </p>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="rounded-full px-2.5 py-1 font-medium hover:bg-white/10"
            @click="ui.toggleCurrency()"
          >
            {{ ui.currency }}
          </button>
          <button
            type="button"
            class="rounded-full px-2.5 py-1 font-medium hover:bg-white/10"
            :aria-label="t('common.language')"
            @click="toggleLocale()"
          >
            {{ locale === 'es' ? 'ES' : 'EN' }}
          </button>
          <button
            type="button"
            class="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
            :aria-label="t('common.theme')"
            @click="ui.toggleTheme()"
          >
            <IconGlyph :name="ui.theme === 'dark' ? 'sun' : 'moon'" :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Barra principal -->
    <div class="container-page flex h-14 items-center gap-3 md:h-[68px]">
      <button
        type="button"
        class="-ml-2 grid h-11 w-11 place-items-center rounded-full hover:bg-white/10 md:hidden"
        :aria-label="t('common.menu')"
        @click="ui.drawerOpen = true"
      >
        <IconGlyph name="menu" :size="22" />
      </button>

      <RouterLink
        :to="{ name: 'home' }"
        class="flex flex-1 justify-center md:flex-none md:justify-start"
        aria-label="Barmor"
      >
        <BrandWordmark />
      </RouterLink>

      <!-- Navegación desktop con mega-menú -->
      <nav class="ml-8 hidden flex-1 items-center gap-1 md:flex" @mouseleave="hovered = null">
        <div v-for="category in categories" :key="category.slug" class="relative">
          <RouterLink
            :to="{ name: 'catalog', params: { category: category.slug } }"
            class="inline-flex h-10 items-center rounded-full px-3 text-[14px] font-medium hover:bg-white/10"
            @mouseenter="hovered = category.slug"
            @focus="hovered = category.slug"
          >
            {{ localized(category, 'name', locale as Locale) }}
          </RouterLink>
        </div>
      </nav>

      <div class="flex items-center gap-0.5">
        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
          :aria-label="t('common.search')"
          @click="ui.searchOpen = true"
        >
          <IconGlyph name="search" :size="20" />
        </button>

        <RouterLink
          :to="{ name: 'catalog' }"
          class="relative hidden h-11 w-11 place-items-center rounded-full hover:bg-white/10 md:grid"
          :aria-label="t('common.wishlist')"
        >
          <IconGlyph name="heart" :size="20" />
          <span
            v-if="wishlist.count"
            class="nums-tabular absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber px-1 text-[10px] font-bold text-on-accent"
          >
            {{ wishlist.count }}
          </span>
        </RouterLink>

        <button
          type="button"
          class="relative grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
          :aria-label="`${t('common.cart')} (${cart.count})`"
          @click="cart.open()"
        >
          <IconGlyph name="cart" :size="20" />
          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="scale-50 opacity-0"
          >
            <span
              v-if="cart.count"
              class="nums-tabular absolute right-1 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-amber px-1 text-[10px] font-bold text-on-accent"
            >
              {{ cart.count }}
            </span>
          </Transition>
        </button>
      </div>
    </div>

    <!-- Panel del mega-menú: fondo sand, un solo filete, sin sombras (§4.1) -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="hovered"
        class="absolute inset-x-0 top-full hidden border-y border-line bg-bg text-ink md:block"
        @mouseenter="hovered = hovered"
        @mouseleave="hovered = null"
      >
        <div class="container-page grid grid-cols-[1fr_auto] gap-10 py-7">
          <div>
            <p class="text-[12px] font-semibold uppercase tracking-wider text-leather">
              {{ label(hovered) }}
            </p>
            <ul class="mt-4 grid grid-cols-3 gap-x-8 gap-y-2">
              <li v-for="product in productsByCategory(hovered).slice(0, 6)" :key="product.id">
                <RouterLink
                  :to="{ name: 'product', params: { slug: product.slug } }"
                  class="block py-1 text-[14px] hover:text-leather"
                >
                  {{ localized(product, 'name', locale as Locale) }}
                </RouterLink>
              </li>
            </ul>
            <RouterLink
              :to="{ name: 'catalog', params: { category: hovered } }"
              class="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-leather"
            >
              {{ t('common.viewAll') }}
              <IconGlyph name="arrowRight" :size="15" />
            </RouterLink>
          </div>
          <RouterLink
            :to="{ name: 'catalog', params: { category: hovered } }"
            class="hidden w-56 overflow-hidden rounded-card border-l border-line pl-6 lg:block"
          >
            <div class="aspect-4/5 overflow-hidden rounded-card">
              <MaterialTexture
                :kind="categoryBySlug(hovered)?.texture ?? 'leather'"
                :label="label(hovered)"
                :seed="hovered.length"
              />
            </div>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
