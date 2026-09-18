<script setup lang="ts">
import { computed, useId } from 'vue'
import type { TextureKind } from '@/types'

/**
 * Placeholder de material dibujado en SVG.
 * Mientras no haya fotografía real, el DESIGN.md §1 pide que la superficie
 * insinúe un material (grano de piel, tejido de palma, sarga de mezclilla)
 * en lugar de un rectángulo gris. Se reemplaza en cuanto se cargan fotos:
 * `ProductImage.vue` usa la foto si existe y este componente si no.
 */
const props = withDefaults(
  defineProps<{
    kind?: TextureKind
    /** Texto corto sobrepuesto (nombre del producto) */
    label?: string
    /** Varía el dibujo entre tarjetas del mismo material */
    seed?: number
  }>(),
  { kind: 'leather', label: '', seed: 1 },
)

const uid = useId()

const palette: Record<TextureKind, { base: string; shade: string; light: string }> = {
  palma: { base: '#CDB183', shade: '#9C7B49', light: '#E3CFA6' },
  leather: { base: '#84502F', shade: '#54321B', light: '#AE7145' },
  denim: { base: '#374763', shade: '#1F2B3E', light: '#59718F' },
  cotton: { base: '#DACBB0', shade: '#B0A083', light: '#EDE3D0' },
  metal: { base: '#AD8548', shade: '#705328', light: '#D9BB7E' },
  suede: { base: '#775132', shade: '#48301E', light: '#A1754E' },
}

const tone = computed(() => palette[props.kind] ?? palette.leather)
const rotation = computed(() => (props.kind === 'denim' ? 45 : props.seed % 2 ? 0 : 90))
const grain = computed(() => (props.kind === 'leather' || props.kind === 'suede' ? 0.9 : 0))
</script>

<template>
  <svg
    viewBox="0 0 400 500"
    preserveAspectRatio="xMidYMid slice"
    class="h-full w-full"
    role="img"
    :aria-label="label || 'Imagen de producto pendiente'"
  >
    <defs>
      <linearGradient :id="`grad-${uid}`" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" :stop-color="tone.light" />
        <stop offset="38%" :stop-color="tone.base" />
        <stop offset="100%" :stop-color="tone.shade" />
      </linearGradient>

      <!-- Tejido / sarga -->
      <pattern
        :id="`weave-${uid}`"
        width="14"
        height="14"
        patternUnits="userSpaceOnUse"
        :patternTransform="`rotate(${rotation})`"
      >
        <rect width="14" height="14" fill="none" />
        <path d="M0 3.5h14M0 10.5h14" :stroke="tone.shade" stroke-opacity="0.35" stroke-width="2" />
        <path d="M3.5 0v14M10.5 0v14" :stroke="tone.light" stroke-opacity="0.3" stroke-width="1.6" />
      </pattern>

      <!-- Grano de piel -->
      <filter :id="`grain-${uid}`" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" :seed="seed" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" :slope="grain * 0.28" intercept="0" />
        </feComponentTransfer>
      </filter>

      <radialGradient :id="`vig-${uid}`" cx="0.5" cy="0.42" r="0.78">
        <stop offset="60%" stop-color="#000" stop-opacity="0" />
        <stop offset="100%" stop-color="#000" stop-opacity="0.22" />
      </radialGradient>

      <linearGradient :id="`sheen-${uid}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.32" />
        <stop offset="45%" stop-color="#fff" stop-opacity="0.04" />
        <stop offset="60%" stop-color="#000" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#fff" stop-opacity="0.2" />
      </linearGradient>
    </defs>

    <rect width="400" height="500" :fill="`url(#grad-${uid})`" />

    <rect
      v-if="kind !== 'metal'"
      width="400"
      height="500"
      :fill="`url(#weave-${uid})`"
      :opacity="kind === 'denim' ? 0.55 : kind === 'palma' ? 0.8 : kind === 'cotton' ? 0.45 : 0.3"
    />

    <rect v-if="kind === 'metal'" width="400" height="500" :fill="`url(#sheen-${uid})`" />

    <rect
      v-if="grain"
      width="400"
      height="500"
      :filter="`url(#grain-${uid})`"
      opacity="0.75"
      fill="#000"
    />

    <rect width="400" height="500" :fill="`url(#vig-${uid})`" />

    <!-- Marca de agua discreta: recuerda que falta la foto real -->
    <g v-if="label" opacity="0.5">
      <text
        x="200"
        y="468"
        text-anchor="middle"
        font-family="Inter, sans-serif"
        font-size="15"
        font-weight="500"
        fill="#FFFFFF"
        fill-opacity="0.85"
      >
        {{ label }}
      </text>
    </g>
  </svg>
</template>
