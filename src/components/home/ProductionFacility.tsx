import Image from 'next/image'
import Link from 'next/link'
import type { HomeFacility, HomeLocale } from '@/types/home.types'
import VideoSpot from '@/components/home/VideoSpot'
import { Icons } from '@/lib/icons'

interface Props {
  lang: HomeLocale
  config: HomeFacility
}

export default function ProductionFacility({ lang, config }: Props) {
  return (
    <section className="section bg-section-light" id="facility">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-label">{config.label[lang]}</span>
          <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
          <h2 className="section-title">{config.title[lang]}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>{config.subtitle[lang]}</p>
        </div>

        {/* Wide video spot (plays on click) with image fallback */}
        <div style={{ marginBottom: '1.5rem' }}>
          <VideoSpot
            poster={config.image?.secure_url || "/images/factory.png"}
            videoUrl={config.video?.secure_url || '/videos/al-nabawy-facility.mp4'}
            alt="Al-Nabawy production facility"
            height={460}
            mobileAspect="21 / 8"
            overlay={
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(22,157,247,0.6) 0%, transparent 50%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '2.5rem',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ pointerEvents: 'auto' }}>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {config.title[lang]}
                  </h3>
                  <Link href={`/${lang}/gallery`} className="btn-secondary" id="facility-gallery-link">
                    {config.viewGallery[lang]}
                  </Link>
                </div>
              </div>
            }
          />
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
            { icon: <Icons.Settings size={28} color="#169DF7" />, label: config.chip1[lang] },
            { icon: <Icons.FlaskConical size={28} color="#169DF7" />, label: config.chip2[lang] },
            { icon: <Icons.Package size={28} color="#169DF7" />, label: config.chip3[lang] },
            { icon: <Icons.Snowflake size={28} color="#169DF7" />, label: config.chip4[lang] },
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
              <span style={{ display: 'flex', alignItems: 'center' }}>{f.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2937' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
