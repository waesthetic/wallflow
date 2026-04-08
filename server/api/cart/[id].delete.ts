import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { useDB } from '~~/server/database/client'
import { cartItems } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = z.uuid().parse(getRouterParam(event, 'id'))
  
  const db = useDB()

  await db.delete(cartItems).where(and(eq(cartItems.userId, user.id), eq(cartItems.id, id)))
  
  return { message: 'Item Deleted' }
})