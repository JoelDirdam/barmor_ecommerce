<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNav from '@/components/layout/HeaderNav.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SearchOverlay from '@/components/layout/SearchOverlay.vue'
import CategoryDrawer from '@/components/layout/CategoryDrawer.vue'
import MiniCartDrawer from '@/components/cart/MiniCartDrawer.vue'
import QuickAddSheet from '@/components/product/QuickAddSheet.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
import { useQuickAdd } from '@/composables/useQuickAdd'

const { target: quickAddTarget, close: closeQuickAdd } = useQuickAdd()
</script>

<template>
  <a
    href="#contenido"
    class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-80 focus:rounded-card focus:bg-amber focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-on-accent"
  >
    Ir al contenido
  </a>

  <HeaderNav />

  <main id="contenido" class="min-h-[60vh]">
    <RouterView v-slot="{ Component }">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-100"
        leave-to-class="opacity-0"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <SiteFooter />

  <SearchOverlay />
  <CategoryDrawer />
  <MiniCartDrawer />
  <QuickAddSheet :product="quickAddTarget" @close="closeQuickAdd()" />
  <ToastHost />
</template>
