import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: { label: string; title: string; subtitle: string; download: string; requestCustom: string }
}

export default function CatalogDownload({ lang, t }: Props) {
  return (
    <section
      className="section"
      id="catalog"
      style={{
        background: 'linear-gradient(135deg,#0f1929 0%,#1a2e4a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-80px', right: lang === 'ar' ? 'auto' : '-80px', left: lang === 'ar' ? '-80px' : 'auto', width: 300, height: 300, borderRadius: '50%', background: 'rgba(22,157,247,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: lang === 'ar' ? 'auto' : '10%', right: lang === 'ar' ? '10%' : 'auto', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,195,74,0.08)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(22,157,247,0.2)',
            color: '#4FC3F7',
            borderRadius: '9999px',
            padding: '0.4rem 1.2rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            letterSpacing: '0.1em',
          }}
        >
          📄 {t.label}
        </div>

        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
          {t.title}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          {t.subtitle}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="/catalog.pdf"
            download
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}
            id="catalog-download-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            {t.download}
          </a>
          <a
            href={`/${lang}/contact`}
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '0.9rem 2.5rem', borderColor: 'rgba(255,255,255,0.4)' }}
            id="catalog-custom-btn"
          >
            {t.requestCustom}
          </a>
        </div>
      </div>
    </section>
  )
}
