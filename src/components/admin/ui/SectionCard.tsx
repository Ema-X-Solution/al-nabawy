'use client'

interface SectionCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
  padding?: string
}

export default function SectionCard({ title, subtitle, children, actions, padding = '1.5rem' }: SectionCardProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      border: '1px solid rgba(22,157,247,0.08)',
      overflow: 'hidden',
    }}>
      {(title || actions) && (
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div>
            {title && (
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h2>
            )}
            {subtitle && (
              <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0.2rem 0 0' }}>{subtitle}</p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  )
}
