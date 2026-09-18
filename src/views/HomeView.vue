<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { featuredProducts, products } from '@/data/products'
import { useQuickAdd } from '@/composables/useQuickAdd'
import HeroBanner from '@/components/home/HeroBanner.vue'
import CategoryCardRow from '@/components/home/CategoryCardRow.vue'
import ValueStrip from '@/components/home/ValueStrip.vue'
import InstagramReelsCarousel from '@/components/home/InstagramReelsCarousel.vue'
import ProductRail from '@/components/product/ProductRail.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'

const { t } = useI18n()
const { open: openQuickAdd } = useQuickAdd()

const newArrivals = products.filter((product) => product.badges.includes('new')).slice(0, 4)
const onSale = products.filter((product) => product.compareAt).slice(0, 5)
</script>

<template>
  <div class="pb-20">
    <HeroBanner />

    <CategoryCardRow />

    <section class="container-page mt-14 md:mt-20">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-section">{{ t('home.featuredTitle') }}</h2>
          <p class="mt-1.5 text-[14px] text-ink-soft">{{ t('home.featuredSub') }}</p>
        </div>
        <RouterLink
          :to="{ name: 'catalog' }"
          class="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-leather"
        >
          {{ t('common.viewAll') }}
          <IconGlyph name="arrowRight" :size="15" />
        </RouterLink>
      </div>
      <div class="mt-6">
        <ProductRail :products="featuredProducts" @quick-add="openQuickAdd" />
      </div>
    </section>

    <ValueStrip />

    <InstagramReelsCarousel />

    <section v-if="newArrivals.length" class="container-page mt-14 md:mt-20">
      <h2 class="text-section">{{ t('catalog.sortNew') }}</h2>
      <ul class="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        <li v-for="product in newArrivals" :key="product.id">
          <ProductCard :product="product" @quick-add="openQuickAdd" />
        </li>
      </ul>
    </section>

    <section v-if="onSale.length" class="container-page mt-14 md:mt-20">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 class="text-section">{{ t('badges.sale') }}</h2>
        <RouterLink
          :to="{ name: 'catalog', params: { category: 'ofertas' } }"
          class="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-leather"
        >
          {{ t('common.viewAll') }}
          <IconGlyph name="arrowRight" :size="15" />
        </RouterLink>
      </div>
      <div class="mt-6">
        <ProductRail :products="onSale" @quick-add="openQuickAdd" />
      </div>
    </section>

    <!-- Banda de mezclilla: ancla visual antes del pie (§3) -->
    <section class="mt-16 bg-denim py-14 text-white md:mt-20 md:py-20">
      <div class="container-page max-w-3xl text-center">
        <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75">
          {{ t('brand.claim') }}
        </p>
        <h2 class="text-section mt-3">{{ t('home.valuesTitle') }}</h2>
        <p class="mx-auto mt-3 max-w-[52ch] text-[15px] text-white/85">{{ t('home.heroSub') }}</p>
        <BaseButton size="lg" class="mt-7" :to="{ name: 'catalog' }">
          {{ t('home.heroCta') }}
        </BaseButton>
      </div>
    </section>
  </div>
</template>
