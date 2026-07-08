'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { mediaSystem, type MediaAssetMetadata, type MediaFolder } from '@/lib/media/mediaSystem'
import { Icons } from '@/lib/icons'

// ─── Props ────────────────────────────────────────────────────────────────────

interface MediaPickerProps {
  /** Currently selected asset (pass null when no asset is selected). */
  value: MediaAssetMetadata | null
  /** Called with the new asset after upload/select, or null after removal. */
  onChange: (asset: MediaAssetMetadata | null) => void
  /** Target Cloudinary folder for new uploads. */
  folder: MediaFolder
  /** Restrict accepted types. Defaults to all allowed types. */
  accept?: 'image' | 'video' | 'document' | 'all'
  /** Optional label shown above the picker. */
  label?: string
  /** Whether the field is read-only. */
  disabled?: boolean
}

// ─── Accept MIME map ──────────────────────────────────────────────────────────

const ACCEPT_MAP: Record<NonNullable<MediaPickerProps['accept']>, string> = {
  image: 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
  video: 'video/mp4,video/webm,video/quicktime',
  document: 'application/pdf',
  all: 'image/*,video/*,application/pdf',
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageAsset(asset: MediaAssetMetadata): boolean {
  return asset.resource_type === 'image'
}

// ─── MediaPicker Component ────────────────────────────────────────────────────

export default function MediaPicker({
  value,
  onChange,
  folder,
  accept = 'all',
  label,
  disabled = false,
}: MediaPickerProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [libraryAssets, setLibraryAssets] = useState<MediaAssetMetadata[]>([])
  const [libraryLoading, setLibraryLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // ─── Library panel ────────────────────────────────────────────────────────

  const openLibrary = useCallback(async () => {
    setShowLibrary(true)
    setLibraryLoading(true)
    try {
      const assets = await mediaSystem.list({ folder })
      setLibraryAssets(assets)
    } catch {
      setError('Failed to load media library.')
    } finally {
      setLibraryLoading(false)
    }
  }, [folder])

  // ─── Upload handler ───────────────────────────────────────────────────────

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (disabled) return
      setError(null)
      setProgress(0)
      setUploading(true)
      try {
        const asset = await mediaSystem.upload(file, folder, setProgress)
        onChange(asset)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Upload failed.')
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [disabled, folder, onChange]
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileSelected(file)
      // Reset so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    },
    [handleFileSelected]
  )

  // ─── Drag & Drop ──────────────────────────────────────────────────────────

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFileSelected(file)
    },
    [handleFileSelected]
  )

  // ─── Remove asset ─────────────────────────────────────────────────────────

  const handleRemove = useCallback(() => {
    onChange(null)
    setError(null)
  }, [onChange])

  // ─── Styles (vanilla CSS-in-JS matching project convention) ──────────────

  const S = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    dropzone: {
      border: `2px dashed ${dragging ? '#169DF7' : 'rgba(22,157,247,0.35)'}`,
      borderRadius: '0.75rem',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      background: dragging ? 'rgba(22,157,247,0.06)' : '#fafafa',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center' as const,
      opacity: disabled ? 0.6 : 1,
    },
    previewWrapper: {
      borderRadius: '0.75rem',
      border: '1px solid rgba(22,157,247,0.18)',
      overflow: 'hidden',
      background: '#f8fafc',
      position: 'relative' as const,
    },
    actionRow: {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.75rem',
      borderTop: '1px solid rgba(22,157,247,0.1)',
      flexWrap: 'wrap' as const,
    },
    actionBtn: (variant: 'primary' | 'danger' | 'ghost') => ({
      padding: '0.4rem 1rem',
      borderRadius: '9999px',
      border: 'none',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      background:
        variant === 'primary'
          ? '#169DF7'
          : variant === 'danger'
          ? '#ef4444'
          : 'white',
      color:
        variant === 'primary' || variant === 'danger' ? 'white' : '#374151',
      border_: variant === 'ghost' ? '1px solid #e5e7eb' : 'none',
    }),
    progressBar: {
      width: '100%',
      height: '4px',
      background: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #169DF7, #4FC3F7)',
      transition: 'width 0.1s linear',
    },
    error: {
      fontSize: '0.8rem',
      color: '#ef4444',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    },
    metaRow: {
      padding: '0.6rem 0.75rem',
      fontSize: '0.75rem',
      color: '#6b7280',
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap' as const,
    },
  }

  // ─── Render: uploading ────────────────────────────────────────────────────

  if (uploading) {
    return (
      <div style={S.wrapper}>
        {label && <span style={S.label}>{label}</span>}
        <div style={{ ...S.dropzone, cursor: 'wait' }}>
          <div style={{ marginBottom: '8px', color: '#169DF7' }}><Icons.UploadCloud size={32} /></div>
          <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem' }}>
            Uploading… {progress}%
          </div>
          <div style={S.progressBar}>
            <div style={S.progressFill} />
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: has asset ────────────────────────────────────────────────────

  if (value) {
    return (
      <div style={S.wrapper}>
        {label && <span style={S.label}>{label}</span>}

        <div style={S.previewWrapper}>
          {/* Preview area */}
          {isImageAsset(value) ? (
            <div style={{ position: 'relative', width: '100%', height: 200 }}>
              <Image
                src={value.secure_url}
                alt="Uploaded asset preview"
                fill
                style={{ objectFit: 'cover' }}
                sizes="600px"
              />
            </div>
          ) : value.resource_type === 'video' ? (
            <video
              src={value.secure_url}
              controls
              style={{ width: '100%', maxHeight: 220, display: 'block', background: '#000' }}
            />
          ) : (
            <div
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span style={{ color: '#9ca3af' }}><Icons.FileText size={40} /></span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2937' }}>
                  {value.public_id.split('/').pop()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {value.format ? value.format.toUpperCase() : 'FILE'} {value.bytes ? `· ${formatBytes(value.bytes)}` : ''}
                </div>
              </div>
            </div>
          )}

          {/* Metadata strip */}
          <div style={S.metaRow}>
            {value.width && value.height && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icons.ImageIcon size={14} /> {value.width} × {value.height}px
              </span>
            )}
            {value.bytes && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icons.HardDrive size={14} /> {formatBytes(value.bytes)}
              </span>
            )}
            {value.format && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icons.Files size={14} /> {value.format.toUpperCase()}
              </span>
            )}
            <span style={{ color: '#169DF7', fontFamily: 'monospace', fontSize: '0.7rem' }}>
              {value.public_id}
            </span>
          </div>

          {/* Action buttons */}
          <div style={S.actionRow}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              style={S.actionBtn('primary')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.RefreshCw size={14} /> Replace</span>
            </button>
            <a
              href={value.secure_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...S.actionBtn('ghost'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Link size={14} /> View</span>
            </a>
            <button
              type="button"
              disabled={disabled}
              onClick={handleRemove}
              style={S.actionBtn('danger')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Trash2 size={14} /> Remove</span>
            </button>
          </div>
        </div>

        {/* Hidden input for "Replace" */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          style={{ display: 'none' }}
          onChange={onInputChange}
        />
        {error && <div style={S.error}><Icons.AlertTriangle size={14} /> {error}</div>}
      </div>
    )
  }

  // ─── Render: empty / dropzone ─────────────────────────────────────────────

  return (
    <div style={S.wrapper}>
      {label && <span style={S.label}>{label}</span>}

      {/* Drag & Drop zone */}
      <div
        style={S.dropzone}
        onDragEnter={() => !disabled && setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <div style={{ marginBottom: '8px', color: '#9ca3af' }}><Icons.ImageIcon size={40} /></div>
        <div>
          <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '0.9rem' }}>
            Drag & drop a file or click to browse
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            {accept === 'image' && 'JPEG, PNG, WebP, GIF, SVG — max 5 MB'}
            {accept === 'video' && 'MP4, WebM, MOV — max 50 MB'}
            {accept === 'document' && 'PDF — max 10 MB'}
            {accept === 'all' && 'Images (5 MB), Videos (50 MB), PDFs (10 MB)'}
          </div>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            openLibrary()
          }}
          style={{
            ...S.actionBtn('ghost'),
            border: '1px solid #e5e7eb',
            marginTop: '0.25rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.FolderOpen size={16} /> Choose from Media Library</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      {error && <div style={S.error}><Icons.AlertTriangle size={14} /> {error}</div>}

      {/* ─── Library Drawer ──────────────────────────────────────────────── */}
      {showLibrary && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setShowLibrary(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1.25rem 1.25rem 0 0',
              width: '100%',
              maxWidth: 860,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icons.FolderOpen size={18} /> Media Library — <span style={{ color: '#169DF7' }}>{folder}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280' }}
              >
                <Icons.XCircle size={20} />
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {libraryLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  Loading assets…
                </div>
              ) : libraryAssets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  No assets found in <strong>{folder}</strong>.
                  <br />Upload a file to get started.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {libraryAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        onChange(asset)
                        setShowLibrary(false)
                      }}
                      style={{
                        borderRadius: '0.6rem',
                        overflow: 'hidden',
                        border: '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                        background: '#f3f4f6',
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.borderColor = '#169DF7')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.borderColor = 'transparent')
                      }
                    >
                      {isImageAsset(asset) ? (
                        <div style={{ position: 'relative', height: 110 }}>
                          <Image
                            src={asset.secure_url}
                            alt={asset.public_id}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="140px"
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 110,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                          }}
                        >
                          {asset.resource_type === 'video' ? <Icons.Video size={40} /> : <Icons.FileText size={40} />}
                        </div>
                      )}
                      <div
                        style={{
                          padding: '0.4rem 0.5rem',
                          fontSize: '0.68rem',
                          color: '#6b7280',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {asset.public_id.split('/').pop()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{
                  ...S.actionBtn('primary'),
                  fontSize: '0.875rem',
                  padding: '0.6rem 1.5rem',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Upload size={16} /> Upload New File</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                style={{
                  ...S.actionBtn('ghost'),
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  padding: '0.6rem 1.25rem',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
