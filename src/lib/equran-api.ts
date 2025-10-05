// equran.id API client
const BASE_URL = 'https://equran.id/api/v2'

export interface EquranSurah {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: 'Mekah' | 'Madinah'
  arti: string
  deskripsi: string
  audioFull: Record<string, string>
}

export interface EquranAyah {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio: Record<string, string>
}

export interface EquranSurahDetail extends EquranSurah {
  ayat: EquranAyah[]
  suratSelanjutnya?: {
    nomor: number
    nama: string
    namaLatin: string
    jumlahAyat: number
  }
  suratSebelumnya?: {
    nomor: number
    nama: string
    namaLatin: string
    jumlahAyat: number
  }
}

export interface EquranApiResponse<T> {
  code: number
  message: string
  data: T
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now()
  const cached = cache.get(url)

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const response = await fetch(url, {
    next: { revalidate: 86400 } // 24 hours
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data: EquranApiResponse<T> = await response.json()

  if (data.code !== 200) {
    throw new Error(data.message || 'API request failed')
  }

  cache.set(url, { data: data.data, timestamp: now })
  return data.data
}

/**
 * Get list of all surahs
 */
export async function getAllSurahs(): Promise<EquranSurah[]> {
  return fetchWithCache<EquranSurah[]>(`${BASE_URL}/surat`)
}

/**
 * Get a specific surah by number (1-114)
 */
export async function getSurahByNumber(surahNumber: number): Promise<EquranSurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error('Surah number must be between 1 and 114')
  }
  return fetchWithCache<EquranSurahDetail>(`${BASE_URL}/surat/${surahNumber}`)
}

/**
 * Get a specific ayah from a surah
 */
export async function getAyah(surahNumber: number, ayahNumber: number): Promise<EquranAyah> {
  const surah = await getSurahByNumber(surahNumber)
  const ayah = surah.ayat.find(a => a.nomorAyat === ayahNumber)

  if (!ayah) {
    throw new Error(`Ayah ${ayahNumber} not found in Surah ${surahNumber}`)
  }

  return ayah
}

/**
 * Search for surahs by name (Latin or Arabic)
 */
export async function searchSurahs(query: string): Promise<EquranSurah[]> {
  const allSurahs = await getAllSurahs()
  const lowerQuery = query.toLowerCase()

  return allSurahs.filter(surah =>
    surah.namaLatin.toLowerCase().includes(lowerQuery) ||
    surah.nama.includes(query) ||
    surah.arti.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get surahs by revelation place
 */
export async function getSurahsByRevelation(place: 'Mekah' | 'Madinah'): Promise<EquranSurah[]> {
  const allSurahs = await getAllSurahs()
  return allSurahs.filter(surah => surah.tempatTurun === place)
}

/**
 * Get tafsir for a specific surah (if you want to add this later)
 */
export async function getTafsir(surahNumber: number): Promise<any> {
  return fetchWithCache(`${BASE_URL}/tafsir/${surahNumber}`)
}

export interface SearchResult {
  type: 'surah' | 'ayah'
  surahNumber: number
  surahName: string
  surahNameLatin: string
  surahMeaning?: string
  ayahNumber?: number
  arabicText?: string
  latinText?: string
  translation?: string
  matchedIn: 'name' | 'meaning' | 'arabic' | 'latin' | 'translation'
}

/**
 * Search across all Quran content (surahs and ayahs) - Optimized for speed
 */
export async function searchQuran(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 1) {
    return []
  }

  const allSurahs = await getAllSurahs()
  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase().trim()

  // Check if query is a number (surah number search)
  const queryAsNumber = parseInt(query)
  if (!isNaN(queryAsNumber) && queryAsNumber >= 1 && queryAsNumber <= 114) {
    const surah = allSurahs.find(s => s.nomor === queryAsNumber)
    if (surah) {
      results.push({
        type: 'surah',
        surahNumber: surah.nomor,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        surahMeaning: surah.arti,
        matchedIn: 'name'
      })
      return results // Return immediately for exact number match
    }
  }

  // Search in surah names and meanings for fast results
  for (const surah of allSurahs) {
    let matched = false

    // Search by surah number (if query contains number)
    if (!matched && surah.nomor.toString().includes(query)) {
      results.push({
        type: 'surah',
        surahNumber: surah.nomor,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        surahMeaning: surah.arti,
        matchedIn: 'name'
      })
      matched = true
    }

    // Search in Latin name
    if (!matched && surah.namaLatin.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'surah',
        surahNumber: surah.nomor,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        surahMeaning: surah.arti,
        matchedIn: 'name'
      })
      matched = true
    }

    // Search in Arabic name (only if not already matched)
    if (!matched && surah.nama.includes(query)) {
      results.push({
        type: 'surah',
        surahNumber: surah.nomor,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        surahMeaning: surah.arti,
        matchedIn: 'name'
      })
      matched = true
    }

    // Search in meaning (only if not already matched)
    if (!matched && surah.arti.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'surah',
        surahNumber: surah.nomor,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        surahMeaning: surah.arti,
        matchedIn: 'meaning'
      })
    }
  }

  // Return only surah results for instant search
  return results
}
