import type { CartItem, Product } from '~~/server/database/schema'

type CartItemWithProduct = {
  cart_items: CartItem
  products: Product
}

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

  const items = computed(() => data.value?.items ?? [])
  const count = computed(() => items.value.length)

  async function addToCart(productId: string) {
    try {
      await $csrfFetch('/api/cart', { method: 'POST', body: { productId } })
      await refresh()
      toast.add({ title: t('cart.itemAdded'), color: 'success' })
    } catch {
      toast.add({ title: t('error.status'), color: 'error' })
    }
  }

  async function removeFromCart(id: string) {
    try {
      await $csrfFetch(`/api/cart/${id}`, { method: 'DELETE' })
      await refresh()
      toast.add({ title: t('cart.itemRemoved'), color: 'success' })
    } catch {
      toast.add({ title: t('error.status'), color: 'error' })
    }
  }

  return { items, count, addToCart, removeFromCart }
}
