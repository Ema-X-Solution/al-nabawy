import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { FooterDocument } from '@/types/footer.types'

const FOOTER_CONFIG_ID = 'footer_config'

export async function getFooterConfig(): Promise<FooterDocument | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', FOOTER_CONFIG_ID))
    return snap.exists() ? (snap.data() as FooterDocument) : null
  } catch (error) {
    console.error('Error fetching footer config:', error)
    return null
  }
}

export async function saveFooterConfig(config: FooterDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'settings', FOOTER_CONFIG_ID), config)
    return { success: true }
  } catch (error: any) {
    console.error('Error saving footer config:', error)
    return { success: false, error: error.message }
  }
}
