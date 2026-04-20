const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5

export function useAvatarUpload(onSuccess: (url: string) => Promise<void>) {
  const { t } = useI18n()
  const toast = useToast()
  const cloudName = useRuntimeConfig().public.cloudinaryCloudName

  const loading = ref(false)
  const previewUrl = ref('')
  const selectedFileName = ref('')

  async function upload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    if (!ALLOWED_MIME.includes(file.type)) {
      toast.add({ title: t('settings.invalidFileType'), color: 'error' })
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.add({ title: t('settings.fileTooLarge'), color: 'error' })
      return
    }

    loading.value = true
    previewUrl.value = URL.createObjectURL(file)
    selectedFileName.value = file.name

    try {
      const { signature, timestamp, folder, apiKey } = await $fetch<{
        signature: string
        timestamp: number
        folder: string
        apiKey: string
      }>('/api/profile/avatar/sign', { method: 'POST' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', apiKey)
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('folder', folder)

      const res = await $fetch<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )

      await onSuccess(res.secure_url)
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    } catch {
      toast.add({ title: t('settings.error'), color: 'error' })
    } finally {
      loading.value = false
    }
  }

  return { upload, loading, previewUrl, selectedFileName }
}
