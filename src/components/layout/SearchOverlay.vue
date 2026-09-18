<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { products } from '@/data/products'
import { localized, useFormat } from '@/composables/useFormat'
import { useScrollLock } from '@/composables/useScrollLock'
import { useUiStore } from '@/stores/ui'
import type { Locale } from '@/types'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import ProductImage from '@/components/ui/ProductImage.vue'

const ui = useUiStore()
const router = useRouter()
const { t, locale } = useI18n()
const { price } = useFormat()

const query = ref('')
const input = ref<HTMLInputElement | null>(null)
const isOpen = computed(() => ui.searchOpen)
useScrollLock(isOpen)

const popular = ['Sombreros', 'Botas vaqueras', 'Chivarras', 'Cintos', 'Nuevo']

const results = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (term.length < 2) return []
  return products
    .filter((product) =>
      [product.name, product.nameEn, product.material, product.category, product.fit]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
    .slice(0, 8)
})

watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    input.value?.focus()
  } else {
    query.value = ''
  }
})

function go(slug: string) {
  ui.searchOpen = false
  router.push({ name: 'product', params: { slug } })
}

function submit() {
  if (!query.value.trim()) return
  ui.searchOpen = false
  router.push({ name: 'catalog', query: { q: query.value.trim() } })
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- Overlay a pantalla completa, no dropdown (§4.1) -->
      <div
        v-if="ui.searchOpen"
        class="fixed inset-0 z-70 flex flex-col bg-bg"
        role="dialog"
        aria-modal="true"
        :aria-label="t('common.search')"
        @keydown.esc="ui.searchOpen = false"
      >
        <div class="container-page flex h-14 items-center gap-3 border-b border-line md:h-16">
          <IconGlyph name="search" :size="20" class="text-leather" />
          <input
            ref="input"
            v-model="query"
            type="search"
            :placeholder="t('common.searchPlaceholder')"
            class="h-11 flex-1 border-b border-leather bg-transparent text-[16px] outline-none placeholder:text-ink-soft focus-visible:outline-none"
            @keydown.enter="submit()"
          />
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"
            :aria-label="t('common.close')"
            @click="ui.searchOpen = false"
          >
            <IconGlyph name="close" :size="20" />
          </button>
        </div>

        <div class="container-page flex-1 overflow-y-auto py-6">
          <div v-if="query.trim().length < 2">
            <p class="text-[12px] font-semibold uppercase tracking-wider text-leather">
              {{ t('common.popularSearches') }}
            </p>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li v-for="term in popular" :key="term">
                <button
                  type="button"
                  class="min-h-11 rounded-full border border-line px-4 text-[14px] hover:border-leather"
                  @click="query = term"
                >
                  {{ term }}
                </button>
              </li>
            </ul>
          </div>

          <p v-else-if="!results.length" class="py-8 text-center text-ink-soft">
            {{ t('common.noResults') }}
          </p>

          <ul v-else class="divide-y divide-line">
            <li v-for="product in results" :key="product.id">
              <button
                type="button"
                class="flex w-full items-center gap-4 py-3 text-left"
                @click="go(product.slug)"
              >
                <span class="h-16 w-14 shrink-0 overflow-hidden rounded-card bg-surface">
                  <ProductImage :product="product" :show-label="false" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-[15px] font-semibold">
                    {{ localized(product, 'name', locale as Locale) }}
                  </span>
                  <span class="block text-[13px] text-ink-soft">
                    {{ localized(product, 'material', locale as Locale) }}
                  </span>
                </span>
                <span class="nums-tabular text-[15px] font-bold">{{ price(product.price) }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
