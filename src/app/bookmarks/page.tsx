'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { BookOpen, BookMarked, LogIn, Lock } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { BookmarkCard } from '@/components/BookmarkCard'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function BookmarksPage() {
  const router = useRouter()
  const { status } = useSession()
  const { bookmarks, loading } = useBookmarks()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [localBookmarks, setLocalBookmarks] = useState(bookmarks)

  // Redirect unauthenticated users to sign in page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/bookmarks')
    }
  }, [status, router])

  // Don't render content for unauthenticated users
  if (status === 'unauthenticated') {
    return null
  }

  const ayahBookmarks = localBookmarks.filter(b => b.type === 'AYAH')
  const duaBookmarks = localBookmarks.filter(b => b.type === 'DUA')

  // Update local bookmarks when bookmarks change
  useEffect(() => {
    setLocalBookmarks(bookmarks)
  }, [bookmarks])

  const handleRemoveBookmark = async (bookmarkId: number) => {
    // Optimistically remove from UI
    setLocalBookmarks(prev => prev.filter(b => b.id !== bookmarkId))

    try {
      if (status === 'authenticated') {
        const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Failed to remove bookmark')
      } else {
        // Guest mode - remove from localStorage
        const bookmark = bookmarks.find(b => b.id === bookmarkId)
        if (bookmark) {
          const stored = localStorage.getItem('taslim_guest_bookmarks')
          if (stored) {
            const guestBookmarks = JSON.parse(stored)
            const updated = guestBookmarks.filter(
              (b: any) => !(b.refId === bookmark.refId && b.type === bookmark.type)
            )
            localStorage.setItem('taslim_guest_bookmarks', JSON.stringify(updated))
          }
        }
      }

      toast({
        title: 'Bookmark removed',
        description: 'Successfully removed from your bookmarks'
      })
    } catch (error) {
      // Rollback on error
      setLocalBookmarks(bookmarks)
      throw error
    }
  }

  // Show loading while checking auth
  if (loading || status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
          {t.nav.bookmarks}
        </h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">
          {t.nav.bookmarks}
        </h1>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Bookmarks Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start reading and bookmark your favorite ayahs and duas!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="ayahs">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ayahs">
              <BookOpen className="h-4 w-4 mr-2" />
              Ayahs ({ayahBookmarks.length})
            </TabsTrigger>
            <TabsTrigger value="duas">
              <BookMarked className="h-4 w-4 mr-2" />
              Duas ({duaBookmarks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ayahs" className="mt-6">
            {ayahBookmarks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No ayah bookmarks yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start reading Quran and bookmark your favorite ayahs
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {ayahBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onRemove={handleRemoveBookmark}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="duas" className="mt-6">
            {duaBookmarks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookMarked className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No dua bookmarks yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Explore duas and save your favorites
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {duaBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onRemove={handleRemoveBookmark}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
