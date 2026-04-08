export function useProducts() {
  const { locale } = useI18n()
  const { currency } = useCurrency()

  return useFetch('/api/products', {
    key: 'products',
    query: { locale, currency },
    watch: [locale]
  })
}

export function useProduct(slug: string) {
  const { locale } = useI18n()
  const { currency } = useCurrency()

  return useFetch(`/api/products/${slug}`, {
    key: `product-${slug}`,
    query: { locale, currency },
    watch: [locale]
  })
}