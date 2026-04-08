<script setup lang="ts">
import type { Order, OrderItem, Product } from '~~/server/database/schema';

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const { formatPrice } = useFormatPrice()
const localePath = useLocalePath()
const route = useRoute()
const id = route.params.id

const { data } = await useFetch<{
  order: Order
  items: Array<{ order_items: OrderItem, products: Product }>
}>('/api/orders/' + id)

if (!data.value?.order) {
  throw createError({
    statusCode: 404,
    message: '404 Order not found'
  })
}

const items = computed(() => data.value?.items)
const order = computed(() => data.value?.order)
const status = computed(() => order.value!.status)
const totalPrice = computed(() => order.value!.totalPrice)
const date = computed(() => order.value!.createdAt)

useHead({
  title: computed(() => t('orders.title') + id)
})

function downloadFiles() {
  navigateTo(`/api/orders/${id}/downloads`, { external: true })
}

const statusColor: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  pending: 'warning',
  paid: 'info',
  completed: 'success',
  failed: 'error'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: t('orders.statusPending'),
    paid: t('orders.statusPaid'),
    completed: t('orders.statusCompleted'),
    failed: t('orders.statusFailed')
  }

  return map[status] ?? status
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
            {{ t('orders.label') }}
          </p>
          <h1 class="text-4xl font-bold text-highlighted">
            {{ t('orders.confirmed') }}
          </h1>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.1 }"
          class="mb-8 space-y-2"
        >
          <p class="text-sm text-muted">
            {{ t('orders.id') }}: <span class="font-mono text-highlighted">{{ id }}</span>
          </p>
          <p class="text-sm text-muted">
            {{ t('orders.date') }}: <span class="text-highlighted">{{ new Date(date).toLocaleDateString() }}</span>
          </p>
          <p class="text-sm text-muted">
            {{ t('orders.status') }}: <UBadge :color="statusColor[status]" variant="soft" size="sm">{{ getStatusLabel(status) }}</UBadge>
          </p>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <div class="space-y-4">
            <div
              v-for="item in items"
              :key="item.order_items.id"
              class="flex items-center justify-between py-4 border-b border-accented"
            >
              <p class="font-medium text-highlighted">{{ item.products.title }}</p>
              <p class="text-sm text-muted">{{ formatPrice(item.order_items.price, order!.currency) }}</p>
            </div>

            <div class="pt-6 flex justify-between items-center">
              <p class="text-lg font-semibold text-highlighted">
                {{ t('cart.total') }}: {{ formatPrice(totalPrice, order!.currency) }}
              </p>
            </div>
          </div>

          <div class="mt-10 flex gap-3">
            <UButton leading-icon="i-lucide-arrow-left" variant="soft" color="secondary" :to="localePath('/')">
              {{ t('orders.goHome') }}
            </UButton>
            <UButton variant="soft" color="secondary" :to="localePath('/products')">
              {{ t('cart.browseShop') }}
            </UButton>
            <UButton variant="soft" color="secondary" trailing-icon="i-lucide-download" @click="downloadFiles()">
              {{ t('orders.download') }}
            </UButton>
          </div>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>