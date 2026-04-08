import { eq } from "drizzle-orm";
import { z } from "zod"
import { useDB } from "~~/server/database/client";
import { users } from "~~/server/database/schema";

const schema = z.object({
  avatarUrl: z.url().refine(
    url => url.startsWith(
      'https://res.cloudinary.com/'),
      'Invalid avatar URL'
    )
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

  const { avatarUrl } = parsed.data

  const db = useDB()
  await db.update(users).set({ avatarUrl }).where(eq(users.id, user.id))

  await setUserSession(event, {
    user: { ...user, avatarUrl }
  })

  return { message: 'Avatar updated' }
})