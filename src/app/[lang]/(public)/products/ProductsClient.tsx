'use client'
import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/dictionaries'
import type { ProductDocument } from '@/types/products.types'
import type { CategoryDocument } from '@/types/categories.types'

interface Props {
  lang: Locale
  t: {
    search: string
    allCategories: string
    viewDetails: string
    noResults: string
    filter?: string
    close?: string
  }
  initialProducts: ProductDocument[]
  categories: CategoryDocument[]
}

/** Normalize a string for robust comparison: lowercase + trim */
const norm = (s: string) => (s || '').toLowerCase().trim()

export default function ProductsClient({ lang, t, initialProducts, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const localeStr = lang as 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'
  const isRtl = lang === 'ar'

  const filterText = t.filter || (isRtl ? 'تصفية الفئات' : 'Filter')
  const closeText = t.close || (isRtl ? 'إغلاق' : 'Close')

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileDrawerOpen])

  const filtered = useMemo(() => {
    if (activeCat === 'all' && !search) return initialProducts

    const activeCatDoc = activeCat !== 'all'
      ? categories.find(c => norm(c.id) === norm(activeCat))
      : null

    return initialProducts.filter((p) => {
      let matchCat = true
      if (activeCat !== 'all') {
        const pc = norm(p.category)
        // Match by: exact id, normalized id, slug, or normalized slug
        matchCat =
          pc === norm(activeCat) ||
          (activeCatDoc !== undefined && activeCatDoc !== null && (
            pc === norm(activeCatDoc.slug) ||
            pc === norm(activeCatDoc.id)
          ))
      }
      const matchSearch =
        !search ||
        p.name[localeStr]?.toLowerCase().includes(search.toLowerCase()) ||
        p.description[localeStr]?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCat, search, initialProducts, localeStr, categories])

  const activeCategoryName = useMemo(() => {
    if (activeCat === 'all') return t.allCategories
    const found = categories.find(c => c.id === activeCat)
    return found ? found.name[localeStr] : t.allCategories
  }, [activeCat, categories, localeStr, t.allCategories])

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside
        className="hidden md:block"
        style={{
          width: '240px',
          minWidth: '240px',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(22,157,247,0.08)',
          padding: '1.5rem',
          position: 'sticky',
          top: '90px',
          border: '1px solid rgba(22,157,247,0.1)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#169DF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          {t.allCategories}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            onClick={() => setActiveCat('all')}
            style={{
              background: activeCat === 'all' ? '#169DF7' : 'transparent',
              color: activeCat === 'all' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.6rem',
              padding: '0.65rem 1rem',
              textAlign: 'start',
              cursor: 'pointer',
              fontWeight: activeCat === 'all' ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              style={{
                background: activeCat === cat.id ? '#169DF7' : 'transparent',
                color: activeCat === cat.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.6rem',
                padding: '0.65rem 1rem',
                textAlign: 'start',
                cursor: 'pointer',
                fontWeight: activeCat === cat.id ? 700 : 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
            >
              {cat.name[localeStr]}
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Sidebar Drawer Modal */}
      {isMobileDrawerOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            justifyContent: isRtl ? 'flex-start' : 'flex-end',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />

          {/* Drawer content */}
          <div
            style={{
              position: 'relative',
              zIndex: 10000,
              width: '280px',
              maxWidth: '85vw',
              height: '100%',
              background: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              overflowY: 'auto',
              animation: isRtl ? 'slideInLeft 0.25s ease' : 'slideInRight 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#169DF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                {t.allCategories}
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label={closeText}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4b5563',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <button
                onClick={() => {
                  setActiveCat('all')
                  setIsMobileDrawerOpen(false)
                }}
                style={{
                  background: activeCat === 'all' ? '#169DF7' : '#f9fafb',
                  color: activeCat === 'all' ? 'white' : '#374151',
                  border: activeCat === 'all' ? 'none' : '1px solid #f3f4f6',
                  borderRadius: '0.6rem',
                  padding: '0.75rem 1rem',
                  textAlign: 'start',
                  cursor: 'pointer',
                  fontWeight: activeCat === 'all' ? 700 : 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                }}
              >
                {t.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCat(cat.id)
                    setIsMobileDrawerOpen(false)
                  }}
                  style={{
                    background: activeCat === cat.id ? '#169DF7' : '#f9fafb',
                    color: activeCat === cat.id ? 'white' : '#374151',
                    border: activeCat === cat.id ? 'none' : '1px solid #f3f4f6',
                    borderRadius: '0.6rem',
                    padding: '0.75rem 1rem',
                    textAlign: 'start',
                    cursor: 'pointer',
                    fontWeight: activeCat === cat.id ? 700 : 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat.name[localeStr]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Products Area */}
      <div style={{ flex: 1, width: '100%' }}>
        {/* Search & Mobile Filter Bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.25rem',
              background: '#169DF7',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(22,157,247,0.25)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>{filterText}</span>
          </button>

          {/* Search Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#9ca3af"
              style={{
                position: 'absolute',
                top: '50%',
                left: isRtl ? 'auto' : '1rem',
                right: isRtl ? '1rem' : 'auto',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: isRtl ? '1rem' : '2.75rem',
                paddingRight: isRtl ? '2.75rem' : '1rem',
              }}
              id="products-search"
            />
          </div>
        </div>

        {/* Selected Category Pill (on mobile when a category is selected) */}
        {activeCat !== 'all' && (
          <div className="md:hidden" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {isRtl ? 'التصنيف المحدد:' : 'Selected:'}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(22,157,247,0.1)',
                color: '#169DF7',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {activeCategoryName}
              <button
                onClick={() => setActiveCat('all')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#169DF7',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  fontSize: '0.9rem',
                }}
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>{t.noResults}</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
              gap: '1.25rem',
            }}
          >
            {filtered.map((p) => (
              <div key={p.slug} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name[localeStr]}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#9ca3af' }}>No Image</div>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.6rem',
                      left: isRtl ? 'auto' : '0.6rem',
                      right: isRtl ? '0.6rem' : 'auto',
                      background: '#169DF7',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {categories.find(c => c.id === p.category)?.name[localeStr] || p.category}
                  </span>
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2937', marginBottom: '0.4rem' }}>
                    {p.name[localeStr]}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5, flex: 1, marginBottom: '0.75rem' }}>
                    {p.description[localeStr]?.slice(0, 80)}...
                  </p>
                  <Link
                    href={`/${lang}/products/${encodeURIComponent(p.slug || p.id)}`}
                    className="btn-outline"
                    style={{ alignSelf: 'flex-start', fontSize: '0.8rem', padding: '0.4rem 1rem' }}
                  >
                    {t.viewDetails}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

