<script setup lang="ts">
import { computed } from 'vue'
/**
 * Set de iconos en línea. Trazo de 1.5 sobre `currentColor`, sin dependencias.
 * Los de producto (sombrero, bota, chivarra…) son de dibujo propio para no
 * caer en el clipart de "fiesta" que el DESIGN.md §1 prohíbe.
 */
const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    /** Iconos de relleno (estrella, corazón activo, play) */
    filled?: boolean
  }>(),
  { size: 20, filled: false },
)

const strokePaths: Record<string, string[]> = {
  hat: [
    'M7.6 15.2c-.1-3 .5-6.1 1.5-7.8C9.8 6.2 10.8 5.6 12 5.6s2.2.6 2.9 1.8c1 1.7 1.6 4.8 1.5 7.8',
    'M3.5 15.4c1.6-.9 4.7-1.5 8.5-1.5s6.9.6 8.5 1.5c-1.2 1.9-4.4 3-8.5 3s-7.3-1.1-8.5-3z',
  ],
  cap: ['M4 15.5a8 8 0 0 1 16 0', 'M4 15.5h13.5a3 3 0 0 0 3 3H4z', 'M12 7.5v8'],
  shirt: [
    'M9 4l3 2.2L15 4l4.5 2.4-1.4 4-1.6-.6V20H7.5v-10.2l-1.6.6-1.4-4z',
    'M9 4l3 2.2L15 4',
  ],
  chaps: [
    'M7 4h10l-.6 5.5V20h-3.2v-8.5h-2.4V20H7.6V9.5z',
    'M5.2 9.5 7 9.8M18.8 9.5 17 9.8M5.2 13.5 7 13.8M18.8 13.5 17 13.8M5.2 17.5 7 17.8M18.8 17.5 17 17.8',
  ],
  jeans: ['M7 4h10v3H7z', 'M7 7h10l-.8 13h-3l-1.2-8-1.2 8h-3z'],
  boot: ['M9 4h3.6v8.4c0 1 .6 1.6 1.6 2l3.4 1.4c1 .4 1.4 1 1.4 2V20H9z', 'M9 16.6h10.4'],
  belt: ['M3 10h18v4H3z', 'M9.5 9h5v6h-5z', 'M12 12h2.5'],
  tag: ['M12.6 3.5H20V11l-8.4 8.4a1.6 1.6 0 0 1-2.3 0L4 14.1a1.6 1.6 0 0 1 0-2.3z', 'M16.5 7.5h.01'],
  search: ['M10.8 17.5a6.7 6.7 0 1 0 0-13.4 6.7 6.7 0 0 0 0 13.4z', 'M15.6 15.6 20 20'],
  cart: [
    'M6.5 7.5h11l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H9a1.5 1.5 0 0 1-1.5-1.4z',
    'M9.2 7.5V6a2.8 2.8 0 0 1 5.6 0v1.5',
  ],
  heart: [
    'M12 19.7 5.4 13c-1.8-1.9-1.8-5 0-6.8a4.6 4.6 0 0 1 6.6 0 4.6 4.6 0 0 1 6.6 0c1.8 1.8 1.8 4.9 0 6.8z',
  ],
  user: ['M12 11.5a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6z', 'M4.8 20.2a7.2 7.2 0 0 1 14.4 0'],
  menu: ['M4 7h16M4 12h16M4 17h11'],
  close: ['M6 6l12 12M18 6 6 18'],
  plus: ['M12 5.5v13M5.5 12h13'],
  minus: ['M5.5 12h13'],
  chevronDown: ['M6 9.5 12 15.5 18 9.5'],
  chevronRight: ['M9.5 6 15.5 12 9.5 18'],
  chevronLeft: ['M14.5 6 8.5 12 14.5 18'],
  arrowRight: ['M4 12h15', 'M13 6l6 6-6 6'],
  arrowLeft: ['M20 12H5', 'M11 6l-6 6 6 6'],
  star: ['M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.8-5.1 2.8 1-5.7-4.1-4 5.7-.8z'],
  check: ['M5 12.8 9.6 17.4 19 6.6'],
  sun: ['M12 16.4a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8z', 'M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4'],
  moon: ['M20 14.4A8.5 8.5 0 1 1 9.6 4a6.9 6.9 0 0 0 10.4 10.4z'],
  globe: ['M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z', 'M3.5 12h17', 'M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z'],
  instagram: [
    'M7.6 3.8h8.8a3.8 3.8 0 0 1 3.8 3.8v8.8a3.8 3.8 0 0 1-3.8 3.8H7.6a3.8 3.8 0 0 1-3.8-3.8V7.6a3.8 3.8 0 0 1 3.8-3.8z',
    'M12 15.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6z',
    'M17.1 7.2h.01',
  ],
  play: ['M8.5 5.5 18.5 12 8.5 18.5z'],
  truck: ['M3 7h10v9H3z', 'M13 10h4l3 3v3h-7z', 'M7 19a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 7 19zM17 19a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z'],
  needle: ['M4 20 20 4', 'M15 4h5v5', 'M9.5 11.5a3 3 0 0 0 3 3'],
  leaf: ['M20 4c0 8.8-4.3 13.2-9.6 13.2A6.4 6.4 0 0 1 4 10.8C4 6.4 9.6 4 20 4z', 'M4 20C7.5 14.5 12 11 17 9'],
  shield: ['M12 3.6 19.5 6v6c0 4.2-3 7.2-7.5 8.4C7.5 19.2 4.5 16.2 4.5 12V6z', 'M9 12l2.3 2.3L15.5 10'],
  ruler: ['M3.5 9h17v6h-17z', 'M7.5 9v2.5M11 9v2.5M14.5 9v2.5M18 9v2.5'],
  filter: ['M4 6.5h16M7 12h10M10 17.5h4'],
  grid: ['M4 4.5h6.5V11H4zM13.5 4.5H20V11h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z'],
  package: ['M12 3.8 20 8v8l-8 4.2L4 16V8z', 'M4 8l8 4.2L20 8', 'M12 12.2V20.2'],
  whatsapp: [
    'M12 3.8a8.2 8.2 0 0 0-7 12.5L4 20.2l4-1a8.2 8.2 0 1 0 4-15.4z',
    'M9 9.5c0 3 2.5 5.5 5.5 5.5.8 0 1.2-.5 1.2-1.2l-1.7-.8-.9.9c-1-.4-1.8-1.2-2.2-2.2l.9-.9-.8-1.7c-.7 0-1 .4-1 1.2z',
  ],
}

const paths = computed(() => strokePaths[props.name] ?? strokePaths.package)
const isFilled = computed(() => props.filled || props.name === 'play')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="isFilled ? 'currentColor' : 'none'"
    :stroke="isFilled && name === 'play' ? 'none' : 'currentColor'"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
  >
    <path v-for="(d, index) in paths" :key="index" :d="d" />
  </svg>
</template>
