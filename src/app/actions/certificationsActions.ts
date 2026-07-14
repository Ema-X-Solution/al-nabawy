'use server'

import { adminDb } from '@/lib/firebase-admin'
import type { CertificationsDocument } from '@/types/certifications.types'
import { revalidatePath } from 'next/cache'

const CERTIFICATIONS_DOC = 'settings/certifications_config'

export async function getCertificationsConfig(): Promise<CertificationsDocument | null> {
  try {
    const snap = await adminDb.doc(CERTIFICATIONS_DOC).get()
    return snap.exists ? (snap.data() as CertificationsDocument) : null
  } catch (error) {
    console.error('Error fetching certifications config:', error)
    return null
  }
}

export async function saveCertificationsConfig(config: CertificationsDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.doc(CERTIFICATIONS_DOC).set(config)
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving certifications config:', error)
    return { success: false, error: error.message }
  }
}
