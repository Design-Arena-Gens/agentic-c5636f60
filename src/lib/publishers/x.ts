import { PublishResult } from '@/types'

export async function publishToX(params: { mediaUrl: string, caption: string }): Promise<PublishResult> {
  const hasCreds = !!(process.env.X_OAUTH_TOKEN && process.env.X_OAUTH_TOKEN_SECRET && process.env.X_API_KEY && process.env.X_API_SECRET)
  if (!hasCreds) {
    return {
      platform: 'x',
      status: 'skipped',
      message: 'X/Twitter credentials not configured. Open compose with prefilled text.',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(params.caption)}`
    }
  }
  return {
    platform: 'x',
    status: 'error',
    message: 'Direct upload not implemented in demo. Provide OAuth creds and implement.'
  }
}
