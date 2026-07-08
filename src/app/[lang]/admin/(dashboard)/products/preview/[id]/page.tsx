import { getDictionary, type Locale } from '@/dictionaries'
import { getProductById } from '@/app/actions/productsActions'
import { getFooterConfig } from '@/app/actions/footerActions'
import { notFound } from 'next/navigation'
import ProductDetailView from '@/components/products/ProductDetailView'
import Link from 'next/link'

export default async function PreviewProductPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.admin

  const product = await getProductById(id)
  if (!product) notFound()

  const footerConfig = await getFooterConfig()
  const whatsapp = footerConfig?.whatsapp || '+20123456789'

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Preview: {product.name.en}</h1>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>This is exactly how it will appear on the public site.</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href={`/${lang}/admin/products`} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
            Back to Products
          </Link>
          <Link href={`/${lang}/admin/products/edit/${id}`} style={{ padding: '8px 16px', borderRadius: '8px', background: '#169DF7', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
            Edit Product
          </Link>
        </div>
      </div>
      
      {/* Container simulating public layout */}
      <div style={{ background: 'white', margin: '32px auto', maxWidth: '1200px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <ProductDetailView product={product} lang={lang} dict={dict} isPreview={true} whatsapp={whatsapp} />
      </div>
    </div>
  )
}
