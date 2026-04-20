import { eq, and, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { useDB } from "~~/server/database/client";
import { accountDeletions, users } from "~~/server/database/schema";

const schema = z.object({
  token: z.string().length(64)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: '400 No data'
    })
  }

  const token = parsed.data.token

  const db = useDB()

  const deleted = await db.transaction(async (tx) => {
    const [claimed] = await tx
      .update(accountDeletions)
      .set({ usedAt: new Date() })
      .where(and(
        eq(accountDeletions.token, token),
        gt(accountDeletions.expiresAt, new Date()),
        isNull(accountDeletions.usedAt),
      ))
      .returning()

    if (!claimed) return null

    await tx.delete(users).where(eq(users.id, claimed.userId))

    return claimed
  })

  if (!deleted) {
    throw createError({
      statusCode: 400,
      message: '400 Invalid or expired link'
    })
  }

  await clearUserSession(event)

  return sendRedirect(event, '/')
})