import { eq } from 'drizzle-orm'
import { useDB } from '~~/server/database/client'
import { cartItems, products, productPrices } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { currency } = getQuery(event)

  const db = useDB()

  const items = await db
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id))

  if (!currency) {
    return { items }
  }

  const prices = await db
    .select()
    .from(productPrices)
    .where(eq(productPrices.currency, String(currency)))

  const priceMap = new Map(prices.map(p => [p.productId, p.amount]))

  return {
    items: items.map(item => ({
      ...item,
      products: {
        ...item.products,
        price: priceMap.get(item.products.id) ?? item.products.price
      }
    }))
  }
})