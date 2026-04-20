import { eq } from "drizzle-orm";
import { z } from 'zod'
import { getPreviewUrl } from "~~/server/utils/cloudinary";
import { useDB } from "~~/server/database/client";
import { products } from "~~/server/database/schema";

const querySchema = z.object({
  locale: z.enum(['en', 'ru']).default('en'),
  currency: z.enum(['USD', 'RUB']).default('USD'),
})

export default defineEventHandler(async (event) => {
  const { locale, currency } = querySchema.parse(getQuery(event))
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: '400 Invalid slug'
    })
  }

  const db = useDB()

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      productFiles: true,
      productTranslations: { where: (t, { eq }) => eq(t.locale, locale) },
      productPrices: { where: (p, { eq }) => eq(p.currency, currency) },
    }
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      message: '404 Product not found'
    })
  }

  const translation = product.productTranslations[0]
  const priceCurrency = product.productPrices[0]

  const localizedProduct = {
    id: product.id,
    slug: product.slug,
    title: translation?.title ?? product.title,
    description: translation?.description ?? product.description,
    price: priceCurrency?.amount ?? product.price,
    currency: priceCurrency?.currency ?? currency,
  }

  const previewFiles = product.productFiles.map(f => ({
    id: f.id,
    url: getPreviewUrl(f.name)
  }))

  return { product: localizedProduct, files: previewFiles }
})