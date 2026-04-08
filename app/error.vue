<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const homeLink = navLinks.find(l => l.to === '/')
const contactLink = navLinks.find(l => l.to === '/contacts')

useHead({
  title: computed(() => t('page.error'))
})

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col items-center justify-center gap-10">
      <EyeFollowing />
      <UError
        class="min-h-0! py-8!"
        :error="{
          statusCode: error.statusCode,
          statusMessage: t('error.status'),
          message: error.statusCode === 404 ? t('error.notFound') : t('error.serverError')
        }"
        :ui="{ statusCode: 'text-4xl', statusMessage: 'text-base', message: 'text-sm' }"
      >
        <template #links>
          <div class="flex flex-col gap-2 w-full">
            <UButton
              :icon="homeLink?.icon"
              size="lg"
              variant="soft"
              :to="localePath(homeLink!.to)"
            >
              {{ t('error.goHome') }}
            </UButton>
            <UButton
              :icon="contactLink?.icon"
              size="lg"
              variant="ghost"
              color="neutral"
              :to="localePath(contactLink!.to)"
            >
              {{ t('error.contact') }}
            </UButton>
          </div>
        </template>
      </UError>
    </div>
  </UApp>
</template>