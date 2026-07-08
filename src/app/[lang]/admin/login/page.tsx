import { getDictionary, type Locale } from '@/dictionaries'
import LoginForm from '@/components/admin/auth/LoginForm'

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  return <LoginForm lang={locale} t={dict.admin} />
}
