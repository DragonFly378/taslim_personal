'use client'

import { useState } from 'react'
import { BookmarkButton } from './BookmarkButton'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface AyahItemProps {
  ayah: {
    id: number
    numberInSurah: number
    arabicText: string
    transliteration?: string
    translations: Record<string, string>
  }
  showTranslations: {
    id: boolean
    en: boolean
  }
  showTransliteration?: boolean
  isBookmarked?: boolean
}

export function AyahItem({
  ayah,
  showTranslations,
  showTransliteration = false,
  isBookmarked: initialBookmarked = false
}: AyahItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [showTranslation, setShowTranslation] = useState(false)

  return (
    <div className="p-6 sm:p-8">
      {/* Header with Number and Bookmark */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-2xl text-white font-bold text-lg sm:text-xl shadow-lg">
            {ayah.numberInSurah}
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Ayah {ayah.numberInSurah}
            </span>
          </div>
        </div>
        <BookmarkButton
          type="AYAH"
          refId={ayah.id}
          isBookmarked={isBookmarked}
          onToggle={setIsBookmarked}
        />
      </div>

      {/* Arabic Text */}
      <div className="mb-8 p-6 sm:p-8 md:p-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border-2 border-primary/10 shadow-sm">
        <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.5] md:leading-[3] lg:leading-[3.2] text-right text-secondary-900 dark:text-primary-100" dir="rtl" lang="ar">
          {ayah.arabicText}
        </p>
      </div>

      {/* Toggle Translation Button */}
      <div className="flex justify-center mb-6">
        <Button
          variant={showTranslation ? "default" : "outline"}
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
          className={`min-w-[160px] sm:min-w-[200px] md:h-11 ${
            showTranslation
              ? "bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
              : "border-2 hover:bg-primary/5"
          }`}
        >
          {showTranslation ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Hide Translation</span>
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Show Translation</span>
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
