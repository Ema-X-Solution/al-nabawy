'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { CertificationsDocument, CertificationItem } from '@/types/certifications.types'
import { saveCertificationsConfig } from '@/app/actions/certificationsActions'
import MediaPicker from '@/components/admin/MediaPicker'
import ContentEditor from '@/components/admin/ContentEditor'
import { emptyLocStr } from '@/types/certifications.types'
import type { MediaAssetMetadata } from '@/lib/media/mediaSystem'
import { Icons } from '@/lib/icons'

interface Props { initialConfig: CertificationsDocument }

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
  fontSize: '13px', fontFamily: 'Poppins, sans-serif', color: '#111827',
  background: '#fff', boxSizing: 'border-box', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
  color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase',
}

export default function CertificationsCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<CertificationsDocument>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const patchMeta = (key: keyof CertificationsDocument, value: any) =>
    setConfig(prev => ({ ...prev, [key]: value }))

  const patchItem = (id: string, updates: Partial<CertificationItem>) =>
    setConfig(prev => ({ ...prev, items: prev.items.map(i => i.id === id ? { ...i, ...updates } : i) }))

  const addItem = () => {
    const newItem: CertificationItem = {
      id: `cert_${Date.now()}`,
      title: emptyLocStr(),
      desc: emptyLocStr(),
      color: '#169DF7',
      image: '',
      issueDate: '',
      validUntil: '',
      certNumber: '',
      order: config.items.length,
      status: 'published',
    }
    setConfig(prev => ({ ...prev, items: [...prev.items, newItem] }))
    setEditingId(newItem.id)
  }

  const removeItem = (id: string) => {
    setConfig(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }))
    setDeleteTarget(null)
    if (editingId === id) setEditingId(null)
  }

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveCertificationsConfig(config)
    setIsSaving(false)
    if (res.success) window.location.reload()
    else alert(res.error || 'Failed to save.')
  }

  const filtered = config.items
    .filter(i => search === '' || Object.values(i.title || {}).some(val => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())) || i.certNumber?.includes(search))
    .sort((a, b) => a.order - b.order)

  const editingItem = config.items.find(i => i.id === editingId) || null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px' }}>

      {/* Hero Banner */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Trophy size={16} color="#169DF7" /> Hero Banner</h3>
        <ContentEditor label="Page Title" value={config.heroTitle} onChange={val => patchMeta('heroTitle', val)} required />
        <ContentEditor label="Subtitle" value={config.heroSub} onChange={val => patchMeta('heroSub', val)} />
      </div>

      {/* Certifications */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* List Panel */}
        <div style={{ flex: 1 }}>
          {/* Toolbar */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Certifications</span>
                <span style={{ background: '#f3f4f6', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{config.items.length}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSave} disabled={isSaving}
                  style={{ background: '#169DF7', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                  {isSaving ? 'Saving...' : <><Icons.Download size={14} /> Save All</>}
                </button>
                <button onClick={addItem}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                  + Add Certificate
                </button>
              </div>
            </div>
            <input placeholder="Search by name or certificate number..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...fieldStyle, width: '300px' }} />
          </div>

          {/* Certificate Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map(item => {
              const isSelected = editingId === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setEditingId(isSelected ? null : item.id)}
                  style={{
                    background: 'white', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${isSelected ? '#169DF7' : '#e5e7eb'}`,
                    boxShadow: isSelected ? '0 0 0 4px rgba(22,157,247,0.12)' : '0 1px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s', borderTop: `4px solid ${item.color}`,
                  }}
                >
                  {/* Certificate Image */}
                  <div style={{ height: '180px', position: 'relative', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title?.en || 'Certificate'}
                        fill
                        style={{ objectFit: 'contain', padding: '12px' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#d1d5db' }}>
                        <Icons.ClipboardList size={40} />
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>No image uploaded</span>
                      </div>
                    )}
                    {/* Status */}
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: item.status === 'published' ? '#10b981' : '#6b7280',
                      color: 'white', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 700
                    }}>
                      {item.status === 'published' ? '✓ Published' : 'Draft'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: item.color || '#111827' }}>
                      {item.title?.en || <span style={{ color: '#9ca3af' }}>Untitled</span>}
                    </h4>
                    {item.certNumber && (
                      <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>#{item.certNumber}</p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {item.issueDate && (
                        <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                          Issued: {item.issueDate}
                        </span>
                      )}
                      {item.validUntil && (
                        <span style={{ fontSize: '11px', color: '#169DF7', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                          Valid until: {item.validUntil}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Order: {item.order}</span>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteTarget(item.id) }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                      ><Icons.Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9ca3af', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Icons.ClipboardList size={40} /></div>
                <p>No certifications found. Click "Add Certificate" to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Panel */}
        {editingItem && (
          <div style={{ width: '360px', minWidth: '360px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', position: 'sticky', top: '90px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Edit Certificate</span>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><Icons.XCircle size={20} /></button>
            </div>

            {/* Certificate Image (PRIMARY) */}
            <div style={{ marginBottom: '16px', padding: '14px', background: '#f9fafb', borderRadius: '10px', border: '2px dashed #e5e7eb' }}>
              <label style={{ ...labelStyle, color: '#374151', marginBottom: '10px' }}>Certificate Image <span style={{ color: '#ef4444' }}>*</span></label>
              <MediaPicker
                value={editingItem.image ? { secure_url: editingItem.image, public_id: editingItem.id } as any : null}
                folder="certifications"
                onChange={(asset: MediaAssetMetadata | null) => patchItem(editingItem.id, { image: asset?.secure_url || '' })}
              />
              {editingItem.image && (
                <div style={{ marginTop: '10px', position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                  <Image src={editingItem.image} alt="Preview" fill style={{ objectFit: 'contain', background: 'white', padding: '8px' }} />
                </div>
              )}
            </div>

            {/* Title */}
            <ContentEditor label="Certificate Name" value={editingItem.title || emptyLocStr()} onChange={val => patchItem(editingItem.id, { title: val })} required />

            {/* Description */}
            <ContentEditor label="Description" value={editingItem.desc || emptyLocStr()} onChange={val => patchItem(editingItem.id, { desc: val })} type="textarea" />

            {/* Certificate number + Color */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Certificate Number</label>
                <input style={fieldStyle} value={editingItem.certNumber || ''} onChange={e => patchItem(editingItem.id, { certNumber: e.target.value })} placeholder="e.g. ISO-2024-001" />
              </div>
              <div>
                <label style={labelStyle}>Color</label>
                <input type="color" value={editingItem.color} onChange={e => patchItem(editingItem.id, { color: e.target.value })}
                  style={{ width: 44, height: 42, border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 2 }} />
              </div>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Issue Date</label>
                <input style={fieldStyle} value={editingItem.issueDate || ''} onChange={e => patchItem(editingItem.id, { issueDate: e.target.value })} placeholder="2022" />
              </div>
              <div>
                <label style={labelStyle}>Valid Until</label>
                <input style={fieldStyle} value={editingItem.validUntil || ''} onChange={e => patchItem(editingItem.id, { validUntil: e.target.value })} placeholder="2028" />
              </div>
            </div>

            {/* Order + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" style={fieldStyle} value={editingItem.order} onChange={e => patchItem(editingItem.id, { order: Number(e.target.value) })} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={fieldStyle} value={editingItem.status} onChange={e => patchItem(editingItem.id, { status: e.target.value as any })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setDeleteTarget(editingItem.id)}
              style={{ width: '100%', padding: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Trash2 size={14} /> Remove Certificate</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#ef4444' }}><Icons.Trash2 size={22} /></div>
            <h3 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: 700 }}>Remove Certificate?</h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#4b5563', lineHeight: 1.5 }}>This certificate will be removed. Save changes to apply permanently.</p>
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
