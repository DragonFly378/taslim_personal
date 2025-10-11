'use client'

import { Heart, Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const handleToggle = async () => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      toast({
        title: '🔒 Sign in required',
        description: 'Please sign in to save bookmarks',
        action: {
          label: 'Sign In',
          onClick: () => router.push('/auth/signin?callbackUrl=' + encodeURIComponent(metadata?.url || ''))
        }
      })
      return
    }

    try {
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
          body: JSON.stringify({
            type,
            refId,
            summary: metadata ? JSON.stringify(metadata) : null,
            url: metadata?.url || null
          })
        })
        if (!response.ok) throw new Error('Failed to add bookmark')
      }

      onToggle(!isBookmarked)

      toast({
        title: isBookmarked ? 'Bookmark removed' : '✅ Bookmark added',
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

  // Guest user - show disabled button with tooltip
  if (status === 'unauthenticated') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="hover:bg-muted/50 relative"
              aria-label="Sign in to bookmark"
            >
              <Heart className="h-5 w-5 text-gray-400" />
              <Lock className="h-3 w-3 absolute top-1 right-1 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Sign in to save bookmarks</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
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
