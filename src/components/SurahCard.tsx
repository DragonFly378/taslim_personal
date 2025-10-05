'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SurahCardProps {
  surah: {
    id: number
    surahNumber: number
    latinName: string
    arabicName: string
    ayahCount: number
    revelationPlace: string
    meaning?: string
  }
  lastReadAyah?: number
  onResume?: () => void
}

export function SurahCard({ surah, lastReadAyah, onResume }: SurahCardProps) {
  return (
    <Card className="group card-glow border-2 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <Link href={`/quran/${surah.id}`} className="block">
          <div className="flex justify-between items-start gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl text-white font-bold text-base sm:text-lg shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {surah.surahNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                    {surah.latinName}
                  </h3>
                  {surah.meaning && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {surah.meaning}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${surah.revelationPlace === 'Makkah' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="truncate">{surah.revelationPlace}</span>
                  </span>
                  <span>•</span>
                  <span>{surah.ayahCount} ayahs</span>
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <h3 className="font-arabic text-2xl sm:text-3xl text-secondary-800 dark:text-primary-300 group-hover:text-primary transition-colors" dir="rtl" lang="ar">
                {surah.arabicName}
              </h3>
            </div>
          </div>
        </Link>
        {lastReadAyah && onResume && (
          <div className="mt-4 pt-4 border-t border-primary/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResume}
              className="w-full text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Continue from ayah {lastReadAyah}</span>
                <span>→</span>
              </span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
