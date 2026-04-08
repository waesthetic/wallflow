import { eq, and, gt, isNull } from 'drizzle-orm'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { useDB } from '~~/server/database/client'
import { users, passwordResets } from '~~/server/database/schema'

const schema = z.object({
  token: z.string().length(64),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: parsed.error.issues[0]?.message,
    })
  }

  const { token, password } = parsed.data
  const db = useDB()

  const resetRequest = await db.query.passwordResets.findFirst({
    where: and(
      eq(passwordResets.token, token),
      gt(passwordResets.expiresAt, new Date()),
      isNull(passwordResets.usedAt),
    ),
  })

  if (!resetRequest) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired link'
    })
  }

  const passwordHash = await hash(password, 12)

  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({ passwordHash })
      .where(eq(users.id, resetRequest.userId))

    await tx.update(passwordResets)
      .set({ usedAt: new Date() })
      .where(eq(passwordResets.id, resetRequest.id))
  })

  return { message: 'Password changed successfully' }
})