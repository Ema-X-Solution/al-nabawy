import ScrollAnimation from '@/components/ScrollAnimation'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: {
    label: string
    title: string
    subtitle: string
    items: Record<string, { title: string; desc: string }>
  }
}

const icons = {
  natural: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-13 4z" />
    </svg>
  ),
  quality: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  ),
  expert: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  global: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
    </svg>
  ),
}

export default function WhyChooseUs({ lang, t }: Props) {
  return (
    <section
      className="section"
      id="why-us"
      style={{ background: 'linear-gradient(135deg,#169DF7 0%,#0d6fb8 100%)' }}
    >
      <div className="container">
        <ScrollAnimation>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              className="section-label"
              style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em' }}
            >
              {t.label}
            </span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem', background: 'rgba(255,255,255,0.4)' }} />
            <h2 className="section-title" style={{ color: 'white' }}>
              {t.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              {t.subtitle}
            </p>
          </div>
        </ScrollAnimation>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Object.entries(t.items).map(([key, item], i) => (
            <ScrollAnimation key={key} delay={i * 100}>
              <div
                className="glass"
                style={{
                  padding: '2rem 1.5rem',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    color: 'white',
                  }}
                >
                  {icons[key as keyof typeof icons]}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
