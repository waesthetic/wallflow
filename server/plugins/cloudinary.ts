import { v2 as cloudinary } from 'cloudinary'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  cloudinary.config({
    cloud_name: config.public.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    long_url_signature: true
  })
})