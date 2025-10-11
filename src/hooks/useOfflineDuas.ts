/**
 * Hook for offline-first Duas data access
 */

'use client'

import { useState, useEffect } from 'react'
import { getOfflineStorage } from '@/lib/offline-storage'

export function useOfflineDuas(category?: string) {
  const [duas, setDuas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    fetchDuas()
  }, [category])

  const fetchDuas = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try offline storage first
      const storage = await getOfflineStorage()
      const offlineDuas = await storage.getDuas()

      if (offlineDuas && offlineDuas.length > 0) {
        // Filter by category if provided
        const filtered = category
          ? offlineDuas.filter((dua) => dua.category?.slug === category)
          : offlineDuas

        setDuas(filtered)
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
      console.error('Error fetching duas:', err)
      setError(err instanceof Error ? err.message : 'Failed to load duas')
      setLoading(false)
    }
  }

  const fetchFromNetwork = async () => {
    try {
      const url = category ? `/api/dua?category=${category}` : '/api/dua'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch duas')

      const data = await response.json()
      setDuas(data)
      setIsOffline(false)

      // Save to offline storage (only if fetching all duas)
      if (!category) {
        const storage = await getOfflineStorage()
        await storage.saveDuas(data)
      }
    } catch (err) {
      if (!duas.length) {
        throw err
      }
      // If we have offline data, just continue using it
    } finally {
      setLoading(false)
    }
  }

  return { duas, loading, error, isOffline, refetch: fetchDuas }
}

export function useOfflineDuaCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try offline storage first
      const storage = await getOfflineStorage()
      const offlineCategories = await storage.getDuaCategories()

      if (offlineCategories && offlineCategories.length > 0) {
        setCategories(offlineCategories)
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
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
      setLoading(false)
    }
  }

  const fetchFromNetwork = async () => {
    try {
      const response = await fetch('/api/dua/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')

      const data = await response.json()
      setCategories(data)
      setIsOffline(false)

      // Save to offline storage
      const storage = await getOfflineStorage()
      await storage.saveDuaCategories(data)
    } catch (err) {
      if (!categories.length) {
        throw err
      }
      // If we have offline data, just continue using it
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, isOffline, refetch: fetchCategories }
}
