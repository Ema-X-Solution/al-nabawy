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
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Al-Nabawy Dairy Factory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Nabawy Dairy Factory',
    description: 'Premium dairy products manufactured and exported worldwide.',
    images: ['/opengraph-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
