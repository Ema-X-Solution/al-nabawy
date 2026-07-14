'use server'

import { adminDb } from '@/lib/firebase-admin'
import type { ExportPolicyDocument } from '@/types/exportPolicy.types'
import { revalidatePath } from 'next/cache'

const CONFIG_DOC = 'configs/export_policy'

export async function getExportPolicyConfig(): Promise<ExportPolicyDocument | null> {
  try {
    const snap = await adminDb.doc(CONFIG_DOC).get()
    if (!snap.exists) return null
    return snap.data() as ExportPolicyDocument
  } catch (error) {
    console.error('Error fetching export policy config:', error)
    return null
  }
}

export async function saveExportPolicyConfig(config: ExportPolicyDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.doc(CONFIG_DOC).set({ ...config, updatedAt: Date.now() })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving export policy config:', error)
    return { success: false, error: error.message }
  }
}
