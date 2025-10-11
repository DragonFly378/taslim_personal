'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface BookmarkCardProps {
  bookmark: {
    id: number
    type: 'AYAH' | 'DUA'
    refId: number
    summary?: string | null
    url?: string | null
    createdAt: string
  }
  onRemove?: (id: number) => void
}

export function BookmarkCard({ bookmark, onRemove }: BookmarkCardProps) {
  const { toast } = useToast()
  const [isRemoving, setIsRemoving] = useState(false)

  let metadata: any = null
  try {
    metadata = bookmark.summary ? JSON.parse(bookmark.summary) : null
  } catch (e) {
    console.error('Failed to parse bookmark metadata:', e)
  }

  const handleRemove = async () => {
    if (!onRemove) return

    setIsRemoving(true)
    try {
      await onRemove(bookmark.id)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove bookmark',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (bookmark.type === 'AYAH' && metadata) {
    return (
      <Link href={bookmark.url || '#'} className="block">
        <Card className="card-glow border-2 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg text-white font-bold text-sm shadow-md">
                  {metadata.surahNumber}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {metadata.surahName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ayah {metadata.ayahNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove()
                }}
                disabled={isRemoving}
                className="hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                {isRemoving ? (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500 animate-pulse" />
                ) : (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500 hover:scale-110 transition-transform" />
                )}
              </Button>
            </div>
          </div>

          {/* Arabic Text Preview */}
          {metadata.arabicText && (
            <div className="mb-4 p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-xl border border-primary/10">
              <p className="font-arabic text-xl sm:text-2xl leading-relaxed text-right text-secondary-900 dark:text-primary-100" dir="rtl" lang="ar">
                {metadata.arabicText}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary/50" />
              Quran
            </span>
            <span>Saved {formatDate(bookmark.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
      </Link>
    )
  }

  if (bookmark.type === 'DUA' && metadata) {
    return (
      <Link href={bookmark.url || '#'} className="block">
        <Card className="card-glow border-2 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {metadata.duaName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemove()
                }}
                disabled={isRemoving}
                className="hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                {isRemoving ? (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500 animate-pulse" />
                ) : (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500 hover:scale-110 transition-transform" />
                )}
              </Button>
            </div>
          </div>

          {/* Arabic Text Preview */}
          {metadata.duaArabic && (
            <div className="mb-4 p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-xl border border-primary/10">
              <p className="font-arabic text-xl sm:text-2xl leading-relaxed text-right text-secondary-900 dark:text-primary-100" dir="rtl" lang="ar">
                {metadata.duaArabic}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary/50" />
              Dua
            </span>
            <span>Saved {formatDate(bookmark.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
      </Link>
    )
  }

  // Fallback for bookmarks without metadata (legacy bookmarks)
  const legacyUrl = bookmark.url || '#'
  return (
    <Link href={legacyUrl} className="block">
    <Card className="card-glow border-2 overflow-hidden cursor-pointer">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 rounded-lg text-muted-foreground font-bold text-sm">
                {bookmark.type === 'AYAH' ? 'Q' : 'D'}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {bookmark.type === 'AYAH' ? 'Quran Ayah' : 'Dua'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reference ID: {bookmark.refId}
                </p>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground italic">
                Legacy bookmark - metadata not available
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Re-bookmark this item to see full content preview
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleRemove()
              }}
              disabled={isRemoving}
              className="hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              {isRemoving ? (
                <Heart className="h-5 w-5 fill-red-500 text-red-500 animate-pulse" />
              ) : (
                <Heart className="h-5 w-5 fill-red-500 text-red-500 hover:scale-110 transition-transform" />
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 mt-4 border-t">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            {bookmark.type === 'AYAH' ? 'Quran' : 'Dua'}
          </span>
          <span>Saved {formatDate(bookmark.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
