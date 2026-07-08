import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import CertificationsCMSClient from './CertificationsCMSClient'
import { getCertificationsConfig } from '@/app/actions/certificationsActions'
import type { CertificationsDocument } from '@/types/certifications.types'

export default async function CertificationsAdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const dbConfig = await getCertificationsConfig()
  
  // Default values matching the public site layout
  const defaultConfig: CertificationsDocument = {
    heroTitle: { en: 'Global Standards & Certifications', ar: 'المعايير العالمية والشهادات', fr: '', de: '', tr: '', pl: '' },
    heroSub: { en: 'We adhere to the highest international standards of quality, safety, and hygiene.', ar: 'نلتزم بأعلى المعايير الدولية للجودة والسلامة والصحة.', fr: '', de: '', tr: '', pl: '' },
    items: []
  }

  const initialConfig = dbConfig || defaultConfig

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.certifications}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.certifications },
        ]}
      />
      <div className="mt-6">
        <CertificationsCMSClient initialConfig={initialConfig} />
      </div>
    </PageContainer>
  )
}
