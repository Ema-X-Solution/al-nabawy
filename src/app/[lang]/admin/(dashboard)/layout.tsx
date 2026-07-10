import { getDictionary, type Locale } from '@/dictionaries'
import DashboardShell from '@/components/admin/layout/DashboardShell'

export const dynamic = 'force-dynamic'

/**
 * Protected dashboard layout.
 * DashboardShell (client component) redirects to /login if unauthenticated.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return (
    <DashboardShell lang={locale} dict={dict}>
      {children}
    </DashboardShell>
  )
}
