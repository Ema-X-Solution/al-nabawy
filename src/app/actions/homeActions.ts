'use server'

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { HomeDocument, createDefaultHomeDocument } from '@/types/home.types'
import { revalidatePath } from 'next/cache'

const HOME_SETTINGS_DOC = 'settings/home'

/**
 * Fetches the Home Page configuration from Firestore.
 * If it doesn't exist, it creates and returns the default configuration.
 */
export async function getHomeConfig(): Promise<HomeDocument> {
  try {
    const dRef = doc(db, HOME_SETTINGS_DOC)
    const snap = await getDoc(dRef)

    if (!snap.exists()) {
      console.log('No home config found in Firestore, creating default...')
      const defaultDoc = createDefaultHomeDocument()
      return defaultDoc
    }

    const data = snap.data() as Partial<HomeDocument>
    
    // We merge the default document with the existing data to ensure 
    // any new fields added to the codebase are present.
    const defaultDoc = createDefaultHomeDocument()
    
    return {
      ...defaultDoc,
      ...data,
      sectionMeta: { ...defaultDoc.sectionMeta, ...data.sectionMeta },
      hero: { ...defaultDoc.hero, ...data.hero },
      overview: { ...defaultDoc.overview, ...data.overview },
      categories: { ...defaultDoc.categories, ...data.categories },
      whyUs: {
        ...defaultDoc.whyUs,
        ...data.whyUs,
        natural: { ...defaultDoc.whyUs.natural, ...data.whyUs?.natural },
        quality: { ...defaultDoc.whyUs.quality, ...data.whyUs?.quality },
        expert: { ...defaultDoc.whyUs.expert, ...data.whyUs?.expert },
        global: { ...defaultDoc.whyUs.global, ...data.whyUs?.global },
      },
      facility: { ...defaultDoc.facility, ...data.facility },
      certifications: { ...defaultDoc.certifications, ...data.certifications },
      exportMarkets: { ...defaultDoc.exportMarkets, ...data.exportMarkets },
      catalog: { ...defaultDoc.catalog, ...data.catalog },
      cta: { ...defaultDoc.cta, ...data.cta }
    } as HomeDocument

  } catch (error) {
    console.error('Error fetching home config:', error)
    // Fallback to default in case of error so the page doesn't break
    return createDefaultHomeDocument()
  }
}

/**
 * Saves the Home Page configuration to Firestore.
 */
export async function saveHomeConfig(data: HomeDocument): Promise<{ success: boolean; error?: string }> {
  try {
    const dRef = doc(db, HOME_SETTINGS_DOC)
    
    // Add updatedAt timestamp
    const dataToSave = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    await setDoc(dRef, dataToSave)
    revalidatePath('/', 'page')
    return { success: true }
  } catch (error) {
    console.error('Error saving home config:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
