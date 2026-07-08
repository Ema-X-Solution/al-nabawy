import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { MediaAssetMetadata } from './mediaSystem.types'

// ─── Firestore Collection Name ────────────────────────────────────────────────
const COLLECTION = 'media_assets'

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Persists asset metadata returned by the storage provider into Firestore.
 * The document ID becomes the asset's `id` within the rest of the application.
 */
export async function saveAssetMetadata(
  asset: Omit<MediaAssetMetadata, 'id'>
): Promise<MediaAssetMetadata> {
  const sanitizedAsset = Object.fromEntries(
    Object.entries(asset).filter(([_, v]) => v !== undefined)
  )

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...sanitizedAsset,
    createdAt: serverTimestamp(),
  })

  return { id: docRef.id, ...(sanitizedAsset as typeof asset) }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Removes an asset's metadata record from Firestore.
 * Call this AFTER the provider successfully deletes the file.
 */
export async function deleteAssetMetadata(assetId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, assetId))
}

// ─── Query ────────────────────────────────────────────────────────────────────

export interface ListAssetsOptions {
  folder?: string
  resource_type?: 'image' | 'video' | 'raw'
  provider?: string
}

/**
 * Lists all assets from Firestore, optionally filtered by folder, type,
 * or provider. Results are sorted newest-first.
 */
export async function listAssets(
  options: ListAssetsOptions = {}
): Promise<MediaAssetMetadata[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

  if (options.folder) {
    constraints.push(where('folder', '==', options.folder))
  }
  if (options.resource_type) {
    constraints.push(where('resource_type', '==', options.resource_type))
  }
  if (options.provider) {
    constraints.push(where('provider', '==', options.provider))
  }

  const q = query(collection(db, COLLECTION), ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as DocumentData),
  })) as MediaAssetMetadata[]
}
