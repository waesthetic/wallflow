<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

useHead({ title: t('settings.deleteAccount') })

const { error } = await useFetch(`/api/auth/delete-confirm`, {
  method: 'POST',
  body: { token: route.query.token },
  server: false
})

if (!error.value) {
  const { clear } = useUserSession()
  await clear()
  await navigateTo(localePath('/'))
}
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-sm mx-auto text-center space-y-4">
      
      <template v-if="error">
        <UIcon name="i-lucide-circle-x" class="size-14 mx-auto text-error" />
        <div class="space-y-1">
          <p class="text-xl font-semibold">{{ t('auth.accountDeleteFailed') }}</p>
          <p class="text-muted text-sm">{{ t('auth.accountDeleteFailedDesc') }}</p>
        </div>
        <UButton
          :to="localePath('/login')"
          color="secondary"
          trailing-icon="i-lucide-log-in"
        >
          {{ t('auth.login') }}
        </UButton>
      </template>

      <template v-else>
        <UIcon name="i-lucide-loader-circle" class="size-14 mx-auto text-primary animate-spin" />
        <p class="text-muted text-sm">{{ t('auth.redirecting') }}</p>
      </template>
    </div>
  </UContainer>
</template>