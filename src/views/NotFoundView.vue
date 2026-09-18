<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <div class="container-page py-24 text-center">
    <p class="font-display text-[64px] font-black leading-none text-leather">404</p>
    <h1 class="text-section mt-4">{{ t('notFound.title') }}</h1>
    <p class="mx-auto mt-3 max-w-[44ch] text-[15px] text-ink-soft">{{ t('notFound.body') }}</p>
    <BaseButton class="mt-7" :to="{ name: 'home' }">{{ t('notFound.cta') }}</BaseButton>
  </div>
</template>
