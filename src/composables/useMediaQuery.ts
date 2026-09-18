import { onUnmounted, ref } from 'vue'

export function useMediaQuery(query: string) {
  const matches = ref(false)
  if (typeof window === 'undefined' || !window.matchMedia) return matches

  const media = window.matchMedia(query)
  matches.value = media.matches
  const listener = (event: MediaQueryListEvent) => (matches.value = event.matches)
  media.addEventListener('change', listener)
  onUnmounted(() => media.removeEventListener('change', listener))

  return matches
}

/** `md+` del DESIGN.md §3 */
export const useIsDesktop = () => useMediaQuery('(min-width: 900px)')
