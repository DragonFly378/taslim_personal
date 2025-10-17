'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export type BookmarkType = 'AYAH' | 'DUA'

export interface Bookmark {
  id: number
  userId: string
  type: BookmarkType
  refId: number
  summary?: string | null
  url?: string | null
  createdAt: string
}

interface LocalBookmark {
  type: BookmarkType
  refId: number
  summary?: string
  url?: string
  createdAt: string
}

const GUEST_BOOKMARKS_KEY = 'taslim_guest_bookmarks'

export function useBookmarks(type?: BookmarkType) {
  const { toast } = useToast()
  const [localBookmarks, setLocalBookmarks] = useState<LocalBookmark[]>([])
  const [loading, setLoading] = useState(true)

  // Load bookmarks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_BOOKMARKS_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setLocalBookmarks(parsed)
      } catch (e) {
        console.error('Failed to parse bookmarks:', e)
      }
    }
    setLoading(false)
  }, [])

  // Check if item is bookmarked
  const isBookmarked = useCallback((refId: number, bookmarkType: BookmarkType) => {
    return localBookmarks.some(b => b.refId === refId && b.type === bookmarkType)
  }, [localBookmarks])

  // Toggle bookmark (local storage only)
  const toggleBookmark = async (refId: number, bookmarkType: BookmarkType) => {
    const alreadyBookmarked = isBookmarked(refId, bookmarkType)

    // Use localStorage only
    if (alreadyBookmarked) {
      const updated = localBookmarks.filter(
        b => !(b.refId === refId && b.type === bookmarkType)
      )
      setLocalBookmarks(updated)
      localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(updated))
      toast({
        title: 'Removed from bookmarks',
        description: 'Bookmark removed (stored locally)',
      })
    } else {
      const newBookmark: LocalBookmark = {
        type: bookmarkType,
        refId,
        createdAt: new Date().toISOString(),
      }
      const updated = [...localBookmarks, newBookmark]
      setLocalBookmarks(updated)
      localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(updated))
      toast({
        title: 'Added to bookmarks',
        description: 'Bookmark saved locally',
      })
    }
  }

  return {
    bookmarks: localBookmarks.map((b: any, i) => {
      // Convert bookmark format
      const summary = b.type === 'AYAH'
        ? JSON.stringify({
            surahName: b.surahName,
            surahNumber: b.surahNumber,
            ayahNumber: b.ayahNumber,
            arabicText: b.arabicText
          })
        : JSON.stringify({
            duaName: b.duaName,
            duaArabic: b.duaArabic
          })

      return {
        id: i,
        userId: 'local',
        type: b.type,
        refId: b.refId,
        summary: summary,
        url: b.url || null,
        createdAt: b.createdAt
      }
    }),
    loading,
    isBookmarked,
    toggleBookmark,
  }
}
