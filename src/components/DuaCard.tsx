'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BookmarkButton } from './BookmarkButton'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Info, Share2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import html2canvas from 'html2canvas'

interface DuaCardProps {
  dua: {
    id: number
    nama: string
    ar: string
    tr: string
    idn: string
    tentang: string
  }
  categorySlug?: string
  isBookmarked?: boolean
}

export function DuaCard({ dua, categorySlug, isBookmarked: initialBookmarked = false }: DuaCardProps) {
  const { t } = useLanguage()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [showMeaning, setShowMeaning] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

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
      const file = new File([blob], `dua-${dua.nama.replace(/\s+/g, '-')}-story.png`, { type: 'image/png' })

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: dua.nama,
          text: dua.nama,
          files: [file]
        })
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `dua-${dua.nama.replace(/\s+/g, '-')}-story.png`
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
    <Card
      id={`dua-${dua.id}`}
      ref={cardRef}
      className="card-glow dua-card border-2 overflow-hidden hover:shadow-xl transition-shadow duration-300 scroll-mt-24"
    >
      <CardContent className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
              {dua.nama}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Share button - temporarily hidden */}
            {false && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                className="text-xs border hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 active:scale-95 h-8 w-8 p-0"
              >
                {isSharing ? (
                  <Share2 className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <Share2 className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            <BookmarkButton
              type="DUA"
              refId={dua.id}
              isBookmarked={isBookmarked}
              onToggle={setIsBookmarked}
              metadata={{
                duaName: dua.nama,
                duaArabic: dua.ar.substring(0, 100) + '...',
                url: categorySlug ? `/duas/${categorySlug}#dua-${dua.id}` : `/duas#dua-${dua.id}`
              }}
            />
          </div>
        </div>

        {/* Arabic Text */}
        <div className="mb-6 p-6 sm:p-8 md:p-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border-2 border-primary/10 shadow-sm">
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.5] md:leading-[3] lg:leading-[3.2] text-right text-secondary-900 dark:text-primary-100" dir="rtl" lang="ar">
            {dua.ar}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-end gap-2 mb-2">
          {/* Transliteration Button */}
          {dua.tr && (
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

          {/* Meaning/Translation Button */}
          <Button
            variant={showMeaning ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMeaning(!showMeaning)}
            className={`h-7 px-2.5 text-xs transition-all duration-300 active:scale-95 ${
              showMeaning
                ? "bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg shadow-md shadow-primary/30"
                : "border hover:bg-primary/5 hover:border-primary/30"
            }`}
          >
            {showMeaning ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                <span>{t.duas.hideMeaning}</span>
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                <span>{t.duas.showMeaning}</span>
              </>
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Transliteration */}
          {showTransliteration && dua.tr && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-xl border-l-4 border-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
                    {t.duas.transliteration}
                  </span>
                </div>
                <p className="text-base sm:text-lg italic text-foreground leading-relaxed">
                  {dua.tr}
                </p>
              </div>
            </div>
          )}

          {/* Meaning Content */}
          {showMeaning && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Meaning */}
              <div className="p-5 sm:p-6 bg-muted/50 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {t.duas.meaning}
                  </span>
                </div>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">
                  {dua.idn}
                </p>
              </div>

              {/* Reference */}
              {dua.tentang && (
                <div className="flex items-start gap-2 p-4 bg-muted/30 rounded-lg">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {t.duas.reference}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {dua.tentang}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
