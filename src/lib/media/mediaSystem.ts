import type { IMediaProvider, MediaAssetMetadata } from './mediaSystem.types'
import { CloudinaryProvider } from './providers/cloudinaryProvider'
import {
  saveAssetMetadata,
  deleteAssetMetadata,
  listAssets,
  type ListAssetsOptions,
} from './mediaDatabase'

// ─── File Validation Rules ────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf']

const MAX_IMAGE_BYTES = 5 * 1024 * 1024    // 5 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024   // 50 MB
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024 // 10 MB

// ─── Validation Helper ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateFile(file: File): ValidationResult {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
  const isDoc = ALLOWED_DOCUMENT_TYPES.includes(file.type)

  if (!isImage && !isVideo && !isDoc) {
    return {
      valid: false,
      error: `Unsupported file type: "${file.type}". Allowed: images (JPEG, PNG, WebP, GIF, SVG), videos (MP4, WebM, MOV), PDFs.`,
    }
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return { valid: false, error: 'Image files must be smaller than 5 MB.' }
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return { valid: false, error: 'Video files must be smaller than 50 MB.' }
  }
  if (isDoc && file.size > MAX_DOCUMENT_BYTES) {
    return { valid: false, error: 'Document files must be smaller than 10 MB.' }
  }

  return { valid: true }
}

// ─── Folder Presets (Cloudinary-folder path constants) ───────────────────────

export const MEDIA_FOLDERS = {
  branding: 'branding',
  products: 'products',
  categories: 'categories',
  gallery: 'gallery',
  home: 'home',
  about: 'about',
  certifications: 'certifications',
  settings: 'settings',
} as const

export type MediaFolder = (typeof MEDIA_FOLDERS)[keyof typeof MEDIA_FOLDERS]

// ─── MediaSystem (The Single Orchestrator) ────────────────────────────────────

/**
 * MediaSystem is the ONLY entry point for all media operations across the CMS.
 *
 * CMS modules (Products, Gallery, Home, About, etc.) must call only this class.
 * The active provider (Cloudinary, S3, Firebase Storage…) is configured once
 * here and is completely transparent to the rest of the application.
 */
class MediaSystem {
  private provider: IMediaProvider

  constructor(provider: IMediaProvider) {
    this.provider = provider
  }

  // ─── Upload ────────────────────────────────────────────────────────────────

  /**
   * Validates, uploads, and registers a file asset.
   *
   * @param file The browser File object from an <input type="file">.
   * @param folder One of the MEDIA_FOLDERS constants.
   * @param onProgress Optional callback called with 0-100 progress values.
   * @returns The fully persisted MediaAssetMetadata including its Firestore id.
   * @throws Error with a user-readable message on validation or upload failure.
   */
  async upload(
    file: File,
    folder: MediaFolder,
    onProgress?: (progress: number) => void
  ): Promise<MediaAssetMetadata> {
    // 1. Validate before touching the network
    const validation = validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // 2. Delegate the actual upload to the active provider
    const providerMetadata = await this.provider.uploadFile(
      file,
      folder,
      onProgress
    )

    // 3. Persist the provider-returned metadata to Firestore
    const asset = await saveAssetMetadata({
      ...providerMetadata,
      provider: this.provider.name,
    })

    return asset
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  /**
   * Deletes the asset from the storage provider and removes its
   * Firestore metadata record.
   *
   * @param asset The full MediaAssetMetadata object to be deleted.
   */
  async delete(asset: MediaAssetMetadata): Promise<void> {
    // 1. Remove from storage provider first
    await this.provider.deleteFile(asset.public_id, asset.resource_type)

    // 2. Then remove the metadata record
    await deleteAssetMetadata(asset.id)
  }

  // ─── Browse ────────────────────────────────────────────────────────────────

  /**
   * Lists registered assets from Firestore.
   * Filtering by folder, resource_type, or provider is supported.
   */
  async list(options: ListAssetsOptions = {}): Promise<MediaAssetMetadata[]> {
    return listAssets(options)
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

/**
 * The singleton MediaSystem instance bound to the Cloudinary provider.
 *
 * To switch providers in the future (e.g. to S3), replace CloudinaryProvider
 * with the new provider class here. No other file needs to change.
 */
export const mediaSystem = new MediaSystem(new CloudinaryProvider())

// Re-export types so CMS modules only need to import from here
export type { MediaAssetMetadata, IMediaProvider } from './mediaSystem.types'
export { MEDIA_FOLDERS as FOLDERS }
