<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { categories } from '@/data/categories'
import { localized } from '@/composables/useFormat'
import { useScrollLock } from '@/composables/useScrollLock'
import { useUiStore } from '@/stores/ui'
import { setLocale } from '@/i18n'
import type { Locale } from '@/types'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import BrandWordmark from './BrandWordmark.vue'

const ui = useUiStore()
const { t, locale } = useI18n()
const isOpen = computed(() => ui.drawerOpen)
useScrollLock(isOpen)

const close = () => (ui.drawerOpen = false)
const toggleLocale = () => setLocale((locale.value === 'es' ? 'en' : 'es') as Locale)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="ui.drawerOpen" class="fixed inset-0 z-70 bg-black/45" @click="close()" />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-[280ms] ease-drawer"
      enter-from-class="-translate-x-full"
      leave-active-class="transition-transform duration-200 ease-drawer"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="ui.drawerOpen"
        class="fixed inset-y-0 left-0 z-70 flex w-[86%] max-w-sm flex-col bg-bg"
        role="dialog"
        aria-modal="true"
        :aria-label="t('common.menu')"
        @keydown.esc="close()"
      >
        <div class="flex h-14 items-center justify-between bg-denim px-4 text-white">
          <BrandWordmark compact />
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
            :aria-label="t('common.close')"
            @click="close()"
          >
            <IconGlyph name="close" :size="20" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-2">
          <ul>
            <li v-for="category in categories" :key="category.slug">
              <RouterLink
                :to="{ name: 'catalog', params: { category: category.slug } }"
                class="flex min-h-14 items-center gap-3.5 border-b border-line px-4 text-[15px] font-medium"
                @click="close()"
              >
                <IconGlyph :name="category.icon" :size="22" class="text-leather" />
                <span class="flex-1">{{ localized(category, 'name', locale as Locale) }}</span>
                <IconGlyph name="chevronRight" :size="16" class="text-ink-soft" />
              </RouterLink>
            </li>
          </ul>

          <ul class="mt-2 px-4 py-2">
            <li v-for="item in ['account', 'orders', 'wishlist'] as const" :key="item">
              <RouterLink
                :to="{ name: 'catalog' }"
                class="flex min-h-12 items-center gap-3 text-[14px] text-ink-soft"
                @click="close()"
              >
                <IconGlyph
                  :name="item === 'wishlist' ? 'heart' : item === 'orders' ? 'package' : 'user'"
                  :size="18"
                />
                {{ t(`common.${item}`) }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Pie del drawer: moneda, idioma, tema (§4.1) -->
        <div class="flex items-center gap-2 border-t border-line px-4 py-3 pb-safe">
          <button
            type="button"
            class="min-h-11 rounded-full border border-line px-4 text-[13px] font-semibold"
            @click="ui.toggleCurrency()"
          >
            {{ ui.currency }}
          </button>
          <button
            type="button"
            class="min-h-11 rounded-full border border-line px-4 text-[13px] font-semibold"
            @click="toggleLocale()"
          >
            {{ locale === 'es' ? 'Español' : 'English' }}
          </button>
          <button
            type="button"
            class="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line"
            :aria-label="t('common.theme')"
            @click="ui.toggleTheme()"
          >
            <IconGlyph :name="ui.theme === 'dark' ? 'sun' : 'moon'" :size="18" />
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
