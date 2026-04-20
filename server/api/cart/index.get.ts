import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/database/client'
import { cartItems, products, productPrices } from '~~/server/database/schema'

const querySchema = z.object({
  currency: z.enum(['USD', 'RUB']).default('USD'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { currency } = querySchema.parse(getQuery(event))

  const db = useDB()

  const items = await db
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id))

  const prices = await db
    .select()
    .from(productPrices)
    .where(eq(productPrices.currency, currency))

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