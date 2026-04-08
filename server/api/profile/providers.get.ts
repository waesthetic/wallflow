import { eq } from "drizzle-orm";
import { useDB } from "~~/server/database/client";
import { oauthAccounts } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const db = useDB()
  const providers = await db.query.oauthAccounts.findMany({
    where: eq(oauthAccounts.userId, user.id),
    columns: { id: true, provider: true }
  })

  return { providers }
})