import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'barmor.wishlist.v1'

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<string[]>(load())

  function load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  }

  watch(ids, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      /* noop */
    }
  })

  const count = computed(() => ids.value.length)
  const has = (id: string) => ids.value.includes(id)

  function toggle(id: string) {
    ids.value = has(id) ? ids.value.filter((i) => i !== id) : [...ids.value, id]
  }

  return { ids, count, has, toggle }
})
