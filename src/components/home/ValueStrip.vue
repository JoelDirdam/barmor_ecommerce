<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconGlyph from '@/components/ui/IconGlyph.vue'

const { t } = useI18n()

const values = [
  { icon: 'leaf', title: 'home.value1Title', body: 'home.value1Body' },
  { icon: 'needle', title: 'home.value2Title', body: 'home.value2Body' },
  { icon: 'truck', title: 'home.value3Title', body: 'home.value3Body' },
]
</script>

<template>
  <section class="mt-14 border-y border-line bg-surface md:mt-20">
    <div class="container-page grid gap-8 py-10 md:grid-cols-3 md:py-12">
      <div v-for="value in values" :key="value.icon" class="flex gap-4">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bg text-leather">
          <IconGlyph :name="value.icon" :size="22" />
        </span>
        <div>
          <h3 class="text-[15px] font-semibold">{{ t(value.title) }}</h3>
          <p class="mt-1 max-w-[34ch] text-[14px] text-ink-soft">{{ t(value.body) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
