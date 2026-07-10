import { getDictionary, type Locale } from '@/dictionaries'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getFooterConfig } from '@/app/actions/footerActions'

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
  const footerConfig = await getFooterConfig()
  const whatsappNumber = footerConfig?.whatsapp || '+20123456789'

  return (
    <>
      <Navbar lang={locale} t={dict.nav} />
      <main style={{ flex: 1, overflowX: 'hidden' }}>{children}</main>
      <Footer lang={locale} t={dict.footer} navT={dict.nav} catT={dict.categories} />
      <WhatsAppButton number={whatsappNumber} />
    </>
  )
}
