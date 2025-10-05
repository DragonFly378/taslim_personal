import { Surah, Ayah, Translation, AyahTranslation, Dua, DuaCategory, User, Bookmark, LastRead } from '@prisma/client'

// Extended types with relations
export type SurahWithAyahs = Surah & {
  ayahs: (Ayah & {
    translations: (AyahTranslation & {
      translation: Translation
    })[]
  })[]
}

export type AyahWithTranslations = Ayah & {
  surah: Surah
  translations: (AyahTranslation & {
    translation: Translation
  })[]
}

export type DuaWithCategory = Dua & {
  category: DuaCategory
}

export type BookmarkWithRefs = Bookmark & {
  ayah?: AyahWithTranslations
  dua?: DuaWithCategory
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Quran API types
export interface SurahListItem {
  id: number
  surahNumber: number
  latinName: string
  arabicName: string
  translationId?: string
  translationEn?: string
  revelationPlace: string
  ayahCount: number
}

export interface AyahResponse {
  id: number
  surahId: number
  numberInSurah: number
  arabicText: string
  juz?: number
  page?: number
  translations: {
    [key: string]: string // translationId: text
  }
}

// Dua API types
export interface DuaCategoryResponse {
  id: number
  nameEn: string
  nameId: string
  slug: string
  order: number
  duaCount?: number
}

export interface DuaResponse {
  id: number
  categoryId: number
  titleEn: string
  titleId: string
  arabicText: string
  transliteration?: string
  meaningEn: string
  meaningId: string
  reference?: string
  order: number
}

// Bookmark & Last Read types
export type BookmarkType = 'AYAH' | 'DUA'
export type LastReadType = 'QURAN' | 'DUA'

export interface CreateBookmarkRequest {
  type: BookmarkType
  refId: number
}

export interface CreateLastReadRequest {
  type: LastReadType
  surahId?: number
  ayahNumber?: number
  duaId?: number
}

export interface MergeGuestDataRequest {
  bookmarks: {
    type: BookmarkType
    refId: number
  }[]
  lastReads: {
    type: LastReadType
    surahId?: number
    ayahNumber?: number
    duaId?: number
  }[]
}

// UI Component types
export interface TranslationPreference {
  id: boolean
  en: boolean
}
