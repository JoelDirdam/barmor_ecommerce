<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { categories } from '@/data/categories'
import { localized } from '@/composables/useFormat'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/data/instagram'
import { useUiStore } from '@/stores/ui'
import type { Locale } from '@/types'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandWordmark from './BrandWordmark.vue'

const { t, locale } = useI18n()
const ui = useUiStore()
const email = ref('')

function subscribe() {
  if (!email.value.includes('@')) return
  ui.showToast(locale.value === 'en' ? 'Subscribed (demo)' : 'Suscripción registrada (demo)')
  email.value = ''
}
</script>

<template>
  <footer class="mt-20 bg-denim text-white">
    <!-- Newsletter -->
    <div class="border-b border-white/10">
      <div class="container-page grid gap-6 py-10 md:grid-cols-2 md:items-center md:py-12">
        <div>
          <h2 class="text-section">{{ t('home.newsletterTitle') }}</h2>
          <p class="mt-2 max-w-[48ch] text-[14px] opacity-80">{{ t('home.newsletterBody') }}</p>
        </div>
        <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="subscribe()">
          <label class="flex-1">
            <span class="sr-only">{{ t('checkout.email') }}</span>
            <input
              v-model="email"
              type="email"
              :placeholder="t('home.emailPlaceholder')"
              class="h-12 w-full rounded-card border border-white/25 bg-white/5 px-4 text-[15px] text-white outline-none placeholder:text-white/55 focus-visible:border-amber"
            />
          </label>
          <BaseButton type="submit" size="lg">{{ t('home.newsletterCta') }}</BaseButton>
        </form>
      </div>
    </div>

    <div class="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
      <div>
        <BrandWordmark />
        <p class="mt-4 max-w-[34ch] text-[14px] opacity-80">{{ t('home.heroSub') }}</p>
        <a
          :href="INSTAGRAM_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-[13px] font-semibold hover:border-amber"
        >
          <IconGlyph name="instagram" :size="17" />
          @{{ INSTAGRAM_HANDLE }}
        </a>
      </div>

      <nav aria-labelledby="footer-shop">
        <h3 id="footer-shop" class="text-[12px] font-semibold uppercase tracking-wider opacity-70">
          {{ t('footer.shop') }}
        </h3>
        <ul class="mt-4 space-y-2.5 text-[14px]">
          <li v-for="category in categories.slice(0, 6)" :key="category.slug">
            <RouterLink
              :to="{ name: 'catalog', params: { category: category.slug } }"
              class="opacity-85 hover:opacity-100 hover:underline"
            >
              {{ localized(category, 'name', locale as Locale) }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <nav aria-labelledby="footer-help">
        <h3 id="footer-help" class="text-[12px] font-semibold uppercase tracking-wider opacity-70">
          {{ t('footer.help') }}
        </h3>
        <ul class="mt-4 space-y-2.5 text-[14px] opacity-85">
          <li>{{ t('footer.shippingInfo') }}</li>
          <li>{{ t('footer.returns') }}</li>
          <li>{{ t('footer.sizeGuide') }}</li>
          <li>{{ t('footer.care') }}</li>
        </ul>
      </nav>

      <nav aria-labelledby="footer-about">
        <h3 id="footer-about" class="text-[12px] font-semibold uppercase tracking-wider opacity-70">
          {{ t('footer.about') }}
        </h3>
        <ul class="mt-4 space-y-2.5 text-[14px] opacity-85">
          <li>
            <RouterLink :to="{ name: 'about' }" class="hover:underline">
              {{ t('footer.story') }}
            </RouterLink>
          </li>
          <li>{{ t('footer.workshop') }}</li>
          <li>{{ t('footer.contact') }}</li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-white/10">
      <div
        class="container-page flex flex-col gap-2 py-5 text-[12px] opacity-70 md:flex-row md:items-center md:justify-between"
      >
        <p>© {{ new Date().getFullYear() }} Barmor. {{ t('footer.rights') }}</p>
        <p class="flex items-center gap-2">
          <IconGlyph name="needle" :size="14" />
          {{ t('footer.madeIn') }} · {{ t('footer.demo') }}
        </p>
      </div>
    </div>
  </footer>
</template>
