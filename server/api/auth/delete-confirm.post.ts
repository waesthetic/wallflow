import { eq, and, gt } from "drizzle-orm";
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

  const deletion = await db.query.accountDeletions.findFirst({
    where: and(eq(accountDeletions.token, token), gt(accountDeletions.expiresAt, new Date()))
  })

  if (!deletion) {
    throw createError({
      statusCode: 400,
      message: '400 Invalid or expired link'
    })
  }

  await db.transaction(async (tx) => {
    await tx.delete(users).where(eq(users.id, deletion.userId))

    await tx.delete(accountDeletions).where(eq(accountDeletions.id, deletion.id))
  })

  await clearUserSession(event)

  return sendRedirect(event, '/')
})