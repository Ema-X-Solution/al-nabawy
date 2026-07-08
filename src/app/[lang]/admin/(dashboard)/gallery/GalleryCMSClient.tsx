'use client'

import React, { useState } from 'react'
import { Icons } from '@/lib/icons'
import Image from 'next/image'
import type { GalleryDocument, GalleryItem, GalleryCategory } from '@/types/gallery.types'
import { saveGalleryConfig } from '@/app/actions/galleryActions'
import MediaPicker from '@/components/admin/MediaPicker'
import ContentEditor from '@/components/admin/ContentEditor'
import { emptyLocStr } from '@/types/gallery.types'
import type { MediaAssetMetadata } from '@/lib/media/mediaSystem'

interface Props { initialConfig: GalleryDocument }

const CATEGORIES: { key: GalleryCategory; label: string; color: string }[] = [
  { key: 'factory',     label: 'Factory',     color: '#3b82f6' },
  { key: 'production',  label: 'Production',  color: '#8b5cf6' },
  { key: 'products',    label: 'Products',    color: '#10b981' },
  { key: 'packaging',   label: 'Packaging',   color: '#f59e0b' },
  { key: 'exhibitions', label: 'Exhibitions', color: '#ef4444' },
]

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
  fontSize: '13px', fontFamily: 'Poppins, sans-serif', color: '#111827',
  background: '#fff', boxSizing: 'border-box', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
  color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase',
}

export default function GalleryCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<GalleryDocument>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [filterCat, setFilterCat] = useState<GalleryCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Modal states
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const patchMeta = (key: keyof GalleryDocument, value: any) =>
    setConfig(prev => ({ ...prev, [key]: value }))

  const patchItem = (id: string, updates: Partial<GalleryItem>) =>
    setConfig(prev => ({ ...prev, items: prev.items.map(i => i.id === id ? { ...i, ...updates } : i) }))

  const addItem = () => {
    const newItem: GalleryItem = {
      id: `g_${Date.now()}`,
      src: '', alt: emptyLocStr(),
      category: 'factory', order: config.items.length,
      status: 'published', featured: false,
    }
    setConfig(prev => ({ ...prev, items: [...prev.items, newItem] }))
    setEditingId(newItem.id)
  }

  const removeItem = (id: string) => {
    setConfig(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id).map((item, idx) => ({ ...item, order: idx }))
    }))
    setDeleteTarget(null)
    if (editingId === id) setEditingId(null)
  }

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveGalleryConfig(config)
    setIsSaving(false)
    if (res.success) window.location.reload()
    else alert(res.error || 'Failed to save.')
  }

  const filtered = config.items
    .filter(i => filterCat === 'all' || i.category === filterCat)
    .filter(i => filterStatus === 'all' || i.status === filterStatus)
    .filter(i => search === '' || Object.values(i.alt || {}).some(val => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => a.order - b.order)

  const editingItem = config.items.find(i => i.id === editingId) || null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px' }}>

      {/* Hero Banner */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.ImageIcon size={16} color="#169DF7" /> Hero Banner</h3>
        <ContentEditor label="Page Title" value={config.heroTitle} onChange={val => patchMeta('heroTitle', val)} required />
        <ContentEditor label="Subtitle" value={config.heroSub} onChange={val => patchMeta('heroSub', val)} />
      </div>

      {/* Gallery Items */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* List Panel */}
        <div style={{ flex: 1 }}>
          {/* List Toolbar */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Gallery Images</span>
                <span style={{ background: '#f3f4f6', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{config.items.length}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ background: '#169DF7', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  {isSaving ? 'Saving...' : <><Icons.Download size={14} /> Save All</>}
                </button>
                <button
                  onClick={addItem}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  + Add Image
                </button>
              </div>
            </div>

            {/* Search + Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                placeholder="Search by alt text..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...fieldStyle, width: '200px' }}
              />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} style={{ ...fieldStyle, width: 'auto' }}>
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[{ key: 'all', label: 'All', color: '#6b7280' }, ...CATEGORIES.map(c => ({ key: c.key, label: c.label, color: c.color }))].map(cat => (
                  <button key={cat.key} onClick={() => setFilterCat(cat.key as any)} style={{
                    padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, border: 'none',
                    background: filterCat === cat.key ? cat.color : '#f3f4f6',
                    color: filterCat === cat.key ? 'white' : '#374151',
                    cursor: 'pointer'
                  }}>{cat.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
            {filtered.map(item => {
              const catMeta = CATEGORIES.find(c => c.key === item.category)
              const isSelected = editingId === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setEditingId(isSelected ? null : item.id)}
                  style={{
                    background: 'white', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${isSelected ? '#169DF7' : '#e5e7eb'}`,
                    boxShadow: isSelected ? '0 0 0 4px rgba(22,157,247,0.12)' : '0 1px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ height: '140px', position: 'relative', background: '#f3f4f6' }}>
                    {item.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.src} alt={item.alt?.en || 'Gallery Image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#d1d5db' }}>
                        <Icons.ImageIcon size={32} />
                      </div>
                    )}
                    {/* Category badge */}
                    <div style={{ position: 'absolute', top: 8, left: 8, background: catMeta?.color || '#6b7280', color: 'white', borderRadius: '99px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                      {catMeta?.label || item.category}
                    </div>
                    {/* Status badge */}
                    <div style={{ position: 'absolute', top: 8, right: 8, background: item.status === 'published' ? '#10b981' : '#6b7280', color: 'white', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 700 }}>
                      {item.status === 'published' ? '✓' : 'Draft'}
                    </div>
                    {item.featured && (
                      <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#f59e0b', color: 'white', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icons.Star size={10} /> Featured
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#111827', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {item.alt?.en || <span style={{ color: '#9ca3af' }}>No alt text</span>}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Order: {item.order}</span>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteTarget(item.id) }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px 4px', fontSize: '14px' }}
                      ><Icons.Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9ca3af', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#94a3b8' }}>
              <Icons.ImageIcon size={40} />
            </div>
                <p>No images found. Click "Add Image" to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail / Edit Panel */}
        {editingItem && (
          <div style={{ width: '360px', minWidth: '360px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Edit Image</span>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><Icons.XCircle size={20} /></button>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Image *</label>
              <MediaPicker
                value={editingItem.src ? { secure_url: editingItem.src, public_id: editingItem.id } as any : null}
                folder="gallery"
                onChange={(asset: MediaAssetMetadata | null) => patchItem(editingItem.id, { src: asset?.secure_url || '' })}
              />
            </div>

            {/* Alt Text */}
            <ContentEditor label="Alt Text" value={editingItem.alt || emptyLocStr()} onChange={val => patchItem(editingItem.id, { alt: val })} required />

            {/* Category */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Category</label>
              <select style={fieldStyle} value={editingItem.category} onChange={e => patchItem(editingItem.id, { category: e.target.value as GalleryCategory })}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            {/* Order */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Display Order</label>
              <input type="number" style={fieldStyle} value={editingItem.order} onChange={e => patchItem(editingItem.id, { order: Number(e.target.value) })} />
            </div>

            {/* Status + Featured */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={fieldStyle} value={editingItem.status} onChange={e => patchItem(editingItem.id, { status: e.target.value as any })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Featured</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editingItem.featured} onChange={e => patchItem(editingItem.id, { featured: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: '13px' }}>Mark as featured</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setDeleteTarget(editingItem.id)}
              style={{ width: '100%', padding: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Trash2 size={14} /> Remove Image</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#ef4444' }}><Icons.Trash2 size={22} /></div>
            <h3 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700 }}>Remove Image?</h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#4b5563', lineHeight: 1.5 }}>This image will be removed from the gallery. Save changes to apply.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => removeItem(deleteTarget)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
