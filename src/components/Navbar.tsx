'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import type { Locale } from '@/dictionaries'
import LanguageSwitcher from './LanguageSwitcher'

interface NavbarProps {
  lang: Locale
  t: {
    home: string
    about: string
    products: string
    gallery: string
    certifications: string
    export: string
    contact: string
    requestQuote: string
  }
}

export default function Navbar({ lang, t }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: `/${lang}`, label: t.home },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/products`, label: t.products },
    { href: `/${lang}/gallery`, label: t.gallery },
    { href: `/${lang}/certifications`, label: t.certifications },
    { href: `/${lang}/export-markets`, label: t.export },
    { href: `/${lang}/contact`, label: t.contact },
  ]

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === `/${lang}` : pathname.startsWith(href)

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}
        style={{ padding: '0 1.5rem' }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo */}
          <Link
            href={`/${lang}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
          >
            <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
            
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="desktop-nav"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: isActive(link.href) ? 700 : 500,
                  color: scrolled
                    ? isActive(link.href)
                      ? '#169DF7'
                      : '#1F2937'
                    : isActive(link.href)
                    ? '#BEE9FF'
                    : 'rgba(255,255,255,0.9)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: isActive(link.href)
                    ? scrolled
                      ? 'rgba(22,157,247,0.1)'
                      : 'rgba(255,255,255,0.15)'
                    : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LanguageSwitcher currentLang={lang} />
          
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hamburger"
              aria-label="Menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                color: scrolled ? '#1F2937' : 'white',
                display: 'none',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                {mobileOpen ? (
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                ) : (
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            left: 0,
            right: 0,
            background: 'white',
            zIndex: 999,
            padding: '1rem 1.5rem 1.5rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: isActive(link.href) ? 700 : 500,
                color: isActive(link.href) ? '#169DF7' : '#1F2937',
                textDecoration: 'none',
                background: isActive(link.href) ? '#f0f9ff' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '0.5rem' }}>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
