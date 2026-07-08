export interface MediaAssetMetadata {
  id: string; // unique document ID in Firestore / database
  public_id: string; // provider-specific public id (e.g. Cloudinary public_id or S3 key)
  secure_url: string; // resolved secure URL
  width?: number; // image/video width in pixels
  height?: number; // image/video height in pixels
  format: string; // e.g. "jpg", "png", "pdf", "mp4"
  bytes: number; // file size in bytes
  created_at: string; // ISO 8601 string or format from provider
  folder: string; // e.g. "products", "gallery", "branding"
  resource_type: 'image' | 'video' | 'raw'; // raw is for documents/PDFs
  provider: string; // e.g. "cloudinary"
}

export interface IMediaProvider {
  name: string;
  
  /**
   * Uploads a file directly to the storage provider
   * @param file The file object from client-side input
   * @param folder The subfolder layout path
   * @param onProgress Optional progress callback (0 to 100)
   */
  uploadFile(
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<Omit<MediaAssetMetadata, 'id' | 'provider'>>;

  /**
   * Deletes a file from the storage provider
   * @param publicId Provider-specific public ID
   * @param resourceType The type category of the resource
   */
  deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw'): Promise<void>;
}
