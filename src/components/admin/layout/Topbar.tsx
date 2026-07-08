'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/authContext'
import type { AdminUser } from '@/lib/auth/authService'
import type { Locale } from '@/dictionaries'

interface TopbarProps {
  lang: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>
  user: AdminUser
  onMenuToggle: () => void
  isRtl: boolean
}

const ROLE_COLORS: Record<string, string> = {
  SuperAdmin: '#169DF7',
  Editor: '#10b981',
  Viewer: '#f59e0b',
}

export default function Topbar({ lang, t, user, onMenuToggle, isRtl }: TopbarProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const topbarT = t?.topbar ?? {}

  const initials = user.displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    router.replace(`/${lang}/admin/login`)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      style={{
        height: '100%',
        background: 'white',
        borderBottom: '1px solid rgba(22,157,247,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        gap: '1rem',
      }}
    >
      {/* Left: hamburger */}
      <button
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.4rem',
          borderRadius: '0.4rem',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* View site */}
        <Link
          href={`/${lang}`}
          target="_blank"
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#169DF7',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            border: '1px solid rgba(22,157,247,0.25)',
            transition: 'all 0.18s',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          {topbarT.viewSite}
        </Link>

        {/* Notification bell (placeholder) */}
        <button
          aria-label="Notifications"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', padding: '0.4rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', position: 'relative',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: '#ef4444', border: '1.5px solid white',
          }} />
        </button>

        {/* User avatar + dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #169DF7, #4FC3F7)',
              color: 'white', fontWeight: 700, fontSize: '0.78rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F2937', lineHeight: 1.2 }}>
                {user.displayName}
              </div>
              <div style={{
                fontSize: '0.68rem', color: ROLE_COLORS[user.role] ?? '#6b7280',
                fontWeight: 600,
              }}>
                {user.role}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              [isRtl ? 'left' : 'right']: 0,
              width: 200,
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              border: '1px solid rgba(22,157,247,0.1)',
              overflow: 'hidden',
              zIndex: 999,
              animation: 'fadeInDown 0.15s ease',
            }}>
              {/* User info */}
              <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1F2937' }}>{user.displayName}</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>{user.email}</div>
              </div>
              {/* Actions */}
              <div style={{ padding: '0.4rem' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '0.65rem 0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontSize: '0.84rem', color: '#ef4444', fontWeight: 500,
                    textAlign: 'start',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  {topbarT.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
