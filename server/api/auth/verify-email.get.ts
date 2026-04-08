import { eq, and, gt } from 'drizzle-orm'
import { useDB } from '~~/server/database/client'
import { users, emailVerification } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)

  if (!token || typeof token !== 'string') {
    throw createError({
      statusCode: 400, 
      message: 'No token provided',
    })
  }

  const db = useDB()

  const verification = await db.query.emailVerification.findFirst({
    where: and(
      eq(emailVerification.token, token),
      gt(emailVerification.expiresAt, new Date()),
    ),
  })

  if (!verification) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired link',
    })
  }

  const user = await db.transaction(async (tx) => {
    await tx.update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, verification.userId))

    await tx.delete(emailVerification)
      .where(eq(emailVerification.userId, verification.userId))

    return tx.query.users.findFirst({
      where: eq(users.id, verification.userId),
    })
  })

  await setUserSession(event, {
    user: {
      id: user!.id,
      email: user!.email,
      name: user!.name,
      avatarUrl: user!.avatarUrl,
    },
  })

  return sendRedirect(event, '/profile?verified=true')
})