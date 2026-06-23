import Image from 'next/image'
import Link from 'next/link'
import ScrollAnimation from '@/components/ScrollAnimation'
import type { Locale } from '@/dictionaries'

const categoryImages: Record<string, string> = {
  milk: '/images/cat_milk.png',
  cheese: '/images/cat_cheese.png',
  butter: '/images/cat_butter.png',
  cream: '/images/cat_cream.png',
  milkPowder: '/images/cat_milk.png',
  ingredients: '/images/cat_cheese.png',
}

const categoryIcons: Record<string, string> = {
  milk: '🥛',
  cheese: '🧀',
  butter: '🧈',
  cream: '🍶',
  milkPowder: '🥣',
  ingredients: '🔬',
}

interface Props {
  lang: Locale
  t: {
    label: string
    title: string
    subtitle: string
    items: Record<string, { name: string; desc: string }>
    viewDetails: string
  }
}

export default function ProductCategories({ lang, t }: Props) {
  return (
    <section className="section" id="categories">
      <div className="container">
        {/* Header */}
        <ScrollAnimation>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{t.label}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{t.title}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t.subtitle}
            </p>
          </div>
        </ScrollAnimation>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {Object.entries(t.items).map(([key, item], i) => (
            <ScrollAnimation key={key} delay={i * 80}>
              <div className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <Image
                    src={categoryImages[key] || '/images/cat_milk.png'}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: lang === 'ar' ? 'auto' : '0.75rem',
                      right: lang === 'ar' ? '0.75rem' : 'auto',
                      fontSize: '1.75rem',
                      background: 'white',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    {categoryIcons[key]}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1F2937', marginBottom: '0.5rem' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                    {item.desc}
                  </p>
                  <Link
                    href={`/${lang}/products?cat=${key}`}
                    className="btn-outline"
                    style={{ alignSelf: 'flex-start' }}
                    id={`cat-${key}`}
                  >
                    {t.viewDetails}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={lang === 'ar' ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'} />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
