import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { CertificationsDocument } from '@/types/certifications.types'

const CERTIFICATIONS_CONFIG_ID = 'certifications_config'

export async function getCertificationsConfig(): Promise<CertificationsDocument | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', CERTIFICATIONS_CONFIG_ID))
    return snap.exists() ? (snap.data() as CertificationsDocument) : null
  } catch (error) {
    console.error('Error fetching certifications config:', error)
    return null
  }
}

export async function saveCertificationsConfig(config: CertificationsDocument): Promise<{ success: boolean; error?: string }> {
  try {
    await setDoc(doc(db, 'settings', CERTIFICATIONS_CONFIG_ID), config)
    return { success: true }
  } catch (error: any) {
    console.error('Error saving certifications config:', error)
    return { success: false, error: error.message }
  }
}
