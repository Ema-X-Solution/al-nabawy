import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.about.heroTitle, description: dict.about.storyBody }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.about
  const isRtl = locale === 'ar'

  const timeline = [
    { year: '2009', event: locale === 'ar' ? 'تأسيس المصنع' : 'Factory Founded' },
    { year: '2012', event: locale === 'ar' ? 'الحصول على شهادة ISO' : 'ISO 22000 Certified' },
    { year: '2015', event: locale === 'ar' ? 'بدء التصدير للخليج' : 'Gulf Export Launched' },
    { year: '2018', event: locale === 'ar' ? 'شهادة حلال وHACCP' : 'HALAL & HACCP Certified' },
    { year: '2020', event: locale === 'ar' ? 'التوسع لأفريقيا وأوروبا' : 'Africa & Europe Expansion' },
    { year: '2024', event: locale === 'ar' ? '17+ دولة مصدّر إليها' : '17+ Countries Served' },
  ]

  const values = [
    { icon: '🎯', label: t.qualityLabel },
    { icon: '🤝', label: t.integrityLabel },
    { icon: '💡', label: t.innovationLabel },
    { icon: '🌱', label: t.sustainLabel },
  ]

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
          {locale === 'ar' ? 'النبوي للألبان' : 'Al-Nabawy Dairy'}
        </span>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, margin: '0.5rem 0', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {t.heroTitle}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{t.heroSub}</p>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">{t.storyLabel}</span>
              <div className="divider" />
              <h2 className="section-title">{t.storyTitle}</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '1.05rem' }}>{t.storyBody}</p>
            </div>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.15)' }}>
              <Image src="/images/factory.png" alt="Factory" width={600} height={400} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section bg-section-light">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
            {[
              { title: t.vision, body: t.visionBody, icon: '👁️', color: '#169DF7' },
              { title: t.mission, body: t.missionBody, icon: '🎯', color: '#8BC34A' },
            ].map((item) => (
              <div key={item.title} style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 24px rgba(22,157,247,0.08)', borderTop: `4px solid ${item.color}` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
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
          <span className="section-label">{t.values}</span>
          <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
          <h2 className="section-title">{t.values}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {values.map((v) => (
              <div key={v.label} style={{ background: '#f0f9ff', borderRadius: '1rem', padding: '1.75rem 1rem', border: '1px solid rgba(22,157,247,0.15)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
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
            <span className="section-label">{t.timelineLabel}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{t.timelineTitle}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
            {timeline.map((item, i) => (
              <div key={item.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,#169DF7,#0d6fb8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.75rem', boxShadow: '0 4px 16px rgba(22,157,247,0.35)' }}>
                  {item.year.slice(2)}
                </div>
                <div style={{ fontWeight: 700, color: '#169DF7', fontSize: '0.9rem' }}>{item.year}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: '1.5rem' }}>
            {locale === 'ar' ? 'تواصل معنا اليوم' : 'Contact Us Today'}
          </h2>
          <Link href={`/${locale}/contact`} className="btn-secondary" style={{ fontSize: '1rem' }}>
            {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </>
  )
}
