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
        name: 'upstash',
        options: {
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
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
    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
    databaseUrl: process.env.DATABASE_URL,
    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM || 'noreply@wallflow.app',
    toEmail: process.env.TO_EMAIL,
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    yookassaShopId: process.env.YOOKASSA_SHOP_ID,
    yookassaSecretKey: process.env.YOOKASSA_SECRET_KEY,

    session: {
      password: process.env.NUXT_SESSION_PASSWORD!,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
  },

    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
    },

    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    }
  },
})
