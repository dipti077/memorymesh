import { supabase } from './supabase'

export interface UploadResult {
  publicUrl: string
  filePath: string
  error?: string
}

export class StorageService {
  private static readonly BUCKET_NAME = 'memory_media'

  /**
   * Upload a file to storage
   */
  static async uploadFile(
    file: File,
    userId: string,
    memoryId: string,
    fileType: 'image' | 'video' | 'audio' = 'image'
  ): Promise<UploadResult | null> {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `${userId}/${memoryId}/${fileType}s/${fileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (error) {
        console.error('Upload error:', error)
        return { publicUrl: '', filePath: '', error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return {
        publicUrl: publicUrlData.publicUrl,
        filePath: filePath,
      }
    } catch (error) {
      console.error('Upload failed:', error)
      return { publicUrl: '', filePath: '', error: 'Upload failed' }
    }
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete failed:', error)
      return false
    }
  }

  /**
   * Generate thumbnail for images
   */
  static async generateThumbnail(filePath: string, width = 300, height = 300): Promise<string> {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath, {
        transform: {
          width,
          height,
          resize: 'cover',
        },
      })

    return data.publicUrl
  }

  /**
   * Get signed URL for private files
   */
  static async getSignedUrl(filePath: string, expiresIn = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        console.error('Signed URL error:', error)
        return null
      }

      return data.signedUrl
    } catch (error) {
      console.error('Signed URL failed:', error)
      return null
    }
  }
}