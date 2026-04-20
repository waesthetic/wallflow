import { eq } from 'drizzle-orm'
import { hash } from 'bcrypt'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { useDB } from '~~/server/database/client'
import { users, emailVerification } from '~~/server/database/schema'
import { sendEmail, emailVerificationHTML } from '~~/server/utils/email'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
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

  const { email, password, name } = parsed.data
  const db = useDB()

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      message: 'Registration failed',
    })
  }

  const passwordHash = await hash(password, 12)
  const token = randomBytes(32).toString('hex')

  const [newUser] = await db.transaction(async (tx) => {
    const [created] = await tx.insert(users).values({
      email: email.toLowerCase(),
      name,
      passwordHash,
      emailVerified: false,
    }).returning()

    await tx.insert(emailVerification).values({
      userId: created!.id,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })

    return [created]
  })

  const config = useRuntimeConfig()
  const verifyUrl = `${config.appUrl}/auth/verify-email?token=${token}`

  try {
    await sendEmail({
      to: newUser!.email,
      subject: 'Confirm your email — Wallflow',
      html: emailVerificationHTML(verifyUrl, name ?? null),
    })
  } catch {
    await db.delete(users).where(eq(users.id, newUser!.id))
    throw createError({ statusCode: 500, message: 'Failed to send verification email. Please try again.' })
  }

  return {
    message: 'Check your email to confirm your account',
  }
})

