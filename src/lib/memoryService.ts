import { supabase } from './supabase'
import { StorageService } from './storage'

export interface Memory {
  id: string
  family_id: string
  title: string
  description?: string
  memory_type: 'photo' | 'video' | 'audio' | 'story'
  file_url?: string
  thumbnail_url?: string
  date_taken?: string
  location?: string
  created_by: string
  created_at: string
  updated_at: string
  is_private: boolean
}

export interface CreateMemoryData {
  family_id: string
  title: string
  description?: string
  memory_type: 'photo' | 'video' | 'audio' | 'story'
  date_taken?: string
  location?: string
  is_private?: boolean
  file?: File
  tags?: string[]
}

export class MemoryService {
  /**
   * Fetch memories for a family
   */
  static async fetchMemories(familyId: string): Promise<Memory[]> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles:created_by (
            id,
            full_name,
            avatar_url
          ),
          memory_tags (
            tags (
              id,
              name,
              color
            )
          )
        `)
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching memories:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Fetch memories failed:', error)
      return []
    }
  }

  /**
   * Create a new memory
   */
  static async createMemory(memoryData: CreateMemoryData): Promise<Memory | null> {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) {
        throw new Error('User not authenticated')
      }

      const memoryId = crypto.randomUUID()
      let fileUrl = ''
      let thumbnailUrl = ''

      // Upload file if provided
      if (memoryData.file) {
        const uploadResult = await StorageService.uploadFile(
          memoryData.file,
          user.data.user.id,
          memoryId,
          memoryData.memory_type === 'photo' ? 'image' : 
          memoryData.memory_type === 'video' ? 'video' : 'audio'
        )

        if (uploadResult?.error) {
          throw new Error(`File upload failed: ${uploadResult.error}`)
        }

        fileUrl = uploadResult?.publicUrl || ''
        
        // Generate thumbnail for images
        if (memoryData.memory_type === 'photo' && uploadResult?.filePath) {
          thumbnailUrl = await StorageService.generateThumbnail(uploadResult.filePath)
        }
      }

      // Create memory record
      const { data, error } = await supabase
        .from('memories')
        .insert([{
          id: memoryId,
          family_id: memoryData.family_id,
          title: memoryData.title,
          description: memoryData.description,
          memory_type: memoryData.memory_type,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl,
          date_taken: memoryData.date_taken,
          location: memoryData.location,
          created_by: user.data.user.id,
          is_private: memoryData.is_private || false
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating memory:', error)
        return null
      }

      // Add tags if provided
      if (memoryData.tags && memoryData.tags.length > 0) {
        await this.addTagsToMemory(memoryId, memoryData.tags, memoryData.family_id)
      }

      // Create activity
      await this.createActivity(
        memoryData.family_id,
        'upload',
        user.data.user.id,
        memoryId,
        `uploaded a new ${memoryData.memory_type}`
      )

      return data
    } catch (error) {
      console.error('Create memory failed:', error)
      return null
    }
  }

  /**
   * Update a memory
   */
  static async updateMemory(memoryId: string, updates: Partial<Memory>): Promise<Memory | null> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', memoryId)
        .select()
        .single()

      if (error) {
        console.error('Error updating memory:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Update memory failed:', error)
      return null
    }
  }

  /**
   * Delete a memory
   */
  static async deleteMemory(memoryId: string): Promise<boolean> {
    try {
      // Get memory details first
      const { data: memory } = await supabase
        .from('memories')
        .select('file_url')
        .eq('id', memoryId)
        .single()

      // Delete file from storage if exists
      if (memory?.file_url) {
        const filePath = memory.file_url.split('/').slice(-4).join('/')
        await StorageService.deleteFile(filePath)
      }

      // Delete memory record
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId)

      if (error) {
        console.error('Error deleting memory:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete memory failed:', error)
      return false
    }
  }

  /**
   * Add tags to a memory
   */
  private static async addTagsToMemory(memoryId: string, tagNames: string[], familyId: string): Promise<void> {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) return

      // Get or create tags
      const tagIds: string[] = []
      
      for (const tagName of tagNames) {
        // Check if tag exists
        let { data: existingTag } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .eq('family_id', familyId)
          .single()

        if (!existingTag) {
          // Create new tag
          const { data: newTag } = await supabase
            .from('tags')
            .insert([{
              name: tagName,
              family_id: familyId,
              created_by: user.data.user.id
            }])
            .select('id')
            .single()

          if (newTag) {
            tagIds.push(newTag.id)
          }
        } else {
          tagIds.push(existingTag.id)
        }
      }

      // Link tags to memory
      if (tagIds.length > 0) {
        const memoryTags = tagIds.map(tagId => ({
          memory_id: memoryId,
          tag_id: tagId
        }))

        await supabase
          .from('memory_tags')
          .insert(memoryTags)
      }
    } catch (error) {
      console.error('Error adding tags to memory:', error)
    }
  }

  /**
   * Create activity record
   */
  private static async createActivity(
    familyId: string,
    activityType: string,
    actorId: string,
    targetMemoryId?: string,
    content?: string
  ): Promise<void> {
    try {
      await supabase
        .from('activities')
        .insert([{
          family_id: familyId,
          activity_type: activityType,
          actor_id: actorId,
          target_memory_id: targetMemoryId,
          content: content
        }])
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  /**
   * Get memory by ID
   */
  static async getMemoryById(memoryId: string): Promise<Memory | null> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles:created_by (
            id,
            full_name,
            avatar_url
          ),
          memory_tags (
            tags (
              id,
              name,
              color
            )
          )
        `)
        .eq('id', memoryId)
        .single()

      if (error) {
        console.error('Error fetching memory:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Get memory failed:', error)
      return null
    }
  }
}