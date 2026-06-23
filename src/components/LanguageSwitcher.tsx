'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/dictionaries'

const locales: { code: Locale; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'tr', label: 'TR', name: 'Türkçe' },
  { code: 'pl', label: 'PL', name: 'Polski' },
]

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  function getLocalePath(targetLocale: Locale) {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <div 
      className="lang-switcher" 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className="lang-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
          {locales.find((l) => l.code === currentLang)?.label}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="lang-dropdown">
          {locales.map((locale) => (
            <Link
              key={locale.code}
              href={getLocalePath(locale.code)}
              className={`lang-option ${currentLang === locale.code ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {locale.name}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .lang-trigger {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          border: 1.5px solid rgba(22,157,247,0.3);
          color: #1F2937;
          transition: all 0.2s;
          background: white;
        }
        .lang-trigger:hover {
          border-color: #169DF7;
          background: #f0f9ff;
        }
        .lang-dropdown {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          border: 1px solid rgba(22,157,247,0.12);
          overflow: hidden;
          min-width: 120px;
          z-index: 9999;
        }
        [dir="rtl"] .lang-dropdown {
          right: auto;
          left: 0;
        }
        .lang-option {
          display: block;
          padding: 0.6rem 1rem;
          text-decoration: none;
          color: #1F2937;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .lang-option:hover { background: #f0f9ff; }
        .lang-option.active { background: #e0f2fe; color: #169DF7; font-weight: 700; }
      `}</style>
    </div>
  )
}
