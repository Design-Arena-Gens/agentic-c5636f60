import Replicate from 'replicate'
import { GenerationRequest, GenerationResult } from '@/types'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

function randSeed() {
  return Math.floor(Math.random() * 10_000_000)
}

// Attempt Veo3/Sora2 via hypothetical endpoints if provided, else fallback to Replicate
export async function generateMedia(req: GenerationRequest): Promise<GenerationResult> {
  const seed = req.seed ?? randSeed()

  if (req.type === 'image') {
    // Hypothetical Veo3 image generation if configured
    if (process.env.VEO3_API_BASE && process.env.VEO3_API_KEY) {
      try {
        const res = await fetch(`${process.env.VEO3_API_BASE}/v1/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.VEO3_API_KEY}`
          },
          body: JSON.stringify({
            prompt: req.prompt,
            aspect_ratio: req.aspectRatio ?? '1:1',
            seed
          })
        })
        if (!res.ok) throw new Error(`Veo3 error ${res.status}`)
        const data = await res.json()
        if (!data?.url) throw new Error('Invalid Veo3 response')
        return { type: 'image', url: data.url, provider: 'veo3', info: { seed } }
      } catch (e) {
        // fall through to replicate fallback
      }
    }

    // Replicate fallback: FLUX Schnell or SDXL
    const output = await replicate.run(
      'black-forest-labs/flux-schnell:0c8d5a57d9819f67a3a79042f2e2f6a7a90e5ce32a5df4d4a135fecf2883d7b8',
      {
        input: {
          prompt: req.prompt,
          guidance: 3,
          num_inference_steps: 20,
          seed,
          aspect_ratio: req.aspectRatio ?? '1:1'
        }
      }
    ) as any

    const url = Array.isArray(output) ? output[0] : output
    return { type: 'image', url, provider: 'replicate-fallback', info: { seed } }
  }

  // Video generation
  if (process.env.SORA2_API_BASE && process.env.SORA2_API_KEY) {
    try {
      const res = await fetch(`${process.env.SORA2_API_BASE}/v1/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SORA2_API_KEY}`
        },
        body: JSON.stringify({
          prompt: req.prompt,
          duration: req.durationSeconds ?? 5,
          aspect_ratio: req.aspectRatio ?? '16:9',
          seed
        })
      })
      if (!res.ok) throw new Error(`Sora2 error ${res.status}`)
      const data = await res.json()
      if (!data?.url) throw new Error('Invalid Sora2 response')
      return { type: 'video', url: data.url, provider: 'sora2', info: { seed } }
    } catch (e) {
      // fall through
    }
  }

  // Replicate fallback: Pika or Zeroscope
  const vid = await replicate.run(
    'pika-art/pika-1-1:8a7b0a0df31a1c6a3d3f7e88dbf4f6c47f1d3f1d0a1e2f3b4c5d6e7f8a9b0c1d',
    {
      input: {
        prompt: req.prompt,
        guidance_scale: 3,
        num_frames: Math.max(16, Math.min(120, Math.floor((req.durationSeconds ?? 5) * 8))),
        aspect_ratio: req.aspectRatio ?? '16:9',
        seed
      }
    }
  ) as any

  const url = Array.isArray(vid) ? vid[0] : vid
  return { type: 'video', url, provider: 'replicate-fallback', info: { seed } }
}
