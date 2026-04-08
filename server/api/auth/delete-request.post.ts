import { eq } from "drizzle-orm";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { useDB } from "~~/server/database/client";
import { users, accountDeletions } from "~~/server/database/schema";
import { sendEmail, accountDeletionHTML } from "~~/server/utils/email"

const schema = z.object({
  email: z.email()
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

  const db = useDB()
  
  if (parsed.data.email !== user.email) {
    throw createError({
      statusCode: 403,
      message: '403 Email does not match'
    })
  }

  const token = randomBytes(32).toString('hex')

  await db.insert(accountDeletions).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
  })

  const config = useRuntimeConfig()
  const deleteUrl = `${config.appUrl}/auth/delete-confirm?token=${token}`

  await sendEmail({
    to: user.email,
    subject: 'Delete account — Wallflow',
    html: accountDeletionHTML(deleteUrl)
  })

  return { message: 'Account deletion email verification sent' }
})