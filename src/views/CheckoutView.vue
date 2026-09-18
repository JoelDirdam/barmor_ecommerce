<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconGlyph from '@/components/ui/IconGlyph.vue'
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard.vue'

/**
 * Checkout de una sola página con pasos en acordeón (§4.5).
 * Invitado por defecto; la cuenta se ofrece al final, nunca como reja.
 * Es una plantilla: no hay pasarela de pago conectada.
 */
const cart = useCartStore()
const ui = useUiStore()
const { t } = useI18n()

type Step = 1 | 2 | 3
const step = ref<Step>(1)
const done = ref(false)
const summaryOpen = ref(false)

const form = reactive({
  email: '',
  phone: '',
  name: '',
  street: '',
  interior: '',
  neighborhood: '',
  city: '',
  state: '',
  zip: '',
  method: 'standard' as 'standard' | 'express',
  payment: 'card' as 'card' | 'oxxo' | 'transfer' | 'wallet',
})

const errors = reactive<Record<string, string>>({})

const paymentMethods = [
  { id: 'card', label: 'checkout.payCard', mark: 'VISA · MC · AMEX' },
  { id: 'oxxo', label: 'checkout.payOxxo', mark: 'OXXO PAY' },
  { id: 'transfer', label: 'checkout.payTransfer', mark: 'SPEI' },
  { id: 'wallet', label: 'checkout.payWallet', mark: 'Mercado Pago · PayPal' },
] as const

const contactSummary = computed(() => [form.email, form.phone].filter(Boolean).join(' · '))
const shippingSummary = computed(() =>
  [form.name, form.street, form.neighborhood, form.city, form.zip].filter(Boolean).join(', '),
)

function validate(fields: string[]) {
  let valid = true
  for (const field of fields) {
    const value = String(form[field as keyof typeof form] ?? '').trim()
    if (!value) {
      errors[field] = t('checkout.required')
      valid = false
    } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      errors[field] = t('checkout.invalidEmail')
      valid = false
    } else {
      delete errors[field]
    }
  }
  return valid
}

function goToShipping() {
  if (validate(['email', 'phone'])) step.value = 2
}

function goToPayment() {
  if (validate(['name', 'street', 'neighborhood', 'city', 'state', 'zip'])) step.value = 3
}

function placeOrder() {
  done.value = true
  cart.clear()
  ui.showToast(t('checkout.orderPlaced'))
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <div class="container-page py-8 md:py-12">
    <!-- Confirmación de demostración -->
    <div v-if="done" class="mx-auto max-w-lg py-16 text-center">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage/15 text-sage">
        <IconGlyph name="check" :size="28" />
      </span>
      <h1 class="text-section mt-5">{{ t('checkout.orderPlaced') }}</h1>
      <p class="mt-3 text-[14px] text-ink-soft">{{ t('checkout.demoNotice') }}</p>
      <BaseButton class="mt-7" :to="{ name: 'home' }">{{ t('cart.keepShopping') }}</BaseButton>
    </div>

    <template v-else-if="cart.detailed.length">
      <h1 class="text-section">{{ t('checkout.title') }}</h1>
      <p class="mt-2 max-w-[60ch] text-[13px] text-ink-soft">{{ t('checkout.demoNotice') }}</p>

      <!-- Resumen colapsable en móvil, columna fija en desktop (§4.5) -->
      <button
        type="button"
        class="mt-6 flex min-h-12 w-full items-center justify-between rounded-card border border-line bg-surface px-4 text-[14px] font-medium lg:hidden"
        :aria-expanded="summaryOpen"
        @click="summaryOpen = !summaryOpen"
      >
        <span>{{ t('checkout.showSummary') }}</span>
        <span class="flex items-center gap-2">
          <span class="nums-tabular font-bold">{{ cart.count }}</span>
          <IconGlyph
            name="chevronDown"
            :size="17"
            class="transition-transform duration-200"
            :class="summaryOpen ? 'rotate-180' : ''"
          />
        </span>
      </button>
      <div v-show="summaryOpen" class="mt-3 lg:hidden">
        <OrderSummaryCard />
      </div>

      <div class="mt-8 gap-10 lg:grid lg:grid-cols-[1fr_380px]">
        <div class="divide-y divide-line border-y border-line">
          <!-- Paso 1: contacto -->
          <section class="py-5">
            <header class="flex items-center justify-between gap-4">
              <h2 class="flex items-center gap-2.5 text-[15px] font-semibold">
                <span
                  class="nums-tabular grid h-7 w-7 place-items-center rounded-full text-[13px]"
                  :class="step > 1 ? 'bg-sage text-white dark:text-on-accent' : 'bg-leather text-white dark:text-on-accent'"
                >
                  <IconGlyph v-if="step > 1" name="check" :size="15" />
                  <template v-else>1</template>
                </span>
                {{ t('checkout.contact') }}
              </h2>
              <button
                v-if="step > 1"
                type="button"
                class="min-h-11 text-[13px] font-semibold text-leather"
                @click="step = 1"
              >
                {{ t('checkout.edit') }}
              </button>
            </header>

            <div v-if="step === 1" class="mt-4 space-y-4">
              <p class="rounded-card bg-surface px-3 py-2.5 text-[13px] text-ink-soft">
                {{ t('checkout.guestNote') }}
              </p>
              <label class="block">
                <span class="text-[13px] font-medium">{{ t('checkout.email') }}</span>
                <input
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  class="mt-1.5 h-12 w-full rounded-card border bg-surface px-3 text-[15px] outline-none"
                  :class="errors.email ? 'border-rust' : 'border-line focus-visible:border-leather'"
                  :aria-invalid="Boolean(errors.email)"
                />
                <span v-if="errors.email" class="mt-1.5 flex items-center gap-1.5 text-[12px] text-rust">
                  <IconGlyph name="close" :size="13" />
                  {{ errors.email }}
                </span>
              </label>
              <label class="block">
                <span class="text-[13px] font-medium">{{ t('checkout.phone') }}</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  autocomplete="tel"
                  class="mt-1.5 h-12 w-full rounded-card border bg-surface px-3 text-[15px] outline-none"
                  :class="errors.phone ? 'border-rust' : 'border-line focus-visible:border-leather'"
                  :aria-invalid="Boolean(errors.phone)"
                />
                <span v-if="errors.phone" class="mt-1.5 flex items-center gap-1.5 text-[12px] text-rust">
                  <IconGlyph name="close" :size="13" />
                  {{ errors.phone }}
                </span>
              </label>
              <BaseButton size="lg" @click="goToShipping()">
                {{ t('checkout.continueToShipping') }}
              </BaseButton>
            </div>
            <p v-else class="mt-2 text-[13px] text-ink-soft">{{ contactSummary }}</p>
          </section>

          <!-- Paso 2: envío -->
          <section class="py-5">
            <header class="flex items-center justify-between gap-4">
              <h2 class="flex items-center gap-2.5 text-[15px] font-semibold">
                <span
                  class="nums-tabular grid h-7 w-7 place-items-center rounded-full text-[13px]"
                  :class="
                    step > 2
                      ? 'bg-sage text-white dark:text-on-accent'
                      : step === 2
                        ? 'bg-leather text-white dark:text-on-accent'
                        : 'bg-line text-ink-soft'
                  "
                >
                  <IconGlyph v-if="step > 2" name="check" :size="15" />
                  <template v-else>2</template>
                </span>
                {{ t('checkout.shipping') }}
              </h2>
              <button
                v-if="step > 2"
                type="button"
                class="min-h-11 text-[13px] font-semibold text-leather"
                @click="step = 2"
              >
                {{ t('checkout.edit') }}
              </button>
            </header>

            <div v-if="step === 2" class="mt-4 grid gap-4 sm:grid-cols-2">
              <label
                v-for="field in [
                  { key: 'name', label: 'checkout.name', span: true, auto: 'name' },
                  { key: 'street', label: 'checkout.street', span: true, auto: 'address-line1' },
                  { key: 'interior', label: 'checkout.interior', span: false, auto: 'address-line2' },
                  {
                    key: 'neighborhood',
                    label: 'checkout.neighborhood',
                    span: false,
                    auto: 'address-level3',
                  },
                  { key: 'city', label: 'checkout.city', span: false, auto: 'address-level2' },
                  { key: 'state', label: 'checkout.state', span: false, auto: 'address-level1' },
                  { key: 'zip', label: 'checkout.zip', span: false, auto: 'postal-code' },
                ]"
                :key="field.key"
                class="block"
                :class="field.span ? 'sm:col-span-2' : ''"
              >
                <span class="text-[13px] font-medium">{{ t(field.label) }}</span>
                <input
                  v-model="form[field.key as 'name']"
                  type="text"
                  :autocomplete="field.auto"
                  class="mt-1.5 h-12 w-full rounded-card border bg-surface px-3 text-[15px] outline-none"
                  :class="
                    errors[field.key] ? 'border-rust' : 'border-line focus-visible:border-leather'
                  "
                  :aria-invalid="Boolean(errors[field.key])"
                />
                <span
                  v-if="errors[field.key]"
                  class="mt-1.5 flex items-center gap-1.5 text-[12px] text-rust"
                >
                  <IconGlyph name="close" :size="13" />
                  {{ errors[field.key] }}
                </span>
              </label>

              <fieldset class="sm:col-span-2">
                <legend class="text-[13px] font-medium">{{ t('common.shipping') }}</legend>
                <div class="mt-2 grid gap-2 sm:grid-cols-2">
                  <label
                    v-for="option in (['standard', 'express'] as const)"
                    :key="option"
                    class="flex min-h-12 cursor-pointer items-center gap-3 rounded-card border px-3 text-[14px]"
                    :class="form.method === option ? 'border-leather bg-leather/5' : 'border-line'"
                  >
                    <input v-model="form.method" type="radio" :value="option" class="accent-leather" />
                    {{ option === 'standard' ? t('checkout.methodStandard') : t('checkout.methodExpress') }}
                  </label>
                </div>
              </fieldset>

              <div class="sm:col-span-2">
                <BaseButton size="lg" @click="goToPayment()">
                  {{ t('checkout.continueToPayment') }}
                </BaseButton>
              </div>
            </div>
            <p v-else-if="step > 2" class="mt-2 text-[13px] text-ink-soft">{{ shippingSummary }}</p>
          </section>

          <!-- Paso 3: pago -->
          <section class="py-5">
            <header>
              <h2 class="flex items-center gap-2.5 text-[15px] font-semibold">
                <span
                  class="nums-tabular grid h-7 w-7 place-items-center rounded-full text-[13px]"
                  :class="step === 3 ? 'bg-leather text-white dark:text-on-accent' : 'bg-line text-ink-soft'"
                >
                  3
                </span>
                {{ t('checkout.payment') }}
              </h2>
            </header>

            <div v-if="step === 3" class="mt-4 space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex min-h-14 cursor-pointer items-center gap-3 rounded-card border px-3.5 text-[14px]"
                :class="form.payment === method.id ? 'border-leather bg-leather/5' : 'border-line'"
              >
                <input
                  v-model="form.payment"
                  type="radio"
                  :value="method.id"
                  class="accent-leather"
                />
                <span class="flex-1 font-medium">{{ t(method.label) }}</span>
                <!-- Marcas de pago reconocibles para el mercado MX (§4.5) -->
                <span class="text-[11px] font-semibold tracking-wide text-ink-soft">
                  {{ method.mark }}
                </span>
              </label>

              <div class="flex gap-2 pt-2">
                <input
                  :placeholder="t('checkout.promoPlaceholder')"
                  class="h-12 flex-1 rounded-card border border-line bg-surface px-3 text-[15px] outline-none focus-visible:border-leather"
                />
                <BaseButton variant="secondary" size="lg">{{ t('checkout.promoApply') }}</BaseButton>
              </div>

              <BaseButton block size="lg" class="mt-2" @click="placeOrder()">
                {{ t('checkout.placeOrder') }}
              </BaseButton>
            </div>
          </section>
        </div>

        <aside class="hidden lg:block">
          <div class="sticky top-32">
            <OrderSummaryCard />
          </div>
        </aside>
      </div>
    </template>

    <div v-else class="py-16 text-center">
      <p class="text-[17px] font-semibold">{{ t('cart.empty') }}</p>
      <BaseButton class="mt-6" :to="{ name: 'catalog' }">{{ t('cart.keepShopping') }}</BaseButton>
    </div>
  </div>
</template>
