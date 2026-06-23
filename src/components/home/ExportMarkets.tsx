import Link from 'next/link'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: { label: string; title: string; subtitle: string; viewAll: string; regions: Record<string, string> }
}

const countries = [
  { name: 'Saudi Arabia', flag: '🇸🇦', region: 'middleEast' },
  { name: 'UAE', flag: '🇦🇪', region: 'middleEast' },
  { name: 'Kuwait', flag: '🇰🇼', region: 'middleEast' },
  { name: 'Qatar', flag: '🇶🇦', region: 'middleEast' },
  { name: 'Oman', flag: '🇴🇲', region: 'middleEast' },
  { name: 'Jordan', flag: '🇯🇴', region: 'middleEast' },
  { name: 'Libya', flag: '🇱🇾', region: 'middleEast' },
  { name: 'Yemen', flag: '🇾🇪', region: 'middleEast' },
  { name: 'Germany', flag: '🇩🇪', region: 'europe' },
  { name: 'Poland', flag: '🇵🇱', region: 'europe' },
  { name: 'Turkey', flag: '🇹🇷', region: 'europe' },
  { name: 'Nigeria', flag: '🇳🇬', region: 'africa' },
  { name: 'Ghana', flag: '🇬🇭', region: 'africa' },
  { name: 'Kenya', flag: '🇰🇪', region: 'africa' },
  { name: 'Ethiopia', flag: '🇪🇹', region: 'africa' },
  { name: 'Senegal', flag: '🇸🇳', region: 'africa' },
  { name: 'Africa', flag: '🌍', region: 'africa' },
]

const regionColors: Record<string, string> = {
  middleEast: '#169DF7',
  europe: '#8BC34A',
  africa: '#FF9800',
}

export default function ExportMarkets({ lang, t }: Props) {
  return (
    <section className="section bg-section-light" id="export-markets">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">{t.label}</span>
          <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>{t.subtitle}</p>
        </div>

        {/* SVG World Map placeholder */}
        <div
          style={{
            background: 'linear-gradient(135deg,#e0f2fe,#f0f9ff)',
            borderRadius: '1.5rem',
            padding: '2rem',
            marginBottom: '2.5rem',
            textAlign: 'center',
            border: '1px solid rgba(22,157,247,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '6rem', marginBottom: '0.5rem' }}>🌍</div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1F2937' }}>
            {lang === 'ar' ? 'نصدّر إلى 17+ دولة' : 'Exporting To 17+ Countries'}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {Object.values(t.regions).join(' • ')}
          </div>
        </div>

        {/* Region groups */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
        >
          {Object.entries(t.regions).map(([regionKey, regionName]) => (
            <div
              key={regionKey}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(22,157,247,0.08)',
                borderTop: `4px solid ${regionColors[regionKey] || '#169DF7'}`,
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: regionColors[regionKey] || '#169DF7',
                  marginBottom: '1rem',
                }}
              >
                {regionName}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {countries
                  .filter((c) => c.region === regionKey)
                  .map((c) => (
                    <span
                      key={c.name}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.8rem',
                        color: '#374151',
                      }}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href={`/${lang}/export-markets`} className="btn-outline" id="export-viewall">
            {t.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
