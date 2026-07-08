import { notFound } from 'next/navigation'
import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import CategoryEditorClient from '../../CategoryEditorClient'
import { getCategoryById } from '@/app/actions/categoriesActions'

export default async function EditCategoryPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const category = await getCategoryById(id)
  if (!category) notFound()

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Category"
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: 'Categories', href: `/${lang}/admin/categories` },
          { label: category.name.en },
        ]}
      />
      <div className="mt-6">
        <CategoryEditorClient lang={lang} initialData={category} />
      </div>
    </PageContainer>
  )
}
