import { eq } from "drizzle-orm";
import { z } from "zod"
import { useDB } from "~~/server/database/client";
import { users } from "~~/server/database/schema";

const schema = z.object({
  name: z.string().min(2).max(100)
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: parsed.error.issues[0]?.message
    })
  }

  const { name } = parsed.data

  const db = useDB()
  await db.update(users).set({ name }).where(eq(users.id, user.id))

  await setUserSession(event, {
    user: { ...user, name }
  })

  return { message: 'Name updated' }
})