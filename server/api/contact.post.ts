import { z } from 'zod'
import { sendEmail, contactMessageHTML } from '../utils/email'

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.email(),
  message: z.string().min(8).max(1000)
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

  const { firstName, lastName, email, message } = parsed.data
  const config = useRuntimeConfig()
  const name = `${firstName} ${lastName}`

  await sendEmail({
    to: config.toEmail as string,
    subject: `New message from ${name}`,
    html: contactMessageHTML(name, email, message),
    replyTo: email,
  })

  return { success: true }
})
