import type { Metadata } from 'next'
import '../app/globals.css'

export const metadata: Metadata = {
  title: 'Al-Nabawy Dairy Factory',
  description: 'Premium dairy products manufactured and exported worldwide.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
