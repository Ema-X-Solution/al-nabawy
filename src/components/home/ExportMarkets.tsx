import Link from 'next/link'
import type { HomeExportMarketsConfig, HomeLocale } from '@/types/home.types'
import { Icons } from '@/lib/icons'
import ExportMap, { project, type MapMarker, type MapHighlight } from '@/components/home/ExportMap'
import { COUNTRY_NAMES } from '@/components/home/map-data'

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

  // Markers on the dotted map for the regions present in the data (grid coords: 84x36)
  const regionMarkerPos: Record<string, { lon: number; lat: number }> = {
    middleEast: { lon: 46, lat: 25 },
    europe: { lon: 14, lat: 51 },
    africa: { lon: 21, lat: 4 },
    default: { lon: 30, lat: 27 },
  }
  const regionKeyFor = (regionEn: string) => {
    const lower = regionEn.toLowerCase()
    if (lower.includes('middle east')) return 'middleEast'
    if (lower.includes('europe')) return 'europe'
    if (lower.includes('africa')) return 'africa'
    return 'default'
  }
  const markers: MapMarker[] = Object.values(groupedRegions).map((regionCountries) => {
    const key = regionKeyFor(regionCountries[0].region['en'])
    const pos = regionMarkerPos[key]
    return { ...project(pos.lon, pos.lat), color: regionColors[key] }
  })
  // Highlight each export country on the map in its region color (match by English name)
  const nameAliases: Record<string, string> = {
    'UAE': 'United Arab Emirates',
    'United States': 'United States of America',
    'UK': 'United Kingdom',
    'Ivory Coast': "Côte d'Ivoire",
    'Congo': 'Dem. Rep. Congo',
  }
  const mapNames = new Set(COUNTRY_NAMES)
  const highlights: MapHighlight[] = countries.flatMap((c) => {
    const en = c.name['en']
    const mapName = mapNames.has(en) ? en : nameAliases[en]
    return mapName ? [{ name: mapName, color: regionColors[regionKeyFor(c.region['en'])] }] : []
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

        {/* Global reach panel: dotted world map */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0a2f52 0%, #0d4d85 55%, #126aa8 100%)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(10,47,82,0.35)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '2rem', lineHeight: 1.2 }}>
              {lang === 'ar' ? `+${countries.length}` : `${countries.length}+`}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '1.05rem' }}>
              {lang === 'ar' ? 'دولة نصدّر إليها' : 'Export Countries'}
            </div>
          </div>
          <ExportMap markers={markers} highlights={highlights} />
          <div
            style={{
              display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1.25rem',
            }}
          >
            {Object.entries(groupedRegions).map(([regionName, regionCountries]) => {
              const color = getColorForRegion(regionCountries[0].region['en'])
              return (
                <span
                  key={regionName}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'white', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {regionName} ({regionCountries.length})
                </span>
              )
            })}
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
