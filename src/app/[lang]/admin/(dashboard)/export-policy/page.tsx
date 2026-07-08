import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import ExportPolicyCMSClient from './ExportPolicyCMSClient'
import { getExportPolicyConfig } from '@/app/actions/exportPolicyActions'
import { createDefaultExportPolicyDocument } from '@/types/exportPolicy.types'

export default async function ExportPolicyAdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const dbConfig = await getExportPolicyConfig()
  const initialConfig = dbConfig || createDefaultExportPolicyDocument()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.websiteManagement ? `${t.nav.websiteManagement} - Export Policy` : 'Export Policy'}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: 'Export Policy' },
        ]}
      />
      <div className="mt-6">
        <ExportPolicyCMSClient initialConfig={initialConfig} />
      </div>
    </PageContainer>
  )
}
