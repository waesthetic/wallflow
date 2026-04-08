import { useDB } from "~~/server/database/client";
import { getPreviewUrl } from "~~/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
  const { locale, currency } = getQuery(event)

  const db = useDB()

  const items = (await db.query.products.findMany({
    with: {
      productFiles: { limit: 1 },
      productTranslations: true,
      productPrices: true
    }
  }))

  const localizedItems = items.map(product => {
    const translation = product.productTranslations.find(t => t.locale === locale)
    const priceCurrency = product.productPrices.find(p => p.currency === currency)

    return {
      ...product,
      title: translation?.title ?? product.title,
      description: translation?.description ?? product.description,
      price: priceCurrency?.amount ?? product.price,
      currency: String(priceCurrency?.currency ?? currency ?? 'USD'),
      productFiles: product.productFiles.map(f => ({
        id: f.id,
        name: f.name,
        url: getPreviewUrl(f.name)
      }))
    }
  })

  return { items: localizedItems }
})