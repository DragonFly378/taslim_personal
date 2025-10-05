// Guest mode utilities for localStorage management

export interface GuestBookmark {
  type: 'AYAH' | 'DUA'
  refId: number
  createdAt: string
}

export interface GuestLastRead {
  type: 'QURAN' | 'DUA'
  surahId?: number
  ayahNumber?: number
  duaId?: number
  updatedAt: string
}

const GUEST_BOOKMARKS_KEY = 'taslim_guest_bookmarks'
const GUEST_LAST_READ_KEY = 'taslim_guest_last_read'

// Bookmarks
export function getGuestBookmarks(): GuestBookmark[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(GUEST_BOOKMARKS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addGuestBookmark(bookmark: Omit<GuestBookmark, 'createdAt'>): void {
  const bookmarks = getGuestBookmarks()
  const exists = bookmarks.find((b) => b.type === bookmark.type && b.refId === bookmark.refId)

  if (!exists) {
    bookmarks.push({ ...bookmark, createdAt: new Date().toISOString() })
    localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }
}

export function removeGuestBookmark(type: 'AYAH' | 'DUA', refId: number): void {
  const bookmarks = getGuestBookmarks()
  const filtered = bookmarks.filter((b) => !(b.type === type && b.refId === refId))
  localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(filtered))
}

export function clearGuestBookmarks(): void {
  localStorage.removeItem(GUEST_BOOKMARKS_KEY)
}

// Last Read
export function getGuestLastRead(type: 'QURAN' | 'DUA'): GuestLastRead | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(`${GUEST_LAST_READ_KEY}_${type}`)
  return stored ? JSON.parse(stored) : null
}

export function setGuestLastRead(lastRead: Omit<GuestLastRead, 'updatedAt'>): void {
  const data = { ...lastRead, updatedAt: new Date().toISOString() }
  localStorage.setItem(`${GUEST_LAST_READ_KEY}_${lastRead.type}`, JSON.stringify(data))
}

export function clearGuestLastReads(): void {
  localStorage.removeItem(`${GUEST_LAST_READ_KEY}_QURAN`)
  localStorage.removeItem(`${GUEST_LAST_READ_KEY}_DUA`)
}

export function clearAllGuestData(): void {
  clearGuestBookmarks()
  clearGuestLastReads()
}
