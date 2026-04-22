import type { CartItem, Product } from '~~/server/database/schema'

type CartItemWithProduct = {
  cart_items: CartItem
  products: Product
}

const ws = import.meta.client ? new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws/cart`) : null

export function useCart() {
  const toast = useToast()
  const { t } = useI18n()
  const { currency } = useCurrency()
  const { $csrfFetch } = useNuxtApp()

  const { data, refresh } = useAsyncData(
    'cart',
    () => $fetch<{ items: CartItemWithProduct[] }>('/api/cart', {
      query: { currency: currency.value }
    }),
    { watch: [currency] }
  )

  if (ws) {
    ws.onmessage = () => refresh()
  }

  const items = computed(() => data.value?.items ?? [])
  const count = computed(() => items.value.length)

  function notifyOtherTabs() {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send('updated')
    }
  }

  async function addToCart(productId: string) {
    try {
      await $csrfFetch('/api/cart', { method: 'POST', body: { productId } })
      await refresh()
      notifyOtherTabs()
      toast.add({ title: t('cart.itemAdded'), color: 'success' })
    } catch {
      toast.add({ title: t('error.status'), color: 'error' })
    }
  }

  async function removeFromCart(id: string) {
    try {
      await $csrfFetch(`/api/cart/${id}`, { method: 'DELETE' })
      await refresh()
      notifyOtherTabs()
      toast.add({ title: t('cart.itemRemoved'), color: 'success' })
    } catch {
      toast.add({ title: t('error.status'), color: 'error' })
    }
  }

  return { items, count, addToCart, removeFromCart }
}
