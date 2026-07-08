'use client'

import Link from 'next/link'
import type { Locale } from '@/dictionaries'
import SidebarItem from './SidebarItem'

// ─── SVG Icons (inline, zero dependencies) ────────────────────────────────────

const Icon = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  About: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Products: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  ),
  Categories: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
  ),
  Gallery: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ),
  Cert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
  ),
  Export: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
  ),
  Contact: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Nav: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  Policy: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ),
  Media: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
  ),
  Inbox: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
}

// ─── Nav structure ────────────────────────────────────────────────────────────

interface SidebarProps {
  lang: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>
  currentPath: string
  userRole: string
}

const LOGO_ACCENT = '#169DF7'

export default function Sidebar({ lang, t, currentPath, userRole }: SidebarProps) {
  const base = `/${lang}/admin`
  const nav = t?.nav ?? {}

  const groups = [
    {
      label: null,
      items: [{ href: base, label: nav.dashboard, icon: <Icon.Dashboard /> }],
    },
    ...(userRole !== 'Viewer' ? [{
      label: nav.websiteManagement,
      items: [
        { href: `${base}/home`, label: nav.home, icon: <Icon.Home /> },
        { href: `${base}/about`, label: nav.about, icon: <Icon.About /> },
        { href: `${base}/products`, label: nav.products, icon: <Icon.Products /> },
        { href: `${base}/categories`, label: nav.categories, icon: <Icon.Categories /> },
        { href: `${base}/gallery`, label: nav.gallery, icon: <Icon.Gallery /> },
        { href: `${base}/certifications`, label: nav.certifications, icon: <Icon.Cert /> },
        { href: `${base}/export-markets`, label: nav.exportMarkets, icon: <Icon.Export /> },
        { href: `${base}/export-policy`, label: 'Export Policy', icon: <Icon.Policy /> },
        { href: `${base}/contact`, label: nav.contactPage, icon: <Icon.Contact /> },
      ],
    }] : []),
    {
      label: nav.communication,
      items: [
        { href: `${base}/inbox`, label: nav.contactRequests, icon: <Icon.Inbox /> },
      ],
    },
    ...(userRole === 'SuperAdmin' ? [{
      label: nav.system,
      items: [
        { href: `${base}/settings`, label: nav.settings, icon: <Icon.Settings /> },
        { href: `${base}/users`, label: nav.users, icon: <Icon.Users /> },
      ],
    }] : [])
  ]

  return (
    <nav
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0d1b2a 0%, #0f2035 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}
    >
      {/* Logo */}
      <Link
        href={`/${lang}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.5rem 1.25rem 1.25rem',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${LOGO_ACCENT}, #4FC3F7)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            color: 'white',
            flexShrink: 0,
          }}
        >
          N
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', letterSpacing: '-0.01em' }}>
            Al-Nabawy
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
            Admin CMS
          </div>
        </div>
      </Link>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0', scrollbarWidth: 'none' }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '0.25rem' }}>
            {group.label && (
              <div
                style={{
                  padding: '0.65rem 1.25rem 0.3rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={
                  item.href === base
                    ? currentPath === base || currentPath === `${base}/`
                    : currentPath.startsWith(item.href)
                }
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer version stamp */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>
        Al-Nabawy CMS v1.0
      </div>
    </nav>
  )
}
