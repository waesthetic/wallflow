import { eq, and } from 'drizzle-orm'
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
    .leftJoin(productPrices, and(
      eq(productPrices.productId, products.id),
      eq(productPrices.currency, currency)
    ))
    .where(eq(cartItems.userId, user.id))

  return {
    items: items.map(item => ({
      cart_items: item.cart_items,
      products: {
        ...item.products,
        price: item.product_prices?.amount ?? item.products.price
      }
    }))
  }
})