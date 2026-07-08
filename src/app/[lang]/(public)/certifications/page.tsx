import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import { getCertificationsConfig } from '@/app/actions/certificationsActions'
import Image from 'next/image'
import { Icons } from '@/lib/icons'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.certifications.heroTitle }
}

export default async function CertificationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.certifications

  const dbConfig = await getCertificationsConfig()
  const isAr = locale === 'ar'

  const heroTitle = dbConfig?.heroTitle?.[locale] || (isAr ? (dbConfig as any)?.heroTitleAr : (dbConfig as any)?.heroTitleEn) || t.heroTitle
  const heroSub = dbConfig?.heroSub?.[locale] || (isAr ? (dbConfig as any)?.heroSubAr : (dbConfig as any)?.heroSubEn) || t.heroSub

  // Only show published items, sorted by order
  const items = (dbConfig?.items || [])
    .filter(c => c.status === 'published')
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {heroTitle}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{heroSub}</p>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
            {items.map((cert) => (
              <div
                key={cert.id}
                className="cert-card"
                style={{ borderTop: `4px solid ${cert.color}` }}
              >
                {/* Certificate Image (primary) */}
                <div style={{ position: 'relative', width: '100%', height: '160px', marginBottom: '1.25rem', background: '#f9fafb', borderRadius: '8px', overflow: 'hidden' }}>
                  {cert.image ? (
                    <Image
                      src={cert.image}
                      alt={cert.title?.[locale] || (isAr ? (cert as any).titleAr : (cert as any).titleEn)}
                      fill
                      style={{ objectFit: 'contain', padding: '12px' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#d1d5db' }}><Icons.ClipboardList size={48} /></div>
                  )}
                </div>

                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: cert.color, marginBottom: '0.75rem' }}>
                  {cert.title?.[locale] || (isAr ? (cert as any).titleAr : (cert as any).titleEn)}
                </h2>
                <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {cert.desc?.[locale] || (isAr ? (cert as any).descAr : (cert as any).descEn)}
                </p>

                {/* Validity badge */}
                {cert.validUntil && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f0f9ff', borderRadius: '9999px', padding: '0.3rem 0.9rem', fontSize: '0.8rem', color: '#169DF7', fontWeight: 600 }}>
                    <Icons.CheckCircle size={16} /> {t.validity}: {cert.validUntil}
                  </div>
                )}
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
