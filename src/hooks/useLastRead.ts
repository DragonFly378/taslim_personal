'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

export type LastReadType = 'QURAN' | 'DUA'

export interface LastRead {
  id: number
  userId: string
  type: LastReadType
  surahId?: number | null
  ayahNumber?: number | null
  duaId?: number | null
  updatedAt: string
}

interface LocalLastRead {
  type: LastReadType
  surahId?: number
  ayahNumber?: number
  duaId?: number
  updatedAt: string
}

const GUEST_LAST_READ_KEY = 'taslim_guest_last_read'

export function useLastRead(type: LastReadType) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [lastRead, setLastRead] = useState<LastRead | LocalLastRead | null>(null)
  const [loading, setLoading] = useState(true)
  const updateTimeoutRef = useRef<NodeJS.Timeout>()

  // Load guest last read from localStorage
  useEffect(() => {
    if (status === 'unauthenticated') {
      const stored = localStorage.getItem(GUEST_LAST_READ_KEY)
      if (stored) {
        try {
          const parsed: Record<string, LocalLastRead> = JSON.parse(stored)
          setLastRead(parsed[type] || null)
        } catch (e) {
          console.error('Failed to parse guest last read:', e)
        }
      }
      setLoading(false)
    }
  }, [status, type])

  // Fetch authenticated user last read
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchLastRead()
    }
  }, [session, status, type])

  const fetchLastRead = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/last-read?type=${type}`)

      if (!response.ok) throw new Error('Failed to fetch last read')

      const data = await response.json()
      setLastRead(data)
    } catch (error) {
      console.error('Error fetching last read:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update last read (debounced)
  const updateLastRead = useCallback((data: {
    surahId?: number
    ayahNumber?: number
    duaId?: number
  }) => {
    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Debounce update (wait 1 second after scroll stops)
    updateTimeoutRef.current = setTimeout(async () => {
      if (status === 'unauthenticated') {
        // Guest mode - use localStorage
        const stored = localStorage.getItem(GUEST_LAST_READ_KEY)
        const allLastReads: Record<string, LocalLastRead> = stored ? JSON.parse(stored) : {}

        const newLastRead: LocalLastRead = {
          type,
          ...data,
          updatedAt: new Date().toISOString(),
        }

        allLastReads[type] = newLastRead
        localStorage.setItem(GUEST_LAST_READ_KEY, JSON.stringify(allLastReads))
        setLastRead(newLastRead)
      } else {
        // Authenticated mode
        try {
          const response = await fetch('/api/last-read', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type,
              ...data,
            }),
          })

          if (!response.ok) throw new Error('Failed to update last read')

          const { data: updatedLastRead } = await response.json()
          setLastRead(updatedLastRead)
        } catch (error) {
          console.error('Error updating last read:', error)
        }
      }
    }, 1000)
  }, [type, status])

  // Mark as last read manually
  const markAsLastRead = async (data: {
    surahId?: number
    ayahNumber?: number
    duaId?: number
  }) => {
    if (status === 'unauthenticated') {
      const stored = localStorage.getItem(GUEST_LAST_READ_KEY)
      const allLastReads: Record<string, LocalLastRead> = stored ? JSON.parse(stored) : {}

      const newLastRead: LocalLastRead = {
        type,
        ...data,
        updatedAt: new Date().toISOString(),
      }

      allLastReads[type] = newLastRead
      localStorage.setItem(GUEST_LAST_READ_KEY, JSON.stringify(allLastReads))
      setLastRead(newLastRead)

      toast({
        title: 'Last read updated',
        description: 'Saved locally. Sign in to sync across devices.',
      })
    } else {
      try {
        const response = await fetch('/api/last-read', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            ...data,
          }),
        })

        if (!response.ok) throw new Error('Failed to update last read')

        const { data: updatedLastRead } = await response.json()
        setLastRead(updatedLastRead)

        toast({
          title: 'Last read updated',
          description: 'Progress saved successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update last read',
          variant: 'destructive',
        })
      }
    }
  }

  // Merge guest last read after login
  const mergeGuestLastRead = async () => {
    const guestData = localStorage.getItem(GUEST_LAST_READ_KEY)
    if (!guestData) return false

    try {
      const guestLastReads: Record<string, LocalLastRead> = JSON.parse(guestData)
      const guestLastRead = guestLastReads[type]

      if (guestLastRead) {
        const response = await fetch('/api/last-read', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guestLastRead),
        })

        if (response.ok) {
          // Clear guest data for this type
          delete guestLastReads[type]
          if (Object.keys(guestLastReads).length === 0) {
            localStorage.removeItem(GUEST_LAST_READ_KEY)
          } else {
            localStorage.setItem(GUEST_LAST_READ_KEY, JSON.stringify(guestLastReads))
          }

          await fetchLastRead()
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Error merging guest last read:', error)
      return false
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  return {
    lastRead,
    loading,
    updateLastRead,
    markAsLastRead,
    mergeGuestLastRead,
  }
}

// Intersection Observer hook for auto-tracking last read
export function useLastReadObserver(
  type: LastReadType,
  onVisible: (data: { surahId?: number; ayahNumber?: number; duaId?: number }) => void
) {
  const observerRef = useRef<IntersectionObserver>()

  const observe = useCallback((element: HTMLElement, data: {
    surahId?: number
    ayahNumber?: number
    duaId?: number
  }) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const elementData = (entry.target as HTMLElement).dataset
              onVisible({
                surahId: elementData.surahId ? Number(elementData.surahId) : undefined,
                ayahNumber: elementData.ayahNumber ? Number(elementData.ayahNumber) : undefined,
                duaId: elementData.duaId ? Number(elementData.duaId) : undefined,
              })
            }
          })
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5, // Element must be 50% visible
        }
      )
    }

    // Set data attributes
    if (data.surahId) element.dataset.surahId = String(data.surahId)
    if (data.ayahNumber) element.dataset.ayahNumber = String(data.ayahNumber)
    if (data.duaId) element.dataset.duaId = String(data.duaId)

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(element)
      }
    }
  }, [onVisible])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { observe }
}
