import { getDictionary, type Locale } from '@/dictionaries'
import { getHomeConfig } from '@/app/actions/homeActions'
import HomeCMSClient from './HomeCMSClient'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageContainer from '@/components/admin/ui/PageContainer'

export default async function HomeSectionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.admin
  
  const config = await getHomeConfig()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.home} 
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.home }
        ]} 
      />
      <div className="mt-6">
        <HomeCMSClient initialConfig={config} />
      </div>
    </PageContainer>
  )
}
