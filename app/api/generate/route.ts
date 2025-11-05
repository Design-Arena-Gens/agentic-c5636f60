import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateMedia } from '@lib/generate'

const schema = z.object({
  type: z.enum(['image', 'video']),
  prompt: z.string().min(3),
  aspectRatio: z.string().optional(),
  durationSeconds: z.number().int().min(1).max(30).optional(),
  seed: z.number().int().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = schema.parse(body)
    const result = await generateMedia(input)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to generate' }, { status: 400 })
  }
}
