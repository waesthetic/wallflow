import { v2 as cloudinary } from "cloudinary"

export function getPreviewUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    type: 'private',
    sign_url: true,
    secure: true,
    width: 1280,
    quality: 70,
    crop: 'limit',
    fetch_format: 'auto'
  })
}

export function getPackZipUrl(fileNames: string[]): string {
  const publicIds = fileNames.map(name => name.replace(/\.[^/.]+$/, ''))

  return cloudinary.utils.download_zip_url({
    public_ids: publicIds,
    type: 'private',
    use_original_filename: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600
  })
}