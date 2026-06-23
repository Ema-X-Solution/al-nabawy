import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/dictionaries'

interface FooterProps {
  lang: Locale
  t: {
    slogan: string
    quickLinks: string
    products: string
    contactInfo: string
    address: string
    copyright: string
    privacy: string
    terms: string
  }
  navT: {
    home: string
    about: string
    products: string
    gallery: string
    certifications: string
    export: string
    contact: string
  }
  catT: { items: Record<string, { name: string }> }
}

export default function Footer({ lang, t, navT, catT }: FooterProps) {
  return (
    <footer style={{ background: '#0f1929', color: 'rgba(255,255,255,0.8)', marginTop: 'auto' }}>
      {/* Main */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Image src="/images/logo.png" alt="Al-Nabawy" width={100} height={100} />      
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{t.slogan}</p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Instagram', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                { label: 'LinkedIn', path: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z M9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
              {t.quickLinks}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: `/${lang}`, label: navT.home },
                { href: `/${lang}/about`, label: navT.about },
                { href: `/${lang}/certifications`, label: navT.certifications },
                { href: `/${lang}/export-markets`, label: navT.export },
                { href: `/${lang}/gallery`, label: navT.gallery },
                { href: `/${lang}/contact`, label: navT.contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span style={{ color: '#169DF7', fontSize: '0.7rem' }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
              {t.products}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(catT.items).map(([key, val]) => (
                <li key={key}>
                  <Link
                    href={`/${lang}/products?cat=${key}`}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span style={{ color: '#169DF7', fontSize: '0.7rem' }}>▶</span>
                    {val.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
              {t.contactInfo}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '📍', text: t.address },
                { icon: '📞', text: '+20 123 456 7890' },
                { icon: '💬', text: '+20 123 456 789 (WhatsApp)' },
                { icon: '✉️', text: 'info@alnabawy.com' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.875rem', alignItems: 'flex-start' }}>
                  <span>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          className="container"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          <span>{t.copyright}</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              {t.privacy}
            </Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              {t.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
