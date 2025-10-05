'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
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
}

export function LastReadBanner() {
  const { data: session } = useSession()
  const [lastRead, setLastRead] = useState<LastReadData | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    async function fetchLastRead() {
      if (session?.user) {
        // Fetch from API
        const response = await fetch('/api/last-read?type=QURAN')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setLastRead(data)
          }
        }
      } else {
        // Get from localStorage
        const guestData = getGuestLastRead('QURAN')
        if (guestData) {
          setLastRead(guestData)
        }
      }
    }

    fetchLastRead()
  }, [session])

  if (!isVisible || !lastRead) return null

  const resumeUrl =
    lastRead.type === 'QURAN' && lastRead.surahId
      ? `/quran/${lastRead.surahId}#ayah-${lastRead.ayahNumber || 1}`
      : lastRead.type === 'DUA' && lastRead.duaId
      ? `/duas#dua-${lastRead.duaId}`
      : null

  if (!resumeUrl) return null

  return (
    <Card className="mb-6 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Continue Reading</p>
              <p className="text-xs text-muted-foreground">
                {lastRead.type === 'QURAN'
                  ? `${lastRead.surahName || 'Surah'} - Ayah ${lastRead.ayahNumber}`
                  : 'Last Dua'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href={resumeUrl}>Resume</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
