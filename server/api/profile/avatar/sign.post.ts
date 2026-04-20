import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const config = useRuntimeConfig()
  const timestamp = Math.round(Date.now() / 1000)
  const params = { timestamp, folder: 'avatars' }

  const signature = cloudinary.utils.api_sign_request(params, config.cloudinaryApiSecret)

  return {
    signature,
    timestamp,
    folder: 'avatars',
    apiKey: config.cloudinaryApiKey,
  }
})
