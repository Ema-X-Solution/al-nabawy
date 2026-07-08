import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import { getContactConfig } from '@/app/actions/contactActions'
import ContactCMSClient from './ContactCMSClient'

export default async function ContactPageAdmin({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const config = await getContactConfig()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.contactPage}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.contactPage },
        ]}
      />
      <div className="mt-6">
        <ContactCMSClient initialConfig={config} />
      </div>
    </PageContainer>
  )
}
