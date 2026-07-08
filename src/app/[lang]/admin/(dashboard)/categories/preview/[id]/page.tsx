import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import { getCategoryById } from '@/app/actions/categoriesActions'

export default async function PreviewCategoryPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin
  const localeStr = lang as 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'

  const category = await getCategoryById(id)
  if (!category) notFound()

  return (
    <PageContainer>
      <PageHeader 
        title="Preview Category"
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: 'Categories', href: `/${lang}/admin/categories` },
          { label: category.name.en },
        ]}
      />

      <div className="mt-6" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Preview: Home Page Card Style */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#374151' }}>
            Preview: Home Page Style
          </h3>
          <div style={{ maxWidth: '320px' }}>
            <div className="product-card" style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#f3f4f6' }}>
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name[localeStr]}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: lang === 'ar' ? 'auto' : '0.75rem',
                    right: lang === 'ar' ? '0.75rem' : 'auto',
                    fontSize: '1.75rem',
                    background: 'white',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  }}
                >
                  {category.icon}
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1F2937', marginBottom: '0.5rem' }}>
                  {category.name[localeStr]}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                  {category.description[localeStr]}
                </p>
                <div
                  className="btn-outline"
                  style={{ alignSelf: 'flex-start', pointerEvents: 'none' }}
                >
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={lang === 'ar' ? 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'} />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            href={`/${lang}/admin/categories/edit/${category.id}`}
            style={{ padding: '10px 20px', background: '#169DF7', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
          >
            Edit Category
          </Link>
          <Link 
            href={`/${lang}/admin/categories`}
            style={{ padding: '10px 20px', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
          >
            Back to List
          </Link>
        </div>

      </div>
    </PageContainer>
  )
}
