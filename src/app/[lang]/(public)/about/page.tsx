import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAboutConfig } from '@/app/actions/aboutActions'
import type { AboutDocument, AboutLocale } from '@/types/about.types'
import { Icons } from '@/lib/icons'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const config = await getAboutConfig()
  const locale = lang as AboutLocale
  return { title: config.hero.title[locale], description: config.story.body[locale] }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as AboutLocale
  const isRtl = locale === 'ar'

  const config = await getAboutConfig()

  const values = [
    { icon: <Icons.Target size={40} color="#169DF7" />, label: config.values.quality[locale] },
    { icon: <Icons.Users size={40} color="#169DF7" />, label: config.values.integrity[locale] },
    { icon: <Icons.Star size={40} color="#169DF7" />, label: config.values.innovation[locale] },
    { icon: <Icons.Globe size={40} color="#169DF7" />, label: config.values.sustainability[locale] },
  ]

  // Sort timeline items by order before displaying
  const timeline = [...config.timelineItems].sort((a, b) => a.order - b.order)

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg,#169DF7,#0d6fb8)',
          padding: '8rem 1.5rem 5rem',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', opacity: 0.8 }}>
          {config.hero.badge[locale]}
        </span>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, margin: '0.5rem 0', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {config.hero.title[locale]}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{config.hero.subtitle[locale]}</p>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">{config.story.label[locale]}</span>
              <div className="divider" />
              <h2 className="section-title">{config.story.title[locale]}</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '1.05rem' }}>{config.story.body[locale]}</p>
            </div>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.15)' }}>
              {config.story.image?.secure_url ? (
                <Image src={config.story.image.secure_url} alt="Factory" width={600} height={400} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
              ) : (
                <Image src="/images/factory.png" alt="Factory" width={600} height={400} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section bg-section-light">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
            {[
              { title: config.visionMission.visionTitle[locale], body: config.visionMission.visionBody[locale], icon: <Icons.Target size={40} />, color: '#169DF7' },
              { title: config.visionMission.missionTitle[locale], body: config.visionMission.missionBody[locale], icon: <Icons.Target size={40} />, color: '#8BC34A' },
            ].map((item) => (
              <div key={item.title} style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 24px rgba(22,157,247,0.08)', borderTop: `4px solid ${item.color}` }}>
                <div style={{ marginBottom: '1rem', color: item.color }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.3rem', color: item.color, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">{config.values.sectionTitle[locale]}</span>
          <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
          <h2 className="section-title">{config.values.sectionTitle[locale]}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {values.map((v) => (
              <div key={v.label} style={{ background: '#f0f9ff', borderRadius: '1rem', padding: '1.75rem 1rem', border: '1px solid rgba(22,157,247,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>{v.icon}</div>
                <div style={{ fontWeight: 700, color: '#1F2937' }}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-section-light">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{config.timelineSection.label[locale]}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{config.timelineSection.title[locale]}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
            {timeline.map((item) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,#169DF7,#0d6fb8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.75rem', boxShadow: '0 4px 16px rgba(22,157,247,0.35)' }}>
                  {item.year.slice(-2)}
                </div>
                <div style={{ fontWeight: 700, color: '#169DF7', fontSize: '0.9rem' }}>{item.year}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>{item.event[locale]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: '1.5rem' }}>
            {config.cta.title[locale]}
          </h2>
          <Link href={`/${locale}${config.cta.buttonLink}`} className="btn-secondary" style={{ fontSize: '1rem' }}>
            {config.cta.buttonLabel[locale]}
          </Link>
        </div>
      </section>
    </>
  )
}
