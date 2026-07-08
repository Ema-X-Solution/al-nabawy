'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {
  fetchAdminUser,
  logout as firebaseLogout,
  roleHasPermission,
  type AdminUser,
  type UserRole,
  type Permission,
} from './authService'

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  can: (permission: Permission) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock fallback for UI development
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const hasMockSession = typeof window !== 'undefined' && localStorage.getItem('mock_admin_session')
      if (hasMockSession) {
        setUser({
          uid: 'mock-uid',
          email: 'admin@alnabawy.com',
          displayName: 'Mock Admin',
          role: 'SuperAdmin',
          isActive: true,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const adminUser = await fetchAdminUser(firebaseUser.uid)
          setUser(adminUser)
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = useCallback(async () => {
    await firebaseLogout()
    setUser(null)
  }, [])

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false
      return roleHasPermission(user.role, permission)
    },
    [user]
  )

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!user) return false
      const roles = Array.isArray(role) ? role : [role]
      return roles.includes(user.role)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        logout,
        can,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
