'use client'

import Link from 'next/link'

interface SidebarItemProps {
  href: string
  label: string
  icon: React.ReactNode
  isActive: boolean
}

export default function SidebarItem({ href, label, icon, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 1.25rem',
        margin: '0.1rem 0.5rem',
        borderRadius: '0.6rem',
        textDecoration: 'none',
        fontSize: '0.84rem',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
        background: isActive
          ? 'linear-gradient(90deg, rgba(22,157,247,0.22), rgba(22,157,247,0.08))'
          : 'transparent',
        borderLeft: isActive ? '3px solid #169DF7' : '3px solid transparent',
        transition: 'all 0.18s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.background = 'rgba(255,255,255,0.06)'
          el.style.color = 'rgba(255,255,255,0.85)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.background = 'transparent'
          el.style.color = 'rgba(255,255,255,0.55)'
        }
      }}
    >
      <span style={{ color: isActive ? '#169DF7' : 'inherit', flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
