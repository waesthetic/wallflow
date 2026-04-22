export default defineNuxtConfig({
  compatibilityDate: '2026-03-06',

  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/i18n', '@nuxt/eslint', 'nuxt-auth-utils', 'nuxt-security', 'motion-v/nuxt'],

  css: ['~/assets/css/main.css'],

  nitro: {
    experimental: {
      websocket: true
    }
  },

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
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'nonce-{{nonce}}'", "'strict-dynamic'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': [
          "'self'",
          'https://res.cloudinary.com',
          'https://avatars.githubusercontent.com',
          'https://lh3.googleusercontent.com',
          'data:',
          'blob:',
        ],
        'connect-src': ["'self'", 'https://api.cloudinary.com', 'ws:', 'wss:'],
        'font-src': ["'self'", 'data:'],
        'script-src-attr': ["'unsafe-hashes'", "'sha256-bwK6T5wZVTANitXbrTsel7kl/PyCjCd/Dq5Qoz3imjM='"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': true,
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },

    csrf: {
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
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
    '/api/auth/reset-password': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 60000 } }
    },
    '/api/auth/verify-email': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 60000 } }
    },
    '/api/auth/delete-request': {
      security: { rateLimiter: { tokensPerInterval: 3, interval: 60000 } }
    },
    '/api/auth/delete-confirm': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 60000 } }
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
    }
  },
})
