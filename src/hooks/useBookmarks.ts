'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
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
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [localBookmarks, setLocalBookmarks] = useState<LocalBookmark[]>([])
  const [loading, setLoading] = useState(true)

  // Load guest bookmarks from localStorage
  useEffect(() => {
    if (status === 'unauthenticated') {
      const stored = localStorage.getItem(GUEST_BOOKMARKS_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setLocalBookmarks(parsed)
        } catch (e) {
          console.error('Failed to parse guest bookmarks:', e)
        }
      }
      setLoading(false)
    }
  }, [status])

  // Fetch authenticated user bookmarks
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchBookmarks()
    }
  }, [session?.user?.id, status, type])

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const params = type ? `?type=${type}` : ''
      const response = await fetch(`/api/bookmarks${params}`)

      if (!response.ok) throw new Error('Failed to fetch bookmarks')

      const data = await response.json()
      setBookmarks(data)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      toast({
        title: 'Error',
        description: 'Failed to load bookmarks',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Check if item is bookmarked
  const isBookmarked = useCallback((refId: number, bookmarkType: BookmarkType) => {
    if (status === 'authenticated') {
      return bookmarks.some(b => b.refId === refId && b.type === bookmarkType)
    } else {
      return localBookmarks.some(b => b.refId === refId && b.type === bookmarkType)
    }
  }, [bookmarks, localBookmarks, status])

  // Toggle bookmark (optimistic UI)
  const toggleBookmark = async (refId: number, bookmarkType: BookmarkType) => {
    const alreadyBookmarked = isBookmarked(refId, bookmarkType)

    if (status === 'unauthenticated') {
      // Guest mode - use localStorage
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
          description: 'Bookmark saved locally. Sign in to sync across devices.',
        })
      }
      return
    }

    // Authenticated mode - optimistic UI
    if (alreadyBookmarked) {
      const bookmark = bookmarks.find(b => b.refId === refId && b.type === bookmarkType)
      if (!bookmark) return

      // Optimistically remove
      setBookmarks(prev => prev.filter(b => b.id !== bookmark.id))

      try {
        const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete bookmark')

        toast({
          title: 'Removed from bookmarks',
          description: 'Bookmark removed successfully',
        })
      } catch (error) {
        // Rollback on error
        setBookmarks(prev => [...prev, bookmark])
        toast({
          title: 'Error',
          description: 'Failed to remove bookmark',
          variant: 'destructive',
        })
      }
    } else {
      // Optimistically add
      const tempBookmark: Bookmark = {
        id: Date.now(), // temporary ID
        userId: session!.user!.id,
        type: bookmarkType,
        refId,
        createdAt: new Date().toISOString(),
      }
      setBookmarks(prev => [...prev, tempBookmark])

      try {
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: bookmarkType, refId }),
        })

        if (!response.ok) throw new Error('Failed to create bookmark')

        const { data } = await response.json()

        // Replace temp bookmark with real one
        setBookmarks(prev =>
          prev.map(b => b.id === tempBookmark.id ? data : b)
        )

        toast({
          title: 'Added to bookmarks',
          description: 'Bookmark saved successfully',
        })
      } catch (error) {
        // Rollback on error
        setBookmarks(prev => prev.filter(b => b.id !== tempBookmark.id))
        toast({
          title: 'Error',
          description: 'Failed to save bookmark',
          variant: 'destructive',
        })
      }
    }
  }

  // Merge guest bookmarks after login
  const mergeGuestBookmarks = async () => {
    const guestData = localStorage.getItem(GUEST_BOOKMARKS_KEY)
    if (!guestData) return 0

    try {
      const guestBookmarks: LocalBookmark[] = JSON.parse(guestData)
      if (guestBookmarks.length === 0) return 0

      let mergedCount = 0

      for (const guestBookmark of guestBookmarks) {
        // Check if already bookmarked
        const exists = bookmarks.some(
          b => b.refId === guestBookmark.refId && b.type === guestBookmark.type
        )

        if (!exists) {
          const response = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: guestBookmark.type,
              refId: guestBookmark.refId,
            }),
          })

          if (response.ok) mergedCount++
        }
      }

      // Clear guest bookmarks
      localStorage.removeItem(GUEST_BOOKMARKS_KEY)
      setLocalBookmarks([])

      // Refresh bookmarks
      await fetchBookmarks()

      return mergedCount
    } catch (error) {
      console.error('Error merging guest bookmarks:', error)
      return 0
    }
  }

  return {
    bookmarks: status === 'authenticated' ? bookmarks : localBookmarks.map((b: any, i) => {
      // Convert guest bookmark format to match authenticated format
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
        userId: 'guest',
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
    mergeGuestBookmarks,
    hasGuestBookmarks: localBookmarks.length > 0,
  }
}
