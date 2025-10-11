/**
 * Service for downloading Quran and Duas for offline use
 */

import { getOfflineStorage } from './offline-storage'

export interface DownloadProgress {
  total: number
  current: number
  percentage: number
  status: 'idle' | 'downloading' | 'completed' | 'error'
  error?: string
}

export type ProgressCallback = (progress: DownloadProgress) => void

/**
 * Download all Quran surahs for offline access
 */
export async function downloadQuranForOffline(
  onProgress?: ProgressCallback
): Promise<boolean> {
  try {
    const storage = await getOfflineStorage()
    const total = 114 // Total number of surahs

    // Update progress
    const updateProgress = (current: number, status: DownloadProgress['status'], error?: string) => {
      const progress: DownloadProgress = {
        total,
        current,
        percentage: Math.round((current / total) * 100),
        status,
        error,
      }
      onProgress?.(progress)
      storage.setDownloadProgress('quran', progress.percentage)
    }

    updateProgress(0, 'downloading')

    // Step 1: Download list of all surahs
    const surahsResponse = await fetch('/api/quran/surah')
    if (!surahsResponse.ok) throw new Error('Failed to fetch surahs list')

    const surahsData = await surahsResponse.json()
    const surahs = surahsData.data

    // Save the list
    await storage.saveSurahs(surahs)

    // Step 2: Download each surah detail with verses
    const surahDetails = []

    for (let i = 0; i < surahs.length; i++) {
      const surah = surahs[i]

      try {
        const response = await fetch(`/api/quran/surah/${surah.id}`)
        if (!response.ok) throw new Error(`Failed to fetch surah ${surah.id}`)

        const data = await response.json()
        surahDetails.push(data.data.surah)

        // Save individual surah immediately
        await storage.saveSurahDetail(data.data.surah)

        updateProgress(i + 1, 'downloading')

        // Small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error downloading surah ${surah.id}:`, error)
        // Continue with other surahs even if one fails
      }
    }

    // Mark as complete
    await storage.saveAllSurahDetails(surahDetails)
    updateProgress(total, 'completed')

    return true
  } catch (error) {
    console.error('Error downloading Quran:', error)
    onProgress?.({
      total: 114,
      current: 0,
      percentage: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return false
  }
}

/**
 * Download all Duas for offline access
 */
export async function downloadDuasForOffline(
  onProgress?: ProgressCallback
): Promise<boolean> {
  try {
    const storage = await getOfflineStorage()

    const updateProgress = (current: number, total: number, status: DownloadProgress['status'], error?: string) => {
      const progress: DownloadProgress = {
        total,
        current,
        percentage: total > 0 ? Math.round((current / total) * 100) : 0,
        status,
        error,
      }
      onProgress?.(progress)
      storage.setDownloadProgress('duas', progress.percentage)
    }

    updateProgress(0, 100, 'downloading')

    // Step 1: Download categories
    const categoriesResponse = await fetch('/api/dua/categories')
    if (!categoriesResponse.ok) throw new Error('Failed to fetch dua categories')

    const categories = await categoriesResponse.json()
    await storage.saveDuaCategories(categories)

    updateProgress(30, 100, 'downloading')

    // Step 2: Download all duas
    const duasResponse = await fetch('/api/dua')
    if (!duasResponse.ok) throw new Error('Failed to fetch duas')

    const duas = await duasResponse.json()
    await storage.saveDuas(duas)

    updateProgress(100, 100, 'completed')

    return true
  } catch (error) {
    console.error('Error downloading Duas:', error)
    onProgress?.({
      total: 100,
      current: 0,
      percentage: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return false
  }
}

/**
 * Check if content is available offline
 */
export async function checkOfflineAvailability(): Promise<{
  quranAvailable: boolean
  duasAvailable: boolean
}> {
  try {
    const storage = await getOfflineStorage()
    const status = await storage.getOfflineStatus()

    return {
      quranAvailable: status.quranDownloaded,
      duasAvailable: status.duasDownloaded,
    }
  } catch (error) {
    console.error('Error checking offline availability:', error)
    return {
      quranAvailable: false,
      duasAvailable: false,
    }
  }
}

/**
 * Delete offline content
 */
export async function deleteOfflineContent(type: 'quran' | 'duas' | 'all'): Promise<boolean> {
  try {
    const storage = await getOfflineStorage()

    if (type === 'all') {
      await storage.clearAll()
    } else if (type === 'quran') {
      await storage.clearQuran()
    } else {
      await storage.clearDuas()
    }

    return true
  } catch (error) {
    console.error('Error deleting offline content:', error)
    return false
  }
}

/**
 * Get storage size estimate
 */
export async function getStorageEstimate(): Promise<{
  usage: number
  quota: number
  percentage: number
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage || 0
    const quota = estimate.quota || 0
    const percentage = quota > 0 ? (usage / quota) * 100 : 0

    return {
      usage,
      quota,
      percentage,
    }
  }

  return {
    usage: 0,
    quota: 0,
    percentage: 0,
  }
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
