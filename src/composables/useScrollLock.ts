import { watch, type Ref } from 'vue'

let locks = 0

/** Bloquea el scroll del body mientras un drawer / overlay está abierto */
export function useScrollLock(isOpen: Ref<boolean>) {
  watch(isOpen, (open) => {
    if (open) {
      locks += 1
      document.body.style.overflow = 'hidden'
    } else {
      locks = Math.max(0, locks - 1)
      if (locks === 0) document.body.style.overflow = ''
    }
  })
}
