'use client'

import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { addGuestBookmark, removeGuestBookmark } from '@/lib/guest'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface BookmarkButtonProps {
  type: 'AYAH' | 'DUA'
  refId: number
  isBookmarked: boolean
  onToggle: (bookmarked: boolean) => void
}

export function BookmarkButton({ type, refId, isBookmarked, onToggle }: BookmarkButtonProps) {
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleToggle = async () => {
    try {
      if (session?.user) {
        // Authenticated user - call API
        if (isBookmarked) {
          const response = await fetch(`/api/bookmarks/${refId}`, {
            method: 'DELETE'
          })
          if (!response.ok) throw new Error('Failed to remove bookmark')
        } else {
          const response = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, refId })
          })
          if (!response.ok) throw new Error('Failed to add bookmark')
        }
      } else {
        // Guest mode - use localStorage
        if (isBookmarked) {
          removeGuestBookmark(type, refId)
        } else {
          addGuestBookmark({ type, refId })
        }
      }

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
          isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'
        }`}
      />
    </Button>
  )
}
