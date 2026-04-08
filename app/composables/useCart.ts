import type { CartItem, Product } from '~~/server/database/schema'

type CartItemWithProduct = {
  cart_items: CartItem
  products: Product
}

export function useCart() {
  const items = useState<CartItemWithProduct[]>('cart-items', () => [])
  const toast = useToast()
  const { t } = useI18n()
  const { currency } = useCurrency()

  async function fetchCart() {
    try {
      const data = await $fetch<{ items: CartItemWithProduct[] }>('/api/cart', {
        query: { currency: currency.value }
      })
      items.value = data.items
    } catch {
      items.value = []
    }
  }

  async function addToCart(productId: string) {
    try {
      await $fetch('/api/cart', {
        method: 'POST',
        body: { productId }
      })
      await fetchCart()
      toast.add({ title: t('cart.itemAdded'), color: 'success' })
    } catch {
      toast.add({ title: t('error.status'), color: 'error' })
    }
  }

  async function removeFromCart(id: string) {
    try {
      await $fetch(`/api/cart/${id}`, {
        method: 'DELETE'
      })
      await fetchCart()
      toast.add({ title: t('cart.itemRemoved'), color: 'success' })
    } catch {
      toast.add({ title: t('error.status'), color: 'error' })
    }
  }

  const count = computed(() => items.value.length)

  return { items, count, fetchCart, addToCart, removeFromCart }
}
