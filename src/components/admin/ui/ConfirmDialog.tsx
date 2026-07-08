'use client'

import { useEffect, useRef } from 'react'
import { Icons } from '@/lib/icons'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9900,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '1.25rem',
          padding: '2rem', maxWidth: 420, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          animation: 'fadeInScale 0.18s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {danger ? <Icons.AlertTriangle size={40} color="#ef4444" /> : <Icons.HelpCircle size={40} color="#169DF7" />}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem', textAlign: 'center' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1.5rem', textAlign: 'center', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '0.6rem',
              border: '1px solid #e5e7eb', background: 'white',
              color: '#374151', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '0.6rem',
              border: 'none', background: danger ? '#ef4444' : '#169DF7',
              color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
        <style>{`@keyframes fadeInScale { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
      </div>
    </div>
  )
}
