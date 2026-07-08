import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import ExportMarketsCMSClient from './ExportMarketsCMSClient'
import { getExportMarketsConfig } from '@/app/actions/exportMarketsActions'
import { createDefaultExportMarketsDocument } from '@/types/exportMarkets.types'

export default async function ExportMarketsAdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const dbConfig = await getExportMarketsConfig()
  const initialConfig = dbConfig || createDefaultExportMarketsDocument()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.exportMarkets}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.exportMarkets },
        ]}
      />
      <div className="mt-6">
        <ExportMarketsCMSClient initialConfig={initialConfig} />
      </div>
    </PageContainer>
  )
}
