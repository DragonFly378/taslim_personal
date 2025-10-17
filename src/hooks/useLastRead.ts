'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const { toast } = useToast()
  const [lastRead, setLastRead] = useState<LastRead | LocalLastRead | null>(null)
  const [loading, setLoading] = useState(true)
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load last read from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_LAST_READ_KEY)
    if (stored) {
      try {
        const parsed: Record<string, LocalLastRead> = JSON.parse(stored)
        setLastRead(parsed[type] || null)
      } catch (e) {
        console.error('Failed to parse last read:', e)
      }
    }
    setLoading(false)
  }, [type])

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
      // Use localStorage only
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
    }, 1000)
  }, [type])

  // Mark as last read manually
  const markAsLastRead = async (data: {
    surahId?: number
    ayahNumber?: number
    duaId?: number
  }) => {
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
      description: 'Saved locally',
    })
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
  }
}

// Intersection Observer hook for auto-tracking last read
export function useLastReadObserver(
  type: LastReadType,
  onVisible: (data: { surahId?: number; ayahNumber?: number; duaId?: number }) => void
) {
  const observerRef = useRef<IntersectionObserver | undefined>(undefined)

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
