'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useLastRead } from '@/hooks/useLastRead'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const MERGE_PROMPT_SHOWN_KEY = 'taslim_merge_prompt_shown'

export function MergeGuestDataDialog() {
  const { data: session, status } = useSession()
  const { hasGuestBookmarks, mergeGuestBookmarks } = useBookmarks()
  const { mergeGuestLastRead: mergeQuranLastRead } = useLastRead('QURAN')
  const { mergeGuestLastRead: mergeDuaLastRead } = useLastRead('DUA')
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [merging, setMerging] = useState(false)

  useEffect(() => {
    // Show dialog when user logs in and has guest data
    if (status === 'authenticated' && session?.user) {
      const promptShown = sessionStorage.getItem(MERGE_PROMPT_SHOWN_KEY)

      if (!promptShown && hasGuestBookmarks) {
        setOpen(true)
      }
    }
  }, [status, session, hasGuestBookmarks])

  const handleMerge = async () => {
    setMerging(true)

    try {
      // Merge bookmarks
      const bookmarkCount = await mergeGuestBookmarks()

      // Merge last read
      const quranMerged = await mergeQuranLastRead()
      const duaMerged = await mergeDuaLastRead()

      // Mark as shown
      sessionStorage.setItem(MERGE_PROMPT_SHOWN_KEY, 'true')

      setOpen(false)

      let message = ''
      if (bookmarkCount > 0) {
        message += `${bookmarkCount} bookmark${bookmarkCount > 1 ? 's' : ''} merged. `
      }
      if (quranMerged) {
        message += 'Quran progress merged. '
      }
      if (duaMerged) {
        message += 'Dua progress merged. '
      }

      if (message) {
        toast({
          title: 'Data merged successfully',
          description: message.trim(),
        })
      } else {
        toast({
          title: 'No data to merge',
          description: 'All data is already synced',
        })
      }
    } catch (error) {
      console.error('Error merging guest data:', error)
      toast({
        title: 'Merge failed',
        description: 'Failed to merge some data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setMerging(false)
    }
  }

  const handleSkip = () => {
    // Clear guest data and mark as shown
    localStorage.removeItem('taslim_guest_bookmarks')
    localStorage.removeItem('taslim_guest_last_read')
    sessionStorage.setItem(MERGE_PROMPT_SHOWN_KEY, 'true')
    setOpen(false)

    toast({
      title: 'Guest data discarded',
      description: 'Your guest bookmarks and progress have been cleared',
    })
  }

  const handleCancel = () => {
    // Just close, keep guest data and mark as shown
    sessionStorage.setItem(MERGE_PROMPT_SHOWN_KEY, 'true')
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Merge Guest Data?</AlertDialogTitle>
          <AlertDialogDescription>
            You have bookmarks and reading progress saved from guest mode.
            Would you like to merge them with your account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleSkip} disabled={merging}>
            Discard Guest Data
          </AlertDialogCancel>
          <AlertDialogCancel onClick={handleCancel} disabled={merging}>
            Keep Separate
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleMerge} disabled={merging}>
            {merging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Merging...
              </>
            ) : (
              'Merge Data'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
