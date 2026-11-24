'use server'

import { adminDb } from '@/lib/firebase-admin'
import type { FooterDocument } from '@/types/footer.types'
import { revalidateFooter } from '@/lib/revalidate'

const FOOTER_DOC = 'settings/footer_config'

export async function getFooterConfig(): Promise<FooterDocument | null> {
  try {
    const snap = await adminDb.doc(FOOTER_DOC).get()
    return snap.exists ? (snap.data() as FooterDocument) : null
  } catch (error) {
    console.error('Error fetching footer config:', error)
    return null
  }
}

export async function saveFooterConfig(config: FooterDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.doc(FOOTER_DOC).set(config)
    revalidateFooter()
    return { success: true }
  } catch (error: any) {
    console.error('Error saving footer config:', error)
    return { success: false, error: error.message }
  }
}
