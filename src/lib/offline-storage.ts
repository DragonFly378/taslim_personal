/**
 * IndexedDB wrapper for offline storage of Quran and Duas
 */

const DB_NAME = 'TaslimDB'
const DB_VERSION = 1

// Store names
const STORES = {
  SURAHS: 'surahs',
  SURAH_DETAILS: 'surah_details',
  DUAS: 'duas',
  DUA_CATEGORIES: 'dua_categories',
  METADATA: 'metadata',
} as const

interface MetadataEntry {
  key: string
  value: any
  timestamp: number
}

export interface OfflineStatus {
  quranDownloaded: boolean
  duasDownloaded: boolean
  lastQuranUpdate: number | null
  lastDuasUpdate: number | null
  quranProgress: number
  duasProgress: number
}

class OfflineStorage {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains(STORES.SURAHS)) {
          db.createObjectStore(STORES.SURAHS, { keyPath: 'nomor' })
        }

        if (!db.objectStoreNames.contains(STORES.SURAH_DETAILS)) {
          db.createObjectStore(STORES.SURAH_DETAILS, { keyPath: 'nomor' })
        }

        if (!db.objectStoreNames.contains(STORES.DUAS)) {
          db.createObjectStore(STORES.DUAS, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(STORES.DUA_CATEGORIES)) {
          db.createObjectStore(STORES.DUA_CATEGORIES, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          db.createObjectStore(STORES.METADATA, { keyPath: 'key' })
        }
      }
    })
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  // Generic methods
  private async getAll<T>(storeName: string): Promise<T[]> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async put<T>(storeName: string, data: T): Promise<void> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async putMany<T>(storeName: string, items: T[]): Promise<void> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)

      let completed = 0
      const total = items.length

      items.forEach((item) => {
        const request = store.put(item)
        request.onsuccess = () => {
          completed++
          if (completed === total) resolve()
        }
        request.onerror = () => reject(request.error)
      })

      if (total === 0) resolve()
    })
  }

  private async clear(storeName: string): Promise<void> {
    const db = this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Metadata methods
  async getMetadata(key: string): Promise<any | null> {
    const entry = await this.get<MetadataEntry>(STORES.METADATA, key)
    return entry ? entry.value : null
  }

  async setMetadata(key: string, value: any): Promise<void> {
    await this.put(STORES.METADATA, {
      key,
      value,
      timestamp: Date.now(),
    })
  }

  // Quran methods
  async saveSurahs(surahs: any[]): Promise<void> {
    await this.putMany(STORES.SURAHS, surahs)
    await this.setMetadata('quran_list_updated', Date.now())
  }

  async getSurahs(): Promise<any[]> {
    return this.getAll(STORES.SURAHS)
  }

  async saveSurahDetail(surahDetail: any): Promise<void> {
    await this.put(STORES.SURAH_DETAILS, surahDetail)
  }

  async getSurahDetail(surahNumber: number): Promise<any | undefined> {
    return this.get(STORES.SURAH_DETAILS, surahNumber)
  }

  async saveAllSurahDetails(surahDetails: any[]): Promise<void> {
    await this.putMany(STORES.SURAH_DETAILS, surahDetails)
    await this.setMetadata('quran_full_updated', Date.now())
    await this.setMetadata('quran_downloaded', true)
  }

  // Duas methods
  async saveDuas(duas: any[]): Promise<void> {
    await this.putMany(STORES.DUAS, duas)
    await this.setMetadata('duas_updated', Date.now())
    await this.setMetadata('duas_downloaded', true)
  }

  async getDuas(): Promise<any[]> {
    return this.getAll(STORES.DUAS)
  }

  async saveDuaCategories(categories: any[]): Promise<void> {
    await this.putMany(STORES.DUA_CATEGORIES, categories)
    await this.setMetadata('dua_categories_updated', Date.now())
  }

  async getDuaCategories(): Promise<any[]> {
    return this.getAll(STORES.DUA_CATEGORIES)
  }

  // Status methods
  async getOfflineStatus(): Promise<OfflineStatus> {
    const quranDownloaded = (await this.getMetadata('quran_downloaded')) || false
    const duasDownloaded = (await this.getMetadata('duas_downloaded')) || false
    const lastQuranUpdate = await this.getMetadata('quran_full_updated')
    const lastDuasUpdate = await this.getMetadata('duas_updated')
    const quranProgress = (await this.getMetadata('quran_download_progress')) || 0
    const duasProgress = (await this.getMetadata('duas_download_progress')) || 0

    return {
      quranDownloaded,
      duasDownloaded,
      lastQuranUpdate,
      lastDuasUpdate,
      quranProgress,
      duasProgress,
    }
  }

  async setDownloadProgress(type: 'quran' | 'duas', progress: number): Promise<void> {
    await this.setMetadata(`${type}_download_progress`, progress)
  }

  // Clear all offline data
  async clearAll(): Promise<void> {
    await this.clear(STORES.SURAHS)
    await this.clear(STORES.SURAH_DETAILS)
    await this.clear(STORES.DUAS)
    await this.clear(STORES.DUA_CATEGORIES)
    await this.clear(STORES.METADATA)
  }

  async clearQuran(): Promise<void> {
    await this.clear(STORES.SURAHS)
    await this.clear(STORES.SURAH_DETAILS)
    await this.setMetadata('quran_downloaded', false)
    await this.setMetadata('quran_full_updated', null)
    await this.setMetadata('quran_download_progress', 0)
  }

  async clearDuas(): Promise<void> {
    await this.clear(STORES.DUAS)
    await this.clear(STORES.DUA_CATEGORIES)
    await this.setMetadata('duas_downloaded', false)
    await this.setMetadata('duas_updated', null)
    await this.setMetadata('duas_download_progress', 0)
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// Singleton instance
let instance: OfflineStorage | null = null

export async function getOfflineStorage(): Promise<OfflineStorage> {
  if (!instance) {
    instance = new OfflineStorage()
    await instance.init()
  }
  return instance
}

export { OfflineStorage }
