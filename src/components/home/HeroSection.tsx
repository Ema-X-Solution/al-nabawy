import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/dictionaries'

interface HeroSectionProps {
  lang: Locale
  t: {
    headline: string
    headlineSub: string
    subheadline: string
    cta1: string
    cta2: string
  }
}

export default function HeroSection({ lang, t }: HeroSectionProps) {
  return (
    <section className="hero-section" id="hero">
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/images/hero_bg.png"
          alt="Al-Nabawy dairy products"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={90}
        />
        {/* Blue overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(22,157,247,0.88) 0%, rgba(15,80,140,0.82) 60%, rgba(22,157,247,0.7) 100%)',
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, white, transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '700px' }}>
          {/* Badge */}

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              marginTop: '1.5rem',
              marginBottom: '1rem',
              animation: 'fadeUp 0.8s ease 0.3s both',
              textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'Poppins, sans-serif',
            }}
          >
            {t.headline}
            <br />
            <span style={{ color: '#BEE9FF' }}>{t.headlineSub}</span>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              animation: 'fadeUp 0.8s ease 0.45s both',
              maxWidth: '540px',
            }}
          >
            {t.subheadline}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              animation: 'fadeUp 0.8s ease 0.6s both',
            }}
          >
            <Link href={`/${lang}/products`} className="btn-primary" id="hero-cta-products">
              {t.cta1}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Link>
            <Link href={`/${lang}/contact`} className="btn-secondary" id="hero-cta-contact">
              {t.cta2}
            </Link>
          </div>
        </div>

        {/* Stats chips */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '4rem',
            flexWrap: 'wrap',
            animation: 'fadeUp 0.8s ease 0.75s both',
          }}
        >
          {[
            { num: '15+', label: lang === 'ar' ? 'سنوات خبرة' : 'Years Experience' },
            { num: '20+', label: lang === 'ar' ? 'منتج ألبان' : 'Dairy Products' },
            { num: '17+', label: lang === 'ar' ? 'دولة تصدير' : 'Export Countries' },
          ].map((stat) => (
            <div key={stat.label} className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{stat.num}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.15rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          animation: 'float 2s ease-in-out infinite',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </div>
    </section>
  )
}
