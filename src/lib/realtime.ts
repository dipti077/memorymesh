import { supabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map()

  /**
   * Subscribe to memory changes for a family
   */
  static subscribeToMemories(
    familyId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeChannel {
    const channelName = `memories_${familyId}`
    
    // Remove existing channel if exists
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memories',
          filter: `family_id=eq.${familyId}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload)
              break
            case 'UPDATE':
              onUpdate?.(payload)
              break
            case 'DELETE':
              onDelete?.(payload)
              break
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * Subscribe to comments for a memory
   */
  static subscribeToComments(
    memoryId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeChannel {
    const channelName = `comments_${memoryId}`
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `memory_id=eq.${memoryId}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload)
              break
            case 'UPDATE':
              onUpdate?.(payload)
              break
            case 'DELETE':
              onDelete?.(payload)
              break
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  /**
   * Unsubscribe from a channel
   */
  static unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }

  /**
   * Unsubscribe from all channels
   */
  static unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe()
    })
    this.channels.clear()
  }
}