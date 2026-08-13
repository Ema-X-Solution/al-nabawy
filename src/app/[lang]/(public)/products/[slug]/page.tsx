import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import { getProducts } from '@/app/actions/productsActions'
import { getFooterConfig } from '@/app/actions/footerActions'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ProductDetailView from '@/components/products/ProductDetailView'

export async function generateStaticParams() {
  const products = await getProducts()
  const locales: Locale[] = ['en', 'ar', 'tr', 'pl', 'de', 'fr']
  return locales.flatMap((lang) => products.filter(p => p.status === 'published').map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const products = await getProducts()
  const decodedSlug = decodeURIComponent(slug)
  const product = products.find(p => (p.slug === decodedSlug || p.id === decodedSlug) && p.status === 'published')
  if (!product) return {}
  const localeStr = lang as 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'
  return { title: product.name[localeStr], description: product.description[localeStr] }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  
  const products = await getProducts()
  const decodedSlug = decodeURIComponent(slug)
  const product = products.find(p => (p.slug === decodedSlug || p.id === decodedSlug) && p.status === 'published')
  if (!product) notFound()
  
  const related = products.filter((p) => p.slug !== decodedSlug && p.id !== decodedSlug && p.category === product.category && p.status === 'published').slice(0, 3)
  const localeStr = lang as 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'
  const footerConfig = await getFooterConfig()
  const whatsapp = footerConfig?.whatsapp || '+20123456789'

  return (
    <>
      <ProductDetailView product={product} lang={lang} dict={dict} isPreview={false} whatsapp={whatsapp} />
      
      {/* Related */}
      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ paddingBottom: '5rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '1.5rem', color: '#1F2937' }}>{dict.productDetail.related}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem' }}>
              {related.map((p) => (
                <Link key={p.slug} href={`/${locale}/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card">
                    <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                      <Image src={p.image} alt={p.name[localeStr]} fill style={{ objectFit: 'cover' }} sizes="25vw" />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2937' }}>{p.name[localeStr]}</div>
                      <div style={{ color: '#169DF7', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {dict.products.viewDetails} →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
