import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import UsersClient from './UsersClient'
import { listAdminUsers } from '@/app/actions/usersActions'

export default async function UsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const users = await listAdminUsers()

  return (
    <PageContainer>
      <PageHeader
        title={t.nav.users}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.users },
        ]}
      />
      <div className="mt-6">
        <UsersClient initialUsers={users} />
      </div>
    </PageContainer>
  )
}
