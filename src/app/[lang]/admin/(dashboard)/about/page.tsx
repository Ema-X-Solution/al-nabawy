import { getDictionary, type Locale } from '@/dictionaries'
import { getAboutConfig } from '@/app/actions/aboutActions'
import AboutCMSClient from './AboutCMSClient'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageContainer from '@/components/admin/ui/PageContainer'

export default async function AboutCMSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.admin
  
  const config = await getAboutConfig()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.about} 
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.about }
        ]} 
      />
      <div className="mt-6">
        <AboutCMSClient initialConfig={config} />
      </div>
    </PageContainer>
  )
}
