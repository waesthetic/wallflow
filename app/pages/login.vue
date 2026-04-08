<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const route = useRoute()

useHead({ title: t('auth.login') })

onMounted(() => {
  if (route.query.error === 'oauth_failed') {
    toast.add({ title: t('auth.oauthFailed'), color: 'error', icon: 'i-lucide-circle-x' })
  }

  if (route.query.error === 'no_email') {
    toast.add({ title: t('auth.noEmail'), color: 'error', icon: 'i-lucide-circle-x' })
  }
})

const schema = z.object({
  email: z.email(t('auth.invalidEmail')),
  password: z.string().min(8, t('auth.enterPassword')),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const isLoading = ref(false)
const oauthLoading = ref<string | null>(null)
const { fetch: refreshSession } = useUserSession()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: event.data })
    await refreshSession()
    await navigateTo(localePath('/profile'))
  }
  catch (e: any) {
    toast.add({
      title: e?.data?.message || t('auth.loginError'),
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
  }
  finally {
    isLoading.value = false
  }
}

function loginWith(provider: 'google' | 'github') {
  oauthLoading.value = provider
  navigateTo(`/auth/${provider}`, { external: true })
}
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="w-full max-w-sm mx-auto">

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5 }"
          class="mb-10 space-y-2"
        >
          <p class="text-xs font-semibold uppercase tracking-widest text-muted">
            {{ t('auth.welcome') }}
          </p>
          <h1 class="text-4xl font-bold text-highlighted">
            {{ t('auth.login') }}
          </h1>
          <p class="text-muted">
            {{ t('auth.noAccount') }}
            <ULink :to="localePath('/auth/register')" class="text-primary hover:underline font-medium">
              {{ t('auth.register') }}
            </ULink>
          </p>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.1 }"
        >
          <div class="space-y-3 mb-8">
            <UButton
              color="neutral"
              variant="outline"
              block
              size="lg"
              :loading="oauthLoading === 'google'"
              :disabled="!!oauthLoading"
              @click="loginWith('google')"
            >
              <template #leading>
                <UIcon name="i-simple-icons-google" />
              </template>
              {{ t('auth.loginWithGoogle') }}
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              block
              size="lg"
              :loading="oauthLoading === 'github'"
              :disabled="!!oauthLoading"
              @click="loginWith('github')"
            >
              <template #leading>
                <UIcon name="i-simple-icons-github" />
              </template>
              {{ t('auth.loginWithGithub') }}
            </UButton>
          </div>

          <div class="flex items-center gap-4 mb-8">
            <div class="flex-1 h-px bg-accented" />
            <span class="text-xs uppercase tracking-widest text-muted">{{ t('auth.or') }}</span>
            <div class="flex-1 h-px bg-accented" />
          </div>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.2 }"
        >
          <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
            <UFormField
              :label="t('auth.email')"
              name="email"
              :ui="{
                label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                error: 'text-xs mt-1',
              }"
            >
              <UInput
                v-model="state.email"
                type="email"
                placeholder="you@example.com"
                variant="none"
                size="xl"
                autocomplete="email"
                class="w-full"
                :ui="{
                  base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full',
                }"
              />
            </UFormField>

            <UFormField
              :label="t('auth.password')"
              name="password"
              :ui="{
                label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                error: 'text-xs mt-1',
              }"
            >
              <template #hint>
                <ULink
                  :to="localePath('/auth/forgot-password')"
                  class="text-xs text-muted hover:text-primary transition-colors"
                >
                  {{ t('auth.forgotPassword') }}
                </ULink>
              </template>
              <UInput
                v-model="state.password"
                type="password"
                placeholder="••••••••"
                variant="none"
                size="xl"
                autocomplete="current-password"
                class="w-full"
                :ui="{
                  base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full',
                }"
              />
            </UFormField>

            <div class="pt-4 flex justify-end">
              <UButton
                type="submit"
                :loading="isLoading"
                trailing-icon="i-lucide-log-in"
                color="secondary"
                size="lg"
              >
                {{ t('auth.login') }}
              </UButton>
            </div>
          </UForm>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>