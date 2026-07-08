import { getDictionary, type Locale } from '@/dictionaries'
import PageContainer from '@/components/admin/ui/PageContainer'
import PageHeader from '@/components/admin/ui/PageHeader'
import SettingsCMSClient from './SettingsCMSClient'
import { getFooterConfig } from '@/app/actions/footerActions'
import type { FooterDocument } from '@/types/footer.types'

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.admin
  const dbConfig = await getFooterConfig()
  
  // Default values matching the public site layout
  const defaultConfig: FooterDocument = {
    sloganEn: "From Nature's Best",
    sloganAr: "من أفضل ما في الطبيعة",
    addressEn: "Industrial Area, Egypt",
    addressAr: "المنطقة الصناعية، مصر",
    phone1: "+20 123 456 7890",
    phone2: "+20 123 456 789",
    whatsapp: "+20 123 456 789",
    email: "info@alnabawy.com",
    copyrightEn: "© 2024 Al-Nabawy Dairy Factory. All Rights Reserved.",
    copyrightAr: "© 2024 مصنع النبوي لمنتجات الألبان. جميع الحقوق محفوظة.",
    socialLinks: [
      { id: 'fb', platform: 'Facebook', url: '#', svgIcon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
      { id: 'ig', platform: 'Instagram', url: '#', svgIcon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
      { id: 'li', platform: 'LinkedIn', url: '#', svgIcon: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z M9.75 15.02V8.98L15.5 12l-5.75 3.02z' }
    ]
  }

  const initialConfig = dbConfig || defaultConfig

  return (
    <PageContainer>
      <PageHeader 
        title={t.nav.settings}
        breadcrumbs={[
          { label: t.nav.dashboard, href: `/${lang}/admin` },
          { label: t.nav.settings },
        ]}
      />
      <div className="mt-6">
        <SettingsCMSClient initialConfig={initialConfig} />
      </div>
    </PageContainer>
  )
}
