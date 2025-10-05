'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Dua {
  id: number
  grup: string
  nama: string
  ar: string
  tr: string
  idn: string
  tentang: string
  tag: string[]
}

interface DuaSearchProps {
  duas: Dua[]
  onSelectDua?: (dua: Dua) => void
}

export function DuaSearch({ duas, onSelectDua }: DuaSearchProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Dua[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length >= 2) {
        setIsSearching(true)

        const searchQuery = query.toLowerCase()
        const filteredResults = duas.filter(dua =>
          dua.nama.toLowerCase().includes(searchQuery) ||
          dua.grup.toLowerCase().includes(searchQuery) ||
          dua.idn.toLowerCase().includes(searchQuery) ||
          dua.tag.some(tag => tag.toLowerCase().includes(searchQuery))
        ).slice(0, 10) // Limit to 10 results

        setResults(filteredResults)
        setShowResults(true)
        setIsSearching(false)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 150)

    return () => clearTimeout(delayDebounce)
  }, [query, duas])

  const handleResultClick = (dua: Dua) => {
    const categorySlug = dua.grup.toLowerCase().replace(/\s+/g, '-')
    router.push(`/duas/${categorySlug}#dua-${dua.id}`)
    setQuery('')
    setShowResults(false)

    if (onSelectDua) {
      onSelectDua(dua)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative w-full z-50">
      {/* Backdrop */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}

      {/* Search Input */}
      <div className="relative z-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.duas.searchPlaceholder}
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
        <Card className="absolute top-full mt-2 w-full max-h-72 sm:max-h-96 overflow-y-auto z-50 shadow-2xl border-2">
          <CardContent className="p-1">
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">{t.duas.searching}</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {t.duas.noResults}
              </div>
            ) : (
              <div className="space-y-0.5">
                {results.map((dua) => (
                  <button
                    key={dua.id}
                    type="button"
                    onClick={() => handleResultClick(dua)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg text-white font-bold text-xs shadow-md flex-shrink-0">
                        {dua.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground mb-0.5 line-clamp-1">
                          {dua.nama}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">
                          {dua.grup}
                        </div>
                        {dua.tag && dua.tag.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {dua.tag.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
