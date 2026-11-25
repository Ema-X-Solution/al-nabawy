import Image from 'next/image'
import Link from 'next/link'
import AnimatedCounter from '@/components/AnimatedCounter'
import VideoSpot from '@/components/home/VideoSpot'
import ScrollAnimation from '@/components/ScrollAnimation'
import type { HomeOverview, HomeLocale } from '@/types/home.types'
import { Icons } from '@/lib/icons'

interface Props {
  lang: HomeLocale
  config: HomeOverview
  countriesCount?: number
}

export default function CompanyOverview({ lang, config, countriesCount }: Props) {
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
            <span className="section-label">{config.label[lang]}</span>
            <div className="divider" />
            <h2 className="section-title">{config.title[lang]}</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.05rem' }}>
              {config.body[lang]}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { target: 15, suffix: '+', label: config.statsYears[lang] },
                { target: 20, suffix: '+', label: config.statsProducts[lang] },
                { target: countriesCount ?? 17, suffix: '+', label: config.statsCountries[lang] },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href={`/${lang}/about`} className="btn-primary" id="overview-readmore">
              {config.readMore[lang]}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={lang === 'ar' ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'} />
              </svg>
            </Link>
          </ScrollAnimation>

          {/* Image / video spot */}
          <ScrollAnimation direction={lang === 'ar' ? 'left' : 'right'}>
            <VideoSpot
              poster={config.image?.secure_url || "/images/factory.png"}
              videoUrl={config.video?.secure_url || '/videos/al-nabawy-brand.mp4'}
              alt="Al-Nabawy factory"
              height={380}
              mobileAspect="3 / 2"
              overlay={
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
                  <span style={{ display: 'flex', alignItems: 'center' }}><Icons.Trophy size={24} color="#f59e0b" /></span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1F2937' }}>ISO 22000</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Certified Factory</div>
                  </div>
                </div>
              }
            />
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
