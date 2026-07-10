import type { Metadata } from 'next'
import '../app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('http://al-nabawy.com'),
  title: 'Al-Nabawy Dairy Factory',
  description: 'Premium dairy products manufactured and exported worldwide.',
  openGraph: {
    title: 'Al-Nabawy Dairy Factory',
    description: 'Premium dairy products manufactured and exported worldwide.',
    url: 'http://al-nabawy.com',
    siteName: 'Al-Nabawy Dairy Factory',
    locale: 'en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Nabawy Dairy Factory',
    description: 'Premium dairy products manufactured and exported worldwide.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
