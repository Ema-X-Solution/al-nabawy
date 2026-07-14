'use client'

import React, { useState } from 'react'
import type { ProductDocument, LocalizedString } from '@/types/products.types'
import type { CategoryDocument } from '@/types/categories.types'
import { saveProduct } from '@/app/actions/productsActions'
import MediaPicker from '@/components/admin/MediaPicker'
import { useRouter } from 'next/navigation'

interface Props {
  initialProduct?: ProductDocument
  categories: CategoryDocument[]
  lang: string
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'tr', label: 'Turkish' },
  { code: 'pl', label: 'Polish' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' }
] as const

const emptyLocString = (): LocalizedString => ({ en: '', ar: '', tr: '', pl: '', de: '', fr: '' })

export default function ProductEditorClient({ initialProduct, categories, lang }: Props) {
  const router = useRouter()
  // Try to default to the first available category if it exists
  const defaultCat = categories.length > 0 ? categories[0].id : 'milk'
  
  const [product, setProduct] = useState<ProductDocument>(initialProduct || {
    id: '', slug: '', category: defaultCat, image: '', status: 'draft', featured: false,
    name: emptyLocString(), description: emptyLocString(),
    packaging: emptyLocString(), weight: emptyLocString(), shelfLife: emptyLocString(),
    storage: emptyLocString(), origin: emptyLocString(),
    createdAt: 0, updatedAt: 0
  })
  const [isSaving, setIsSaving] = useState(false)
  const [activeLang, setActiveLang] = useState<keyof LocalizedString>('en')

  const patch = (key: keyof ProductDocument, value: any) => {
    setProduct(prev => ({ ...prev, [key]: value }))
  }

  const patchLoc = (field: keyof ProductDocument, value: string) => {
    setProduct(prev => ({ ...prev, [field]: { ...(prev[field] as LocalizedString), [activeLang]: value } }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await saveProduct(product)
    setIsSaving(false)
    if (res.success) {
      router.push(`/${lang}/admin/products`)
      router.refresh()
    } else {
      alert(res.error || 'Failed to save')
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box'
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase'
  }
  const cardStyle: React.CSSProperties = {
    background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '24px'
  }

  const isRtl = activeLang === 'ar'

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
      
      {/* ── 1. BASIC INFO ─────────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          Basic Info
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Internal Slug (URL)</label>
            <input style={fieldStyle} value={product.slug} onChange={e => patch('slug', e.target.value)} placeholder="e.g. uht-full-cream-milk" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={fieldStyle} value={product.category} onChange={e => patch('category', e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name.en || c.name.ar}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={fieldStyle} value={product.status} onChange={e => patch('status', e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '28px' }}>
            <input 
              type="checkbox" 
              id="featured-toggle"
              checked={product.featured} 
              onChange={e => patch('featured', e.target.checked)} 
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="featured-toggle" style={{ fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Featured Product</label>
          </div>
        </div>
      </div>

      {/* ── 2. MEDIA ──────────────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          Product Image
        </h2>
        <MediaPicker 
          value={product.image ? { secure_url: product.image, public_id: '' } as any : undefined}
          folder="products"
          onChange={asset => patch('image', asset?.secure_url || '')}
        />
      </div>

      {/* ── LANGUAGE TABS ───────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => setActiveLang(l.code as any)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', border: 'none',
              background: activeLang === l.code ? '#169DF7' : '#e5e7eb',
              color: activeLang === l.code ? 'white' : '#374151'
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* ── 3. CONTENT ──────────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          Content ({LANGUAGES.find(l => l.code === activeLang)?.label})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Product Name</label>
            <input style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr'}} value={product.name[activeLang]} onChange={e => patchLoc('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Full Description</label>
            <textarea 
              style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr', minHeight: '120px', resize: 'vertical'}} 
              value={product.description[activeLang]} 
              onChange={e => patchLoc('description', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* ── 4. SPECIFICATIONS ─────────────────────── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          Specifications ({LANGUAGES.find(l => l.code === activeLang)?.label})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Packaging</label>
            <input style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr'}} value={product.packaging[activeLang]} onChange={e => patchLoc('packaging', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Weight / Sizes</label>
            <input style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr'}} value={product.weight[activeLang]} onChange={e => patchLoc('weight', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Shelf Life</label>
            <input style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr'}} value={product.shelfLife[activeLang]} onChange={e => patchLoc('shelfLife', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Storage Conditions</label>
            <input style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr'}} value={product.storage[activeLang]} onChange={e => patchLoc('storage', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Origin</label>
            <input style={{...fieldStyle, direction: isRtl ? 'rtl' : 'ltr'}} value={product.origin[activeLang]} onChange={e => patchLoc('origin', e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Floating Save Bar ────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: '#111', color: 'white', padding: '12px 20px', borderRadius: '9999px',
        display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.24)', zIndex: 100
      }}>
        <button onClick={() => router.push(`/${lang}/admin/products`)} style={{ background: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
        <button onClick={handleSave} disabled={isSaving} style={{ background: '#169DF7', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer' }}>
          {isSaving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </div>
  )
}
