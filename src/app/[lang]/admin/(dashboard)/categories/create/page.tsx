import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import CategoryEditorClient from '../CategoryEditorClient'

export default async function CreateCategoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  return (
    <PageContainer>
      <PageHeader 
        title="Create Category"
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: 'Categories', href: `/${lang}/admin/categories` },
          { label: 'Create Category' },
        ]}
      />
      <div className="mt-6">
        <CategoryEditorClient lang={lang} />
      </div>
    </PageContainer>
  )
}
