import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import GalleryClient from './GalleryClient'
import { getGalleryConfig } from '@/app/actions/galleryActions'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.gallery.heroTitle }
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  const config = await getGalleryConfig()

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {config.heroTitle?.[locale] || (locale === 'ar' ? (config as any).heroTitleAr : (config as any).heroTitleEn)}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{config.heroSub?.[locale] || (locale === 'ar' ? (config as any).heroSubAr : (config as any).heroSubEn)}</p>
      </section>

      <section className="section">
        <div className="container">
          <GalleryClient lang={locale} t={dict.gallery} config={config} />
        </div>
      </section>
    </>
  )
}
