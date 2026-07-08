import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import { getProducts } from '@/app/actions/productsActions'
import ProductsListClient from './ProductsListClient'

export default async function ProductsAdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.admin

  const products = await getProducts()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.products}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.products },
        ]}
      />
      <div className="mt-6">
        <ProductsListClient initialProducts={products} lang={lang} />
      </div>
    </PageContainer>
  )
}
