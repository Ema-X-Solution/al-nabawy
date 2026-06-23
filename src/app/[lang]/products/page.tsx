import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import ProductsClient from './ProductsClient'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.products.heroTitle }
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', opacity: 0.8 }}>
          {locale === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog'}
        </span>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0.5rem 0', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {dict.products.heroTitle}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{dict.products.heroSub}</p>
      </section>

      <section className="section">
        <div className="container">
          <ProductsClient lang={locale} t={{ ...dict.products, items: dict.categories.items }} />
        </div>
      </section>
    </>
  )
}
