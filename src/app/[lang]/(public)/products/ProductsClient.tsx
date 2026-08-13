'use client'
import { useState, useMemo } from 'react'
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
  }
  initialProducts: ProductDocument[]
  categories: CategoryDocument[]
}

/** Normalize a string for robust comparison: lowercase + trim */
const norm = (s: string) => (s || '').toLowerCase().trim()

export default function ProductsClient({ lang, t, initialProducts, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string>('all')
  const [search, setSearch] = useState('')

  const localeStr = lang as 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'

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

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          minWidth: '220px',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(22,157,247,0.08)',
          padding: '1.5rem',
          position: 'sticky',
          top: '90px',
          border: '1px solid rgba(22,157,247,0.1)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1F2937', marginBottom: '0.75rem' }}>
          {t.allCategories}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            onClick={() => setActiveCat('all')}
            style={{
              background: activeCat === 'all' ? '#169DF7' : 'transparent',
              color: activeCat === 'all' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.6rem 0.9rem',
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
                borderRadius: '0.5rem',
                padding: '0.6rem 0.9rem',
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

      {/* Products */}
      <div style={{ flex: 1 }}>
        {/* Search */}
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#9ca3af"
            style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }}
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            id="products-search"
          />
        </div>

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
                      left: lang === 'ar' ? 'auto' : '0.6rem',
                      right: lang === 'ar' ? '0.6rem' : 'auto',
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
