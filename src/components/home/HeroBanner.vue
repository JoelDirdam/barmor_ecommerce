<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import MaterialTexture from '@/components/ui/MaterialTexture.vue'

const { t } = useI18n()
</script>

<template>
  <!-- Full-bleed: 4:5 en móvil, recorte cinematográfico en md+ (§3) -->
  <section class="relative isolate overflow-hidden">
    <div class="aspect-4/5 w-full sm:aspect-16/9 md:aspect-16/7">
      <!-- Reemplaza este bloque por la fotografía real de portada -->
      <MaterialTexture kind="leather" :seed="7" />
    </div>

    <!-- Scrim de abajo hacia arriba, nunca bloque plano (§4.2) -->
    <div class="scrim-photo absolute inset-0" />

    <div class="absolute inset-x-0 bottom-0">
      <div class="container-page pb-8 md:pb-14">
        <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/85">
          {{ t('home.heroEyebrow') }}
        </p>
        <h1 class="text-hero mt-3 max-w-[20ch] text-white">{{ t('home.heroTitle') }}</h1>
        <p class="mt-4 max-w-[46ch] text-[15px] text-white/90 md:text-[16px]">
          {{ t('home.heroSub') }}
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <BaseButton size="lg" :to="{ name: 'catalog' }">{{ t('home.heroCta') }}</BaseButton>
          <BaseButton
            size="lg"
            variant="ghost"
            :to="{ name: 'about' }"
            class="border border-white/40 text-white hover:bg-white/10"
          >
            {{ t('home.heroCtaAlt') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
