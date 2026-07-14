'use server'

import { adminDb } from '@/lib/firebase-admin'
import { createDefaultExportMarketsDocument, type ExportMarketsDocument } from '@/types/exportMarkets.types'
import { revalidatePath } from 'next/cache'

const EXPORT_MARKETS_DOC = 'settings/export_markets_config'

export async function getExportMarketsConfig(): Promise<ExportMarketsDocument> {
  try {
    const snap = await adminDb.doc(EXPORT_MARKETS_DOC).get()
    if (snap.exists) {
      const data = snap.data() as ExportMarketsDocument
      const defaults = createDefaultExportMarketsDocument()
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
    await adminDb.doc(EXPORT_MARKETS_DOC).set(config)
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving export markets config:', error)
    return { success: false, error: error.message }
  }
}
