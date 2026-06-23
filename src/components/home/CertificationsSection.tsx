import ScrollAnimation from '@/components/ScrollAnimation'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: { label: string; title: string; subtitle: string; items: Record<string, { title: string; desc: string }> }
}

const certColors: Record<string, string> = {
  iso: '#169DF7',
  haccp: '#8BC34A',
  halal: '#4FC3F7',
  fda: '#1F2937',
}

const certEmoji: Record<string, string> = {
  iso: '🏅',
  haccp: '✅',
  halal: '☪️',
  fda: '🏛️',
}

export default function CertificationsSection({ lang, t }: Props) {
  return (
    <section className="section" id="certs">
      <div className="container">
        <ScrollAnimation>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{t.label}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{t.title}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>{t.subtitle}</p>
          </div>
        </ScrollAnimation>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Object.entries(t.items).map(([key, item], i) => (
            <ScrollAnimation key={key} delay={i * 100}>
              <div
                className="cert-card"
                style={{ borderTop: `4px solid ${certColors[key] || '#169DF7'}` }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{certEmoji[key]}</div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    color: certColors[key] || '#169DF7',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.title}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
