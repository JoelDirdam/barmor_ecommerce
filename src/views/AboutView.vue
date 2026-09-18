<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import MaterialTexture from '@/components/ui/MaterialTexture.vue'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '@/data/instagram'

const { t } = useI18n()
</script>

<template>
  <div class="pb-20">
    <section class="relative isolate overflow-hidden">
      <div class="aspect-4/5 w-full sm:aspect-16/9 md:aspect-16/7">
        <MaterialTexture kind="suede" :seed="11" />
      </div>
      <div class="scrim-photo absolute inset-0" />
      <div class="absolute inset-x-0 bottom-0">
        <div class="container-page pb-8 md:pb-12">
          <h1 class="text-hero max-w-[22ch] text-white">{{ t('footer.story') }}</h1>
        </div>
      </div>
    </section>

    <section class="container-page mt-12 max-w-[65ch]">
      <p class="text-[17px] leading-relaxed">
        Barmor nació en Durango, entre el corral y el taller. Empezamos vendiendo cintos piteados y
        sombreros de palma en la tienda física, y hoy la misma selección se puede ver y pedir desde
        el teléfono.
      </p>
      <p class="mt-5 text-[15px] leading-relaxed text-ink-soft">
        No vendemos disfraz: vendemos la vestimenta con la que se trabaja, se monta y se sale el
        sábado. La piel es vaqueta curtida al vegetal, la mezclilla es rígida, y las piezas hechas a
        mano llevan el nombre del talabartero que las armó.
      </p>
      <p class="mt-5 text-[15px] leading-relaxed text-ink-soft">
        Si quieres ver el producto en movimiento, en Instagram subimos el trabajo del taller y lo
        que va entrando a la tienda.
      </p>

      <a
        :href="INSTAGRAM_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-semibold hover:border-leather"
      >
        <IconGlyph name="instagram" :size="17" class="text-leather" />
        @{{ INSTAGRAM_HANDLE }}
      </a>
    </section>

    <section class="container-page mt-14 grid gap-6 md:grid-cols-3">
      <article v-for="item in ['leaf', 'needle', 'shield']" :key="item" class="stitch rounded-card p-5">
        <IconGlyph :name="item" :size="24" class="text-leather" />
        <h2 class="mt-3 text-[15px] font-semibold">
          {{ item === 'leaf' ? t('home.value1Title') : item === 'needle' ? t('home.value2Title') : t('pdp.craft1') }}
        </h2>
        <p class="mt-1.5 text-[14px] text-ink-soft">
          {{ item === 'leaf' ? t('home.value1Body') : item === 'needle' ? t('home.value2Body') : t('pdp.returnsCopy') }}
        </p>
      </article>
    </section>

    <div class="container-page mt-12">
      <BaseButton size="lg" :to="{ name: 'catalog' }">{{ t('home.heroCta') }}</BaseButton>
    </div>
  </div>
</template>
