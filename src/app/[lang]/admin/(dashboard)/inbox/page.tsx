import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import InboxClient from './InboxClient'
import { getContactMessages } from '@/app/actions/messagesActions'

export default async function InboxPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const messages = await getContactMessages()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.contactRequests}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.contactRequests },
        ]}
      />
      <div className="mt-6">
        <InboxClient initialMessages={messages} />
      </div>
    </PageContainer>
  )
}
