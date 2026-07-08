'use server'

import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { ExportPolicyDocument } from '@/types/exportPolicy.types'

const CONFIG_DOC_ID = 'export_policy'

export async function getExportPolicyConfig(): Promise<ExportPolicyDocument | null> {
  try {
    const snap = await getDoc(doc(db, 'configs', CONFIG_DOC_ID))
    if (!snap.exists()) return null
    return snap.data() as ExportPolicyDocument
  } catch (error) {
    console.error('Error fetching export policy config:', error)
    return null
  }
}

export async function saveExportPolicyConfig(config: ExportPolicyDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'configs', CONFIG_DOC_ID), {
      ...config,
      updatedAt: Date.now()
    })
    return { success: true }
  } catch (error: any) {
    console.error('Error saving export policy config:', error)
    return { success: false, error: error.message }
  }
}
