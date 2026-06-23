import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: { title: string; subtitle: string; quote: string; contact: string }
}

export default function CTASection({ lang, t }: Props) {
  return (
    <section
      className="section"
      id="cta"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <Image
        src="/images/hero_bg.png"
        alt=""
        fill
        style={{ objectFit: 'cover' }}
        quality={70}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg,rgba(22,157,247,0.92),rgba(15,80,140,0.88))',
        }}
      />
      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '1rem',
            fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'Poppins, sans-serif',
          }}
        >
          {t.title}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7, fontSize: '1.05rem' }}>
          {t.subtitle}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href={`/${lang}/contact`} className="btn-primary" style={{ background: 'white', color: '#169DF7', fontSize: '1rem', padding: '0.9rem 2.5rem' }} id="cta-quote">
            {t.quote}
          </Link>
          <Link href={`/${lang}/contact`} className="btn-secondary" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }} id="cta-contact">
            {t.contact}
          </Link>
        </div>
      </div>
    </section>
  )
}
