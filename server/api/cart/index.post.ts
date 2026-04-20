import { eq } from "drizzle-orm";
import { z } from 'zod'
import { useDB } from "~~/server/database/client";
import { cartItems, products } from "~~/server/database/schema";

const schema = z.object({
  productId: z.uuid()
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: parsed.error.issues[0]?.message,
    })
  }

  const { productId } = parsed.data
  const db = useDB()

  const item = await db.query.products.findFirst({
    where: eq(products.id, productId)
  })

  if (!item) {
    throw createError({
      statusCode: 404,
      message: "Product not found"
    })
  }

  const [inserted] = await db.insert(cartItems)
    .values({ userId: user.id, productId })
    .onConflictDoNothing()
    .returning({ id: cartItems.id })

  if (!inserted) {
    throw createError({
      statusCode: 409,
      message: 'Found duplicate'
    })
  }

  return { message: 'Items added' }
})