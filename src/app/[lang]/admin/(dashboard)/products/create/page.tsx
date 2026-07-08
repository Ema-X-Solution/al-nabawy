import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import ProductEditorClient from '../ProductEditorClient'

export default async function CreateProductPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.admin

  return (
    <PageContainer>
      <PageHeader 
        title="Create Product"
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.products, href: `/${lang}/admin/products` },
          { label: "Create" },
        ]}
      />
      <div className="mt-6">
        <ProductEditorClient lang={lang} />
      </div>
    </PageContainer>
  )
}
