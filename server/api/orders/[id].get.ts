import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { useDB } from "~~/server/database/client";
import { orders, orderItems, products } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = z.uuid().parse(getRouterParam(event, 'id'))

  const db = useDB()

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.userId, user.id), eq(orders.id, id))
  })

  if (!order) {
    throw createError({
      statusCode: 404,
      message: '404 Order not exist'
    })
  }

  const items = await db
    .select()
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id))

  return { order, items }
})