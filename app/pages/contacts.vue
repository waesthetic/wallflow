<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

useHead({
    title: t('page.contacts')
})

const schema = z.object({
  firstName: z.string(t('contact.firstNameRequired')),
  lastName: z.string(t('contact.lastNameRequired')),
  email: z.email(t('contact.emailInvalid')),
  message: z.string(t('contact.messageRequired')).min(8, t('contact.messageMin')).max(1000, t('contact.messageMax'))
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  message: undefined
})

const isLoading = ref(false)
const isSuccess = ref(false)

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: event.data
    })

    isSuccess.value = true

    toast.add({
      title: t('contact.messageSent'),
      description: t('contact.messageSentDescription'),
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  
  } catch {
    toast.add({
      title: t('contact.messageError'),
      description: t('contact.messageErrorDescription'),
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  isSuccess.value = false
  Object.assign(state, {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    message: undefined
  })
}
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="w-full max-w-xl mx-auto">

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5 }"
          class="mb-10 space-y-2"
        >
          <p class="text-xs font-semibold uppercase tracking-widest text-muted">
            {{ t('nav.contacts') }}
          </p>
          <h1 class="text-4xl font-bold text-highlighted">
            {{ t('contact.title') }}
          </h1>
          <p class="text-muted">
            {{ t('contact.responseTime') }}
          </p>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.15 }"
        >
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="isSuccess" class="py-16 text-center space-y-4">
              <UIcon name="i-lucide-circle-check" class="size-14 mx-auto text-primary" />
              <div class="space-y-1">
                <p class="text-xl font-semibold text-highlighted">{{ t('contact.messageSent') }}</p>
                <p class="text-muted text-sm">{{ t('contact.messageSentDescription') }}</p>
              </div>
              <UButton
                variant="ghost"
                color="secondary"
                leading-icon="i-lucide-arrow-left"
                @click="resetForm"
              >
                {{ t('auth.back') }}
              </UButton>
            </div>
          </Transition>

          <UForm
            v-if="!isSuccess"
            :schema="schema"
            :state="state"
            class="space-y-6"
            @submit="onSubmit"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <UFormField
                :label="t('contact.firstName')"
                name="firstName"
                required
                :ui="{
                  label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                  error: 'text-xs mt-1'
                }"
              >
                <UInput
                  v-model="state.firstName"
                  variant="none"
                  size="xl"
                  class="w-full"
                  :ui="{
                    base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full'
                  }"
                />
              </UFormField>

              <UFormField
                :label="t('contact.lastName')"
                name="lastName"
                required
                :ui="{
                  label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                  error: 'text-xs mt-1'
                }"
              >
                <UInput
                  v-model="state.lastName"
                  variant="none"
                  size="xl"
                  class="w-full"
                  :ui="{
                    base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full'
                  }"
                />
              </UFormField>
            </div>

            <UFormField
              :label="t('contact.email')"
              name="email"
              required
              :ui="{
                label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                error: 'text-xs mt-1'
              }"
            >
              <UInput
                v-model="state.email"
                type="email"
                variant="none"
                size="xl"
                class="w-full"
                :ui="{
                  base: 'border-b border-accented rounded-none px-0 transition-colors focus-within:border-primary w-full'
                }"
              />
            </UFormField>

            <UFormField
              :label="t('contact.message')"
              name="message"
              :hint="`${state.message?.length ?? 0}/1000`"
              required
              :ui="{
                label: 'text-xs uppercase tracking-widest font-semibold text-muted',
                hint: 'text-muted text-xs tabular-nums',
                error: 'text-xs mt-1'
              }"
            >
              <div class="w-full border-b border-accented transition-colors focus-within:border-primary">
                <UTextarea
                  v-model="state.message"
                  variant="none"
                  :rows="4"
                  autoresize
                  class="w-full"
                  :ui="{ base: 'w-full px-0 resize-none' }"
                />
              </div>
            </UFormField>

            <div class="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p class="text-xs text-muted">
                {{ t('contact.privacyNote') }}
              </p>
              <UButton
                type="submit"
                :loading="isLoading"
                trailing-icon="i-lucide-send"
                :ui="{ trailingIcon: 'size-4' }"
                color="secondary"
                size="lg"
              >
                {{ t('contact.send') }}
              </UButton>
            </div>
          </UForm>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>