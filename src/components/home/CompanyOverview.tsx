import Image from 'next/image'
import Link from 'next/link'
import AnimatedCounter from '@/components/AnimatedCounter'
import ScrollAnimation from '@/components/ScrollAnimation'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: {
    label: string
    title: string
    body: string
    readMore: string
    stats: { years: string; products: string; countries: string }
  }
}

export default function CompanyOverview({ lang, t }: Props) {
  return (
    <section className="section bg-section-light" id="overview">
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Text */}
          <ScrollAnimation direction={lang === 'ar' ? 'right' : 'left'}>
            <span className="section-label">{t.label}</span>
            <div className="divider" />
            <h2 className="section-title">{t.title}</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.05rem' }}>
              {t.body}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { target: 15, suffix: '+', label: t.stats.years },
                { target: 20, suffix: '+', label: t.stats.products },
                { target: 17, suffix: '+', label: t.stats.countries },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href={`/${lang}/about`} className="btn-primary" id="overview-readmore">
              {t.readMore}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={lang === 'ar' ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'} />
              </svg>
            </Link>
          </ScrollAnimation>

          {/* Image */}
          <ScrollAnimation direction={lang === 'ar' ? 'left' : 'right'}>
            <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.2)' }}>
              <Image
                src="/images/factory.png"
                alt="Al-Nabawy factory"
                width={600}
                height={420}
                style={{ width: '100%', height: '380px', objectFit: 'cover' }}
              />
              {/* Play button overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(22,157,247,0.1)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(22,157,247,0.4)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#169DF7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: lang === 'ar' ? 'auto' : '1rem',
                  right: lang === 'ar' ? '1rem' : 'auto',
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1F2937' }}>ISO 22000</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Certified Factory</div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
