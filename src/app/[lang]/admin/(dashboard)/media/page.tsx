import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import MediaLibraryClient from './MediaLibraryClient'

export default async function MediaLibraryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  return (
    <PageContainer>
      <PageHeader
        title={t.nav.mediaLibrary}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.mediaLibrary },
        ]}
      />
      <div className="mt-6">
        <MediaLibraryClient />
      </div>
    </PageContainer>
  )
}
