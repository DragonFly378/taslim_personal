'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookMarked } from 'lucide-react'
import { DuaSearch } from '@/components/DuaSearch'
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

export default function DuasPage() {
  const { t } = useLanguage()
  const [duas, setDuas] = useState<Dua[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDuas() {
      try {
        const res = await fetch('https://equran.id/api/doa')
        if (!res.ok) {
          throw new Error('Failed to fetch duas')
        }
        const data = await res.json()
        setDuas(data.data)
      } catch (error) {
        console.error('Error loading duas:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDuas()
  }, [])

  // Group duas by category (grup)
  const categoriesMap = new Map<string, Dua[]>()

  duas.forEach(dua => {
    if (!categoriesMap.has(dua.grup)) {
      categoriesMap.set(dua.grup, [])
    }
    categoriesMap.get(dua.grup)!.push(dua)
  })

  const categories = Array.from(categoriesMap.entries()).map(([name, duas]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    count: duas.length
  }))

  const totalDuas = duas.length

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-16 relative">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 islamic-pattern opacity-10" />
        </div>

        <div className="relative py-12 md:py-16">
          {/* Main Content */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="font-arabic text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text leading-normal py-2" dir="rtl" lang="ar">
              الدعاء
            </h1>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t.duas.title}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.duas.subtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <DuaSearch duas={duas} />
            </div>
          </div>

          {/* Decorative Bottom Element */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 mb-12">
          <Card className="relative text-center p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500" />
            <CardContent className="p-0 relative z-10">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {categories.length}
              </p>
              <p className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {t.duas.stats.categories}
              </p>
            </CardContent>
          </Card>
          <Card className="relative text-center p-6 bg-gradient-to-br from-secondary/10 via-secondary/5 to-secondary/10 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-secondary/20 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all duration-500" />
            <CardContent className="p-0 relative z-10">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {totalDuas}
              </p>
              <p className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {t.duas.stats.duas}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category, index) => (
          <Link key={category.slug} href={`/duas/${category.slug}`}>
            <Card className="h-full card-glow border-2 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BookMarked className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="font-medium">
                    {category.count} {category.count === 1 ? 'Dua' : 'Duas'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}
