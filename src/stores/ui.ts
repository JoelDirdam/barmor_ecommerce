import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
type Currency = 'MXN' | 'USD'

const THEME_KEY = 'barmor.theme'
const CURRENCY_KEY = 'barmor.currency'

export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>(initialTheme())
  const currency = ref<Currency>(readCurrency())
  const drawerOpen = ref(false)
  const searchOpen = ref(false)
  const toast = ref<{ id: number; text: string } | null>(null)
  let toastTimer: number | undefined

  function initialTheme(): Theme {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      /* noop */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function readCurrency(): Currency {
    try {
      return localStorage.getItem(CURRENCY_KEY) === 'USD' ? 'USD' : 'MXN'
    } catch {
      return 'MXN'
    }
  }

  function applyTheme(value: Theme) {
    document.documentElement.classList.toggle('dark', value === 'dark')
    document.documentElement.style.colorScheme = value
  }

  watch(theme, (value) => {
    applyTheme(value)
    try {
      localStorage.setItem(THEME_KEY, value)
    } catch {
      /* noop */
    }
  })

  watch(currency, (value) => {
    try {
      localStorage.setItem(CURRENCY_KEY, value)
    } catch {
      /* noop */
    }
  })

  applyTheme(theme.value)

  const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark')
  const toggleCurrency = () => (currency.value = currency.value === 'MXN' ? 'USD' : 'MXN')

  function showToast(text: string) {
    toast.value = { id: Date.now(), text }
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => (toast.value = null), 2600)
  }

  return {
    theme,
    currency,
    drawerOpen,
    searchOpen,
    toast,
    toggleTheme,
    toggleCurrency,
    showToast,
  }
})
