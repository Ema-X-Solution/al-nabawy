import { AuthProvider } from '@/lib/auth/authContext'

/**
 * Root admin layout — only wraps with AuthProvider.
 * The login page inherits this, but NOT the dashboard shell.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
