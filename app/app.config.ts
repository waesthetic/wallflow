export default defineAppConfig({
  app: {
    name: 'Wallflow',
    email: 'pacificteam47@gmail.com'
  },

  footer: {
    links: [
      { icon: 'i-simple-icons-telegram', to: 'https://t.me/extise', target: '_blank', 'aria-label': 'Telegram' },
      { icon: 'i-simple-icons-vk', to: 'https://vk.com/waest', target: '_blank', 'aria-label': 'VK' }
    ]
  },

  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },

    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-4xl sm:text-5xl lg:text-6xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-lg text-muted'
      }
    },

    error: {
      slots: {
        root: 'min-h-[calc(100vh-var(--ui-header-height))] flex flex-col items-center justify-center text-center',
        statusCode: 'text-5xl font-semibold text-secondary',
        statusMessage: 'mt-2 text-4xl sm:text-5xl font-bold text-highlighted text-balance',
        message: 'mt-4 text-lg text-muted text-balance',
        links: 'mt-8 flex items-center justify-center gap-6'
      }
    }
  }
})
