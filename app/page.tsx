"use client"

import { useState } from 'react'
import Image from 'next/image'
import { GenerationResult, PublishPlatform } from '@/types'

const allPlatforms: { key: PublishPlatform, label: string }[] = [
  { key: 'x', label: 'X' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
]

export default function Home() {
  const [type, setType] = useState<'image'|'video'>('image')
  const [prompt, setPrompt] = useState('Ultra-detailed cyberpunk city skyline at dusk, cinematic lighting')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState(5)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [caption, setCaption] = useState('Crafted by AI ? #AI #Generative')
  const [selected, setSelected] = useState<PublishPlatform[]>(['x','instagram'])
  const [publishing, setPublishing] = useState(false)
  const [pubResults, setPubResults] = useState<any[] | null>(null)

  async function generate() {
    setLoading(true)
    setResult(null)
    setPubResults(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt, aspectRatio, durationSeconds: duration })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function publish() {
    if (!result) return
    setPublishing(true)
    setPubResults(null)
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaUrl: result.url, caption, platforms: selected, mediaType: result.type })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setPubResults(data.results)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setPublishing(false)
    }
  }

  function togglePlatform(key: PublishPlatform) {
    setSelected((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="text-2xl font-bold">Agentic Social Studio</div>
        <span className="ml-auto text-xs text-white/60">Models: Veo3, Sora2 (fallbacks auto-used if unavailable)</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="mb-4 flex gap-2">
            <button className={`btn ${type==='image' ? '' : 'bg-slate-700 hover:bg-slate-600'}`} onClick={()=>setType('image')}>Image</button>
            <button className={`btn ${type==='video' ? '' : 'bg-slate-700 hover:bg-slate-600'}`} onClick={()=>setType('video')}>Video</button>
          </div>

          <label className="block text-sm mb-2">Prompt</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded p-3 mb-4" rows={5} value={prompt} onChange={e=>setPrompt(e.target.value)} />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">Aspect Ratio</label>
              <select className="w-full bg-white/5 border border-white/10 rounded p-3" value={aspectRatio} onChange={e=>setAspectRatio(e.target.value)}>
                <option>1:1</option>
                <option>9:16</option>
                <option>16:9</option>
                <option>4:5</option>
              </select>
            </div>
            {type==='video' && (
              <div>
                <label className="block text-sm mb-2">Duration (sec)</label>
                <input type="range" min={2} max={15} value={duration} onChange={e=>setDuration(parseInt(e.target.value))} className="w-full" />
                <div className="text-xs mt-1">{duration}s</div>
              </div>
            )}
          </div>

          <button className="btn" onClick={generate} disabled={loading}>
            {loading ? 'Generating?' : 'Generate'}
          </button>

          {result && (
            <div className="mt-6 text-xs text-white/70">
              Provider: <span className="font-mono">{result.provider}</span>
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 font-semibold">Preview</div>
          {!result && <div className="text-white/60 text-sm">No media yet. Generate to preview.</div>}
          {result && result.type==='image' && (
            <div className="relative aspect-video">
              <Image src={result.url} alt="generated" fill className="object-contain rounded" />
            </div>
          )}
          {result && result.type==='video' && (
            <video src={result.url} controls className="w-full rounded" />
          )}
        </div>
      </div>

      <div className="card mt-6 p-5">
        <div className="mb-3 font-semibold">Publish</div>
        <label className="block text-sm mb-2">Caption</label>
        <textarea className="w-full bg-white/5 border border-white/10 rounded p-3 mb-4" rows={3} value={caption} onChange={e=>setCaption(e.target.value)} />
        <div className="flex flex-wrap gap-2 mb-4">
          {allPlatforms.map(p => (
            <button key={p.key} className={`px-3 py-2 rounded border ${selected.includes(p.key) ? 'bg-brand-600 border-brand-500' : 'bg-white/5 border-white/10'}`} onClick={()=>togglePlatform(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
        <button className="btn" onClick={publish} disabled={!result || publishing}>
          {publishing ? 'Publishing?' : 'One-click Publish'}
        </button>

        {pubResults && (
          <div className="mt-4 space-y-2">
            {pubResults.map((r, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold capitalize">{r.platform}:</span> {r.status}
                {r.url && <a href={r.url} target="_blank" className="ml-2 underline text-white/90">Open</a>}
                {r.message && <span className="ml-2 text-white/60">? {r.message}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-white/50">
        Tip: Set env `REPLICATE_API_TOKEN` to enable generation fallback. Optional: `VEO3_API_BASE`/`VEO3_API_KEY` and `SORA2_API_BASE`/`SORA2_API_KEY` for direct model access.
      </div>
    </div>
  )
}
