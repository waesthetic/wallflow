import { z } from 'zod'
import { useDB } from "~~/server/database/client";
import { getPreviewUrl } from "~~/server/utils/cloudinary";
import { CURRENCIES } from '~~/server/utils/constants'

const querySchema = z.object({
  locale: z.enum(['en', 'ru']).default('en'),
  currency: z.enum(CURRENCIES).default('USD'),
})

export default defineEventHandler(async (event) => {
  const { locale, currency } = querySchema.parse(getQuery(event))

  const db = useDB()

  const items = await db.query.products.findMany({
    with: {
      productFiles: { limit: 1 },
      productTranslations: { where: (t, { eq }) => eq(t.locale, locale) },
      productPrices: { where: (p, { eq }) => eq(p.currency, currency) },
    }
  })

  const localizedItems = items.map(product => {
    const translation = product.productTranslations[0]
    const priceCurrency = product.productPrices[0]

    return {
      ...product,
      title: translation?.title ?? product.title,
      description: translation?.description ?? product.description,
      price: priceCurrency?.amount ?? product.price,
      currency: priceCurrency?.currency ?? currency,
      productFiles: product.productFiles.map(f => ({
        id: f.id,
        name: f.name,
        url: getPreviewUrl(f.name)
      }))
    }
  })

  return { items: localizedItems }
})