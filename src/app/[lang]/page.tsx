import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import CompanyOverview from '@/components/home/CompanyOverview'
import ProductCategories from '@/components/home/ProductCategories'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import ProductionFacility from '@/components/home/ProductionFacility'
import CertificationsSection from '@/components/home/CertificationsSection'
import ExportMarkets from '@/components/home/ExportMarkets'
import CatalogDownload from '@/components/home/CatalogDownload'
import CTASection from '@/components/home/CTASection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.meta.siteName,
    description: dict.meta.description,
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <HeroSection lang={locale} t={dict.hero} />
      <CompanyOverview lang={locale} t={dict.overview} />
      <ProductCategories lang={locale} t={dict.categories} />
      <WhyChooseUs lang={locale} t={dict.whyUs} />
      <ProductionFacility lang={locale} t={dict.facility} />
      <CertificationsSection lang={locale} t={dict.certs} />
      <ExportMarkets lang={locale} t={dict.exportMap} />
      <CatalogDownload lang={locale} t={dict.catalog} />
      <CTASection lang={locale} t={dict.cta} />
    </>
  )
}
