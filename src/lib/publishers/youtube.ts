import { PublishResult } from '@/types'

export async function publishToYouTube(params: { mediaUrl: string, caption: string }): Promise<PublishResult> {
  const hasCreds = !!(process.env.YT_API_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS)
  if (!hasCreds) {
    return {
      platform: 'youtube',
      status: 'skipped',
      message: 'YouTube API not configured. Opening upload page instead.',
      url: 'https://www.youtube.com/upload'
    }
  }
  return {
    platform: 'youtube',
    status: 'error',
    message: 'Direct upload not implemented in demo. Provide YouTube API credentials.'
  }
}
