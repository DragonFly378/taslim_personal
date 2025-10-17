'use client'

import { useState, useRef } from 'react'
import { BookmarkButton } from './BookmarkButton'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, BookOpenCheck, Share2 } from 'lucide-react'
import { updateGuestLastRead } from '@/lib/guest'
import html2canvas from 'html2canvas'

interface AyahItemProps {
  ayah: {
    id: number
    numberInSurah: number
    arabicText: string
    transliteration?: string
    translations: Record<string, string>
  }
  surahId: number
  surahName: string
  showTranslations: {
    id: boolean
    en: boolean
  }
  isBookmarked?: boolean
  isLastRead?: boolean
}

export function AyahItem({
  ayah,
  surahId,
  surahName,
  showTranslations,
  isBookmarked: initialBookmarked = false,
  isLastRead = false
}: AyahItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [isSavingLastRead, setIsSavingLastRead] = useState(false)
  const [lastReadSaved, setLastReadSaved] = useState(isLastRead)
  const [isSharing, setIsSharing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleSaveLastRead = async () => {
    setIsSavingLastRead(true)
    try {
      const url = `/quran/${surahId}#ayah-${ayah.numberInSurah}`

      // Save to localStorage with metadata
      updateGuestLastRead('QURAN', {
        surahId,
        surahName,
        surahNumber: surahId,
        ayahNumber: ayah.numberInSurah,
        arabicText: ayah.arabicText.substring(0, 100) + '...',
        url
      })
      setLastReadSaved(true)
    } catch (error) {
      console.error('Failed to save last read:', error)
    } finally {
      setIsSavingLastRead(false)
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) return

    setIsSharing(true)
    try {
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300))

      // Create Instagram story canvas (1080 x 1920)
      const storyCanvas = document.createElement('canvas')
      storyCanvas.width = 1080
      storyCanvas.height = 1920
      const ctx = storyCanvas.getContext('2d')!

      // Fill background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920)
      gradient.addColorStop(0, '#f0f9ff')
      gradient.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1080, 1920)

      // Capture navbar (header)
      const navbar = document.querySelector('nav') || document.querySelector('header')
      let navbarHeight = 0
      if (navbar) {
        try {
          const navbarCanvas = await html2canvas(navbar as HTMLElement, {
            backgroundColor: 'transparent',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: false
          })
          if (navbarCanvas.width > 0 && navbarCanvas.height > 0) {
            navbarHeight = Math.min(200, navbarCanvas.height)
            ctx.drawImage(navbarCanvas, 0, 0, 1080, navbarHeight)
          }
        } catch (error) {
          console.warn('Failed to capture navbar:', error)
        }
      }

      // Capture bottom bar (footer)
      const bottomBar = document.querySelector('footer') || document.querySelector('[role="navigation"]:last-of-type')
      let bottomBarHeight = 0
      if (bottomBar) {
        try {
          const bottomBarCanvas = await html2canvas(bottomBar as HTMLElement, {
            backgroundColor: 'transparent',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: false
          })
          if (bottomBarCanvas.width > 0 && bottomBarCanvas.height > 0) {
            bottomBarHeight = Math.min(150, bottomBarCanvas.height)
            ctx.drawImage(bottomBarCanvas, 0, 1920 - bottomBarHeight, 1080, bottomBarHeight)
          }
        } catch (error) {
          console.warn('Failed to capture bottom bar:', error)
        }
      }

      // Capture the card content
      const cardCanvas = await html2canvas(cardRef.current, {
        backgroundColor: 'transparent',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false
      })

      // Calculate card positioning (centered in middle section)
      const maxCardHeight = 1920 - navbarHeight - bottomBarHeight - 100 // 100px padding
      const cardWidth = Math.min(cardCanvas.width, 980)
      const cardHeight = (cardCanvas.height * cardWidth) / cardCanvas.width
      const finalCardHeight = Math.min(cardHeight, maxCardHeight)
      const finalCardWidth = (cardWidth * finalCardHeight) / cardHeight
      const cardX = (1080 - finalCardWidth) / 2
      const cardY = navbarHeight + (1920 - navbarHeight - bottomBarHeight - finalCardHeight) / 2

      // Draw card
      ctx.drawImage(cardCanvas, cardX, cardY, finalCardWidth, finalCardHeight)

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        storyCanvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
      })

      // Create file from blob
      const file = new File([blob], `ayah-${surahName}-${ayah.numberInSurah}-story.png`, { type: 'image/png' })

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${surahName} - Ayah ${ayah.numberInSurah}`,
          text: `${surahName} - Ayah ${ayah.numberInSurah}`,
          files: [file]
        })
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `ayah-${surahName}-${ayah.numberInSurah}-story.png`
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to share:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div id={`ayah-${ayah.numberInSurah}`} className="relative">
      <div ref={cardRef} className="ayah-card p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
      {/* Last Read Indicator */}
      {lastReadSaved && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full text-xs font-semibold shadow-sm border border-primary/20 backdrop-blur-sm z-10">
          <BookOpenCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="hidden sm:inline">Last Read</span>
          <span className="sm:hidden">📖</span>
        </div>
      )}

      {/* Header with Number and Actions */}
      <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-2xl text-white font-bold text-base sm:text-lg md:text-xl shadow-lg shadow-primary/20 ring-2 ring-primary/10">
            {ayah.numberInSurah}
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              Ayah {ayah.numberInSurah}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
              {surahName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant={lastReadSaved ? "default" : "outline"}
            size="sm"
            onClick={handleSaveLastRead}
            disabled={isSavingLastRead}
            className={`text-xs sm:text-sm transition-all duration-300 active:scale-95 ${
              lastReadSaved
                ? "bg-gradient-to-r from-primary to-secondary hover:shadow-lg shadow-primary/30"
                : "border-2 hover:bg-primary/5 hover:border-primary/30"
            }`}
          >
            {isSavingLastRead ? (
              <>
                <BookOpenCheck className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : lastReadSaved ? (
              <>
                <BookOpenCheck className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Saved</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <BookOpenCheck className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">Mark as Last Read</span>
                <span className="md:hidden">Mark</span>
              </>
            )}
          </Button>
          {/* Share button - temporarily hidden */}
          {false && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="text-xs sm:text-sm border-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 active:scale-95"
            >
              {isSharing ? (
                <>
                  <Share2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
                  <span className="hidden sm:inline">Sharing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Share2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Share</span>
                  <span className="sm:hidden">📤</span>
                </>
              )}
            </Button>
          )}
          {/* Bookmark button hidden - requires backend auth */}
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-6 sm:mb-8 p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-3xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50"></div>
        <p className="font-arabic text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[2.2] sm:leading-[2.5] md:leading-[3] lg:leading-[3.5] text-right text-primary dark:text-primary-100 relative z-10 drop-shadow-sm" dir="rtl" lang="ar">
          {ayah.arabicText}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-end gap-2 mb-2">
        {/* Transliteration Button */}
        {ayah.transliteration && (
          <Button
            variant={showTransliteration ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`h-7 px-2.5 text-xs transition-all duration-300 active:scale-95 ${
              showTransliteration
                ? "bg-gradient-to-r from-secondary to-secondary/80 hover:shadow-lg shadow-md shadow-secondary/30"
                : "border hover:bg-secondary/5 hover:border-secondary/30"
            }`}
          >
            {showTransliteration ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                <span>Hide Transliteration</span>
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                <span>Transliteration</span>
              </>
            )}
          </Button>
        )}

        {/* Translation Button */}
        <Button
          variant={showTranslation ? "default" : "outline"}
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
          className={`h-7 px-2.5 text-xs transition-all duration-300 active:scale-95 ${
            showTranslation
              ? "bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg shadow-md shadow-primary/30"
              : "border hover:bg-primary/5 hover:border-primary/30"
          }`}
        >
          {showTranslation ? (
            <>
              <ChevronUp className="mr-1 h-3 w-3" />
              <span>Hide Translation</span>
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-3 w-3" />
              <span>Translation</span>
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {/* Transliteration */}
        {showTransliteration && ayah.transliteration && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-xl border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
                  Transliteration
                </span>
              </div>
              <p className="text-base sm:text-lg italic text-foreground leading-relaxed">
                {ayah.transliteration}
              </p>
            </div>
          </div>
        )}

        {/* Translation Content */}
        {showTranslation && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Indonesian Translation */}
            {showTranslations.id && ayah.translations['id-kemenag'] && (
              <div className="p-5 sm:p-6 bg-muted/50 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    🇮🇩 Indonesian Translation
                  </span>
                </div>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">
                  {ayah.translations['id-kemenag']}
                </p>
              </div>
            )}

            {/* English Translation */}
            {showTranslations.en && ayah.translations['en-sahih'] && (
              <div className="p-5 sm:p-6 bg-muted/30 rounded-xl border border-muted">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    🇬🇧 English Translation
                  </span>
                </div>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {ayah.translations['en-sahih']}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
