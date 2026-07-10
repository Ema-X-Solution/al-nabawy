'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/dictionaries'

const locales: { code: Locale; label: string; name: string; flagUrl: string }[] = [
  { code: 'en', label: 'EN', name: 'English',  flagUrl: 'https://flagcdn.com/gb.svg' },
  { code: 'ar', label: 'AR', name: 'العربية',  flagUrl: 'https://flagcdn.com/eg.svg' },
  { code: 'tr', label: 'TR', name: 'Türkçe',   flagUrl: 'https://flagcdn.com/tr.svg' },
  { code: 'pl', label: 'PL', name: 'Polski',   flagUrl: 'https://flagcdn.com/pl.svg' },
  { code: 'de', label: 'DE', name: 'Deutsch',  flagUrl: 'https://flagcdn.com/de.svg' },
  { code: 'fr', label: 'FR', name: 'Français', flagUrl: 'https://flagcdn.com/fr.svg' },
]

export default function LanguageSwitcher({ currentLang, scrolled = false }: { currentLang: Locale; scrolled?: boolean }) {
  const pathname  = usePathname()
  const [isOpen, setIsOpen]   = useState(false)
  const [pinned, setPinned]   = useState(false)   // true = clicked open, stays open until click-outside
  const containerRef = useRef<HTMLDivElement>(null)
  const isRtl = currentLang === 'ar'

  /* ── Color tokens based on scroll state ── */
  const colors = scrolled
    ? {
        text: '#1F2937',
        border: pinned ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.12)',
        bg: pinned ? 'rgba(0,0,0,0.06)' : 'transparent',
        hoverBg: 'rgba(0,0,0,0.05)',
        hoverBorder: 'rgba(0,0,0,0.2)',
        restBg: 'transparent',
        restBorder: 'rgba(0,0,0,0.12)',
      }
    : {
        text: '#fff',
        border: pinned ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
        bg: pinned ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
        hoverBg: 'rgba(255,255,255,0.2)',
        hoverBorder: 'rgba(255,255,255,0.6)',
        restBg: 'rgba(255,255,255,0.1)',
        restBorder: 'rgba(255,255,255,0.3)',
      }

  /* Close on click outside */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setPinned(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function getLocalePath(targetLocale: Locale) {
    if (!pathname) return `/${targetLocale}`
    const segments = pathname.split('/').filter(Boolean)
    if (locales.some(l => l.code === segments[0])) {
      segments[0] = targetLocale
    } else {
      segments.unshift(targetLocale)
    }
    return '/' + segments.join('/')
  }

  const currentLocale = locales.find((l) => l.code === currentLang)

  /* ── Hover handlers – only act when not pinned via click ── */
  function onMouseEnter() { if (!pinned) setIsOpen(true) }
  function onMouseLeave() { if (!pinned) setIsOpen(false) }

  /* ── Click handler – pin/unpin the dropdown ── */
  function onTriggerClick() {
    const next = !pinned
    setPinned(next)
    setIsOpen(next)
  }

  /* ── Pick a language ── */
  function onSelect() {
    setIsOpen(false)
    setPinned(false)
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Trigger ── */}
      <button
        type="button"
        dir="ltr"
        onClick={onTriggerClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '8px 14px',
          borderRadius: 9999,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          background: colors.bg,
          backdropFilter: scrolled ? 'none' : 'blur(4px)',
          WebkitBackdropFilter: scrolled ? 'none' : 'blur(4px)',
          boxShadow: pinned ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
          userSelect: 'none',
          outline: 'none',
          transition: 'all 300ms',
        }}
        onMouseEnter={(e) => {
          if (!pinned) {
            e.currentTarget.style.background = colors.hoverBg
            e.currentTarget.style.borderColor = colors.hoverBorder
          }
        }}
        onMouseLeave={(e) => {
          if (!pinned) {
            e.currentTarget.style.background = colors.restBg
            e.currentTarget.style.borderColor = colors.restBorder
          }
        }}
      >
        <Image
          src={currentLocale!.flagUrl}
          alt={currentLocale!.label}
          width={22}
          height={15}
          style={{ borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
          unoptimized
        />
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '0.025em' }}>{currentLocale?.label}</span>
        <svg
          style={{
            width: 14,
            height: 14,
            opacity: 0.7,
            transition: 'transform 300ms',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Dropdown ── */}
      <div
        dir="ltr"
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          ...(isRtl ? { left: 0 } : { right: 0 }),
          width: 210,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 16px 48px -8px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scaleY(1)' : 'scaleY(0.95)',
          transformOrigin: 'top',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 200ms, transform 200ms',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f0f0f0' }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Select Language
          </p>
        </div>

        {/* Items */}
        <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {locales.map((locale) => {
            const isActive = currentLang === locale.code
            return (
              <Link
                key={locale.code}
                href={getLocalePath(locale.code)}
                onClick={onSelect}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#169DF7' : '#374151',
                  background: isActive ? '#f0f9ff' : 'transparent',
                  transition: 'background 150ms, color 150ms',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f9fafb'
                    e.currentTarget.style.color = '#111827'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#374151'
                  }
                }}
              >
                <Image
                  src={locale.flagUrl}
                  alt={locale.label}
                  width={24}
                  height={16}
                  style={{ borderRadius: 3, objectFit: 'cover', flexShrink: 0 }}
                  unoptimized
                />
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{locale.name}</span>
                {isActive && (
                  <svg style={{ width: 16, height: 16, color: '#169DF7', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
