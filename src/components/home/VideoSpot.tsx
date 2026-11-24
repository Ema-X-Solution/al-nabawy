'use client'

import Image from 'next/image'
import { useState, type ReactNode } from 'react'

interface Props {
  poster: string
  videoUrl?: string
  alt: string
  height?: number
  mobileAspect?: string
  overlay?: ReactNode
}

export default function VideoSpot({ poster, videoUrl, alt, height = 380, mobileAspect = '3 / 2', overlay }: Props) {
  const frameVars = { '--vs-h': `${height}px`, '--vs-aspect': mobileAspect } as React.CSSProperties
  const [playing, setPlaying] = useState(false)

  if (playing && videoUrl) {
    return (
      <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.2)' }}>
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="videospot-media"
          style={{ ...frameVars, width: '100%', objectFit: 'cover', display: 'block', background: '#000' }}
        />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.2)' }}>
      <Image
        src={poster}
        alt={alt}
        width={1200}
        height={Math.round(height * 2)}
        className="videospot-media"
        style={{ ...frameVars, width: '100%', objectFit: 'cover' }}
      />
      {videoUrl && (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => setPlaying(true)}
          style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(22,157,247,0.1)', border: 'none', cursor: 'pointer',
          }}
        >
          <span
            style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(22,157,247,0.4)', transition: 'transform 0.2s ease',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#169DF7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
      {overlay}
    </div>
  )
}
