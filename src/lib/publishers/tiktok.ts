import { PublishResult } from '@/types'

export async function publishToTiktok(params: { mediaUrl: string, caption: string }): Promise<PublishResult> {
  const hasCreds = !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET)
  if (!hasCreds) {
    return {
      platform: 'tiktok',
      status: 'skipped',
      message: 'TikTok API not configured. Opening upload page instead.',
      url: 'https://www.tiktok.com/upload?lang=en'
    }
  }
  return {
    platform: 'tiktok',
    status: 'error',
    message: 'Direct upload not implemented in demo. Provide TikTok credentials.'
  }
}
