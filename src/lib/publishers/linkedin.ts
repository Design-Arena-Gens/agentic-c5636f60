import { PublishResult } from '@/types'

export async function publishToLinkedIn(params: { mediaUrl: string, caption: string }): Promise<PublishResult> {
  const hasCreds = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
  if (!hasCreds) {
    return {
      platform: 'linkedin',
      status: 'skipped',
      message: 'LinkedIn API not configured. Opening share dialog with text only.',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(params.mediaUrl)}`
    }
  }
  return {
    platform: 'linkedin',
    status: 'error',
    message: 'Direct upload not implemented in demo. Provide LinkedIn credentials.'
  }
}
