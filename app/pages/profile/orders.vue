<script setup lang="ts">
import type { Order } from '~~/server/database/schema'

definePageMeta({ middleware: 'auth' })

const localePath = useLocalePath()
const { t } = useI18n()
const { formatPrice } = useFormatPrice()

useHead({ title: t('orders.label') })

const { data } = await useFetch<{
  items: Order[]
}>('/api/orders')

const items = computed(() => data.value?.items ?? [])

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
            {{ t('orders.subtitle') }}
          </h1>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.15 }"
        >
          <div v-if="items.length === 0" class="py-16 text-center space-y-4">
            <UIcon name="i-lucide-package" class="size-14 mx-auto text-muted" />
            <p class="text-muted">{{ t('orders.empty') }}</p>
            <UButton variant="ghost" color="secondary" :to="localePath('/products')">
              {{ t('orders.browseShop') }}
            </UButton>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in items"
              :key="item.id"
              class="flex items-center justify-between py-4 border-b border-accented"
            >
              <div class="space-y-1">
                <p class="font-medium text-highlighted">
                  {{ new Date(item.createdAt).toLocaleDateString() }}
                </p>
                <p class="text-sm text-muted">
                  {{ formatPrice(item.totalPrice, item.currency) }}
                </p>
                <UBadge :color="statusColor[item.status]" variant="soft" size="sm">
                  {{ getStatusLabel(item.status) }}
                </UBadge>
              </div>

              <UButton
                variant="ghost"
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
                :to="localePath(`/orders/${item.id}`)"
              />
            </div>
          </div>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>