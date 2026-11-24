import { getDictionary, type Locale } from '@/dictionaries'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getFooterConfigCached } from '@/lib/cached-data'

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const footerConfig = await getFooterConfigCached()
  const whatsappNumber = footerConfig?.whatsapp || '+201008661480'

  return (
    <>
      <Navbar lang={locale} t={dict.nav} />
      <main style={{ flex: 1, overflowX: 'hidden' }}>{children}</main>
      <Footer lang={locale} t={dict.footer} navT={dict.nav} catT={dict.categories} />
      {/* Hidden only while the number is the old placeholder */}
      {!whatsappNumber.includes('123456789') && <WhatsAppButton number={whatsappNumber} />}
    </>
  )
}
