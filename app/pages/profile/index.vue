<script setup lang="ts">
import type { Order } from '~~/server/database/schema'

definePageMeta({ middleware: 'auth' })

const { user } = useUserSession()
const localePath = useLocalePath()
const { t } = useI18n()
const route = useRoute()
const toast = useToast()

useHead({ title: t('profile.label') })

const quickLinks = navLinks.filter(l => 
  ['/', '/cart', '/profile/orders', '/profile/settings'].includes(l.to)
)

const greeting = computed(() => {
  const hour = new Date().getHours()
  const name = user.value?.name || user.value?.email || t('nav.user')
  if (hour >= 5 && hour < 11) return t('profile.morning') + name
  if (hour >= 11 && hour < 17) return t('profile.afternoon') + name
  if (hour >= 17 && hour < 23) return t('profile.evening') + name
  return t('profile.night') + name
})

onMounted(() => {
  if (route.query.verified === 'true') {
    toast.add({ title: t('auth.verifyEmailSuccess'), color: 'success' })
  }
})

const { data } = await useFetch<{
  items: Order[]
}>('/api/orders')

const count = computed(() => data.value?.items.length ?? 0)
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="w-full max-w-3xl mx-auto">

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5 }"
          class="flex gap-10 items-start mb-12"
        >
          <UAvatar
            :src="user?.avatarUrl ?? undefined"
            :alt="user?.name ?? user?.email ?? ''"
            size="3xl"
            class="shrink-0 size-32 text-4xl"
          />
          <div class="space-y-2 pt-2">
            <h1 class="text-4xl font-bold text-highlighted">{{ greeting }}</h1>
            <p class="text-muted">{{ user?.email }}</p>
            <UBadge variant="soft" color="neutral">
              {{ t('profile.orderCount', { count }) }}
            </UBadge>
          </div>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.15 }"
        >
          <div class="grid grid-cols-2 gap-4">
            <UCard v-for="link in quickLinks" :key="link.to">
              <NuxtLink :to="localePath(link.to)" class="flex items-center gap-3">
                <UIcon :name="link.icon" class="size-5 text-muted" />
                <span class="font-medium text-highlighted">{{ t(link.label) }}</span>
              </NuxtLink>
            </UCard>
          </div>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>
