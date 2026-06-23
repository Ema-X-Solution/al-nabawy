import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.certifications.heroTitle }
}

const certs = [
  { key: 'iso', title: 'ISO 22000', emoji: '🏅', color: '#169DF7', validity: '2026', desc: 'International Food Safety Management System standard ensuring the highest level of food safety at all stages of production and distribution.' },
  { key: 'haccp', title: 'HACCP', emoji: '✅', color: '#8BC34A', validity: '2026', desc: 'Hazard Analysis and Critical Control Points — a systematic preventive approach to food safety from biological, chemical, and physical hazards.' },
  { key: 'halal', title: 'HALAL', emoji: '☪️', color: '#4FC3F7', validity: '2026', desc: 'Certified Halal by recognized international Islamic authorities, ensuring all products comply with Islamic dietary laws.' },
  { key: 'fda', title: 'FDA Registered', emoji: '🏛️', color: '#1F2937', validity: '2026', desc: 'Registered with the United States Food and Drug Administration, compliant with US food safety and labeling regulations.' },
]

export default async function CertificationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.certifications

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {t.heroTitle}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{t.heroSub}</p>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
            {certs.map((cert) => (
              <div
                key={cert.key}
                className="cert-card"
                style={{ borderTop: `4px solid ${cert.color}` }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>{cert.emoji}</div>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: cert.color, marginBottom: '0.75rem' }}>
                  {cert.title}
                </h2>
                <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.9rem' }}>{cert.desc}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f0f9ff', borderRadius: '9999px', padding: '0.3rem 0.9rem', fontSize: '0.8rem', color: '#169DF7', fontWeight: 600 }}>
                  ✓ {t.validity}: {cert.validity}
                </div>
              </div>
            ))}
          </div>

          {/* Commitment section */}
          <div style={{ marginTop: '4rem', background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '1rem' }}>
              {locale === 'ar' ? 'التزامنا بالجودة' : 'Our Commitment to Quality'}
            </h2>
            <p style={{ opacity: 0.9, maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
              {locale === 'ar'
                ? 'نحن ملتزمون بالحفاظ على أعلى معايير سلامة الغذاء والجودة في كل مرحلة من مراحل الإنتاج.'
                : 'We are committed to maintaining the highest food safety and quality standards at every stage of production, from raw materials to final packaging.'}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
