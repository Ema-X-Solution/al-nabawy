'use server'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createDefaultAboutDocument, type AboutDocument } from '@/types/about.types'
import { revalidatePath } from 'next/cache'

const ABOUT_DOC_REF = 'settings/about'

/**
 * Fetches the About page configuration document.
 * Returns the seeded default if the document doesn't exist yet.
 */
export async function getAboutConfig(): Promise<AboutDocument> {
  try {
    const dRef = doc(db, ABOUT_DOC_REF)
    const snap = await getDoc(dRef)
    if (snap.exists()) {
      const data = snap.data() as AboutDocument
      // Backfill timelineItems if document is old and missing them
      if (!data.timelineItems) {
        const defaults = createDefaultAboutDocument()
        data.timelineItems = defaults.timelineItems
      }
      return data
    }
    return createDefaultAboutDocument()
  } catch (error) {
    console.error('Error fetching about config:', error)
    return createDefaultAboutDocument()
  }
}

/**
 * Saves the About page configuration document.
 */
export async function saveAboutConfig(
  config: AboutDocument,
): Promise<{ success: boolean; error?: string }> {
  try {
    const dRef = doc(db, ABOUT_DOC_REF)
    await setDoc(dRef, { ...config, updatedAt: new Date().toISOString() })
    revalidatePath('/[lang]/about', 'page')
    return { success: true }
  } catch (error) {
    console.error('Error saving about config:', error)
    return { success: false, error: String(error) }
  }
}
