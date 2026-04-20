export default defineNuxtConfig({
  compatibilityDate: '2026-03-06',

  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', '@nuxt/eslint', 'nuxt-auth-utils', 'nuxt-security', 'motion-v/nuxt'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system'
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: '../app/i18n/locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' }
    ]
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },

    rateLimiter: {
      tokensPerInterval: 1000,
      interval: 60000,
      driver: {
        name: 'redis',
        options: {
          url: process.env.REDIS_URL,
        }
      }
    }
  },

  routeRules: {
    '/api/auth/login': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 60000 } }
    },
    '/api/auth/register': {
      security: { rateLimiter: { tokensPerInterval: 3, interval: 60000 } }
    },
    '/api/auth/forgot-password': {
      security: { rateLimiter: { tokensPerInterval: 3, interval: 60000 } }
    },
    '/api/contact': {
      security: { rateLimiter: { tokensPerInterval: 3, interval: 60000 } }
    },
    '/api/orders/**': {
      security: { rateLimiter: { tokensPerInterval: 10, interval: 60000 } }
    },
    '/api/payments/webhook': {
      security: { rateLimiter: { tokensPerInterval: 3, interval: 60000 } }
    }
  },

  runtimeConfig: {
    sessionPassword: '',
    databaseUrl: '',
    resendApiKey: '',
    emailFrom: '',
    toEmail: '',
    appUrl: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    yookassaShopId: '',
    yookassaSecretKey: '',

    session: {
      password: '',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      }
    },

    oauth: {
      google: {
        clientId: '',
        clientSecret: '',
      },
      github: {
        clientId: '',
        clientSecret: '',
      },
    },

    public: {
      cloudinaryCloudName: '',
      cloudinaryUploadPreset: ''
    }
  },
})
