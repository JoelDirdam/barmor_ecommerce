import { createI18n } from 'vue-i18n'
import type { Locale } from '@/types'
import es from './es'
import en from './en'

const STORAGE_KEY = 'barmor.locale'

function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    /* noop */
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'es',
  messages: { es, en },
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale === 'en' ? 'en' : 'es-MX'
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* noop */
  }
}

export function currentLocale(): Locale {
  return i18n.global.locale.value as Locale
}

document.documentElement.lang = currentLocale() === 'en' ? 'en' : 'es-MX'
