const localeFormats: Record<string, string> = {
  'ru': 'ru-RU',
  'en': 'en-US',
}

export function useFormatPrice() {
  const { locale } = useI18n()
  const { currency } = useCurrency()

  function formatPrice(cents: number, currencyOverride?: string): string {
    const resolvedCurrency = currencyOverride ?? currency.value
    const intlLocale = localeFormats[locale.value] ?? 'en-US'

    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: resolvedCurrency,
      maximumFractionDigits: resolvedCurrency === 'RUB' ? 0 : 2
    }).format(cents / 100)
  }

  return { formatPrice }
}