'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface BookmarkButtonProps {
  type: 'AYAH' | 'DUA'
  refId: number
  isBookmarked: boolean
  onToggle: (bookmarked: boolean) => void
  metadata?: {
    // For Ayah
    surahName?: string
    surahNumber?: number
    ayahNumber?: number
    arabicText?: string
    // For Dua
    duaName?: string
    duaArabic?: string
    // Common
    url: string
  }
}

export function BookmarkButton({ type, refId, isBookmarked, onToggle, metadata }: BookmarkButtonProps) {
  const { toast } = useToast()

  const handleToggle = async () => {
    try {
      // Use local storage for bookmarks (no authentication)
      onToggle(!isBookmarked)

      toast({
        title: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
        description: isBookmarked
          ? 'Removed from your bookmarks'
          : 'Added to your bookmarks',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive'
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="hover:bg-transparent"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
        }`}
      />
    </Button>
  )
}
