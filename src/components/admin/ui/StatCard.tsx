'use client'

import Link from 'next/link'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color?: string
  href?: string
  linkLabel?: string
  loading?: boolean
}

export default function StatCard({
  title,
  value,
  icon,
  color = '#169DF7',
  href,
  linkLabel,
  loading = false,
}: StatCardProps) {
  const bg = `${color}14`

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid rgba(22,157,247,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: href ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (href) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 24px ${color}22`
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (href) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Subtle corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
        borderRadius: '0 1rem 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </p>
          {loading ? (
            <div style={{ width: 60, height: 32, background: '#f1f5f9', borderRadius: 6, marginTop: 6, animation: 'pulse 1.5s infinite' }} />
          ) : (
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0', lineHeight: 1 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '0.75rem',
          background: bg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          style={{
            fontSize: '0.78rem', fontWeight: 600, color, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem', marginTop: '0.25rem',
          }}
        >
          {linkLabel}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </Link>
      )}
    </div>
  )
}
