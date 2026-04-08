import { eq, desc } from "drizzle-orm";
import { useDB } from "~~/server/database/client";
import { orders } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const db = useDB()

  const items = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    orderBy: desc(orders.createdAt)
  })

  return { items }
})