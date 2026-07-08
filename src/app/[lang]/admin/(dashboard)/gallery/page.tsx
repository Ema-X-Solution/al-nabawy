import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import { getGalleryConfig } from '@/app/actions/galleryActions'
import GalleryCMSClient from './GalleryCMSClient'

export default async function GalleryPageAdmin({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin

  const config = await getGalleryConfig()

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.gallery}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.gallery },
        ]}
      />
      <div className="mt-6">
        <GalleryCMSClient initialConfig={config} />
      </div>
    </PageContainer>
  )
}
