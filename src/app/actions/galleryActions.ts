'use server'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createDefaultGalleryDocument, type GalleryDocument } from '@/types/gallery.types'
import { revalidatePath } from 'next/cache'

const GALLERY_DOC_REF = 'settings/gallery'

export async function getGalleryConfig(): Promise<GalleryDocument> {
  try {
    const dRef = doc(db, GALLERY_DOC_REF)
    const snap = await getDoc(dRef)
    if (snap.exists()) {
      const data = snap.data() as GalleryDocument
      const defaults = createDefaultGalleryDocument()
      return {
        ...defaults,
        ...data,
        items: data.items?.length ? data.items : defaults.items,
      }
    }
    return createDefaultGalleryDocument()
  } catch (error) {
    console.error('Error fetching gallery config:', error)
    return createDefaultGalleryDocument()
  }
}

export async function saveGalleryConfig(
  config: GalleryDocument,
): Promise<{ success: boolean; error?: string }> {
  try {
    const dRef = doc(db, GALLERY_DOC_REF)
    await setDoc(dRef, { ...config, updatedAt: new Date().toISOString() })
    revalidatePath('/[lang]/gallery', 'page')
    return { success: true }
  } catch (error) {
    console.error('Error saving gallery config:', error)
    return { success: false, error: String(error) }
  }
}
