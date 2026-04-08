import { eq } from 'drizzle-orm'
import { compare } from 'bcrypt'
import { z } from 'zod'
import { useDB } from '~~/server/database/client'
import { users } from '~~/server/database/schema'

const schema = z.object({
  email: z.email('Invalid email'),
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

  const { email, password } = parsed.data
  const db = useDB()

  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  })

  const invalidError = createError({
    statusCode: 401,
    message: 'Invalid email or password',
  })

  if (!user || !user.passwordHash) throw invalidError

  const isValid = await compare(password, user.passwordHash)
  
  if (!isValid) throw invalidError

  if (!user.emailVerified) {
    throw createError({
      statusCode: 403,
      message: 'Please verify your email first',
    })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  })

  return { message: 'Logged in' }
})