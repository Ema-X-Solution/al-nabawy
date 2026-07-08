interface LoadingSkeletonProps {
  rows?: number
  card?: boolean
}

export default function LoadingSkeleton({ rows = 3, card = false }: LoadingSkeletonProps) {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    borderRadius: '0.5rem',
  }

  if (card) {
    return (
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ ...shimmer, width: 48, height: 48, borderRadius: '0.75rem', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...shimmer, height: 14, width: '60%', marginBottom: 8 }} />
            <div style={{ ...shimmer, height: 28, width: '40%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ ...shimmer, width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...shimmer, height: 12, width: `${70 - i * 8}%`, marginBottom: 6 }} />
              <div style={{ ...shimmer, height: 10, width: `${50 - i * 5}%` }} />
            </div>
            <div style={{ ...shimmer, height: 28, width: 72, borderRadius: '9999px' }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  )
}
