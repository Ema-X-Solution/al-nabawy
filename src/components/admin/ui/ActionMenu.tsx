'use client'

import { useState, useRef, useEffect } from 'react'

interface ActionMenuItem {
  label: string
  icon?: string
  onClick: () => void
  danger?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  align?: 'left' | 'right'
}

export default function ActionMenu({ items, align = 'right' }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Actions"
        style={{
          background: 'none', border: '1px solid #e5e7eb',
          borderRadius: '0.5rem', padding: '0.35rem 0.6rem',
          cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center',
          transition: 'all 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          [align]: 0,
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb',
          minWidth: 160,
          zIndex: 999,
          overflow: 'hidden',
          animation: 'fadeInDown 0.12s ease',
        }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false) }}
              style={{
                width: '100%', background: 'none', border: 'none',
                padding: '0.6rem 1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontSize: '0.84rem', color: item.danger ? '#ef4444' : '#374151',
                fontWeight: 500, textAlign: 'start',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = item.danger ? '#fef2f2' : '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
