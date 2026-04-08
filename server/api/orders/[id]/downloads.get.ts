import { eq, and, inArray } from "drizzle-orm"
import { z } from "zod"
import { useDB } from "~~/server/database/client"
import { orders, orderItems, productFiles } from "~~/server/database/schema"
import { getPackZipUrl } from "~~/server/utils/cloudinary"

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = z.uuid().parse(getRouterParam(event, 'id'))

  const db = useDB()

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, id), eq(orders.userId, user.id))
  })

  if (!order) {
    throw createError({
      statusCode: 404,
      message: '404 Order not exist'
    })
  }

  if (order.status !== "completed" && order.status !== "paid") {
    throw createError({
      statusCode: 403,
      message: 'Order is not paid'
    })
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))
  const productIds = items.map(item => item.productId)

  if (productIds.length === 0) {
    throw createError({ statusCode: 404, message: 'No files found' })
  }

  const files = await db.select().from(productFiles).where(inArray(productFiles.productId, productIds))

  const zipUrl = getPackZipUrl(files.map(f => f.name))

  return sendRedirect(event, zipUrl)
})
