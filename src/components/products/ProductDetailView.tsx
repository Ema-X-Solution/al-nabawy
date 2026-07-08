import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProductDocument } from '@/types/products.types'
import { Icons } from '@/lib/icons'

interface Props {
  product: ProductDocument
  lang: string
  dict: any // Full dictionary
  isPreview?: boolean
  whatsapp: string
}

export default function ProductDetailView({ product, lang, dict, isPreview = false, whatsapp }: Props) {
  const t = dict.productDetail
  const isRtl = lang === 'ar'
  const localeStr = lang as 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'

  const specs = [
    { label: t.packaging, value: product.packaging[localeStr] },
    { label: t.weight, value: product.weight[localeStr] },
    { label: t.shelfLife, value: product.shelfLife[localeStr] },
    { label: t.storage, value: product.storage[localeStr] },
    { label: t.origin, value: product.origin[localeStr] },
  ]

  const name = product.name[localeStr]
  const desc = product.description[localeStr]

  return (
    <>
      {/* Breadcrumb */}
      {!isPreview && (
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem', marginTop: '72px' }}>
          <div className="container" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', alignItems: 'center' }}>
            <Link href={`/${lang}`} style={{ color: '#169DF7', textDecoration: 'none' }}>
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${lang}/products`} style={{ color: '#169DF7', textDecoration: 'none' }}>
              {dict.products.heroTitle}
            </Link>
            <span>›</span>
            <span>{name}</span>
          </div>
        </div>
      )}

      {isPreview && (
        <div style={{ background: '#fef2f2', borderBottom: '1px solid #fee2e2', padding: '1rem 1.5rem', color: '#ef4444', fontWeight: 600, textAlign: 'center' }}>
          Admin Preview Mode
        </div>
      )}

      <section className="section" style={{ paddingTop: isPreview ? '2rem' : undefined }}>
        <div className="container">
          {/* Main product */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem', marginBottom: '3rem' }}>
            {/* Image */}
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(22,157,247,0.15)', aspectRatio: '4/3', position: 'relative' }}>
              {product.image ? (
                <Image src={product.image} alt={name} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f3f4f6', color: '#9ca3af' }}>No Image</div>
              )}
            </div>

            {/* Info */}
            <div>
              <span style={{ background: '#e0f2fe', color: '#169DF7', fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.9rem', borderRadius: '9999px' }}>
                {dict.categories.items[product.category]?.name || product.category}
              </span>
              <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 800, color: '#1F2937', margin: '1rem 0 0.75rem', fontFamily: lang === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
                {name}
              </h1>
              <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {desc}
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
                <Link href={isPreview ? '#' : `/${lang}/contact`} className="btn-primary" id="product-request-info">
                  {t.requestInfo}
                </Link>
                <a
                  href={isPreview ? '#' : `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${name}`)}`}
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
                  <Icons.MessageCircle size={18} /> {t.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
