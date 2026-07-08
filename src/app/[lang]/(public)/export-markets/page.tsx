import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import { getExportMarketsConfig } from '@/app/actions/exportMarketsActions'
import { Icons } from '@/lib/icons'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dbConfig = await getExportMarketsConfig()
  const title = dbConfig?.heroTitle?.[lang as Locale] || 'Export Markets'
  return { title }
}

export default async function ExportMarketsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.exportMarkets
  const isAr = locale === 'ar'
  
  const dbConfig = await getExportMarketsConfig()
  
  const heroTitle = dbConfig?.heroTitle?.[locale] || t.heroTitle
  const heroSub = dbConfig?.heroSub?.[locale] || t.heroSub
  
  const countriesLabel = dbConfig?.countriesLabel?.[locale] || t.countriesLabel
  const countriesTitle = dbConfig?.countriesTitle?.[locale] || t.countriesLabel
  
  const logisticsLabel = dbConfig?.logisticsLabel?.[locale] || t.logisticsLabel
  const logisticsTitle = dbConfig?.logisticsTitle?.[locale] || t.logisticsTitle
  const logisticsBody = dbConfig?.logisticsBody?.[locale] || t.logisticsBody

  const countries = dbConfig?.countries || []
  
  // Extract unique regions dynamically based on English to group them correctly regardless of current language
  const regionsEn = Array.from(new Set(countries.map(c => c.region?.en).filter(Boolean))) as string[]

  const steps = Object.values(t.steps)
  const stepIcons = [
    <Icons.ClipboardList key={0} size={28} color="white" />,
    <Icons.CircleDollarSign key={1} size={28} color="white" />,
    <Icons.Factory key={2} size={28} color="white" />,
    <Icons.Package key={3} size={28} color="white" />,
    <Icons.Ship key={4} size={28} color="white" />,
    <Icons.CheckCircle key={5} size={28} color="white" />,
  ]

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {heroTitle}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{heroSub}</p>
      </section>

      {/* Countries */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{countriesLabel}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{countriesTitle}</h2>
          </div>

          {regionsEn.map((regionEnStr) => {
            // Find the translation of this region from the first country in it
            const firstCountry = countries.find(c => c.region?.en === regionEnStr)
            const regionDisplayName = firstCountry?.region?.[locale] || regionEnStr

            // Hardcoded color fallback just to keep styling alive
            const regionColors: Record<string, string> = { 'Middle East': '#169DF7', Europe: '#8BC34A', Africa: '#FF9800' }
            const color = regionColors[regionEnStr] || '#169DF7'
            
            return (
              <div key={regionEnStr} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, color, fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: `2px solid ${color}30` }}>
                  {regionDisplayName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {countries.filter((c) => c.region?.en === regionEnStr).map((c) => (
                    <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'white', border: `1px solid ${color}30`, borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '1.2rem' }}>{c.flag}</span>
                      <span>{c.name?.[locale] || c.name?.en}</span>
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Export Process Timeline */}
      <section className="section bg-section-light">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{t.processLabel}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{t.processTitle}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem' }}>
            {steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.75rem', boxShadow: '0 4px 16px rgba(22,157,247,0.3)' }}>
                  {stepIcons[i]}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#169DF7', marginBottom: '0.25rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2937' }}>{step}</div>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', color: '#BEE9FF', fontSize: '1.2rem' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">{logisticsLabel}</span>
              <div className="divider" />
              <h2 className="section-title">{logisticsTitle}</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>{logisticsBody}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { icon: <Icons.Ship size={20} color="#169DF7" />, label: (t as any).logisticsSea || (locale === 'ar' ? 'شحن بحري' : 'Sea Freight') },
                  { icon: <Icons.Plane size={20} color="#169DF7" />, label: (t as any).logisticsAir || (locale === 'ar' ? 'شحن جوي' : 'Air Freight') },
                  { icon: <Icons.Truck size={20} color="#169DF7" />, label: (t as any).logisticsRoad || (locale === 'ar' ? 'نقل بري' : 'Road Transport') },
                  { icon: <Icons.Snowflake size={20} color="#169DF7" />, label: (t as any).logisticsReefer || (locale === 'ar' ? 'حاويات مبردة' : 'Reefer Containers') },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid rgba(22,157,247,0.1)' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span style={{ fontWeight: 500, fontSize: '0.85rem', color: '#374151' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#e0f2fe,#f0f9ff)', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Globe size={96} color="#169DF7" strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
