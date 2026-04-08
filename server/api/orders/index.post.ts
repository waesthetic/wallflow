import { eq } from "drizzle-orm"
import { z } from "zod"
import { useDB } from "~~/server/database/client"
import { cartItems, products, productPrices, orders, orderItems } from "~~/server/database/schema"

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { currency } = await readValidatedBody(event, z.object({
    currency: z.enum(['RUB', 'USD']).default('RUB')
  }).parse)

  const db = useDB()

  const [order] = await db.transaction(async (tx) => {
    const items = await tx
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id))

    if (items.length === 0) {
      throw createError({
        statusCode: 400,
        message: '400 Cart is empty'
      })
    }

    const prices = await tx
      .select()
      .from(productPrices)
      .where(eq(productPrices.currency, currency))

    const priceMap = new Map(prices.map(p => [p.productId, p.amount]))

    const totalPrice = items.reduce((sum, item) =>
      sum + (priceMap.get(item.products.id) ?? item.products.price), 0
    )

    const [newOrder] = await tx.insert(orders).values({
      userId: user.id,
      status: 'completed',
      totalPrice,
      currency,
    }).returning()

    if (!newOrder) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create order'
      })
    }

    await tx.insert(orderItems).values(items.map(item => ({
      orderId: newOrder.id,
      productId: item.cart_items.productId,
      price: priceMap.get(item.products.id) ?? item.products.price
    })))

    await tx.delete(cartItems).where(eq(cartItems.userId, user.id))

    return [newOrder]
  })

  return { orderId: order.id }
})