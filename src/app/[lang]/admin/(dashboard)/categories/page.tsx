import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import { getCategories } from '@/app/actions/categoriesActions'
import { getProducts } from '@/app/actions/productsActions'
import CategoriesListClient from './CategoriesListClient'

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const categories = await getCategories()
  const products = await getProducts()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.categories}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.categories },
        ]}
      />
      <div className="mt-6">
        <CategoriesListClient initialCategories={categories} initialProducts={products} lang={lang} />
      </div>
    </PageContainer>
  )
}
