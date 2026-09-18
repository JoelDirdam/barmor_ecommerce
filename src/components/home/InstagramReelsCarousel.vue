<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_REELS_URL,
  instagramReels,
} from '@/data/instagram'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import MaterialTexture from '@/components/ui/MaterialTexture.vue'

/**
 * Carrusel de Instagram.
 * Sin autoplay y con controles manuales, como pide el DESIGN.md §6
 * ("no auto-playing carousels without a pause control"). Los datos vienen de
 * `src/data/instagram.ts`; ahí están las instrucciones para poner los reels
 * reales o cambiarlo por la Graph API sin tocar este componente.
 */
const { t } = useI18n()
const track = ref<HTMLElement | null>(null)

function scrollBy(direction: 1 | -1) {
  track.value?.scrollBy({ left: direction * track.value.clientWidth * 0.75, behavior: 'smooth' })
}
</script>

<template>
  <section class="container-page mt-14 md:mt-20">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="text-section">{{ t('home.instagramTitle') }}</h2>
        <p class="mt-1.5 text-[14px] text-ink-soft">
          {{ t('home.instagramSub', { handle: INSTAGRAM_HANDLE }) }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <a
          :href="INSTAGRAM_REELS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-semibold hover:border-leather"
        >
          <IconGlyph name="instagram" :size="17" class="text-leather" />
          {{ t('home.instagramCta') }}
        </a>
        <button
          type="button"
          class="hidden h-11 w-11 place-items-center rounded-full border border-line hover:border-leather md:grid"
          aria-label="Anterior"
          @click="scrollBy(-1)"
        >
          <IconGlyph name="arrowLeft" :size="18" />
        </button>
        <button
          type="button"
          class="hidden h-11 w-11 place-items-center rounded-full border border-line hover:border-leather md:grid"
          aria-label="Siguiente"
          @click="scrollBy(1)"
        >
          <IconGlyph name="arrowRight" :size="18" />
        </button>
      </div>
    </div>

    <ul
      ref="track"
      class="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:gap-4 md:px-0"
    >
      <li
        v-for="(reel, index) in instagramReels"
        :key="reel.id"
        class="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[26%] lg:w-[19%]"
      >
        <a
          :href="reel.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group block"
          :aria-label="`${reel.caption} — ${t('home.instagramOpen')}`"
        >
          <div class="relative aspect-9/16 overflow-hidden rounded-card bg-surface">
            <img
              v-if="reel.thumbnail"
              :src="reel.thumbnail"
              :alt="reel.caption"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <MaterialTexture v-else :kind="reel.texture" :seed="index + 3" />

            <div class="scrim-photo absolute inset-0" />

            <span
              v-if="reel.tag"
              class="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-sm bg-black/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
            >
              <IconGlyph name="play" :size="11" />
              {{ reel.tag }}
            </span>

            <span
              class="absolute inset-0 grid place-items-center opacity-90 transition-transform duration-200 group-hover:scale-110"
            >
              <span class="grid h-12 w-12 place-items-center rounded-full bg-white/22 backdrop-blur-sm">
                <IconGlyph name="play" :size="20" class="ml-0.5 text-white" />
              </span>
            </span>

            <p class="absolute inset-x-3 bottom-3 line-clamp-2 text-[13px] font-medium text-white">
              {{ reel.caption }}
            </p>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>
