import { PublishResult } from '@/types'

export async function publishToInstagram(params: { mediaUrl: string, caption: string }): Promise<PublishResult> {
  const hasCreds = !!(process.env.IG_USER_ACCESS_TOKEN && process.env.IG_BUSINESS_ACCOUNT_ID)
  if (!hasCreds) {
    return {
      platform: 'instagram',
      status: 'skipped',
      message: 'Instagram Graph API not configured. Opening upload page instead.',
      url: 'https://www.instagram.com/'
    }
  }
  return {
    platform: 'instagram',
    status: 'error',
    message: 'Direct upload not implemented in demo. Provide IG Graph API credentials.'
  }
}
