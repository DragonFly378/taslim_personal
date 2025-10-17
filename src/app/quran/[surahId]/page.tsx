import { notFound } from "next/navigation";
import { getSurahByNumber } from "@/lib/equran-api";
import { AyahItem } from "@/components/AyahItem";
import { SurahBottomBar } from "@/components/SurahBottomBar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ surahId: string }>;
}) {
  try {
    const resolvedParams = await params;
    const surahNumber = parseInt(resolvedParams.surahId);
    const surah = await getSurahByNumber(surahNumber);

    return {
      title: `${surah.namaLatin} - Quran - Taslim`,
      description: `${surah.namaLatin} (${surah.nama}) - ${surah.arti}. ${surah.jumlahAyat} ayahs. Revealed in ${surah.tempatTurun}.`,
    };
  } catch {
    return {
      title: "Surah Not Found",
    };
  }
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ surahId: string }>;
}) {
  const resolvedParams = await params;
  const surahNumber = parseInt(resolvedParams.surahId);

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const surah = await getSurahByNumber(surahNumber);

  const ayahs = surah.ayat.map((ayah) => ({
    id: surahNumber * 1000 + ayah.nomorAyat,
    numberInSurah: ayah.nomorAyat,
    arabicText: ayah.teksArab,
    transliteration: ayah.teksLatin,
    translations: {
      "id-kemenag": ayah.teksIndonesia,
    },
  }));

  return (
    <>
      {/* Bottom Navigation Bar */}
      <SurahBottomBar
        currentSurah={{
          nomor: surah.nomor,
          namaLatin: surah.namaLatin,
          nama: surah.nama,
          arti: surah.arti,
          jumlahAyat: surah.jumlahAyat,
        }}
        previousSurah={
          surah.suratSebelumnya
            ? {
                nomor: surah.suratSebelumnya.nomor,
                namaLatin: surah.suratSebelumnya.namaLatin,
                nama: surah.suratSebelumnya.nama,
              }
            : null
        }
        nextSurah={
          surah.suratSelanjutnya
            ? {
                nomor: surah.suratSelanjutnya.nomor,
                namaLatin: surah.suratSelanjutnya.namaLatin,
                nama: surah.suratSelanjutnya.nama,
              }
            : null
        }
      />

      <div>
        {/* Surah Header */}
        <Card className="mb-6 sm:mb-8 card-glow border-2 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient" />
          <CardHeader className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg shadow-primary/30 ring-2 ring-primary/20">
                    {surah.nomor}
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                      {surah.namaLatin}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground">
                      {surah.arti}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full font-semibold border border-primary/20 shadow-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${surah.tempatTurun === "Mekah" ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"} shadow-md`}
                    />
                    {surah.tempatTurun}
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary rounded-full font-semibold border border-secondary/20 shadow-sm">
                    <span className="text-base sm:text-lg">📖</span>
                    {surah.jumlahAyat} Ayahs
                  </span>
                </div>
              </div>
              <div className="text-right md:text-center self-start md:self-center">
                <h3
                  className="font-arabic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary dark:text-primary-300 leading-normal drop-shadow-lg"
                  dir="rtl"
                  lang="ar"
                >
                  {surah.nama}
                </h3>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Bismillah (except for Surah 9 and Surah 1 first ayah already contains it) */}
        {surahNumber !== 9 && surahNumber !== 1 && (
          <div className="text-center mb-8 sm:mb-10 p-6 sm:p-8 md:p-10 bg-gradient-to-br from-primary/10 via-secondary/5 to-background rounded-3xl border-2 border-primary/20 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
            <p
              className="font-arabic text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary dark:text-primary-200 leading-normal py-2 sm:py-3 md:py-4 relative z-10 drop-shadow-sm"
              dir="rtl"
              lang="ar"
            >
              بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2 sm:mt-3 md:mt-4 italic font-medium relative z-10">
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>
        )}

        {/* Ayahs */}
        <div className="space-y-4 sm:space-y-6">
          {ayahs.map((ayah, index) => (
            <Card
              key={ayah.id}
              data-ayah={ayah.numberInSurah}
              className="card-glow ayah-card border-2 overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 scroll-mt-24 bg-gradient-to-br from-card to-card/50"
            >
              <CardContent className="p-0">
                <AyahItem
                  ayah={ayah}
                  surahId={surahNumber}
                  surahName={surah.namaLatin}
                  showTranslations={{ id: true, en: false }}
                  showTransliteration={true}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-10 sm:mt-12 gap-3 sm:gap-4">
          {surah.suratSebelumnya ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none border-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:border-primary/40 hover:shadow-lg transition-all duration-300 active:scale-95 group"
            >
              <Link
                href={`/quran/${surah.suratSebelumnya.nomor}`}
                className="flex items-center justify-start"
              >
                <ChevronLeft className="mr-2 sm:mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <div className="text-left">
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Previous
                  </div>
                  <div className="font-bold text-sm sm:text-base text-primary">
                    {surah.suratSebelumnya.namaLatin}
                  </div>
                </div>
              </Link>
            </Button>
          ) : (
            <div className="flex-1 sm:flex-none" />
          )}

          <Button
            asChild
            variant="ghost"
            className="hover:bg-primary/10 hover:shadow-md transition-all duration-300 active:scale-95 border border-transparent hover:border-primary/20"
          >
            <Link href="/quran" className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-medium">
                📚 All Surahs
              </span>
            </Link>
          </Button>

          {surah.suratSelanjutnya ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none border-2 hover:bg-gradient-to-l hover:from-secondary/10 hover:to-transparent hover:border-secondary/40 hover:shadow-lg transition-all duration-300 active:scale-95 group"
            >
              <Link
                href={`/quran/${surah.suratSelanjutnya.nomor}`}
                className="flex items-center justify-end"
              >
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Next
                  </div>
                  <div className="font-bold text-sm sm:text-base text-secondary">
                    {surah.suratSelanjutnya.namaLatin}
                  </div>
                </div>
                <ChevronRight className="ml-2 sm:ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          ) : (
            <div className="flex-1 sm:flex-none" />
          )}
        </div>

        {/* Add padding at bottom to prevent content from being hidden behind bottom bar */}
      </div>
    </>
  );
}
