import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatArabic(text: string): string {
  return text.trim()
}

export function getGuestId(): string {
  if (typeof window === 'undefined') return ''

  let guestId = localStorage.getItem('guest_id')
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('guest_id', guestId)
  }
  return guestId
}
