'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { Locale } from '@/dictionaries'

type Category = 'all' | 'factory' | 'production' | 'products' | 'packaging' | 'exhibitions'

interface GalleryItem {
  src: string
  alt: string
  cat: Category
  span?: boolean
}

const galleryItems: GalleryItem[] = [
  { src: '/images/factory.png', alt: 'Factory interior', cat: 'factory', span: true },
  { src: '/images/cat_milk.png', alt: 'Milk products', cat: 'products' },
  { src: '/images/cat_cheese.png', alt: 'Cheese products', cat: 'products' },
  { src: '/images/factory.png', alt: 'Production line', cat: 'production' },
  { src: '/images/cat_butter.png', alt: 'Butter products', cat: 'products' },
  { src: '/images/cat_cream.png', alt: 'Cream products', cat: 'products' },
  { src: '/images/factory.png', alt: 'Packaging area', cat: 'packaging', span: true },
  { src: '/images/cat_milk.png', alt: 'Milk cartons packaging', cat: 'packaging' },
  { src: '/images/factory.png', alt: 'Quality control lab', cat: 'factory' },
  { src: '/images/cat_cheese.png', alt: 'Cheese production', cat: 'production' },
  { src: '/images/cat_milk.png', alt: 'Exhibition booth', cat: 'exhibitions', span: true },
  { src: '/images/factory.png', alt: 'Export loading', cat: 'packaging' },
]

interface Props {
  lang: Locale
  t: { all: string; factory: string; production: string; products: string; packaging: string; exhibitions: string }
}

export default function GalleryClient({ lang, t }: Props) {
  const [active, setActive] = useState<Category>('all')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const cats: { key: Category; label: string }[] = [
    { key: 'all', label: t.all },
    { key: 'factory', label: t.factory },
    { key: 'production', label: t.production },
    { key: 'products', label: t.products },
    { key: 'packaging', label: t.packaging },
    { key: 'exhibitions', label: t.exhibitions },
  ]

  const filtered = active === 'all' ? galleryItems : galleryItems.filter((g) => g.cat === active)

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
        {filtered.map((item, i) => (
          <div
            key={i}
            className="masonry-item"
            onClick={() => setLightbox(item.src)}
            title={item.alt}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={400}
              height={item.span ? 400 : 260}
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
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
