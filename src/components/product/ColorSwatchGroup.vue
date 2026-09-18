<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { localized } from '@/composables/useFormat'
import type { Locale, ProductVariant } from '@/types'

const props = defineProps<{ variants: ProductVariant[]; modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [index: number] }>()
const { t, locale } = useI18n()
</script>

<template>
  <div>
    <!-- El color nunca comunica solo: siempre va el nombre en texto (§6) -->
    <p class="text-[13px] font-semibold">
      {{ t('common.color') }}
      <span class="font-normal text-ink-soft">
        · {{ localized(props.variants[modelValue]!, 'name', locale as Locale) }}
      </span>
    </p>

    <ul class="mt-2.5 flex flex-wrap items-center gap-1" role="radiogroup" :aria-label="t('common.color')">
      <li v-for="(variant, index) in props.variants" :key="variant.name">
        <button
          type="button"
          role="radio"
          :aria-checked="modelValue === index"
          :aria-label="localized(variant, 'name', locale as Locale)"
          class="grid h-11 w-11 place-items-center rounded-full"
          @click="emit('update:modelValue', index)"
        >
          <span
            class="block h-8 w-8 rounded-full border transition-all duration-200"
            :class="
              modelValue === index
                ? 'border-leather ring-2 ring-leather ring-offset-2 ring-offset-bg'
                : 'border-line'
            "
            :style="{ backgroundColor: variant.swatch }"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
