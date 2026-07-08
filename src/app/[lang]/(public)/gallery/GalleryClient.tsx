'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Icons } from '@/lib/icons'
import type { Locale } from '@/dictionaries'
import type { GalleryDocument, GalleryCategory } from '@/types/gallery.types'

interface Props {
  lang: Locale
  t: { all: string; factory: string; production: string; products: string; packaging: string; exhibitions: string }
  config: GalleryDocument
}

export default function GalleryClient({ lang, t, config }: Props) {
  const [active, setActive] = useState<GalleryCategory | 'all'>('all')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const cats: { key: GalleryCategory | 'all'; label: string }[] = [
    { key: 'all', label: t.all },
    { key: 'factory', label: t.factory },
    { key: 'production', label: t.production },
    { key: 'products', label: t.products },
    { key: 'packaging', label: t.packaging },
    { key: 'exhibitions', label: t.exhibitions },
  ]

  // Sort by order and filter by status (backward compatible: missing status implies published)
  const sortedItems = [...config.items]
    .filter(item => !item.status || item.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const filtered = active === 'all' ? sortedItems : sortedItems.filter((g) => g.category === active)

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
        {cats.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: active === c.key ? 'none' : '1.5px solid rgba(22,157,247,0.3)',
              background: active === c.key ? '#169DF7' : 'white',
              color: active === c.key ? 'white' : '#374151',
              fontWeight: active === c.key ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="masonry-grid">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="masonry-item"
            onClick={() => setLightbox(item.src)}
            title={item.alt?.[lang] || (lang === 'ar' ? (item as any).altAr : (item as any).altEn)}
          >
            <Image
              src={item.src}
              alt={item.alt?.[lang] || (lang === 'ar' ? (item as any).altAr : (item as any).altEn)}
              width={400}
              height={item.order % 3 === 0 ? 400 : 260} // Pseudo-random span
              style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.3s ease' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox} alt="Lightbox" width={1200} height={800} style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '1rem' }} />
            <button
              onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: '-2rem', right: 0, background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              <Icons.XCircle size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
