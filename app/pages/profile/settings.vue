<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const toast = useToast()

const { user, fetch: fetchSession } = useUserSession()
const { data } = useFetch('/api/profile/providers')
const { $csrfFetch } = useNuxtApp()

const name = ref(user.value?.name ?? '')
const avatarUrl = ref(user.value?.avatarUrl ?? '')
const confirmEmail = ref('')
const deletionRequested = ref(false)

useHead({ title: t('settings.label') })

async function saveName() {
  try {
    await $csrfFetch('/api/profile/name', {
      method: 'PATCH',
      body: { name: name.value }
    })
    await fetchSession()
    toast.add({ title: t('settings.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('settings.error'), color: 'error' })
  }
}

async function saveAvatar() {
  try {
    await $csrfFetch('/api/profile/avatar', {
      method: 'PATCH',
      body: { avatarUrl: avatarUrl.value }
    })
    await fetchSession()
    toast.add({ title: t('settings.saved'), color: 'success' })
  } catch {
    toast.add({ title: t('settings.error'), color: 'error' })
  }
}

async function sendPasswordReset() {
  try {
    await $csrfFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: user.value?.email}
    })
    toast.add({ title: t('auth.emailSent'), color: 'success'}) 
  } catch {
    toast.add({ title: t('auth.genericError'), color: 'error'})
  }
}

async function requestDeletion() {
  try {
    await $csrfFetch('/api/auth/delete-request', {
      method: 'POST',
      body: { email: confirmEmail.value }
    })
    toast.add({ title: t('auth.emailSent'), color: 'success' })
    deletionRequested.value = true
  } catch {
    toast.add({ title: t('auth.genericError'), color: 'error' })
  }
}

const fileInput = useTemplateRef('fileInput')
const { upload: uploadAvatar, loading: avatarLoading, previewUrl, selectedFileName } = useAvatarUpload(async (url) => {
  avatarUrl.value = url
  await saveAvatar()
})
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
            :src="previewUrl || avatarUrl || undefined"
            :alt="user?.name ?? user?.email ?? ''"
            size="3xl"
            class="shrink-0 size-32 text-4xl"
          />
          <div class="space-y-1 pt-2">
            <p class="text-xs font-semibold uppercase tracking-widest text-muted">{{ t('settings.label') }}</p>
            <h1 class="text-4xl font-bold text-highlighted">{{ user?.name ?? user?.email }}</h1>
            <p class="text-sm text-muted">{{ user?.email }}</p>
          </div>
        </Motion>

        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0px)' }"
          :transition="{ duration: 0.5, delay: 0.15 }"
        >
          <div class="space-y-0 divide-y divide-accented">

            <div class="py-6 flex items-center justify-between gap-8">
              <div class="shrink-0 w-40">
                <p class="font-medium text-highlighted">{{ t('settings.name') }}</p>
              </div>
              <UInput v-model="name" :placeholder="t('auth.namePlaceholder')" class="flex-1" />
              <UButton variant="soft" @click="saveName()">{{ t('settings.save') }}</UButton>
            </div>

            <div class="py-6 flex items-center justify-between gap-8">
              <div class="shrink-0 w-40">
                <p class="font-medium text-highlighted">{{ t('settings.avatar') }}</p>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="uploadAvatar"
              />
              <UInput :model-value="selectedFileName" :placeholder="t('settings.avatarUrl')" class="flex-1" readonly />
              <UButton variant="soft" :loading="avatarLoading" @click="fileInput?.click()">
                {{ t('settings.upload') }}
              </UButton>
            </div>

            <div class="py-6 flex items-center justify-between gap-8">
              <div>
                <p class="font-medium text-highlighted">{{ t('settings.changePassword') }}</p>
                <p class="text-xs text-muted mt-1">{{ t('settings.changePasswordDesc') }}</p>
              </div>
              <p v-if="data?.providers?.length" class="text-sm text-muted">{{ t('settings.oauthPasswordNote') }}</p>
              <UButton v-else variant="soft" @click="sendPasswordReset()">{{ t('settings.changePassword') }}</UButton>
            </div>

            <div class="py-6 flex items-center justify-between gap-8">
              <div class="shrink-0 w-40">
                <p class="font-medium text-highlighted">{{ t('settings.connectedAccounts') }}</p>
              </div>
              <div class="flex-1 space-y-1">
                <div v-if="data?.providers?.length" class="space-y-1">
                  <div v-for="provider in data.providers" :key="provider.provider" class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="text-success size-4" />
                    <span class="capitalize text-sm text-highlighted">{{ provider.provider }}</span>
                  </div>
                </div>
                <p v-else class="text-sm text-muted">{{ t('settings.noConnectedAccounts') }}</p>
              </div>
            </div>

            <div v-if="deletionRequested" class="py-6">
              <p class="text-sm text-muted">{{ t('auth.emailSentDesc') }}</p>
            </div>

            <div v-else class="py-6 flex items-center justify-between gap-8">
              <div class="shrink-0 w-40">
                <p class="font-medium text-error">{{ t('settings.dangerZone') }}</p>
                <p class="text-xs text-muted mt-1">{{ t('settings.deleteAccountDesc') }}</p>
              </div>
              <UInput v-model="confirmEmail" :placeholder="t('settings.typeEmail')" class="flex-1" />
              <UButton color="error" @click="requestDeletion()">{{ t('settings.deleteAccount') }}</UButton>
            </div>

          </div>
        </Motion>

      </div>
    </UPageSection>
  </UPage>
</template>