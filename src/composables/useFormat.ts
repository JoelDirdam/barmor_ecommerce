import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import type { Locale } from '@/types'

/**
 * Tipo de cambio de referencia para el toggle MXN/USD del DESIGN.md §4.1.
 * En producción esto viene del backend, no del cliente.
 */
export const USD_RATE = 17.5

export function useFormat() {
  const ui = useUiStore()
  const { locale } = useI18n()

  const formatter = computed(() =>
    new Intl.NumberFormat(locale.value === 'en' ? 'en-US' : 'es-MX', {
      style: 'currency',
      currency: ui.currency,
      maximumFractionDigits: ui.currency === 'USD' ? 2 : 0,
    }),
  )

  /** Recibe siempre pesos y convierte si la vitrina está en USD */
  function price(mxn: number) {
    const value = ui.currency === 'USD' ? mxn / USD_RATE : mxn
    return formatter.value.format(value)
  }

  function discountPercent(price: number, compareAt?: number) {
    if (!compareAt || compareAt <= price) return 0
    return Math.round(((compareAt - price) / compareAt) * 100)
  }

  return { price, discountPercent, currency: computed(() => ui.currency) }
}

/** Devuelve el campo en español o su gemelo `...En` según el idioma activo */
export function localized<T extends Record<string, any>, K extends string & keyof T>(
  item: T,
  key: K,
  locale: Locale,
): T[K] {
  if (locale === 'en') {
    const englishKey = `${key}En` as keyof T
    const value = item[englishKey]
    if (value !== undefined && value !== null) return value as T[K]
  }
  return item[key]
}
