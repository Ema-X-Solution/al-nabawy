import { getDictionary, type Locale } from '@/dictionaries'
import DashboardHome from '@/components/admin/dashboard/DashboardHome'

export default async function AdminIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return <DashboardHome lang={locale} t={dict.admin} />
}
