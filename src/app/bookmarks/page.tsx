'use client'

import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { BookOpen, BookMarked, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function BookmarksPage() {
  const { status } = useSession()
  const { bookmarks, loading } = useBookmarks()
  const { t } = useLanguage()

  const ayahBookmarks = bookmarks.filter(b => b.type === 'AYAH')
  const duaBookmarks = bookmarks.filter(b => b.type === 'DUA')

  if (loading) {
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
        {status === 'unauthenticated' && bookmarks.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <LogIn className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                    {t.common.guestMode || 'Guest Mode'}
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                    Your bookmarks are stored locally. Sign in to sync them across devices and keep them safe.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => signIn()}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Bookmarks Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start reading and bookmark your favorite ayahs and duas!
            </p>
            {status === 'unauthenticated' && (
              <Button onClick={() => signIn()} variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
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
                  <p className="text-muted-foreground">No ayah bookmarks yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ayahBookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Ayah ID: {bookmark.refId}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="duas" className="mt-6">
            {duaBookmarks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No dua bookmarks yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {duaBookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        Dua ID: {bookmark.refId}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
