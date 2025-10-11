'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { getAllSurahs, EquranSurah } from '@/lib/equran-api'
import { SurahCard } from '@/components/SurahCard'
import { QuranSearch } from '@/components/QuranSearch'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { LastReadBanner } from '@/components/LastReadBanner'

export default function QuranPage() {
  const { t } = useLanguage()
  const [surahs, setSurahs] = useState<EquranSurah[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSurahs() {
      try {
        const data = await getAllSurahs()
        setSurahs(data)
      } catch (error) {
        console.error('Error loading surahs:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSurahs()
  }, [])

  return (
    <div>
      {/* Last Read Banner */}
      <LastReadBanner />

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
              القرآن الكريم
            </h1>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t.quran.title}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.quran.subtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <QuranSearch />
            </div>
          </div>

          {/* Decorative Bottom Element */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      {/* Offline Download Banner */}
      <Link href="/offline" className="block mb-8">
        <Card className="relative overflow-hidden bg-gradient-to-r from-green-500/10 via-green-600/10 to-green-500/10 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group cursor-pointer">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Download Quran for Offline Reading
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Access all 114 surahs anytime, anywhere - even without internet connection
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card className="relative text-center p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500" />
          <CardContent className="p-0 relative z-10">
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">114</p>
            <p className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t.quran.stats.surahs}</p>
          </CardContent>
        </Card>
        <Card className="relative text-center p-6 bg-gradient-to-br from-secondary/10 via-secondary/5 to-secondary/10 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-secondary/20 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all duration-500" />
          <CardContent className="p-0 relative z-10">
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">6,236</p>
            <p className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t.quran.stats.ayahs}</p>
          </CardContent>
        </Card>
        <Card className="relative text-center p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-secondary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/20 group-hover:to-secondary/10 transition-all duration-500" />
          <CardContent className="p-0 relative z-10">
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">86</p>
            <p className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t.quran.stats.makkah}</p>
          </CardContent>
        </Card>
        <Card className="relative text-center p-6 bg-gradient-to-br from-secondary/10 via-primary/5 to-primary/10 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-secondary/20 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-primary/0 group-hover:from-secondary/20 group-hover:to-primary/10 transition-all duration-500" />
          <CardContent className="p-0 relative z-10">
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">28</p>
            <p className="text-sm md:text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t.quran.stats.madinah}</p>
          </CardContent>
        </Card>
      </div>

      {/* Surah List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {surahs.map((surah) => (
            <SurahCard
              key={surah.nomor}
              surah={{
                id: surah.nomor,
                surahNumber: surah.nomor,
                latinName: surah.namaLatin,
                arabicName: surah.nama,
                ayahCount: surah.jumlahAyat,
                revelationPlace: surah.tempatTurun,
                meaning: surah.arti
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
