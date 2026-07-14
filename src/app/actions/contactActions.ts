'use server'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createDefaultContactDocument, type ContactDocument } from '@/types/contact.types'
import { revalidatePath } from 'next/cache'

const CONTACT_DOC_REF = 'settings/contact'

export async function getContactConfig(): Promise<ContactDocument> {
  try {
    const dRef = doc(db, CONTACT_DOC_REF)
    const snap = await getDoc(dRef)
    if (snap.exists()) {
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

export async function saveContactConfig(
  config: ContactDocument,
): Promise<{ success: boolean; error?: string }> {
  try {
    const dRef = doc(db, CONTACT_DOC_REF)
    await setDoc(dRef, { ...config, updatedAt: new Date().toISOString() })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error saving contact config:', error)
    return { success: false, error: String(error) }
  }
}
