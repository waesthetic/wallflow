import { eq, and } from 'drizzle-orm'
import { useDB } from '~~/server/database/client'
import { users, oauthAccounts } from '~~/server/database/schema'
import type { User } from '~~/server/database/schema'
import { PROVIDERS } from '~~/server/utils/constants'

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user: googleUser }) {
    const db = useDB()

    const email = (googleUser.email as string).toLowerCase()
    const providerAccountId = String(googleUser.sub)

    const existingAccount = await db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.provider, PROVIDERS.GOOGLE),
        eq(oauthAccounts.providerAccountId, providerAccountId),
      ),
      with: { user: true },
    })

    if (existingAccount) {
      await setUserSession(event, {
        user: {
          id: existingAccount.user.id,
          email: existingAccount.user.email,
          name: existingAccount.user.name,
          avatarUrl: existingAccount.user.avatarUrl,
        },
      })
      return sendRedirect(event, '/profile')
    }

    const byEmail = await db.query.users.findFirst({ where: eq(users.email, email) })

    const user: User = await db.transaction(async (tx) => {
      if (!byEmail) {
        const [newUser] = await tx.insert(users).values({
          email,
          name: googleUser.name as string,
          avatarUrl: googleUser.picture as string,
          emailVerified: true,
        }).returning()

        if (!newUser) {
          throw createError({ 
            statusCode: 500, message: 'Failed to create user' 
          })
        }

        await tx.insert(oauthAccounts).values({ userId: newUser.id, provider: PROVIDERS.GOOGLE, providerAccountId })
        return newUser
      }

      if (!byEmail.emailVerified) {
        await tx.update(users).set({ emailVerified: true }).where(eq(users.id, byEmail.id))
      }
      await tx.insert(oauthAccounts).values({ userId: byEmail.id, provider: PROVIDERS.GOOGLE, providerAccountId })
      return byEmail
    })

    await setUserSession(event, {
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    })
    return sendRedirect(event, '/profile')
  },

  onError(event) {
    return sendRedirect(event, '/login?error=oauth_failed')
  },
})
