'use client'

import { useState } from 'react'
import { BookmarkButton } from './BookmarkButton'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, BookOpenCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { updateGuestLastRead } from '@/lib/guest'

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
  showTransliteration?: boolean
  isBookmarked?: boolean
  isLastRead?: boolean
}

export function AyahItem({
  ayah,
  surahId,
  surahName,
  showTranslations,
  showTransliteration = false,
  isBookmarked: initialBookmarked = false,
  isLastRead = false
}: AyahItemProps) {
  const { data: session } = useSession()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [showTranslation, setShowTranslation] = useState(false)
  const [isSavingLastRead, setIsSavingLastRead] = useState(false)
  const [lastReadSaved, setLastReadSaved] = useState(isLastRead)

  const handleSaveLastRead = async () => {
    setIsSavingLastRead(true)
    try {
      const url = `/quran/${surahId}#ayah-${ayah.numberInSurah}`

      if (session?.user) {
        // Save to API with metadata
        await fetch('/api/last-read', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'QURAN',
            surahId,
            ayahNumber: ayah.numberInSurah,
            summary: JSON.stringify({
              surahName,
              surahNumber: surahId,
              ayahNumber: ayah.numberInSurah,
              arabicText: ayah.arabicText.substring(0, 100) + '...'
            }),
            url
          })
        })
      } else {
        // Save to localStorage with metadata
        updateGuestLastRead('QURAN', {
          surahId,
          surahName,
          surahNumber: surahId,
          ayahNumber: ayah.numberInSurah,
          arabicText: ayah.arabicText.substring(0, 100) + '...',
          url
        })
      }
      setLastReadSaved(true)
    } catch (error) {
      console.error('Failed to save last read:', error)
    } finally {
      setIsSavingLastRead(false)
    }
  }

  return (
    <div id={`ayah-${ayah.numberInSurah}`} className="p-4 sm:p-6 md:p-8 relative">
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

      {/* Toggle Translation Button */}
      <div className="flex justify-center mb-6">
        <Button
          variant={showTranslation ? "default" : "outline"}
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
          className={`min-w-[160px] sm:min-w-[200px] md:min-w-[240px] h-10 sm:h-11 md:h-12 text-sm sm:text-base transition-all duration-300 active:scale-95 ${
            showTranslation
              ? "bg-gradient-to-r from-primary to-secondary hover:shadow-xl shadow-lg shadow-primary/30"
              : "border-2 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md"
          }`}
        >
          {showTranslation ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>Hide Translation</span>
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>Show Translation</span>
            </>
          )}
        </Button>
      </div>

      {/* Translation Content */}
      {showTranslation && (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Transliteration */}
          {showTransliteration && ayah.transliteration && (
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
          )}

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
  )
}
