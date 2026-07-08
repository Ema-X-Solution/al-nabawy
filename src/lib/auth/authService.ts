import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'SuperAdmin' | 'Editor' | 'Viewer'

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  isActive: boolean
}

// ─── Permission Matrix ────────────────────────────────────────────────────────

export const ROLE_PERMISSIONS = {
  SuperAdmin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
  Editor: ['read', 'write'],
  Viewer: ['read'],
} as const

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number]

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role] as readonly string[]
  return perms.includes(permission)
}

// ─── Auth Operations ──────────────────────────────────────────────────────────

/**
 * Signs the user in with email and password.
 * Uses local persistence when rememberMe is true, session persistence otherwise.
 */
export async function loginWithEmail(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<void> {
  // Mock fallback for UI development
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    if (email) {
      localStorage.setItem('mock_admin_session', 'true')
      return
    }
    throw new Error('Invalid mock credentials')
  }

  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence
  )
  await signInWithEmailAndPassword(auth, email, password)
}

/**
 * Signs the current user out.
 */
export async function logout(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    localStorage.removeItem('mock_admin_session')
    return
  }
  await signOut(auth)
}

// ─── User Profile ─────────────────────────────────────────────────────────────

/**
 * Fetches the admin user document from the `users` Firestore collection.
 * Returns null if the document doesn't exist or the user is inactive.
 */
export async function fetchAdminUser(uid: string): Promise<AdminUser | null> {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    // If the user document doesn't exist, auto-create it as SuperAdmin for initial setup.
    // (This is useful for the first time you login with a new Firebase project)
    const firebaseUser = auth.currentUser
    if (firebaseUser) {
      const newUser = {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
        role: 'SuperAdmin',
        isActive: true,
      }
      await setDoc(docRef, newUser)
      return { uid, ...newUser, role: 'SuperAdmin' }
    }
    return null
  }

  const data = docSnap.data()
  if (!data.isActive) return null

  return {
    uid,
    email: data.email ?? '',
    displayName: data.displayName ?? data.email ?? 'Admin',
    role: (data.role ?? 'Viewer') as UserRole,
    isActive: true,
  }
}
