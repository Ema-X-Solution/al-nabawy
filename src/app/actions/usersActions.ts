'use server'

import { adminAuth, adminDb } from '@/lib/firebase-admin'
import type { AdminUser, UserRole } from '@/lib/auth/authService'

export async function listAdminUsers(): Promise<AdminUser[]> {
  try {
    const snap = await adminDb.collection('users').get()
    return snap.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() } as AdminUser))
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

export async function createAdminUser(email: string, password: string, displayName: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Create in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    })

    // 2. Create in Firestore `users` collection
    const userData = {
      email,
      displayName,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    await adminDb.collection('users').doc(userRecord.uid).set(userData)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateAdminUser(uid: string, data: { role?: UserRole; isActive?: boolean }): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.collection('users').doc(uid).update(data)
    
    // If we suspend them, maybe we also disable them in Firebase Auth
    if (data.isActive !== undefined) {
      await adminAuth.updateUser(uid, { disabled: !data.isActive })
    }
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteAdminUser(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Delete from Firebase Auth
    await adminAuth.deleteUser(uid)
    
    // 2. Delete from Firestore
    await adminDb.collection('users').doc(uid).delete()
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
