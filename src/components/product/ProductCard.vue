<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { localized, useFormat } from '@/composables/useFormat'
import { useWishlistStore } from '@/stores/wishlist'
import type { Locale, Product } from '@/types'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import StarRating from '@/components/ui/StarRating.vue'
import ProductImage from '@/components/ui/ProductImage.vue'

const props = withDefaults(defineProps<{ product: Product; eager?: boolean }>(), { eager: false })
const emit = defineEmits<{ quickAdd: [product: Product] }>()

const { t, locale } = useI18n()
const { price, discountPercent } = useFormat()
const wishlist = useWishlistStore()

/** Swatch activo: cambia la miniatura sin navegar (§4.3) */
const activeVariant = ref(0)
const hovering = ref(false)

const visibleSwatches = computed(() => props.product.variants.slice(0, 4))
const overflow = computed(() => Math.max(0, props.product.variants.length - 4))
const discount = computed(() => discountPercent(props.product.price, props.product.compareAt))

/** En hover se muestra la foto secundaria; con placeholder cambia la semilla */
const imageIndex = computed(() => {
  const base = props.product.variants[activeVariant.value]?.image ?? 0
  return hovering.value ? base + 1 : base
})
</script>

<template>
  <article
    class="group relative transition-transform duration-200 hover:-translate-y-0.5"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="relative overflow-hidden rounded-card bg-surface">
      <RouterLink
        :to="{ name: 'product', params: { slug: product.slug } }"
        class="block aspect-4/5"
        :aria-label="localized(product, 'name', locale as Locale)"
      >
        <!-- Crossfade a la foto secundaria (§5) -->
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          leave-active-class="absolute inset-0 transition-opacity duration-300"
          leave-to-class="opacity-0"
        >
          <div :key="imageIndex" class="h-full w-full">
            <ProductImage :product="product" :index="imageIndex" :eager="eager" />
          </div>
        </Transition>
      </RouterLink>

      <div class="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
        <BaseBadge v-for="badge in product.badges.slice(0, 2)" :key="badge" :kind="badge" />
      </div>

      <button
        type="button"
        class="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-transform duration-150 active:scale-90"
        :aria-label="`${t('common.wishlist')}: ${product.name}`"
        :aria-pressed="wishlist.has(product.id)"
        @click="wishlist.toggle(product.id)"
      >
        <IconGlyph
          name="heart"
          :size="19"
          :filled="wishlist.has(product.id)"
          :class="wishlist.has(product.id) ? 'text-terracotta' : ''"
        />
      </button>

      <!-- Quick add: siempre visible en móvil, aparece en hover en desktop -->
      <button
        type="button"
        class="absolute bottom-2.5 right-2.5 grid h-11 w-11 place-items-center rounded-full bg-amber text-on-accent transition-all duration-200 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
        :aria-label="`${t('common.quickAdd')}: ${product.name}`"
        @click="emit('quickAdd', product)"
      >
        <IconGlyph name="plus" :size="20" />
      </button>
    </div>

    <div class="mt-3">
      <h3 class="truncate text-[16px] font-semibold md:text-[17px]">
        <RouterLink :to="{ name: 'product', params: { slug: product.slug } }">
          {{ localized(product, 'name', locale as Locale) }}
        </RouterLink>
      </h3>

      <div class="mt-1 flex items-baseline justify-between gap-3">
        <p class="truncate text-[13px] text-ink-soft">
          {{ localized(product, 'fit', locale as Locale) }} ·
          {{ localized(product, 'material', locale as Locale) }}
        </p>
        <StarRating :rating="product.rating" :reviews="product.reviews" :show-count="false" />
      </div>

      <div class="mt-1.5 flex items-center gap-2">
        <span
          v-if="product.compareAt"
          class="nums-tabular text-[13px] text-ink-soft line-through decoration-line"
        >
          {{ price(product.compareAt) }}
        </span>
        <span class="nums-tabular text-[17px] font-bold md:text-[20px]">
          {{ price(product.price) }}
        </span>
        <span v-if="discount" class="text-[12px] font-semibold text-terracotta">
          −{{ discount }}%
        </span>
      </div>

      <!-- Swatches: hasta 4 + overflow (§4.3) -->
      <ul v-if="product.variants.length > 1" class="mt-2.5 flex items-center gap-1">
        <li v-for="(variant, index) in visibleSwatches" :key="variant.name">
          <button
            type="button"
            class="grid h-11 w-8 place-items-center"
            :aria-label="localized(variant, 'name', locale as Locale)"
            :aria-pressed="activeVariant === index"
            @click="activeVariant = index"
          >
            <span
              class="block h-5 w-5 rounded-full border transition-transform duration-150"
              :class="
                activeVariant === index
                  ? 'scale-110 border-leather ring-2 ring-leather/40'
                  : 'border-line'
              "
              :style="{ backgroundColor: variant.swatch }"
            />
          </button>
        </li>
        <li v-if="overflow" class="nums-tabular text-[12px] font-medium text-ink-soft">
          +{{ overflow }}
        </li>
      </ul>
    </div>
  </article>
</template>
