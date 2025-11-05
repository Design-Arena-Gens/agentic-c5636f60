import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PublishPlatform, PublishResult } from '@/types'
import { publishToX } from '@/lib/publishers/x'
import { publishToInstagram } from '@/lib/publishers/instagram'
import { publishToTiktok } from '@/lib/publishers/tiktok'
import { publishToYouTube } from '@/lib/publishers/youtube'
import { publishToFacebook } from '@/lib/publishers/facebook'
import { publishToLinkedIn } from '@/lib/publishers/linkedin'

const schema = z.object({
  mediaUrl: z.string().url(),
  caption: z.string().max(2200),
  platforms: z.array(z.enum(['x','instagram','tiktok','youtube','facebook','linkedin'] as const)),
  mediaType: z.enum(['image','video'])
})

type PublisherMap = Record<PublishPlatform, (p: { mediaUrl: string, caption: string }) => Promise<PublishResult>>

const publishers: PublisherMap = {
  x: publishToX,
  instagram: publishToInstagram,
  tiktok: publishToTiktok,
  youtube: publishToYouTube,
  facebook: publishToFacebook,
  linkedin: publishToLinkedIn,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = schema.parse(body)

    const tasks = input.platforms.map((p) => publishers[p]({ mediaUrl: input.mediaUrl, caption: input.caption }))
    const results = await Promise.all(tasks)

    return NextResponse.json({ results })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to publish' }, { status: 400 })
  }
}
