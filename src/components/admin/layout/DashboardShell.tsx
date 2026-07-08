'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/authContext'
import type { Locale } from '@/dictionaries'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import LoadingSkeleton from '../ui/LoadingSkeleton'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode
  lang: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const SIDEBAR_W = 260
const TOPBAR_H = 64

// ─── DashboardShell ───────────────────────────────────────────────────────────

export default function DashboardShell({ children, lang, dict }: Props) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const isRtl = lang === 'ar'
  const t = dict.admin

  // Detect desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${lang}/admin/login`)
    }
  }, [loading, user, router, lang])

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <LoadingSkeleton rows={4} />
      </div>
    )
  }

  if (!user) return null // redirect in progress

  // Route guarding based on role
  const pathSegment = pathname.split('/').pop() || ''
  const isSystemPage = ['settings', 'users'].includes(pathSegment)
  const isContentPage = ['home', 'about', 'products', 'categories', 'gallery', 'certifications', 'export-markets', 'contact'].includes(pathSegment)

  if (isSystemPage && user.role !== 'SuperAdmin') {
    router.replace(`/${lang}/admin`)
    return null
  }
  
  if (isContentPage && user.role === 'Viewer') {
    router.replace(`/${lang}/admin`)
    return null
  }

  const sidebarVisible = isDesktop || sidebarOpen

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', position: 'relative' }}>

      {/* Mobile overlay */}
      {sidebarOpen && !isDesktop && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 200, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          width: SIDEBAR_W,
          flexShrink: 0,
          position: isDesktop ? 'sticky' : 'fixed',
          top: 0,
          [isRtl ? 'right' : 'left']: 0,
          height: '100vh',
          zIndex: 300,
          transform: sidebarVisible ? 'translateX(0)' : isRtl ? `translateX(${SIDEBAR_W}px)` : `translateX(-${SIDEBAR_W}px)`,
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
        }}
      >
        <Sidebar lang={lang} t={t} currentPath={pathname} userRole={user.role} />
      </div>

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, height: TOPBAR_H }}>
          <Topbar
            lang={lang}
            t={t}
            user={user}
            onMenuToggle={() => setSidebarOpen((v) => !v)}
            isRtl={isRtl}
          />
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
