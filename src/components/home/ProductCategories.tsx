import Image from 'next/image'
import Link from 'next/link'
import ScrollAnimation from '@/components/ScrollAnimation'
import type { HomeCategoriesConfig, HomeLocale } from '@/types/home.types'
import type { CategoryDocument } from '@/types/categories.types'

interface Props {
  lang: HomeLocale
  config: HomeCategoriesConfig
  categories: CategoryDocument[]
}

export default function ProductCategories({ lang, config, categories }: Props) {
  return (
    <section className="section" id="categories">
      <div className="container">
        {/* Header */}
        <ScrollAnimation>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">{config.label[lang]}</span>
            <div className="divider" style={{ margin: '0.75rem auto 1rem' }} />
            <h2 className="section-title">{config.title[lang]}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {config.subtitle[lang]}
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
          {categories.map((cat, i) => (
            <ScrollAnimation key={cat.id} delay={i * 80}>
              <div className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#f3f4f6' }}>
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1F2937', marginBottom: '0.5rem' }}>
                    {cat.name[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                    {cat.description[lang as 'en'|'ar'|'tr'|'pl'|'de'|'fr']}
                  </p>
                  <Link
                    href={`/${lang}/products?cat=${cat.id}`}
                    className="btn-outline"
                    style={{ alignSelf: 'flex-start' }}
                    id={`cat-${cat.id}`}
                  >
                    {config.viewDetails[lang]}
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
