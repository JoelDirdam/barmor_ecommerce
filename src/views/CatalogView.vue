<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { categories, categoryBySlug } from '@/data/categories'
import { products, productsByCategory } from '@/data/products'
import { localized, useFormat } from '@/composables/useFormat'
import { useQuickAdd } from '@/composables/useQuickAdd'
import type { Locale, Product } from '@/types'
import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonGrid from '@/components/product/SkeletonGrid.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { price } = useFormat()
const { open: openQuickAdd } = useQuickAdd()

const activeCategory = computed(() => (route.params.category as string | undefined) ?? '')
const searchTerm = computed(() => ((route.query.q as string) ?? '').toLowerCase())

const maxPrice = ref(7000)
const onlyInStock = ref(false)
const sort = ref<'relevance' | 'new' | 'priceAsc' | 'priceDesc' | 'rating'>('relevance')
const filtersOpen = ref(false)
const loading = ref(false)

const base = computed<Product[]>(() =>
  activeCategory.value ? productsByCategory(activeCategory.value) : products,
)

const filtered = computed(() => {
  let list = base.value.filter((product) => product.price <= maxPrice.value)

  if (onlyInStock.value) list = list.filter((p) => p.sizes.some((s) => s.inStock))

  if (searchTerm.value.length > 1) {
    list = list.filter((product) =>
      [product.name, product.nameEn, product.material, product.fit, product.category]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.value),
    )
  }

  const sorted = [...list]
  if (sort.value === 'priceAsc') sorted.sort((a, b) => a.price - b.price)
  if (sort.value === 'priceDesc') sorted.sort((a, b) => b.price - a.price)
  if (sort.value === 'rating') sorted.sort((a, b) => b.rating - a.rating)
  if (sort.value === 'new')
    sorted.sort(
      (a, b) => Number(b.badges.includes('new')) - Number(a.badges.includes('new')),
    )
  return sorted
})

/** Skeletons breves al cambiar filtros: nunca pantalla vacía (§5) */
watch([activeCategory, sort, maxPrice, onlyInStock, searchTerm], () => {
  loading.value = true
  window.setTimeout(() => (loading.value = false), 220)
})

function selectCategory(slug: string) {
  filtersOpen.value = false
  router.push(slug ? { name: 'catalog', params: { category: slug } } : { name: 'catalog' })
}

function reset() {
  maxPrice.value = 7000
  onlyInStock.value = false
  sort.value = 'relevance'
}

const heading = computed(() => {
  const category = categoryBySlug(activeCategory.value)
  if (category) return localized(category, 'name', locale.value as Locale)
  if (searchTerm.value) return `“${route.query.q}”`
  return t('catalog.title')
})
</script>

<template>
  <div class="pb-24">
    <!-- Chips de categoría bajo el header (§4.1) -->
    <div class="sticky top-14 z-40 border-b border-line bg-bg/95 backdrop-blur md:top-[104px]">
      <ul class="no-scrollbar container-page flex gap-2 overflow-x-auto py-3">
        <li>
          <button
            type="button"
            class="min-h-11 whitespace-nowrap rounded-full border px-4 text-[14px] font-medium transition-colors duration-150"
            :class="
              activeCategory
                ? 'border-line hover:border-leather'
                : 'border-leather bg-leather text-white dark:text-on-accent'
            "
            @click="selectCategory('')"
          >
            {{ t('catalog.all') }}
          </button>
        </li>
        <li v-for="category in categories" :key="category.slug">
          <button
            type="button"
            class="min-h-11 whitespace-nowrap rounded-full border px-4 text-[14px] font-medium transition-colors duration-150"
            :class="
              activeCategory === category.slug
                ? 'border-leather bg-leather text-white dark:text-on-accent'
                : 'border-line hover:border-leather'
            "
            @click="selectCategory(category.slug)"
          >
            {{ localized(category, 'name', locale as Locale) }}
          </button>
        </li>
      </ul>
    </div>

    <div class="container-page pt-8">
      <nav class="text-[12px] text-ink-soft" aria-label="breadcrumb">
        <RouterLink :to="{ name: 'home' }" class="hover:underline">
          {{ t('pdp.breadcrumbHome') }}
        </RouterLink>
        <span aria-hidden="true"> / </span>
        <span>{{ heading }}</span>
      </nav>

      <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-section">{{ heading }}</h1>
          <p class="mt-1 text-[13px] text-ink-soft">
            {{ t('catalog.results', { count: filtered.length }) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <label class="hidden items-center gap-2 text-[13px] md:flex">
            <span class="text-ink-soft">{{ t('catalog.sort') }}</span>
            <select
              v-model="sort"
              class="min-h-11 rounded-card border border-line bg-surface px-3 text-[14px]"
            >
              <option value="relevance">{{ t('catalog.sortRelevance') }}</option>
              <option value="new">{{ t('catalog.sortNew') }}</option>
              <option value="priceAsc">{{ t('catalog.sortPriceAsc') }}</option>
              <option value="priceDesc">{{ t('catalog.sortPriceDesc') }}</option>
              <option value="rating">{{ t('catalog.sortRating') }}</option>
            </select>
          </label>

          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-card border border-line px-4 text-[14px] font-medium md:hidden"
            @click="filtersOpen = true"
          >
            <IconGlyph name="filter" :size="17" />
            {{ t('catalog.filters') }}
          </button>
        </div>
      </div>

      <div class="mt-8 gap-10 md:grid md:grid-cols-[220px_1fr]">
        <!-- Filtros laterales desde md (§3) -->
        <aside class="hidden md:block">
          <div class="sticky top-[168px]">
            <h2 class="text-[12px] font-semibold uppercase tracking-wider text-leather">
              {{ t('catalog.filters') }}
            </h2>

            <div class="mt-5">
              <label class="text-[13px] font-medium" for="price-range">
                {{ t('catalog.priceRange') }}
              </label>
              <input
                id="price-range"
                v-model.number="maxPrice"
                type="range"
                min="300"
                max="7000"
                step="100"
                class="mt-2 w-full accent-leather"
              />
              <p class="nums-tabular mt-1 text-[13px] text-ink-soft">{{ price(maxPrice) }}</p>
            </div>

            <label class="mt-6 flex min-h-11 items-center gap-2.5 text-[14px]">
              <input v-model="onlyInStock" type="checkbox" class="h-5 w-5 accent-leather" />
              {{ t('catalog.onlyInStock') }}
            </label>

            <button
              type="button"
              class="mt-6 min-h-11 text-[13px] font-semibold text-leather underline decoration-line underline-offset-4"
              @click="reset()"
            >
              {{ t('catalog.clear') }}
            </button>
          </div>
        </aside>

        <div>
          <SkeletonGrid v-if="loading" :count="8" />

          <p v-else-if="!filtered.length" class="py-16 text-center text-ink-soft">
            {{ t('catalog.empty') }}
          </p>

          <!-- Stagger sólo en la primera fila para no sentirse lento (§5) -->
          <ul
            v-else
            class="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            <li
              v-for="(product, index) in filtered"
              :key="product.id"
              :style="index < 5 ? { animationDelay: `${index * 40}ms` } : undefined"
              :class="index < 5 ? 'animate-[barmor-fade-in_240ms_ease-out_both]' : ''"
            >
              <ProductCard :product="product" :eager="index < 4" @quick-add="openQuickAdd" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Hoja de filtros en móvil -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div v-if="filtersOpen" class="fixed inset-0 z-70 bg-black/45 md:hidden" @click="filtersOpen = false" />
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-[280ms] ease-drawer"
        enter-from-class="translate-y-full"
        leave-active-class="transition-transform duration-200 ease-drawer"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="filtersOpen"
          class="fixed inset-x-0 bottom-0 z-70 rounded-t-2xl bg-bg p-4 pb-safe md:hidden"
          role="dialog"
          aria-modal="true"
          :aria-label="t('catalog.filters')"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-[16px] font-semibold">{{ t('catalog.filters') }}</h2>
            <button
              type="button"
              class="-mr-2 grid h-11 w-11 place-items-center rounded-full"
              :aria-label="t('common.close')"
              @click="filtersOpen = false"
            >
              <IconGlyph name="close" :size="20" />
            </button>
          </div>

          <div class="mt-4">
            <label class="text-[13px] font-medium" for="price-range-mobile">
              {{ t('catalog.priceRange') }}
            </label>
            <input
              id="price-range-mobile"
              v-model.number="maxPrice"
              type="range"
              min="300"
              max="7000"
              step="100"
              class="mt-2 w-full accent-leather"
            />
            <p class="nums-tabular mt-1 text-[13px] text-ink-soft">{{ price(maxPrice) }}</p>
          </div>

          <label class="mt-4 flex min-h-11 items-center gap-2.5 text-[14px]">
            <input v-model="onlyInStock" type="checkbox" class="h-5 w-5 accent-leather" />
            {{ t('catalog.onlyInStock') }}
          </label>

          <label class="mt-4 block text-[13px] font-medium">
            {{ t('catalog.sort') }}
            <select
              v-model="sort"
              class="mt-2 min-h-12 w-full rounded-card border border-line bg-surface px-3 text-[14px]"
            >
              <option value="relevance">{{ t('catalog.sortRelevance') }}</option>
              <option value="new">{{ t('catalog.sortNew') }}</option>
              <option value="priceAsc">{{ t('catalog.sortPriceAsc') }}</option>
              <option value="priceDesc">{{ t('catalog.sortPriceDesc') }}</option>
              <option value="rating">{{ t('catalog.sortRating') }}</option>
            </select>
          </label>

          <div class="mt-5 flex gap-3">
            <BaseButton variant="secondary" block @click="reset()">
              {{ t('catalog.clear') }}
            </BaseButton>
            <BaseButton block @click="filtersOpen = false">{{ t('catalog.apply') }}</BaseButton>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
