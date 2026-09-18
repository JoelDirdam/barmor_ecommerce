<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { productBySlug, products } from '@/data/products'
import { categoryBySlug } from '@/data/categories'
import { localized, useFormat } from '@/composables/useFormat'
import { useQuickAdd } from '@/composables/useQuickAdd'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import type { Locale } from '@/types'
import AccordionItem from '@/components/ui/AccordionItem.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import StarRating from '@/components/ui/StarRating.vue'
import ColorSwatchGroup from '@/components/product/ColorSwatchGroup.vue'
import PDPGallery from '@/components/product/PDPGallery.vue'
import ProductRail from '@/components/product/ProductRail.vue'
import SizeSelector from '@/components/product/SizeSelector.vue'
import StickyBuyBar from '@/components/product/StickyBuyBar.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { price, discountPercent } = useFormat()
const cart = useCartStore()
const wishlist = useWishlistStore()
const { open: openQuickAdd } = useQuickAdd()

const product = computed(() => productBySlug(route.params.slug as string))
const variant = ref(0)
const size = ref('')
const guideOpen = ref(false)

watch(
  product,
  (value) => {
    variant.value = 0
    const available = value?.sizes.filter((s) => s.inStock) ?? []
    size.value = available.length === 1 ? available[0]!.label : ''
  },
  { immediate: true },
)

const discount = computed(() =>
  product.value ? discountPercent(product.value.price, product.value.compareAt) : 0,
)

const related = computed(() =>
  product.value
    ? products
        .filter((p) => p.id !== product.value!.id && p.category !== product.value!.category)
        .slice(0, 6)
    : [],
)

/** Tablas de la guía de tallas por sistema (§4.4) */
const sizeChart = computed(() => {
  switch (product.value?.sizeSystem) {
    case 'hat':
      return {
        head: ['Talla', 'cm', 'Pulgadas'],
        rows: [
          ['6¾', '54', '21.3'],
          ['7', '56', '22.0'],
          ['7⅛', '57', '22.4'],
          ['7¼', '58', '22.8'],
          ['7⅜', '59', '23.2'],
          ['7½', '60', '23.6'],
        ],
        tip: t('pdp.measureTip'),
      }
    case 'boot-mx':
      return {
        head: ['MX', 'US', 'cm'],
        rows: [
          ['25', '7', '24.5'],
          ['26', '8', '25.4'],
          ['27', '9', '26.2'],
          ['28', '10', '27.0'],
          ['29', '11', '27.9'],
          ['30', '12', '28.7'],
        ],
        tip: t('pdp.measureTipBoot'),
      }
    case 'waist':
      return {
        head: ['Talla', 'Cintura cm', 'Cadera cm'],
        rows: [
          ['30', '76', '94'],
          ['32', '81', '99'],
          ['34', '86', '104'],
          ['36', '91', '109'],
          ['38', '96', '114'],
          ['40', '101', '119'],
        ],
        tip: '',
      }
    default:
      return {
        head: ['Talla', 'Pecho cm', 'Largo cm'],
        rows: [
          ['CH', '96-101', '74'],
          ['M', '102-107', '76'],
          ['G', '108-113', '78'],
          ['XG', '114-119', '80'],
          ['2XG', '120-125', '82'],
        ],
        tip: '',
      }
  }
})

function addToCart() {
  if (!product.value || !size.value) return
  cart.add(
    product.value,
    size.value,
    localized(product.value.variants[variant.value]!, 'name', locale.value as Locale),
  )
}

function buyNow() {
  addToCart()
  cart.close()
  router.push({ name: 'checkout' })
}
</script>

<template>
  <div v-if="product" class="pb-32 md:pb-24">
    <div class="container-page pt-4 md:pt-6">
      <nav class="text-[12px] text-ink-soft" aria-label="breadcrumb">
        <RouterLink :to="{ name: 'home' }" class="hover:underline">
          {{ t('pdp.breadcrumbHome') }}
        </RouterLink>
        <span aria-hidden="true"> / </span>
        <RouterLink
          :to="{ name: 'catalog', params: { category: product.category } }"
          class="hover:underline"
        >
          {{ localized(categoryBySlug(product.category)!, 'name', locale as Locale) }}
        </RouterLink>
      </nav>
    </div>

    <!-- md+: galería 58% / buy-box 42% pegajoso (§4.4) -->
    <div class="container-page mt-4 md:grid md:grid-cols-[58fr_42fr] md:gap-10">
      <div class="-mx-4 md:mx-0">
        <PDPGallery :product="product" />
      </div>

      <div class="mt-6 md:mt-0">
        <div class="md:sticky md:top-32">
          <div class="flex flex-wrap gap-1.5">
            <BaseBadge v-for="badge in product.badges" :key="badge" :kind="badge" />
          </div>

          <h1 class="text-section mt-3">{{ localized(product, 'name', locale as Locale) }}</h1>

          <div class="mt-2 flex items-center gap-3">
            <StarRating :rating="product.rating" :reviews="product.reviews" />
            <span class="text-[13px] text-ink-soft">
              {{ product.reviews }} {{ t('common.reviews') }}
            </span>
          </div>

          <div class="mt-4 flex flex-wrap items-baseline gap-3">
            <span class="nums-tabular text-[26px] font-bold">{{ price(product.price) }}</span>
            <span
              v-if="product.compareAt"
              class="nums-tabular text-[15px] text-ink-soft line-through decoration-line"
            >
              {{ price(product.compareAt) }}
            </span>
            <span
              v-if="discount"
              class="rounded-sm bg-terracotta px-2 py-1 text-[11px] font-semibold text-white"
            >
              {{ discount }}% {{ t('common.off') }}
            </span>
          </div>

          <div class="mt-7 space-y-6">
            <SizeSelector
              v-model="size"
              :sizes="product.sizes"
              with-guide
              @open-guide="guideOpen = true"
            />
            <ColorSwatchGroup v-model="variant" :variants="product.variants" />
          </div>

          <div class="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <BaseButton block size="lg" :disabled="!size" @click="addToCart()">
              {{ size ? t('common.addToCart') : t('common.selectSize') }}
            </BaseButton>
            <BaseButton
              variant="secondary"
              size="lg"
              class="sm:w-auto"
              :aria-pressed="wishlist.has(product.id)"
              @click="wishlist.toggle(product.id)"
            >
              <IconGlyph
                name="heart"
                :size="18"
                :filled="wishlist.has(product.id)"
                :class="wishlist.has(product.id) ? 'text-terracotta' : ''"
              />
              <span class="sm:sr-only">{{ t('common.wishlist') }}</span>
            </BaseButton>
          </div>

          <!-- Material y oficio (§4.4 punto 6) -->
          <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-soft">
            <li class="flex items-center gap-2">
              <IconGlyph name="shield" :size="16" class="text-leather" />
              {{ t('pdp.craft1') }}
            </li>
            <li class="flex items-center gap-2">
              <IconGlyph name="needle" :size="16" class="text-leather" />
              {{ t('pdp.craft2') }}
            </li>
            <li class="flex items-center gap-2">
              <IconGlyph name="truck" :size="16" class="text-leather" />
              {{ t('pdp.craft3') }}
            </li>
          </ul>

          <div class="mt-8">
            <AccordionItem :title="t('pdp.description')" open>
              <p>{{ localized(product, 'description', locale as Locale) }}</p>
            </AccordionItem>

            <AccordionItem :title="t('pdp.materialCare')">
              <p class="font-medium text-ink">
                {{ localized(product, 'material', locale as Locale) }}
              </p>
              <ul class="mt-2 space-y-1.5">
                <li
                  v-for="item in localized(product, 'care', locale as Locale)"
                  :key="item"
                  class="flex gap-2"
                >
                  <IconGlyph name="check" :size="15" class="mt-0.5 text-sage" />
                  {{ item }}
                </li>
              </ul>
            </AccordionItem>

            <AccordionItem :title="t('pdp.sizeGuideFull')">
              <table class="w-full text-[13px]">
                <thead>
                  <tr class="border-b border-line text-left">
                    <th v-for="column in sizeChart.head" :key="column" class="py-2 font-semibold">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody class="nums-tabular">
                  <tr v-for="row in sizeChart.rows" :key="row[0]" class="border-b border-line/60">
                    <td v-for="cell in row" :key="cell" class="py-2">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-if="sizeChart.tip" class="mt-3">{{ sizeChart.tip }}</p>
            </AccordionItem>

            <AccordionItem :title="t('pdp.shippingReturns')">
              <p>{{ t('pdp.shippingCopy') }}</p>
              <p class="mt-2">{{ t('pdp.returnsCopy') }}</p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>

    <section v-if="related.length" class="container-page mt-16 md:mt-20">
      <h2 class="text-section">{{ t('pdp.related') }}</h2>
      <div class="mt-6">
        <ProductRail :products="related" @quick-add="openQuickAdd" />
      </div>
    </section>

    <StickyBuyBar
      :product="product"
      :can-add="Boolean(size)"
      @add="addToCart()"
      @buy="buyNow()"
    />

    <!-- Guía de tallas como bottom sheet (§4.4) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div v-if="guideOpen" class="fixed inset-0 z-70 bg-black/45" @click="guideOpen = false" />
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-[280ms] ease-drawer"
        enter-from-class="translate-y-full"
        leave-active-class="transition-transform duration-200 ease-drawer"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="guideOpen"
          class="fixed inset-x-0 bottom-0 z-70 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-bg p-5 pb-safe md:inset-0 md:m-auto md:h-fit md:max-w-lg md:rounded-2xl"
          role="dialog"
          aria-modal="true"
          :aria-label="t('common.sizeGuide')"
        >
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-[16px] font-semibold">
              <IconGlyph name="ruler" :size="19" class="text-leather" />
              {{ t('common.sizeGuide') }}
            </h2>
            <button
              type="button"
              class="-mr-2 grid h-11 w-11 place-items-center rounded-full"
              :aria-label="t('common.close')"
              @click="guideOpen = false"
            >
              <IconGlyph name="close" :size="20" />
            </button>
          </div>

          <table class="mt-4 w-full text-[14px]">
            <thead>
              <tr class="border-b border-line text-left">
                <th v-for="column in sizeChart.head" :key="column" class="py-2 font-semibold">
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody class="nums-tabular">
              <tr v-for="row in sizeChart.rows" :key="row[0]" class="border-b border-line/60">
                <td v-for="cell in row" :key="cell" class="py-2.5">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="sizeChart.tip" class="mt-4 text-[14px] text-ink-soft">{{ sizeChart.tip }}</p>
        </div>
      </Transition>
    </Teleport>
  </div>

  <div v-else class="container-page py-24 text-center">
    <h1 class="text-section">{{ t('notFound.title') }}</h1>
    <BaseButton class="mt-6" :to="{ name: 'catalog' }">{{ t('catalog.title') }}</BaseButton>
  </div>
</template>
