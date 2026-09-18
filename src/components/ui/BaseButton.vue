<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Botón único de la plantilla.
 * Nota de accesibilidad (§6): el ámbar NUNCA lleva texto blanco (contraste
 * 2.1:1). El primario usa texto `--color-ink` sobre ámbar.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'denim' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    to?: RouteLocationRaw
    href?: string
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', block: false, type: 'button', disabled: false },
)

const variants: Record<string, string> = {
  primary: 'bg-amber text-on-accent hover:brightness-105 active:brightness-95 shadow-none',
  secondary: 'border border-leather text-leather hover:bg-leather/10',
  denim: 'bg-denim text-white hover:brightness-110',
  ghost: 'text-ink hover:bg-ink/5',
  danger: 'bg-rust text-white hover:brightness-110',
}

const sizes: Record<string, string> = {
  sm: 'h-10 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-13 px-6 text-[15px]',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-card font-semibold',
  'transition-[filter,background-color,transform,border-color] duration-150',
  'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100',
  'min-h-11', // 44px de objetivo táctil (§6)
  variants[props.variant],
  sizes[props.size],
  props.block ? 'w-full' : '',
])

const component = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
</script>

<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    :type="to || href ? undefined : type"
    :disabled="to || href ? undefined : disabled"
    :aria-disabled="disabled || undefined"
    :class="classes"
  >
    <slot />
  </component>
</template>
