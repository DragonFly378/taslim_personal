'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getGuestLastRead } from '@/lib/guest'

interface LastReadData {
  type: 'QURAN' | 'DUA'
  surahId?: number
  ayahNumber?: number
  duaId?: number
  surahName?: string
  arabicText?: string
  url?: string
}

export function LastReadBanner() {
  const [lastRead, setLastRead] = useState<LastReadData | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    async function loadLastRead() {
      // Get from localStorage
      const guestData = getGuestLastRead('QURAN')
      if (guestData) {
        setLastRead(guestData)
      }
    }

    loadLastRead()
  }, [])

  if (!isVisible || !lastRead || lastRead.type !== 'QURAN') return null

  const resumeUrl = lastRead.url || `/quran/${lastRead.surahId}#ayah-${lastRead.ayahNumber || 1}`

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg flex-shrink-0">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">Continue Reading</p>
              <p className="text-sm text-muted-foreground">
                {lastRead.surahName || 'Surah'} - Ayah {lastRead.ayahNumber}
              </p>
              {lastRead.arabicText && (
                <p className="text-xs text-muted-foreground mt-1 font-arabic" dir="rtl">
                  {lastRead.arabicText}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Link href={resumeUrl}>Resume Reading →</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
