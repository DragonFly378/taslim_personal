/**
 * Hook for offline-first Quran data access
 */

'use client'

import { useState, useEffect } from 'react'
import { getOfflineStorage } from '@/lib/offline-storage'

export function useOfflineQuran() {
  const [surahs, setSurahs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    fetchSurahs()
  }, [])

  const fetchSurahs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try offline storage first
      const storage = await getOfflineStorage()
      const offlineSurahs = await storage.getSurahs()

      if (offlineSurahs && offlineSurahs.length > 0) {
        setSurahs(offlineSurahs)
        setIsOffline(true)
        setLoading(false)

        // Update from network in background if online
        if (navigator.onLine) {
          fetchFromNetwork()
        }
        return
      }

      // Fallback to network
      await fetchFromNetwork()
    } catch (err) {
      console.error('Error fetching surahs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load surahs')
      setLoading(false)
    }
  }

  const fetchFromNetwork = async () => {
    try {
      const response = await fetch('/api/quran/surah')
      if (!response.ok) throw new Error('Failed to fetch surahs')

      const data = await response.json()
      setSurahs(data.data)
      setIsOffline(false)

      // Save to offline storage
      const storage = await getOfflineStorage()
      await storage.saveSurahs(data.data)
    } catch (err) {
      if (!surahs.length) {
        throw err
      }
      // If we have offline data, just continue using it
    } finally {
      setLoading(false)
    }
  }

  return { surahs, loading, error, isOffline, refetch: fetchSurahs }
}

export function useOfflineSurahDetail(surahNumber: number | null) {
  const [surahDetail, setSurahDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    if (surahNumber !== null) {
      fetchSurahDetail()
    }
  }, [surahNumber])

  const fetchSurahDetail = async () => {
    if (surahNumber === null) return

    try {
      setLoading(true)
      setError(null)

      // Try offline storage first
      const storage = await getOfflineStorage()
      const offlineDetail = await storage.getSurahDetail(surahNumber)

      if (offlineDetail) {
        setSurahDetail(offlineDetail)
        setIsOffline(true)
        setLoading(false)

        // Update from network in background if online
        if (navigator.onLine) {
          fetchFromNetwork()
        }
        return
      }

      // Fallback to network
      await fetchFromNetwork()
    } catch (err) {
      console.error('Error fetching surah detail:', err)
      setError(err instanceof Error ? err.message : 'Failed to load surah')
      setLoading(false)
    }
  }

  const fetchFromNetwork = async () => {
    if (surahNumber === null) return

    try {
      const response = await fetch(`/api/quran/surah/${surahNumber}`)
      if (!response.ok) throw new Error('Failed to fetch surah detail')

      const data = await response.json()
      setSurahDetail(data.data.surah)
      setIsOffline(false)

      // Save to offline storage
      const storage = await getOfflineStorage()
      await storage.saveSurahDetail(data.data.surah)
    } catch (err) {
      if (!surahDetail) {
        throw err
      }
      // If we have offline data, just continue using it
    } finally {
      setLoading(false)
    }
  }

  return { surahDetail, loading, error, isOffline, refetch: fetchSurahDetail }
}
