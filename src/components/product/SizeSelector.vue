<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SizeOption } from '@/types'

const props = defineProps<{
  sizes: SizeOption[]
  modelValue: string
  /** Muestra el enlace a la guía de tallas */
  withGuide?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; openGuide: [] }>()
const { t } = useI18n()

const pick = (size: SizeOption) => size.inStock && emit('update:modelValue', size.label)
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between">
      <p class="text-[13px] font-semibold">
        {{ t('common.size') }}
        <span v-if="modelValue" class="font-normal text-ink-soft">· {{ modelValue }}</span>
      </p>
      <button
        v-if="withGuide"
        type="button"
        class="text-[13px] font-medium text-leather underline decoration-line underline-offset-4"
        @click="emit('openGuide')"
      >
        {{ t('common.sizeGuide') }}
      </button>
    </div>

    <ul class="mt-2.5 flex flex-wrap gap-2" role="radiogroup" :aria-label="t('common.size')">
      <li v-for="size in props.sizes" :key="size.label">
        <button
          type="button"
          role="radio"
          :aria-checked="modelValue === size.label"
          :aria-disabled="!size.inStock || undefined"
          :aria-label="
            size.inStock ? `${t('common.size')} ${size.label}` : `${t('common.size')} ${size.label}, ${t('common.soldOut')}`
          "
          class="relative grid h-12 min-w-14 place-items-center rounded-card border px-3 text-[14px] font-semibold transition-colors duration-150"
          :class="[
            modelValue === size.label
              ? 'border-leather bg-leather text-white dark:text-on-accent'
              : 'border-line hover:border-leather',
            size.inStock ? '' : 'cursor-not-allowed text-ink-soft hover:border-line',
          ]"
          @click="pick(size)"
        >
          {{ size.label }}
          <!-- Agotada: tachada en diagonal, nunca oculta (§4.4) -->
          <svg
            v-if="!size.inStock"
            class="pointer-events-none absolute inset-0 h-full w-full text-line"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="4" y1="96" x2="96" y2="4" stroke="currentColor" stroke-width="3" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>
