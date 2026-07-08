interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {i > 0 && <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  style={{ fontSize: '0.78rem', color: '#169DF7', textDecoration: 'none', fontWeight: 500 }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.3rem 0 0', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  )
}
