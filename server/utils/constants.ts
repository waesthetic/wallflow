export const CURRENCIES = ['USD', 'RUB'] as const
export type Currency = typeof CURRENCIES[number]

export const PROVIDERS = {
  GITHUB: 'github',
  GOOGLE: 'google',
} as const
export type Provider = typeof PROVIDERS[keyof typeof PROVIDERS]
