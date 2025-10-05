import { notFound } from 'next/navigation'
import { getSurahByNumber } from '@/lib/equran-api'
import { AyahItem } from '@/components/AyahItem'
import { SurahBottomBar } from '@/components/SurahBottomBar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ surahId: string }> }) {
  try {
    const resolvedParams = await params
    const surahNumber = parseInt(resolvedParams.surahId)
    const surah = await getSurahByNumber(surahNumber)

    return {
      title: `${surah.namaLatin} - Quran - Taslim`,
      description: `${surah.namaLatin} (${surah.nama}) - ${surah.arti}. ${surah.jumlahAyat} ayahs. Revealed in ${surah.tempatTurun}.`
    }
  } catch {
    return {
      title: 'Surah Not Found'
    }
  }
}

export default async function SurahPage({ params }: { params: Promise<{ surahId: string }> }) {
  const resolvedParams = await params
  const surahNumber = parseInt(resolvedParams.surahId)

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound()
  }

  const surah = await getSurahByNumber(surahNumber)

  const ayahs = surah.ayat.map(ayah => ({
    id: surahNumber * 1000 + ayah.nomorAyat,
    numberInSurah: ayah.nomorAyat,
    arabicText: ayah.teksArab,
    transliteration: ayah.teksLatin,
    translations: {
      'id-kemenag': ayah.teksIndonesia
    }
  }))

  return (
    <>
      {/* Bottom Navigation Bar */}
      <SurahBottomBar
        currentSurah={{
          nomor: surah.nomor,
          namaLatin: surah.namaLatin,
          nama: surah.nama,
          arti: surah.arti,
          jumlahAyat: surah.jumlahAyat
        }}
        previousSurah={surah.suratSebelumnya ? {
          nomor: surah.suratSebelumnya.nomor,
          namaLatin: surah.suratSebelumnya.namaLatin,
          nama: surah.suratSebelumnya.nama
        } : null}
        nextSurah={surah.suratSelanjutnya ? {
          nomor: surah.suratSelanjutnya.nomor,
          namaLatin: surah.suratSelanjutnya.namaLatin,
          nama: surah.suratSelanjutnya.nama
        } : null}
      />

      <div>
        {/* Surah Header */}
      <Card className="mb-8 card-glow border-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl text-white font-bold text-base sm:text-lg shadow-md">
                  {surah.nomor}
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-1">{surah.namaLatin}</CardTitle>
                  <CardDescription className="text-sm sm:text-base md:text-lg">
                    {surah.arti}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-primary/10 text-primary rounded-full">
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${surah.tempatTurun === 'Mekah' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {surah.tempatTurun}
                </span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                  {surah.jumlahAyat} Ayahs
                </span>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-arabic text-3xl sm:text-4xl md:text-5xl text-secondary-800 dark:text-primary-300 leading-normal" dir="rtl" lang="ar">
                {surah.nama}
              </h3>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bismillah (except for Surah 9 and Surah 1 first ayah already contains it) */}
      {surahNumber !== 9 && surahNumber !== 1 && (
        <div className="text-center mb-10 p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl border-2 border-primary/20">
          <p className="font-arabic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-secondary-900 dark:text-primary-100 leading-normal py-2" dir="rtl" lang="ar">
            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 italic">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-6">
        {ayahs.map((ayah, index) => (
          <Card
            key={ayah.id}
            data-ayah={ayah.numberInSurah}
            className="card-glow border-2 overflow-hidden hover:shadow-xl transition-shadow duration-300 scroll-mt-24"
          >
            <CardContent className="p-0">
              <AyahItem
                ayah={ayah}
                showTranslations={{ id: true, en: false }}
                showTransliteration={true}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-8 gap-4">
        {surah.suratSebelumnya ? (
          <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none border-2 hover:bg-primary/5 hover:border-primary/30">
            <Link href={`/quran/${surah.suratSebelumnya.nomor}`}>
              <ChevronLeft className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-semibold">{surah.suratSebelumnya.namaLatin}</div>
              </div>
            </Link>
          </Button>
        ) : (
          <div className="flex-1 sm:flex-none" />
        )}

        <Button asChild variant="ghost" className="hover:bg-primary/10">
          <Link href="/quran">
            <span className="text-sm">Back to All Surahs</span>
          </Link>
        </Button>

        {surah.suratSelanjutnya ? (
          <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none border-2 hover:bg-primary/5 hover:border-primary/30">
            <Link href={`/quran/${surah.suratSelanjutnya.nomor}`}>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="font-semibold">{surah.suratSelanjutnya.namaLatin}</div>
              </div>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <div className="flex-1 sm:flex-none" />
        )}
      </div>

      {/* Add padding at bottom to prevent content from being hidden behind bottom bar */}
      <div className="h-32" />
    </div>
    </>
  )
}
