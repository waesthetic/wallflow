<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const { items, count, removeFromCart } = useCart()
const { formatPrice } = useFormatPrice()
const { currency } = useCurrency()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('cart.label'))
})

const total = computed(() => items.value.reduce((sum, item) => sum + item.products.price, 0))

const orderLoading = ref(false)
const { $csrfFetch } = useNuxtApp()

async function placeOrder() {
  orderLoading.value = true
  try {
    const result = await $csrfFetch<{ orderId: string }>('/api/orders', {
      method: 'POST',
      body: { currency: currency.value }
    })
    await navigateTo(localePath(`/orders/${result.orderId}`))
  } catch {
    const toast = useToast()
    toast.add({ title: t('error.status'), color: 'error' })
  } finally {
    orderLoading.value = false
  }
}
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="w-full max-w-2xl mx-auto">

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5 }"
          class="mb-10 space-y-2"
        >
          <p class="text-xs font-semibold uppercase tracking-widest text-muted">
            {{ t('cart.label') }}
          </p>
          <h1 class="text-4xl font-bold text-highlighted">
            {{ t('cart.description') }}
          </h1>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.15 }"
        >
          <div v-if="count === 0" class="py-16 text-center space-y-4">
            <UIcon name="i-lucide-shopping-cart" class="size-14 mx-auto text-muted" />
            <p class="text-muted">{{ t('cart.empty') }}</p>
            <UButton variant="ghost" color="secondary" :to="localePath('/products')">
              {{ t('cart.browseShop') }}
            </UButton>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in items"
              :key="item.cart_items.id"
              class="flex items-center justify-between py-4 border-b border-accented"
            >
              <div class="space-y-1">
                <p class="font-medium text-highlighted">{{ item.products.title }}</p>
                <p class="text-sm text-muted">{{ formatPrice(item.products.price) }}</p>
              </div>

              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                @click="removeFromCart(item.cart_items.id)"
              />
            </div>

            <div class="pt-6 flex justify-between items-center">
              <p class="text-lg font-semibold text-highlighted">
                {{ t('cart.total') }}: {{ formatPrice(total) }}
              </p>

              <UButton
                color="secondary"
                size="lg"
                trailing-icon="i-lucide-arrow-right"
                :loading="orderLoading"
                @click="placeOrder()"
              >
                {{ t('cart.placeOrder') }}
              </UButton>
            </div>
          </div>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>