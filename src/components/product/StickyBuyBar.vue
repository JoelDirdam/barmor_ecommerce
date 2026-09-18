<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormat } from '@/composables/useFormat'
import type { Product } from '@/types'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductImage from '@/components/ui/ProductImage.vue'

/**
 * Barra inferior fija en móvil. Entra una sola vez al pasar el umbral y no
 * reacciona al cambio de dirección del scroll (§5).
 */
const props = defineProps<{ product: Product; canAdd: boolean }>()
const emit = defineEmits<{ add: []; buy: [] }>()

const { t } = useI18n()
const { price } = useFormat()
const visible = ref(false)

function onScroll() {
  if (!visible.value && window.scrollY > 520) visible.value = true
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-200 ease-out"
    enter-from-class="translate-y-full"
  >
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-60 border-t border-line bg-bg px-4 pt-2.5 pb-safe md:hidden"
    >
      <div class="flex items-center gap-3">
        <span class="h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-surface">
          <ProductImage :product="props.product" :show-label="false" />
        </span>
        <span class="nums-tabular text-[16px] font-bold">{{ price(props.product.price) }}</span>
        <div class="ml-auto flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="!canAdd" @click="emit('add')">
            {{ t('common.add') }}
          </BaseButton>
          <BaseButton size="sm" :disabled="!canAdd" @click="emit('buy')">
            {{ t('common.buyNow') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
