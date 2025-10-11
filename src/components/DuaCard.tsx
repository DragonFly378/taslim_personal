'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BookmarkButton } from './BookmarkButton'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

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
  const [showMeaning, setShowMeaning] = useState(false)

  return (
    <Card
      id={`dua-${dua.id}`}
      className="card-glow border-2 overflow-hidden hover:shadow-xl transition-shadow duration-300 scroll-mt-24"
    >
      <CardContent className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
              {dua.nama}
            </h3>
          </div>
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

        {/* Arabic Text */}
        <div className="mb-6 p-6 sm:p-8 md:p-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border-2 border-primary/10 shadow-sm">
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.5] md:leading-[3] lg:leading-[3.2] text-right text-secondary-900 dark:text-primary-100" dir="rtl" lang="ar">
            {dua.ar}
          </p>
        </div>

        {/* Toggle Meaning Button */}
        <div className="flex justify-center mb-6">
          <Button
            variant={showMeaning ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMeaning(!showMeaning)}
            className={`min-w-[160px] sm:min-w-[200px] md:h-11 ${
              showMeaning
                ? "bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                : "border-2 hover:bg-primary/5"
            }`}
          >
            {showMeaning ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">{t.duas.hideMeaning}</span>
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">{t.duas.showMeaning}</span>
              </>
            )}
          </Button>
        </div>

        {/* Meaning Content */}
        {showMeaning && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Transliteration */}
            {dua.tr && (
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
            )}

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
      </CardContent>
    </Card>
  )
}
