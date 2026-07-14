'use server'

import { adminDb } from '@/lib/firebase-admin'
import { createDefaultContactDocument, type ContactDocument } from '@/types/contact.types'
import { revalidatePath } from 'next/cache'

const CONTACT_DOC = 'settings/contact'

export async function getContactConfig(): Promise<ContactDocument> {
  try {
    const snap = await adminDb.doc(CONTACT_DOC).get()
    if (snap.exists) {
      const data = snap.data() as ContactDocument
      const defaults = createDefaultContactDocument()
      return { ...defaults, ...data }
    }
    return createDefaultContactDocument()
  } catch (error) {
    console.error('Error fetching contact config:', error)
    return createDefaultContactDocument()
  }
}

export async function saveContactConfig(config: ContactDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.doc(CONTACT_DOC).set({ ...config, updatedAt: new Date().toISOString() })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving contact config:', error)
    return { success: false, error: error.message }
  }
}
