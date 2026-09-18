import { ref } from 'vue'
import type { Product } from '@/types'

/** Estado compartido del bottom sheet de agregado rápido */
const target = ref<Product | null>(null)

export function useQuickAdd() {
  return {
    target,
    open: (product: Product) => (target.value = product),
    close: () => (target.value = null),
  }
}
