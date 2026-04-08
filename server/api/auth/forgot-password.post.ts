import { eq } from "drizzle-orm"
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { useDB } from "~~/server/database/client"
import { users, passwordResets } from "~~/server/database/schema"
import { sendEmail, passwordResetHTML, oauthAccountHTML } from '~~/server/utils/email'

const schema = z.object({
  email: z.email('Invalid email'),
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

  const db = useDB()

  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email.toLowerCase()),
  })

  if (!user) {
    return { message: 'Message has been sent if the account exists.' }
  }

  if (!user.passwordHash) {
    await sendEmail({
      to: user.email,
      subject: 'Log in — Wallflow',
      html: oauthAccountHTML()
    })

    return { message: 'Message has been sent if the account exists.' }
  }

  const token = randomBytes(32).toString('hex')

  await db.insert(passwordResets).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  })

  const config = useRuntimeConfig()
  const resetUrl = `${config.appUrl}/auth/reset-password?token=${token}`

  await sendEmail({
    to: user.email,
    subject: 'Reset password — Wallflow',
    html: passwordResetHTML(resetUrl),
  })

  return { message: 'Message has been sent if the account exists.' }
})