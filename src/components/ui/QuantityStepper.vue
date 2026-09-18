<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconGlyph from './IconGlyph.vue'

const props = withDefaults(defineProps<{ modelValue: number; min?: number; max?: number }>(), {
  min: 1,
  max: 10,
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const { t } = useI18n()

const step = (delta: number) => {
  const next = Math.min(props.max, Math.max(props.min, props.modelValue + delta))
  emit('update:modelValue', next)
}
</script>

<template>
  <div
    class="inline-flex items-center rounded-card border border-line"
    role="group"
    :aria-label="t('common.quantity')"
  >
    <button
      type="button"
      class="grid h-11 w-11 place-items-center text-ink disabled:opacity-40"
      :disabled="modelValue <= min"
      :aria-label="`${t('common.quantity')} −`"
      @click="step(-1)"
    >
      <IconGlyph name="minus" :size="16" />
    </button>
    <span class="nums-tabular w-8 text-center text-[14px] font-semibold" aria-live="polite">
      {{ modelValue }}
    </span>
    <button
      type="button"
      class="grid h-11 w-11 place-items-center text-ink disabled:opacity-40"
      :disabled="modelValue >= max"
      :aria-label="`${t('common.quantity')} +`"
      @click="step(1)"
    >
      <IconGlyph name="plus" :size="16" />
    </button>
  </div>
</template>
