import ScrollAnimation from '@/components/ScrollAnimation'
import type { HomeCertificationsConfig, HomeLocale } from '@/types/home.types'
import { Icons } from '@/lib/icons'

import type { CertificationsDocument } from '@/types/certifications.types'

interface Props {
  lang: HomeLocale
  config: HomeCertificationsConfig
  certsData?: CertificationsDocument
}

export default function CertificationsSection({ lang, config, certsData }: Props) {
  // Use dynamic items if available, else empty array
  const items = certsData?.items?.filter(item => item.status === 'published').sort((a, b) => a.order - b.order) || []

  return (
    <section className="section" id="certs">
      <div className="container">
        <ScrollAnimation>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{config.label[lang]}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{config.title[lang]}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>{config.subtitle[lang]}</p>
          </div>
        </ScrollAnimation>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {items.slice(0, config.maxItems).map((item, i) => (
            <ScrollAnimation key={item.id} delay={i * 100}>
              <div
                className="cert-card"
                style={{ borderTop: `4px solid ${item.color || '#169DF7'}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                  ) : (
                    <Icons.Award size={48} color={item.color || "#169DF7"} />
                  )}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    color: item.color || '#169DF7',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.title[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{item.desc[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
