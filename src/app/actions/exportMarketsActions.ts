'use server'

import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { createDefaultExportMarketsDocument, type ExportMarketsDocument } from '@/types/exportMarkets.types'
import { revalidatePath } from 'next/cache'

const EXPORT_MARKETS_CONFIG_ID = 'export_markets_config'

export async function getExportMarketsConfig(): Promise<ExportMarketsDocument> {
  try {
    const snap = await getDoc(doc(db, 'settings', EXPORT_MARKETS_CONFIG_ID))
    if (snap.exists()) {
      const data = snap.data() as ExportMarketsDocument
      const defaults = createDefaultExportMarketsDocument()
      // We can merge defaults here but for complex nested localization objects, it's safer to just return data or merge root properties.
      return { ...defaults, ...data }
    }
    return createDefaultExportMarketsDocument()
  } catch (error) {
    console.error('Error fetching export markets config:', error)
    return createDefaultExportMarketsDocument()
  }
}

export async function saveExportMarketsConfig(config: ExportMarketsDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'settings', EXPORT_MARKETS_CONFIG_ID), config)
    revalidatePath('/[lang]/export-markets', 'page')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving export markets config:', error)
    return { success: false, error: error.message }
  }
}
