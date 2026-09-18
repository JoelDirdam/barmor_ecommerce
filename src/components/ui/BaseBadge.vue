<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BadgeKind } from '@/types'

const props = defineProps<{ kind: BadgeKind }>()
const { t } = useI18n()

/**
 * Terracota con texto blanco (≈4.6:1, AA en tamaño small-bold) — §6.
 * En modo oscuro los acentos suben de luminancia, así que el texto se
 * invierte a tinta para no caer por debajo de AA.
 */
const tone = computed(() =>
  props.kind === 'new'
    ? 'bg-sage text-white dark:text-on-accent'
    : props.kind === 'sale'
      ? 'bg-rust text-white dark:text-on-accent'
      : 'bg-terracotta text-white dark:text-on-accent',
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-semibold leading-none',
      tone,
    ]"
  >
    {{ t(`badges.${kind}`) }}
  </span>
</template>
