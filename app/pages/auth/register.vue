<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()

useHead({ title: t('auth.register') })

const schema = z.object({
  name: z.string().min(2, t('auth.nameTooShort')).optional(),
  email: z.email(t('auth.invalidEmail')),
  password: z.string().min(8, t('auth.passwordTooShort')),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
})

const isLoading = ref(false)
const isSuccess = ref(false)
const { $csrfFetch } = useNuxtApp()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await $csrfFetch('/api/auth/register', { method: 'POST', body: event.data })
    isSuccess.value = true
  }
  catch (e: any) {
    toast.add({
      title: t('auth.registerError'),
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
  }
  finally {
    isLoading.value = false
  }
}

function loginWith(provider: 'google' | 'github') {
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
            {{ t('auth.newAccount') }}
          </p>
          <h1 class="text-4xl font-bold text-highlighted">
            {{ t('auth.register') }}
          </h1>
          <p class="text-muted">
            {{ t('auth.haveAccount') }}
            <ULink :to="localePath('/login')" class="text-primary hover:underline font-medium">
              {{ t('auth.login') }}
            </ULink>
          </p>
        </Motion>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="isSuccess" class="py-16 text-center space-y-4">
            <UIcon name="i-lucide-mail-check" class="size-14 mx-auto text-primary" />
            <div class="space-y-1">
              <p class="text-xl font-semibold text-highlighted">{{ t('auth.checkEmail') }}</p>
              <p class="text-muted text-sm">{{ t('auth.checkEmailDesc') }}</p>
            </div>
            <UButton
              :to="localePath('/login')"
              variant="ghost"
              color="secondary"
              leading-icon="i-lucide-arrow-left"
            >
              {{ t('auth.backToLogin') }}
            </UButton>
          </div>
        </Transition>

        <template v-if="!isSuccess">
          <Motion
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :animate="{ opacity: 1, transform: 'translateY(0px)' }"
            :transition="{ duration: 0.5, delay: 0.1 }"
          >
            <div class="space-y-3 mb-8">
              <UButton color="neutral" variant="outline" block size="lg" @click="loginWith('google')">
                <template #leading><UIcon name="i-simple-icons-google" /></template>
                {{ t('auth.loginWithGoogle') }}
              </UButton>
              <UButton color="neutral" variant="outline" block size="lg" @click="loginWith('github')">
                <template #leading><UIcon name="i-simple-icons-github" /></template>
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
                :label="t('auth.name')"
                name="name"
                :ui="{
                  label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                  error: 'text-xs mt-1',
                }"
              >
                <UInput
                  v-model="state.name"
                  :placeholder="t('auth.namePlaceholder')"
                  variant="none"
                  size="xl"
                  autocomplete="name"
                  class="w-full"
                  :ui="{
                    base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full',
                  }"
                />
              </UFormField>

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
                <UInput
                  v-model="state.password"
                  type="password"
                  :placeholder="t('auth.passwordPlaceholder')"
                  variant="none"
                  size="xl"
                  autocomplete="new-password"
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
                  trailing-icon="i-lucide-user-plus"
                  color="secondary"
                  size="lg"
                >
                  {{ t('auth.register') }}
                </UButton>
              </div>
            </UForm>
          </Motion>
        </template>

      </div>
    </UPageSection>
  </UPage>
</template>