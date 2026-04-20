import { eq } from "drizzle-orm";
import { z } from 'zod'
import { getPreviewUrl } from "~~/server/utils/cloudinary";
import { useDB } from "~~/server/database/client";
import { productFiles, products } from "~~/server/database/schema";

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
    where:
      eq(products.slug, slug),
    with: {
      productTranslations: true,
      productPrices: true
    }
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      message: '404 Product not found'
    })
  }

  const files = await db.query.productFiles.findMany({
    where:
      eq(productFiles.productId, product.id)
  })

  const previewFiles = files.map(f => ({
    id: f.id,
    url: getPreviewUrl(f.name)
  }))

  const translation = product.productTranslations.find(t => t.locale === locale)
  const priceCurrency = product.productPrices.find(p => p.currency === currency)

  const localizedProduct = {
    id: product.id,
    slug: product.slug,
    title: translation?.title ?? product.title,
    description: translation?.description ?? product.description,
    price: priceCurrency?.amount ?? product.price,
    currency: String(priceCurrency?.currency ?? currency ?? 'USD'),
  }

  return { product: localizedProduct, files: previewFiles }
})