'use server'

import { v2 as cloudinary } from 'cloudinary'

// ─── Provider Initialization (server-only) ────────────────────────────────────
// Credentials are read exclusively from environment variables.
// Never pass secrets from client code.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadSignaturePayload {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * Generates a signed upload token so the client can upload directly to
 * Cloudinary without ever exposing the API secret in the browser.
 */
export async function getUploadSignatureAction(
  folder: string
): Promise<UploadSignaturePayload> {
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!apiKey || !cloudName || !apiSecret) {
    throw new Error(
      'Cloudinary environment variables are not configured. ' +
      'Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, ' +
      'NEXT_PUBLIC_CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local'
    )
  }

  const timestamp = Math.round(Date.now() / 1000)

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  )

  return { signature, timestamp, apiKey, cloudName, folder }
}

/**
 * Deletes an asset from Cloudinary by its public_id.
 * Only the server action has access to the API secret for this operation.
 */
export async function deleteCloudinaryAssetAction(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!apiSecret) {
    throw new Error(
      'Cloudinary API secret is not configured. ' +
      'Please set CLOUDINARY_API_SECRET in .env.local'
    )
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
