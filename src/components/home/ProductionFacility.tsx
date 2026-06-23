import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: { label: string; title: string; subtitle: string; viewGallery: string }
}

export default function ProductionFacility({ lang, t }: Props) {
  return (
    <section className="section bg-section-light" id="facility">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-label">{t.label}</span>
          <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>{t.subtitle}</p>
        </div>

        {/* Main image */}
        <div
          style={{
            position: 'relative',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(22,157,247,0.15)',
            marginBottom: '1.5rem',
          }}
        >
          <Image
            src="/images/factory.png"
            alt="Al-Nabawy production facility"
            width={1200}
            height={500}
            style={{ width: '100%', height: '460px', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(22,157,247,0.6) 0%, transparent 50%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2.5rem',
            }}
          >
            <div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t.title}
              </h3>
              <Link href={`/${lang}/gallery`} className="btn-secondary" id="facility-gallery-link">
                {t.viewGallery}
              </Link>
            </div>
          </div>
        </div>

        {/* Feature chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { icon: '⚙️', label: lang === 'ar' ? 'خطوط إنتاج حديثة' : 'Modern Production Lines' },
            { icon: '🧪', label: lang === 'ar' ? 'مختبر مراقبة الجودة' : 'Quality Control Lab' },
            { icon: '📦', label: lang === 'ar' ? 'تعبئة متقدمة' : 'Advanced Packaging' },
            { icon: '❄️', label: lang === 'ar' ? 'سلسلة تبريد كاملة' : 'Full Cold Chain' },
          ].map((f) => (
            <div
              key={f.label}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 2px 12px rgba(22,157,247,0.08)',
                border: '1px solid rgba(22,157,247,0.1)',
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>{f.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2937' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
