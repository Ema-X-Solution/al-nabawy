import Link from 'next/link'
import type { HomeExportMarketsConfig, HomeLocale } from '@/types/home.types'
import { Icons } from '@/lib/icons'

import type { ExportMarketsDocument } from '@/types/exportMarkets.types'

interface Props {
  lang: HomeLocale
  config: HomeExportMarketsConfig
  exportData?: ExportMarketsDocument
}

const regionColors: Record<string, string> = {
  middleEast: '#169DF7',
  europe: '#8BC34A',
  africa: '#FF9800',
  default: '#169DF7'
}

export default function ExportMarkets({ lang, config, exportData }: Props) {
  // Use dynamic countries if available, else empty
  const countries = exportData?.countries || []
  
  // Group countries by their localized region name
  const groupedRegions: Record<string, typeof countries> = {}
  countries.forEach(c => {
    const regionName = c.region[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr'] || c.region['en']
    if (!groupedRegions[regionName]) {
      groupedRegions[regionName] = []
    }
    groupedRegions[regionName].push(c)
  })

  // To map colors consistently, we'll try to guess based on english region name if possible
  const getColorForRegion = (regionEn: string) => {
    const lower = regionEn.toLowerCase()
    if (lower.includes('middle east')) return regionColors.middleEast
    if (lower.includes('europe')) return regionColors.europe
    if (lower.includes('africa')) return regionColors.africa
    return regionColors.default
  }

  return (
    <section className="section bg-section-light" id="export-markets">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">{config.label[lang]}</span>
          <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
          <h2 className="section-title">{config.title[lang]}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>{config.subtitle[lang]}</p>
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><Icons.Globe size={96} color="#169DF7" /></div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1F2937' }}>
            {lang === 'ar' ? `نصدّر إلى ${countries.length}+ دولة` : `Exporting To ${countries.length}+ Countries`}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {Object.keys(groupedRegions).join(' • ')}
          </div>
        </div>

        {/* Region groups */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
        >
          {Object.entries(groupedRegions).map(([regionName, regionCountries]) => {
            const sampleCountry = regionCountries[0]
            const color = getColorForRegion(sampleCountry.region['en'])
            
            return (
              <div
                key={regionName}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(22,157,247,0.08)',
                  borderTop: `4px solid ${color}`,
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: color,
                    marginBottom: '1rem',
                  }}
                >
                  {regionName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {regionCountries.slice(0, config.maxItems).map((c) => (
                      <span
                        key={c.id}
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
                        <span>{c.name[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']}</span>
                      </span>
                    ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href={`/${lang}/export-markets`} className="btn-outline" id="export-viewall">
            {config.viewAll[lang]}
          </Link>
        </div>
      </div>
    </section>
  )
}
