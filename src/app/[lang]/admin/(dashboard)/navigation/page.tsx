import { getDictionary, type Locale } from '@/dictionaries'
import { redirect } from 'next/navigation'

export default async function NavigationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  redirect(`/${lang}/admin`)
}
