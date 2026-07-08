import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/dictionaries'
import type { HomeLocale } from '@/types/home.types'
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
import { getHomeConfig } from '@/app/actions/homeActions'
import { getCategories } from '@/app/actions/categoriesActions'
import { getCertificationsConfig } from '@/app/actions/certificationsActions'
import { getExportMarketsConfig } from '@/app/actions/exportMarketsActions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const locale = lang as HomeLocale
  const dict = await getDictionary(locale)
  return {
    title: dict.meta.siteName,
    description: dict.meta.description,
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as HomeLocale
  
  // We still need the dictionary for categories and certificates items
  // since those are not entirely managed by the home CMS (they belong to their own models or are hardcoded references)
  const dict = await getDictionary(locale)
  
  const config = await getHomeConfig()
  const categories = await getCategories()
  const publishedCategories = categories.filter(c => c.status === 'published')
  
  const certsConfig = await getCertificationsConfig()
  const exportConfig = await getExportMarketsConfig()
  
  // Sort sections by their order in sectionMeta
  const sortedSections = Object.values(config.sectionMeta)
    .filter(meta => meta.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {sortedSections.map(meta => {
        switch (meta.id) {
          case 'hero':
            return <HeroSection key={meta.id} lang={locale} config={config.hero} />
          case 'overview':
            return <CompanyOverview key={meta.id} lang={locale} config={config.overview} />
          case 'categories':
            return <ProductCategories key={meta.id} lang={locale} config={config.categories} categories={publishedCategories} />
          case 'whyUs':
            return <WhyChooseUs key={meta.id} lang={locale} config={config.whyUs} />
          case 'facility':
            return <ProductionFacility key={meta.id} lang={locale} config={config.facility} />
          case 'certifications':
            return certsConfig ? <CertificationsSection key={meta.id} lang={locale} config={config.certifications} certsData={certsConfig} /> : null
          case 'exportMarkets':
            return exportConfig ? <ExportMarkets key={meta.id} lang={locale} config={config.exportMarkets} exportData={exportConfig} /> : null
          case 'catalog':
            return <CatalogDownload key={meta.id} lang={locale} config={config.catalog} />
          case 'cta':
            return <CTASection key={meta.id} lang={locale} config={config.cta} />
          default:
            return null
        }
      })}
    </>
  )
}
