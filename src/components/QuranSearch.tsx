'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { searchQuran, SearchResult } from '@/lib/equran-api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function QuranSearch() {
  const router = useRouter()
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length >= 1) {
        setIsSearching(true)
        try {
          const searchResults = await searchQuran(query)
          setResults(searchResults)
          setShowResults(true)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 150) // Reduced debounce from 300ms to 150ms

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'surah') {
      router.push(`/quran/${result.surahNumber}`)
    } else if (result.type === 'ayah') {
      router.push(`/quran/${result.surahNumber}#ayah-${result.ayahNumber}`)
    }
    setQuery('')
    setShowResults(false)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === 'en' ? 'Search by name or number (1-114)...' : 'Cari berdasarkan nama atau nomor (1-114)...'}
          className="pl-9 sm:pl-10 pr-10 py-5 sm:py-6 text-sm sm:text-base border-2 focus:border-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <Card className="absolute top-full mt-2 w-full max-h-72 sm:max-h-80 overflow-y-auto z-50 shadow-xl border-2">
          <CardContent className="p-1">
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {language === 'en' ? 'Searching...' : 'Mencari...'}
                </span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {language === 'en' ? 'No surahs found' : 'Tidak ada surah ditemukan'}
              </div>
            ) : (
              <div className="space-y-0.5">
                {results.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg text-white font-bold text-sm shadow-md flex-shrink-0">
                        {result.surahNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-semibold text-foreground">
                            {result.surahNameLatin}
                          </span>
                          {result.surahMeaning && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {result.surahMeaning}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-arabic text-secondary-900 dark:text-primary-100">
                            {result.surahName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Backdrop */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
