'use client'

import { useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export type ShareType = 'ayah' | 'dua' | 'surah'

interface ShareAyahParams {
  type: 'ayah'
  surahId: number
  surahName: string
  ayahNumber: number
  arabicText?: string
  translation?: string
}

interface ShareDuaParams {
  type: 'dua'
  duaId: number
  duaTitle: string
  arabicText?: string
  meaning?: string
}

interface ShareSurahParams {
  type: 'surah'
  surahId: number
  surahName: string
}

type ShareParams = ShareAyahParams | ShareDuaParams | ShareSurahParams

export function useSharing() {
  const { toast } = useToast()

  const generateShareUrl = useCallback((params: ShareParams): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

    if (params.type === 'ayah') {
      return `${baseUrl}/quran/${params.surahId}?ayah=${params.ayahNumber}`
    } else if (params.type === 'dua') {
      return `${baseUrl}/duas/${params.duaId}`
    } else if (params.type === 'surah') {
      return `${baseUrl}/quran/${params.surahId}`
    }

    return baseUrl
  }, [])

  const generateShareText = useCallback((params: ShareParams): string => {
    if (params.type === 'ayah') {
      let text = `${params.surahName} - Ayah ${params.ayahNumber}\n\n`
      if (params.arabicText) {
        text += `${params.arabicText}\n\n`
      }
      if (params.translation) {
        text += `${params.translation}\n\n`
      }
      text += `Read more on Taslim`
      return text
    } else if (params.type === 'dua') {
      let text = `${params.duaTitle}\n\n`
      if (params.arabicText) {
        text += `${params.arabicText}\n\n`
      }
      if (params.meaning) {
        text += `${params.meaning}\n\n`
      }
      text += `Read more on Taslim`
      return text
    } else if (params.type === 'surah') {
      return `${params.surahName}\n\nRead on Taslim`
    }

    return 'Check out Taslim - Quran & Daily Duas'
  }, [])

  const copyToClipboard = useCallback(async (params: ShareParams) => {
    const url = generateShareUrl(params)
    const text = generateShareText(params)
    const fullText = `${text}\n${url}`

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText)
        toast({
          title: 'Copied to clipboard',
          description: 'Share link copied successfully',
        })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = fullText
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        toast({
          title: 'Copied to clipboard',
          description: 'Share link copied successfully',
        })
      }
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      })
    }
  }, [generateShareUrl, generateShareText, toast])

  const share = useCallback(async (params: ShareParams) => {
    const url = generateShareUrl(params)
    const text = generateShareText(params)

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: params.type === 'ayah' ? `${params.surahName} - Ayah ${params.ayahNumber}` :
                 params.type === 'dua' ? params.duaTitle :
                 params.surahName,
          text: text,
          url: url,
        })

        toast({
          title: 'Shared successfully',
          description: 'Content shared',
        })
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
          // Fallback to copy
          await copyToClipboard(params)
        }
      }
    } else {
      // Fallback to copy to clipboard
      await copyToClipboard(params)
    }
  }, [generateShareUrl, generateShareText, copyToClipboard, toast])

  const shareViaWhatsApp = useCallback((params: ShareParams) => {
    const url = generateShareUrl(params)
    const text = generateShareText(params)
    const fullText = encodeURIComponent(`${text}\n${url}`)
    const whatsappUrl = `https://wa.me/?text=${fullText}`

    window.open(whatsappUrl, '_blank')
  }, [generateShareUrl, generateShareText])

  const shareViaTwitter = useCallback((params: ShareParams) => {
    const url = generateShareUrl(params)
    const text = generateShareText(params)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

    window.open(twitterUrl, '_blank')
  }, [generateShareUrl, generateShareText])

  const shareViaFacebook = useCallback((params: ShareParams) => {
    const url = generateShareUrl(params)
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

    window.open(facebookUrl, '_blank')
  }, [generateShareUrl])

  const shareViaTelegram = useCallback((params: ShareParams) => {
    const url = generateShareUrl(params)
    const text = generateShareText(params)
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`

    window.open(telegramUrl, '_blank')
  }, [generateShareUrl, generateShareText])

  return {
    share,
    copyToClipboard,
    shareViaWhatsApp,
    shareViaTwitter,
    shareViaFacebook,
    shareViaTelegram,
    generateShareUrl,
    generateShareText,
  }
}
