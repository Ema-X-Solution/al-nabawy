import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import ProductEditorClient from '../../ProductEditorClient'
import { getProductById } from '@/app/actions/productsActions'
import { getCategories } from '@/app/actions/categoriesActions'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.admin

  const product = await getProductById(id)
  if (!product) notFound()
  
  const categories = await getCategories()

  return (
    <PageContainer>
      <PageHeader 
        title={`Edit Product: ${product.name.en}`}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.products, href: `/${lang}/admin/products` },
          { label: "Edit" },
        ]}
      />
      <div className="mt-6">
        <ProductEditorClient initialProduct={product} lang={lang} categories={categories} />
      </div>
    </PageContainer>
  )
}
