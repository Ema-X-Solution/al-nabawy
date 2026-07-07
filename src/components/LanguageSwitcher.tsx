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

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname  = usePathname()
  const [isOpen, setIsOpen]   = useState(false)
  const [pinned, setPinned]   = useState(false)   // true = clicked open, stays open until click-outside
  const containerRef = useRef<HTMLDivElement>(null)
  const isRtl = currentLang === 'ar'

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
      className="relative inline-block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Trigger ── */}
      <button
        type="button"
        dir="ltr"
        onClick={onTriggerClick}
        className={`flex items-center gap-2 cursor-pointer px-3.5 py-2 rounded-full border text-white transition-all duration-300 backdrop-blur-sm select-none outline-none
          ${pinned
            ? 'bg-white/25 border-white/70 shadow-md'
            : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/60'
          }`}
      >
        <Image
          src={currentLocale!.flagUrl}
          alt={currentLocale!.label}
          width={22}
          height={15}
          className="rounded-sm object-cover flex-shrink-0"
          unoptimized
        />
        <span className="font-semibold text-sm tracking-wide">{currentLocale?.label}</span>
        <svg
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
        className={`absolute top-[calc(100%+8px)] flex flex-col bg-white rounded-2xl z-[9999] transition-all duration-200 origin-top
          ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}
        style={{
          width: 200,
          boxShadow: '0 16px 48px -8px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.06)',
          ...(isRtl ? { left: 0 } : { right: 0 }),
        }}
      >
        {/* Header */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
            Select Language
          </p>
        </div>

        {/* Items */}
        <div className="py-2 px-2 flex flex-col gap-0.5">
          {locales.map((locale) => {
            const isActive = currentLang === locale.code
            return (
              <Link
                key={locale.code}
                href={getLocalePath(locale.code)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline text-sm transition-all duration-150 group
                  ${isActive
                    ? 'bg-sky-50 text-[#169DF7] font-semibold'
                    : 'text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900'
                  }`}
                onClick={onSelect}
              >
                <Image
                  src={locale.flagUrl}
                  alt={locale.label}
                  width={24}
                  height={16}
                  className="rounded-[3px] object-cover flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-150"
                  unoptimized
                />
                <span className="flex-1 whitespace-nowrap">{locale.name}</span>
                {isActive
                  ? (
                    <svg className="w-4 h-4 text-[#169DF7] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )
                }
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
