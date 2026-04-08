<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()

useHead({ title: t('auth.forgotPassword') })

const schema = z.object({
  email: z.email(t('auth.invalidEmail')),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ email: undefined })
const isLoading = ref(false)
const isSuccess = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await $fetch('/api/auth/forgot-password', { method: 'POST', body: event.data })
    isSuccess.value = true
  }
  catch {
    toast.add({ title: t('auth.genericError'), color: 'error', icon: 'i-lucide-circle-x' })
  }
  finally {
    isLoading.value = false
  }
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
            {{ t('auth.account') }}
          </p>
          <h1 class="text-4xl font-bold text-highlighted">
            {{ t('auth.forgotPassword') }}
          </h1>
          <p class="text-muted">
            {{ t('auth.forgotPasswordDesc') }}
          </p>
        </Motion>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="isSuccess" class="py-16 text-center space-y-4">
            <UIcon name="i-lucide-send" class="size-14 mx-auto text-primary" />
            <div class="space-y-1">
              <p class="text-xl font-semibold text-highlighted">{{ t('auth.emailSent') }}</p>
              <p class="text-muted text-sm">{{ t('auth.emailSentDesc') }}</p>
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

        <Motion
          v-if="!isSuccess"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.15 }"
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
                class="w-full"
                :ui="{
                  base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full',
                }"
              />
            </UFormField>

            <div class="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <UButton
                :to="localePath('/login')"
                variant="ghost"
                color="secondary"
                leading-icon="i-lucide-arrow-left"
              >
                {{ t('auth.back') }}
              </UButton>
              <UButton
                type="submit"
                :loading="isLoading"
                trailing-icon="i-lucide-send"
                color="secondary"
                size="lg"
              >
                {{ t('auth.sendLink') }}
              </UButton>
            </div>
          </UForm>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>