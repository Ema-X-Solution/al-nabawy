'use client'

import React, { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { mediaSystem, type MediaAssetMetadata, MEDIA_FOLDERS, type MediaFolder } from '@/lib/media/mediaSystem'

import { Icons } from '@/lib/icons'

const FOLDER_LABELS: Record<MediaFolder, { label: string, icon: React.ReactNode }> = {
  branding: { label: 'Branding', icon: <Icons.Palette size={16} /> },
  products: { label: 'Products', icon: <Icons.Package size={16} /> },
  categories: { label: 'Categories', icon: <Icons.FolderOpen size={16} /> },
  gallery: { label: 'Gallery', icon: <Icons.ImageIcon size={16} /> },
  home: { label: 'Home', icon: <Icons.Home size={16} /> },
  about: { label: 'About', icon: <Icons.Info size={16} /> },
  certifications: { label: 'Certifications', icon: <Icons.Award size={16} /> },
  settings: { label: 'Settings', icon: <Icons.Settings size={16} /> },
}

function formatBytes(bytes: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaLibraryClient() {
  const [activeFolder, setActiveFolder] = useState<MediaFolder>(MEDIA_FOLDERS.gallery)
  const [assets, setAssets] = useState<MediaAssetMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState<MediaFolder | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<MediaAssetMetadata | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadFolder = useCallback(async (folder: MediaFolder) => {
    setActiveFolder(folder)
    setSelected(null)
    setLoading(true)
    try {
      const list = await mediaSystem.list({ folder })
      setAssets(list)
      setLoaded(folder)
    } catch {
      alert('Failed to load assets.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load on first tab click
  const handleTabClick = (folder: MediaFolder) => {
    if (folder === loaded && folder === activeFolder) return
    loadFolder(folder)
  }

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    try {
      const asset = await mediaSystem.upload(file, activeFolder, setUploadProgress)
      setAssets(prev => [asset, ...prev])
    } catch (err: any) {
      alert(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [activeFolder])

  const handleDelete = async (asset: MediaAssetMetadata) => {
    if (!window.confirm(`Delete "${asset.public_id.split('/').pop()}"? This cannot be undone.`)) return
    setDeletingId(asset.id)
    try {
      await mediaSystem.delete(asset)
      setAssets(prev => prev.filter(a => a.id !== asset.id))
      if (selected?.id === asset.id) setSelected(null)
    } catch {
      alert('Failed to delete asset.')
    } finally {
      setDeletingId(null)
    }
  }

  const S = {
    tab: (active: boolean): React.CSSProperties => ({
      padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: active ? 700 : 500,
      background: active ? '#169DF7' : '#f3f4f6', color: active ? 'white' : '#374151',
      transition: 'all 0.15s',
    }),
  }

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' }}>
      
      {/* Left: Folder tabs + grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
        
        {/* Folder tabs */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(Object.entries(FOLDER_LABELS) as [MediaFolder, typeof FOLDER_LABELS[MediaFolder]][]).map(([key, data]) => (
              <button key={key} style={S.tab(activeFolder === key)} onClick={() => handleTabClick(key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {data.icon} {data.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload + grid */}
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Toolbar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {FOLDER_LABELS[activeFolder].icon} {FOLDER_LABELS[activeFolder].label}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {uploading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
                  <div style={{ width: '100px', height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${uploadProgress}%`, background: '#169DF7', transition: 'width 0.1s' }} />
                  </div>
                  {uploadProgress}%
                </div>
              )}
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                style={{ background: '#169DF7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icons.UploadCloud size={16} /> Upload
                </div>
              </button>
              {loaded !== activeFolder && (
                <button
                  onClick={() => loadFolder(activeFolder)}
                  style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                >
                  Load
                </button>
              )}
            </div>
          </div>

          <input ref={inputRef} type="file" accept="image/*,video/*,application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />

          {/* Asset Grid */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>Loading assets…</div>
            ) : loaded !== activeFolder ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  <Icons.Folder size={40} />
                </div>
                <p>Click <strong>Load</strong> or <strong>Upload</strong> to browse this folder.</p>
              </div>
            ) : assets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', color: '#d1d5db' }}>
                  <Icons.ImageIcon size={40} />
                </div>
                <p>No assets in this folder yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {assets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => setSelected(asset)}
                    style={{ borderRadius: '10px', overflow: 'hidden', border: `2px solid ${selected?.id === asset.id ? '#169DF7' : '#e5e7eb'}`, cursor: 'pointer', background: '#f8fafc', transition: 'border-color 0.15s' }}
                  >
                    <div style={{ height: 110, position: 'relative', background: '#f3f4f6' }}>
                      {asset.resource_type === 'image' ? (
                        <Image src={asset.secure_url} alt={asset.public_id} fill style={{ objectFit: 'cover' }} sizes="140px" />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                          {asset.resource_type === 'video' ? <Icons.Video size={32} /> : <Icons.FileText size={32} />}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '6px 8px', fontSize: '10px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {asset.public_id.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Asset detail panel */}
      <div style={{ width: '280px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        {selected ? (
          <>
            {/* Preview */}
            <div style={{ height: 200, background: '#f3f4f6', position: 'relative', flexShrink: 0 }}>
              {selected.resource_type === 'image' ? (
                <Image src={selected.secure_url} alt={selected.public_id} fill style={{ objectFit: 'contain' }} sizes="280px" />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                  {selected.resource_type === 'video' ? <Icons.Video size={64} /> : <Icons.FileText size={64} />}
                </div>
              )}
            </div>
            {/* Details */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px', wordBreak: 'break-all' }}>
                {selected.public_id.split('/').pop()}
              </div>
              {[
                ['Type', `${selected.resource_type} / ${selected.format?.toUpperCase() || '—'}`],
                ['Size', formatBytes(selected.bytes)],
                ['Dimensions', selected.width && selected.height ? `${selected.width} × ${selected.height}` : '—'],
                ['Folder', selected.public_id.split('/').slice(0, -1).join('/') || 'root'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '12px' }}>
                  <span style={{ color: '#9ca3af', fontWeight: 600 }}>{k}</span>
                  <span style={{ color: '#374151', textAlign: 'right', maxWidth: '150px', wordBreak: 'break-all' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', wordBreak: 'break-all', background: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                {selected.secure_url}
              </div>
            </div>
            {/* Actions */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
              <a href={selected.secure_url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icons.Link size={14} /> View
                </div>
              </a>
              <button
                onClick={() => handleDelete(selected)}
                disabled={deletingId === selected.id}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {deletingId === selected.id ? '…' : <><Icons.Trash2 size={14} /> Delete</>}
                </div>
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '20px', textAlign: 'center' }}>
            <span style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><Icons.ImageIcon size={48} /></span>
            <p style={{ fontSize: '13px' }}>Click on an asset to view details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
