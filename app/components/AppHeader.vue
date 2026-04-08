<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const localePath = useLocalePath()
const { locale, locales, setLocale, t } = useI18n()
const { user, clear } = useUserSession()
const { data } = await useProducts()
const { count } = useCart()

const headerNavLinks = ['/', '/products', '/contacts']

const packLinks = computed(() => (data.value?.items ?? []).map(pack => ({
  label: t('product.packTitle', { title: pack.title }),
  to: localePath(`/products/${pack.slug}`),
  active: route.path === localePath(`/products/${pack.slug}`)
})).sort((a, b) => a.label.localeCompare(b.label)))

const items = computed<NavigationMenuItem[]>(() =>
  navLinks
    .filter(link => headerNavLinks.includes(link.to))
    .map(link => ({
      label: t(link.label),
      to: localePath(link.to),
      active: link.to === '/products' 
        ? route.path.startsWith(localePath('/products')) 
        : route.path === localePath(link.to), 
        ...(link.to === '/products' ? { children: packLinks.value } : {})
    }))
)

const cartLink = navLinks.find(l => l.to === '/cart')
const loginLink = navLinks.find(l => l.to === '/login')

const languageItems = computed(() => [
  locales.value.map(l => ({
    label: l.name,
    icon: locale.value === l.code ? 'i-lucide-check' : undefined,
    onSelect: () => setLocale(l.code)
  }))
])

const userMenuItems = computed(() => [[
  {
    label: user.value?.name || user.value?.email || t('nav.profile'),
    icon: 'i-lucide-user',
    to: localePath('/profile'),
  }
], [
  {
    label: t('nav.logout'),
    icon: 'i-lucide-log-out',
    onSelect: async () => {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await clear()
      await navigateTo(localePath('/login'))
    }
  }
]])
</script>

<template>
  <div class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50">
    <UNavigationMenu
      :items="items"
      variant="link"
      color="neutral"
      class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-default shadow-lg shadow-neutral-950/5"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />

        <UButton
          :icon="cartLink?.icon"
          variant="ghost"
          color="neutral"
          size="sm"
          :to="localePath(cartLink?.to ?? '/cart')"
          :aria-label="t(cartLink?.label ?? 'cart.label')"
        >
          <template v-if="count > 0" #trailing>
            <UBadge :label="String(count)" variant="solid" size="sm" class="rounded-full" />
          </template>
        </UButton>

        <UDropdownMenu :items="languageItems" :ui="{ content: 'min-w-24' }">
          <UButton 
            icon="i-lucide-languages"
            variant="ghost" 
            color="neutral"
            size="sm"
          />
        </UDropdownMenu>

        <template v-if="user">
          <UDropdownMenu :items="userMenuItems">
            <UButton variant="ghost" color="neutral" size="sm" :aria-label="t('nav.profile')">
              <UAvatar :src="user.avatarUrl || undefined" :alt="user.name || user.email || ''" size="xs" />
            </UButton>
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton
            :icon="loginLink?.icon"
            variant="ghost"
            color="neutral"
            :to="localePath(loginLink?.to ?? '/login')"
            :aria-label="t(loginLink?.label ?? 'nav.login')"
          />
        </template>
      </template>
    </UNavigationMenu>
  </div>
</template>