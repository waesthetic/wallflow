<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const route = useRoute()

useHead({ title: t('auth.newPassword') })

const token = route.query.token as string
if (!token) await navigateTo(localePath('/login'))

const schema = z.object({
  password: z.string().min(8, t('auth.passwordTooShort')),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: t('auth.passwordsDoNotMatch'),
  path: ['confirm'],
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  password: undefined,
  confirm: undefined,
})

const isLoading = ref(false)
const isSuccess = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token, password: event.data.password },
    })
    isSuccess.value = true
  }
  catch (e: any) {
    toast.add({
      title: e?.data?.message || t('auth.genericError'),
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
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
            {{ t('auth.newPassword') }}
          </h1>
          <p class="text-muted">
            {{ t('auth.newPasswordDesc') }}
          </p>
        </Motion>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="isSuccess" class="py-16 text-center space-y-4">
            <UIcon name="i-lucide-shield-check" class="size-14 mx-auto text-primary" />
            <div class="space-y-1">
              <p class="text-xl font-semibold text-highlighted">{{ t('auth.passwordChanged') }}</p>
              <p class="text-muted text-sm">{{ t('auth.passwordChangedDesc') }}</p>
            </div>
            <UButton
              :to="localePath('/login')"
              color="secondary"
              trailing-icon="i-lucide-log-in"
            >
              {{ t('auth.login') }}
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
              :label="t('auth.newPassword')"
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

            <UFormField
              :label="t('auth.confirmPassword')"
              name="confirm"
              :ui="{
                label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                error: 'text-xs mt-1',
              }"
            >
              <UInput
                v-model="state.confirm"
                type="password"
                placeholder="••••••••"
                variant="none"
                size="xl"
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
                trailing-icon="i-lucide-shield-check"
                color="secondary"
                size="lg"
              >
                {{ t('auth.savePassword') }}
              </UButton>
            </div>
          </UForm>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>