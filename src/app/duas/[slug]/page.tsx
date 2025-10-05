'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DuaCard } from '@/components/DuaCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, BookMarked } from 'lucide-react'
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

export default function DuaCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useLanguage()
  const resolvedParams = use(params)
  const [categoryDuas, setCategoryDuas] = useState<Dua[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategoryDuas() {
      try {
        const res = await fetch('https://equran.id/api/doa')
        if (!res.ok) {
          throw new Error('Failed to fetch duas')
        }
        const data = await res.json()
        const allDuas = data.data as Dua[]

        // Filter duas by category slug
        const filtered = allDuas.filter(dua =>
          dua.grup.toLowerCase().replace(/\s+/g, '-') === resolvedParams.slug
        )

        if (filtered.length === 0) {
          notFound()
        }

        setCategoryDuas(filtered)
        setCategoryName(filtered[0].grup)
      } catch (error) {
        console.error('Error loading category duas:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCategoryDuas()
  }, [resolvedParams.slug])

  return (
    <div>
      {/* Category Header */}
      <Card className="mb-8 card-glow border-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl text-white shadow-md">
                  <BookMarked className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl md:text-4xl mb-1">
                    {categoryName}
                  </CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {categoryDuas.length} {t.duas.stats.duas}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Duas List */}
      <div className="space-y-6 mb-8">
        {categoryDuas.map((dua) => (
          <DuaCard key={dua.id} dua={dua} />
        ))}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" size="lg" className="border-2 hover:bg-primary/5 hover:border-primary/30">
          <Link href="/duas">
            <ChevronLeft className="mr-2 h-5 w-5" />
            <span className="text-base">{t.duas.backToAll}</span>
          </Link>
        </Button>
      </div>

      {/* Bottom Padding */}
      <div className="h-20" />
    </div>
  )
}
