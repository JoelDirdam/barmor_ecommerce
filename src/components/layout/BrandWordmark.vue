<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <span class="inline-flex flex-col items-center leading-none">
    <span
      class="font-display font-black tracking-tight"
      :class="compact ? 'text-[19px]' : 'text-[22px]'"
    >
      BARMOR
    </span>
    <span
      v-if="!compact"
      class="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] opacity-75"
    >
      Estilo Ranch Vaquera
    </span>
  </span>
</template>
