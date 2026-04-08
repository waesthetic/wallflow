const currencyMap: Record<string, string> = {
  'ru': 'RUB',
  'en': 'USD',
}

export function useCurrency() {
  const { locale } = useI18n()
  const currency = computed(() => currencyMap[locale.value] ?? 'USD')

  return { currency }
}
