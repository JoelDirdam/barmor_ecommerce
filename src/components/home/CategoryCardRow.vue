<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { categories } from '@/data/categories'
import { localized } from '@/composables/useFormat'
import type { Locale } from '@/types'
import MaterialTexture from '@/components/ui/MaterialTexture.vue'

const { t, locale } = useI18n()
</script>

<template>
  <section class="container-page mt-14 md:mt-20">
    <h2 class="text-section">{{ t('home.categoriesTitle') }}</h2>

    <ul
      class="no-scrollbar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:px-0 lg:grid-cols-8"
    >
      <li v-for="category in categories" :key="category.slug" class="w-28 shrink-0 snap-start md:w-auto">
        <RouterLink
          :to="{ name: 'catalog', params: { category: category.slug } }"
          class="group block text-center"
        >
          <!-- Recorte consistente por fila, sin bordes ni sombras (§4.2) -->
          <span
            class="block aspect-square overflow-hidden rounded-card transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            <MaterialTexture :kind="category.texture" :seed="category.slug.length" />
          </span>
          <span class="mt-2.5 block text-[14px] font-semibold">
            {{ localized(category, 'name', locale as Locale) }}
          </span>
          <span class="mt-0.5 hidden text-[12px] text-ink-soft md:block">
            {{ localized(category, 'blurb', locale as Locale) }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
