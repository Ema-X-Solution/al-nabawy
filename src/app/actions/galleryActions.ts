'use server'

import { adminDb } from '@/lib/firebase-admin'
import { createDefaultGalleryDocument, type GalleryDocument } from '@/types/gallery.types'
import { revalidatePath } from 'next/cache'

const GALLERY_DOC = 'settings/gallery'

export async function getGalleryConfig(): Promise<GalleryDocument> {
  try {
    const snap = await adminDb.doc(GALLERY_DOC).get()
    if (snap.exists) {
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

export async function saveGalleryConfig(config: GalleryDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.doc(GALLERY_DOC).set({ ...config, updatedAt: new Date().toISOString() })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving gallery config:', error)
    return { success: false, error: error.message }
  }
}
