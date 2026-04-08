import { eq, and } from 'drizzle-orm'
import { useDB } from '~~/server/database/client'
import { users, oauthAccounts } from '~~/server/database/schema'
import type { User } from '~~/server/database/schema'

export default defineOAuthGitHubEventHandler({
  config: {
    scope: ['user:email'],
  },

  async onSuccess(event, { user: githubUser, tokens }) {
    const db = useDB()
    let email = githubUser.email as string | null

    if (!email) {
      try {
        const emails = await $fetch<Array<{ email: string, primary: boolean, verified: boolean }>>(
          'https://api.github.com/user/emails',
          { headers: { Authorization: `Bearer ${tokens.access_token}` } },
        )
        email = emails.find(e => e.primary && e.verified)?.email ?? null
      } catch {
        return sendRedirect(event, '/login?error=oauth_failed')
      }
    }

    if (!email) return sendRedirect(event, '/login?error=no_email')

    const normalizedEmail = email.toLowerCase()
    const providerAccountId = String(githubUser.id)

    const existingAccount = await db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.provider, 'github'),
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

    const byEmail = await db.query.users.findFirst({ where: eq(users.email, normalizedEmail) })

    const user: User = await db.transaction(async (tx) => {
      if (!byEmail) {
        const [newUser] = await tx.insert(users).values({
          email: normalizedEmail,
          name: (githubUser.name || githubUser.login) as string,
          avatarUrl: githubUser.avatar_url as string,
          emailVerified: true,
        }).returning()

        if (!newUser) {
          throw createError({ 
            statusCode: 500, 
            message: 'Failed to create user' 
          })
        }

        await tx.insert(oauthAccounts).values({ userId: newUser.id, provider: 'github', providerAccountId })
        return newUser
      }

      if (!byEmail.emailVerified) {
        await tx.update(users).set({ emailVerified: true }).where(eq(users.id, byEmail.id))
      }
      await tx.insert(oauthAccounts).values({ userId: byEmail.id, provider: 'github', providerAccountId })
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
