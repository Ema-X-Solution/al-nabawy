import type { IMediaProvider, MediaAssetMetadata } from '../mediaSystem.types'
import {
  getUploadSignatureAction,
  deleteCloudinaryAssetAction,
} from '@/app/actions/cloudinaryActions'

// ─── Cloudinary Upload API Response Shape ─────────────────────────────────────

interface CloudinaryUploadResponse {
  public_id: string
  secure_url: string
  width?: number
  height?: number
  format: string
  bytes: number
  created_at: string
  resource_type: 'image' | 'video' | 'raw'
}

// ─── Cloudinary Provider ──────────────────────────────────────────────────────

/**
 * Implements IMediaProvider for Cloudinary.
 *
 * This class is the ONLY file in the project that knows about Cloudinary.
 * All CMS modules interact with this through the MediaSystem orchestrator —
 * never directly.
 */
export class CloudinaryProvider implements IMediaProvider {
  readonly name = 'cloudinary'

  async uploadFile(
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<Omit<MediaAssetMetadata, 'id' | 'provider'>> {
    // 1. Obtain a signed upload token from the server (keeps API secret off client)
    const { signature, timestamp, apiKey, cloudName } =
      await getUploadSignatureAction(folder)

    // 2. Build the multipart form data payload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('signature', signature)
    formData.append('folder', folder)

    // 3. Determine resource_type so Cloudinary handles PDFs and videos correctly
    const resourceType = this.resolveResourceType(file)
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

    // 4. Upload directly from the browser to Cloudinary using XHR so we can
    //    track real upload progress
    const result = await this.uploadWithProgress<CloudinaryUploadResponse>(
      uploadUrl,
      formData,
      onProgress
    )

    // 5. Return only the metadata — never the raw binary
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
      folder,
      resource_type: result.resource_type,
    }
  }

  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw'
  ): Promise<void> {
    await deleteCloudinaryAssetAction(publicId, resourceType)
  }

  // ─── Private Utilities ──────────────────────────────────────────────────────

  private resolveResourceType(file: File): 'image' | 'video' | 'raw' {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') return 'image'
    if (file.type.startsWith('video/')) return 'video'
    return 'raw' // spreadsheets, text files, etc.
  }

  private uploadWithProgress<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open('POST', url)

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            onProgress(percent)
          }
        })
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText) as T)
          } catch {
            reject(new Error('Failed to parse Cloudinary response.'))
          }
        } else {
          let errorMessage = `Upload failed with status ${xhr.status}`
          try {
            const body = JSON.parse(xhr.responseText)
            if (body?.error?.message) errorMessage = body.error.message
          } catch {
            // ignore parse error
          }
          reject(new Error(errorMessage))
        }
      }

      xhr.onerror = () => reject(new Error('Network error during upload.'))
      xhr.onabort = () => reject(new Error('Upload was aborted.'))

      xhr.send(formData)
    })
  }
}
