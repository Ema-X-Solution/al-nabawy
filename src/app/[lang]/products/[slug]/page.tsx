import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import { getProductBySlug, getRelatedProducts, products } from '@/data/products'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export function generateStaticParams() {
  const locales: Locale[] = ['en', 'ar', 'tr', 'pl']
  return locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const product = getProductBySlug(slug)
  if (!product) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: product.nameKey, description: product.descKey }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const product = getProductBySlug(slug)
  if (!product) notFound()
  const related = getRelatedProducts(slug, 3)
  const t = dict.productDetail
  const isRtl = locale === 'ar'

  const specs = [
    { label: t.packaging, value: product.packaging },
    { label: t.weight, value: product.weight },
    { label: t.shelfLife, value: product.shelfLife },
    { label: t.storage, value: product.storage },
    { label: t.origin, value: product.origin },
  ]

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem', marginTop: '72px' }}>
        <div className="container" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', alignItems: 'center' }}>
          <Link href={`/${locale}`} style={{ color: '#169DF7', textDecoration: 'none' }}>
            {locale === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>›</span>
          <Link href={`/${locale}/products`} style={{ color: '#169DF7', textDecoration: 'none' }}>
            {dict.products.heroTitle}
          </Link>
          <span>›</span>
          <span>{product.nameKey}</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Main product */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem', marginBottom: '3rem' }}>
            {/* Image */}
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.15)', aspectRatio: '4/3', position: 'relative' }}>
              <Image src={product.image} alt={product.nameKey} fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Info */}
            <div>
              <span style={{ background: '#e0f2fe', color: '#169DF7', fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.9rem', borderRadius: '9999px' }}>
                {dict.categories.items[product.category]?.name || product.category}
              </span>
              <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#1F2937', margin: '1rem 0 0.75rem', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
                {product.nameKey}
              </h1>
              <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
                {product.descKey}
              </p>

              {/* Specs */}
              <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(22,157,247,0.1)' }}>
                {specs.map((spec) => (
                  <div key={spec.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>{spec.label}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: isRtl ? 'start' : 'end' }}>{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href={`/${locale}/contact`} className="btn-primary" id="product-request-info">
                  {t.requestInfo}
                </Link>
                <a
                  href={`https://wa.me/20123456789?text=${encodeURIComponent(`Hi, I'm interested in ${product.nameKey}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: '#25D366',
                    color: 'white',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                  }}
                  id="product-whatsapp-btn"
                >
                  💬 {t.whatsapp}
                </a>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '1.5rem', color: '#1F2937' }}>{t.related}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/${locale}/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="product-card">
                      <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                        <Image src={p.image} alt={p.nameKey} fill style={{ objectFit: 'cover' }} sizes="25vw" />
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2937' }}>{p.nameKey}</div>
                        <div style={{ color: '#169DF7', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          {dict.products.viewDetails} →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
