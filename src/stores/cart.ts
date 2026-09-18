import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CartLine, Product } from '@/types'
import { productById } from '@/data/products'

/** Umbral de envío gratis (§4.5, barra de progreso del mini-carrito) */
export const FREE_SHIPPING_THRESHOLD = 1500
const STORAGE_KEY = 'barmor.cart.v1'

export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartLine[]>(load())
  const isOpen = ref(false)
  /** Mensaje para el aria-live del mini-carrito (§6) */
  const lastAnnouncement = ref('')

  function load(): CartLine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartLine[]) : []
    } catch {
      return []
    }
  }

  watch(
    lines,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        /* modo privado o storage bloqueado: el carrito sigue en memoria */
      }
    },
    { deep: true },
  )

  const detailed = computed(() =>
    lines.value.flatMap((line) => {
      const product = productById(line.productId)
      return product ? [{ line, product }] : []
    }),
  )

  const count = computed(() => lines.value.reduce((total, l) => total + l.qty, 0))

  const subtotal = computed(() =>
    detailed.value.reduce((total, { line, product }) => total + product.price * line.qty, 0),
  )

  const savings = computed(() =>
    detailed.value.reduce(
      (total, { line, product }) =>
        total + (product.compareAt ? (product.compareAt - product.price) * line.qty : 0),
      0,
    ),
  )

  const shipping = computed(() =>
    subtotal.value === 0 || subtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : 149,
  )

  const total = computed(() => subtotal.value + shipping.value)

  const missingForFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal.value),
  )

  const freeShippingProgress = computed(() =>
    Math.min(100, Math.round((subtotal.value / FREE_SHIPPING_THRESHOLD) * 100)),
  )

  function add(product: Product, size: string, variant: string, qty = 1) {
    const key = `${product.id}::${size}::${variant}`
    const existing = lines.value.find((l) => l.key === key)
    if (existing) existing.qty += qty
    else lines.value.push({ key, productId: product.id, size, variant, qty })

    lastAnnouncement.value = `${product.name}, ${variant}, talla ${size}, agregada al carrito`
    isOpen.value = true
  }

  function setQty(key: string, qty: number) {
    const line = lines.value.find((l) => l.key === key)
    if (!line) return
    if (qty <= 0) remove(key)
    else line.qty = Math.min(qty, 10)
  }

  function remove(key: string) {
    lines.value = lines.value.filter((l) => l.key !== key)
  }

  function clear() {
    lines.value = []
  }

  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)

  return {
    lines,
    detailed,
    isOpen,
    lastAnnouncement,
    count,
    subtotal,
    savings,
    shipping,
    total,
    missingForFreeShipping,
    freeShippingProgress,
    add,
    setQty,
    remove,
    clear,
    open,
    close,
  }
})
